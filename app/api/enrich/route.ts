import FirecrawlApp from "@mendable/firecrawl-js"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"
import { NextResponse } from "next/server"

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const CompanyProfileSchema = z.object({
  name: z.string(),
  description: z.string(),
  industry: z.string(),
  headquarters: z.string(),
  employee_count: z.string(),
  founded: z.string(),
  website: z.string(),
  funding_stage: z.string(),
  tech_stack: z.array(z.string()),
  engineering_culture: z.array(z.string()),
  interview_process: z.array(z.string()),
  glassdoor_highlights: z.array(z.string()),
  recent_news: z.array(z.string()),
})

export async function POST(request: Request) {
  const body = await request.json()
  let { company } = body
  const { role, rawText } = body

  // If no company name provided, extract it from the raw job text
  if (!company && rawText) {
    const extraction = await openai.chat.completions.create({
      model: "gpt-5.4-nano",
      messages: [
        {
          role: "system",
          content: "Extract ONLY the company name from this job posting. Reply with just the company name, nothing else.",
        },
        { role: "user", content: rawText.slice(0, 2000) },
      ],
      temperature: 0,
      max_completion_tokens: 50,
    })
    company = extraction.choices[0]?.message?.content?.trim() || ""
  }

  if (!company) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 },
    )
  }

  try {
    // Search for company info from multiple angles in parallel
    const searches = await Promise.allSettled([
      firecrawl.search(`${company} company about overview employees headquarters`, {
        limit: 3,
        scrapeOptions: { formats: ["markdown"] },
      }),
      firecrawl.search(`${company} engineering culture tech stack blog`, {
        limit: 2,
        scrapeOptions: { formats: ["markdown"] },
      }),
      firecrawl.search(`${company} interview process glassdoor reviews ${role || ""}`, {
        limit: 2,
        scrapeOptions: { formats: ["markdown"] },
      }),
      firecrawl.search(`${company} recent news funding 2024 2025`, {
        limit: 2,
        scrapeOptions: { formats: ["markdown"] },
      }),
    ])

    // Collect all markdown content from successful searches
    const allContent: string[] = []
    for (const result of searches) {
      if (result.status === "fulfilled" && result.value.web) {
        for (const item of result.value.web) {
          const r = item as Record<string, unknown>
          const text = (r.markdown as string) ?? (r.description as string) ?? ""
          if (text) allContent.push(text.slice(0, 3000))
        }
      }
    }

    if (allContent.length === 0) {
      return NextResponse.json(
        { error: "Could not find company information" },
        { status: 404 },
      )
    }

    const combined = allContent.join("\n\n---\n\n").slice(0, 15000)

    const completion = await openai.chat.completions.parse({
      model: "gpt-5.4-nano",
      messages: [
        {
          role: "system",
          content: `You are a company research analyst. Given scraped web content about a company, extract a comprehensive company profile. Be specific with numbers and facts. If information is not found, use "Unknown" for strings and empty arrays for lists. For glassdoor_highlights, summarize key themes from employee reviews. For interview_process, describe what candidates typically experience. For recent_news, include the most notable recent developments.`,
        },
        {
          role: "user",
          content: `Extract a detailed company profile for "${company}" from this research:\n\n${combined}`,
        },
      ],
      response_format: zodResponseFormat(CompanyProfileSchema, "company_profile"),
      temperature: 0.2,
    })

    const profile = completion.choices[0]?.message?.parsed

    if (!profile) {
      return NextResponse.json(
        { error: "Failed to build company profile" },
        { status: 500 },
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Enrich error:", error)
    return NextResponse.json(
      { error: "Failed to enrich company data" },
      { status: 500 },
    )
  }
}
