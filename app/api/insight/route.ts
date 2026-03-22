import OpenAI from "openai"
import { NextResponse } from "next/server"

const cerebras = new OpenAI({
  baseURL: "https://api.cerebras.ai/v1",
  apiKey: process.env.CEREBRAS_API_KEY!,
})

export async function POST(request: Request) {
  if (!process.env.CEREBRAS_API_KEY) {
    return NextResponse.json(
      { error: "CEREBRAS_API_KEY is not configured" },
      { status: 500 },
    )
  }

  const { rawText, resumeText, recentTranscript } = await request.json()

  if (!rawText || !recentTranscript) {
    return NextResponse.json(
      { error: "rawText and recentTranscript are required" },
      { status: 400 },
    )
  }

  const resumeSection = resumeText
    ? `\n\n## Candidate Resume (summary)\n${resumeText.slice(0, 1000)}`
    : ""

  try {
    const completion = await cerebras.chat.completions.create({
      model: "gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are a real-time interview coach whispering advice to a candidate during a live mock interview. Given the job description, candidate background, and the most recent exchange, generate ONE brief, actionable coaching insight (1-2 sentences, under 40 words). Focus on what the candidate should do or mention in their NEXT response. Be specific and tactical — reference actual skills, projects, or job requirements. Never use bullet points or numbered lists.`,
        },
        {
          role: "user",
          content: `## Job Description\n${rawText.slice(0, 2000)}${resumeSection}\n\n## Recent Conversation\n${recentTranscript}\n\nGenerate a brief coaching insight for the candidate's next response:`,
        },
      ],
      temperature: 0.4,
      reasoning_effort: "low",
    })

    const insight = completion.choices[0]?.message?.content ?? ""

    return NextResponse.json({ insight })
  } catch (error) {
    console.error("Insight error:", error)
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 },
    )
  }
}
