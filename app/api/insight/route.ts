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
    ? `\n\n## Candidate Resume (summary)\n${resumeText.slice(0, 1500)}`
    : ""

  try {
    const completion = await cerebras.chat.completions.create({
      model: "gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are a real-time interview coach whispering advice to a candidate during a live mock interview. You respond with a JSON object containing two fields:

1. "insight": A specific, actionable coaching tip (1-2 sentences, under 40 words) for the candidate's NEXT response. Reference their actual resume projects, skills, or specific job requirements by name. Examples: "Mention your work on the payments migration at Acme — it directly maps to their microservices requirement." or "They're testing system design thinking — walk through data flow before jumping to implementation."

2. "type": One of these categories:
   - "mention" — candidate should bring up a specific skill, project, or experience
   - "technique" — candidate should use a specific answering technique (STAR, tradeoff analysis, etc.)
   - "warning" — candidate is going off track, being too vague, or missing the point
   - "depth" — candidate should go deeper on their current topic with specifics

Never use bullet points or lists in the insight. Be direct and tactical.`,
        },
        {
          role: "user",
          content: `## Job Description\n${rawText.slice(0, 2000)}${resumeSection}\n\n## Recent Conversation\n${recentTranscript}\n\nGenerate coaching JSON:`,
        },
      ],
      temperature: 0.4,
      reasoning_effort: "low",
    })

    const raw = completion.choices[0]?.message?.content ?? ""

    let insight = raw
    let type = "mention"
    try {
      const parsed = JSON.parse(raw)
      insight = parsed.insight ?? raw
      type = parsed.type ?? "mention"
    } catch {
      // If model didn't return valid JSON, use raw text as insight
    }

    return NextResponse.json({ insight, type })
  } catch (error) {
    console.error("Insight error:", error)
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 },
    )
  }
}
