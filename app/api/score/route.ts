import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"
import { NextResponse } from "next/server"

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
})
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const QuestionScoreSchema = z.object({
  question: z.string(),
  answer_summary: z.string(),
  relevance: z.number(),
  depth: z.number(),
  communication: z.number(),
  feedback: z.string(),
})

const SessionDebriefSchema = z.object({
  overall_score: z.number(),
  hire_signal: z.enum([
    "strong_hire",
    "hire",
    "lean_hire",
    "lean_no_hire",
    "no_hire",
  ]),
  summary: z.string(),
  question_scores: z.array(QuestionScoreSchema),
  improvements: z.array(z.string()),
})

async function fetchTranscriptWithRetry(
  conversationId: string,
  maxRetries = 5,
) {
  for (let i = 0; i < maxRetries; i++) {
    const conversation =
      await elevenlabs.conversationalAi.conversations.get(conversationId)

    console.log(
      `[score] Attempt ${i + 1}: status=${conversation.status}, transcript entries=${conversation.transcript?.length ?? 0}`,
    )

    // Transcript is available once status is "done"
    if (
      conversation.transcript &&
      conversation.transcript.length > 0
    ) {
      return conversation.transcript
    }

    // If still processing, wait and retry
    if (
      conversation.status === "processing" ||
      conversation.status === "in-progress"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      continue
    }

    // Status is done but no transcript, or failed
    break
  }

  return null
}

export async function POST(request: Request) {
  const { conversationId, rawText } = await request.json()

  if (!conversationId || !rawText) {
    return NextResponse.json(
      { error: "conversationId and rawText are required" },
      { status: 400 },
    )
  }

  try {
    const transcript = await fetchTranscriptWithRetry(conversationId)

    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: "No transcript found for this conversation" },
        { status: 404 },
      )
    }

    // Format transcript — role is "user" | "agent", message is optional
    const formattedTranscript = transcript
      .filter((entry) => entry.message)
      .map(
        (entry) =>
          `${entry.role === "agent" ? "Interviewer" : "Candidate"}: ${entry.message}`,
      )
      .join("\n\n")

    if (!formattedTranscript) {
      return NextResponse.json(
        { error: "Transcript has no messages" },
        { status: 404 },
      )
    }

    // Score with OpenAI
    const completion = await openai.chat.completions.parse({
      model: "gpt-5.4-nano",
      messages: [
        {
          role: "system",
          content: `You are an expert interview coach scoring a mock interview. You have the original job description and the full transcript.

Score each question-answer pair on three dimensions (1-10 scale):
- relevance: How well the answer addresses what was asked and relates to the job requirements
- depth: Technical depth, specificity, use of concrete examples
- communication: Clarity, structure, conciseness of the answer

Provide:
- Per-question scores and specific actionable feedback
- An overall score (1-100)
- A hire signal (strong_hire, hire, lean_hire, lean_no_hire, no_hire)
- A brief summary of the candidate's performance
- 3-5 specific improvements the candidate should work on

Be honest but constructive. Ground all feedback in the actual job requirements.`,
        },
        {
          role: "user",
          content: `## Job Description\n${rawText}\n\n## Interview Transcript\n${formattedTranscript}`,
        },
      ],
      response_format: zodResponseFormat(
        SessionDebriefSchema,
        "session_debrief",
      ),
      temperature: 0.3,
    })

    const debrief = completion.choices[0]?.message?.parsed
    if (!debrief) {
      return NextResponse.json(
        { error: "Failed to parse scoring response" },
        { status: 500 },
      )
    }

    return NextResponse.json(debrief)
  } catch (error) {
    console.error("Score error:", error)
    return NextResponse.json(
      { error: "Failed to score interview" },
      { status: 500 },
    )
  }
}
