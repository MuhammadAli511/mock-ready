import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const InterviewBriefSchema = z.object({
  role: z.string(),
  company: z.string(),
  seniority: z.string(),
  required_skills: z.array(z.string()),
  nice_to_have: z.array(z.string()),
  likely_interview_topics: z.array(z.string()),
  culture_signals: z.array(z.string()),
  red_flags: z.array(z.string()),
})

export async function POST(request: Request) {
  const body = await request.json()
  const { rawText } = body

  if (!rawText) {
    return NextResponse.json(
      { error: "No job description text provided" },
      { status: 400 },
    )
  }

  try {
    const completion = await openai.chat.completions.parse({
      model: "gpt-5.4-nano",
      messages: [
        {
          role: "system",
          content: `You are an expert job posting analyst. Given raw job description text, extract a structured interview brief. Be thorough and specific. For red_flags, identify any concerning patterns like unrealistic expectations, vague role definitions, or potential issues. For culture_signals, pick up on company values, work style, and team dynamics mentioned.`,
        },
        {
          role: "user",
          content: `Parse this job posting into a structured interview brief:\n\n${rawText}`,
        },
      ],
      response_format: zodResponseFormat(InterviewBriefSchema, "interview_brief"),
      temperature: 0.3,
    })

    const brief = completion.choices[0]?.message?.parsed

    if (!brief) {
      return NextResponse.json(
        { error: "Failed to parse job description" },
        { status: 500 },
      )
    }

    return NextResponse.json(brief)
  } catch (error) {
    console.error("Parse error:", error)
    return NextResponse.json(
      { error: "Failed to parse job description" },
      { status: 500 },
    )
  }
}
