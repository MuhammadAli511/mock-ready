import FirecrawlApp from "@mendable/firecrawl-js"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"
import { NextResponse } from "next/server"

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

// --- Zod schemas per section ---

const RoleSchema = z.object({
  role: z.string(),
  company: z.string(),
  seniority: z.string(),
  required_skills: z.array(z.string()),
  nice_to_have: z.array(z.string()),
})

const TopicsSchema = z.object({
  likely_interview_topics: z.array(z.string()),
})

const SignalsSchema = z.object({
  culture_signals: z.array(z.string()),
  red_flags: z.array(z.string()),
})

const CompanyOverviewSchema = z.object({
  name: z.string(),
  description: z.string(),
  industry: z.string(),
  headquarters: z.string(),
  employee_count: z.string(),
  founded: z.string(),
  website: z.string(),
  funding_stage: z.string(),
})

const CompanyTechSchema = z.object({
  tech_stack: z.array(z.string()),
  engineering_culture: z.array(z.string()),
})

const CompanyInterviewSchema = z.object({
  interview_process: z.array(z.string()),
  glassdoor_highlights: z.array(z.string()),
})

const CompanyNewsSchema = z.object({
  recent_news: z.array(z.string()),
})

const SkillMatchSchema = z.object({
  matched_skills: z.array(z.string()),
  missing_skills: z.array(z.string()),
  match_percentage: z.number(),
})

const ResumeStrengthsSchema = z.object({
  strengths: z.array(z.string()),
  talking_points: z.array(z.string()),
})

const GapAnalysisSchema = z.object({
  gaps: z.array(z.string()),
  suggestions: z.array(z.string()),
})

const PrepQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      category: z.string(),
      tip: z.string(),
    }),
  ),
})

const SalaryIntelSchema = z.object({
  range_low: z.string(),
  range_high: z.string(),
  median: z.string(),
  currency: z.string(),
  notes: z.array(z.string()),
})

// --- Shared helpers ---

async function resolveCompanyName(rawText: string, hint?: string): Promise<string> {
  if (hint) return hint
  const res = await openai.chat.completions.create({
    model: "gpt-5.4-nano",
    messages: [
      {
        role: "system",
        content:
          "Extract ONLY the company name from this job posting. Reply with just the company name, nothing else.",
      },
      { role: "user", content: rawText.slice(0, 2000) },
    ],
    temperature: 0,
    max_completion_tokens: 50,
  })
  return res.choices[0]?.message?.content?.trim() || ""
}

async function searchAndCollect(query: string, limit = 3): Promise<string> {
  const results = await firecrawl.search(query, {
    limit,
    scrapeOptions: { formats: ["markdown"] },
  })
  const texts: string[] = []
  if (results.web) {
    for (const item of results.web) {
      const r = item as Record<string, unknown>
      const text = (r.markdown as string) ?? (r.description as string) ?? ""
      if (text) texts.push(text.slice(0, 3000))
    }
  }
  return texts.join("\n\n---\n\n")
}

async function parseWithSchema<T>(
  systemPrompt: string,
  userContent: string,
  schema: z.ZodType<T>,
  schemaName: string,
): Promise<T | null> {
  const completion = await openai.chat.completions.parse({
    model: "gpt-5.4-nano",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response_format: zodResponseFormat(schema as any, schemaName),
    temperature: 0.2,
  })
  return completion.choices[0]?.message?.parsed as T | null
}

// --- Section handlers ---

async function handleRole(rawText: string) {
  return parseWithSchema(
    "Extract role, company, seniority, required skills (max 8), and nice-to-have (max 5). Use short skill names like 'React' not 'Experience with React framework'.",
    rawText,
    RoleSchema,
    "role_analysis",
  )
}

async function handleTopics(rawText: string) {
  return parseWithSchema(
    "List 5-7 likely interview topics as short phrases (3-6 words each). Mix technical and behavioral. E.g. 'System design at scale', 'Conflict resolution'.",
    rawText,
    TopicsSchema,
    "topics_analysis",
  )
}

async function handleSignals(rawText: string) {
  return parseWithSchema(
    "List culture signals (max 5) and red flags (max 3) as short phrases (3-6 words). E.g. 'Remote-first culture', 'Vague growth expectations'.",
    rawText,
    SignalsSchema,
    "signals_analysis",
  )
}

async function handleCompanyOverview(rawText: string, companyHint?: string) {
  const company = await resolveCompanyName(rawText, companyHint)
  if (!company) return null
  const content = await searchAndCollect(
    `${company} company about overview headquarters employees founded funding`,
    3,
  )
  if (!content) return null
  return parseWithSchema(
    'Extract company facts. Keep description to 1-2 sentences. Use "Unknown" for unavailable info.',
    `Company: ${company}\n\nResearch:\n${content}`,
    CompanyOverviewSchema,
    "company_overview",
  )
}

async function handleCompanyTech(rawText: string, companyHint?: string) {
  const company = await resolveCompanyName(rawText, companyHint)
  if (!company) return null
  const content = await searchAndCollect(
    `${company} engineering tech stack technology tools blog`,
    3,
  )
  if (!content) return null
  return parseWithSchema(
    "List tech stack items as short names (e.g. 'Go', 'Kubernetes', 'PostgreSQL'). Engineering culture as short phrases (max 4, 3-6 words each).",
    `Company: ${company}\n\nResearch:\n${content}`,
    CompanyTechSchema,
    "company_tech",
  )
}

async function handleCompanyInterview(rawText: string, companyHint?: string) {
  const company = await resolveCompanyName(rawText, companyHint)
  if (!company) return null
  const content = await searchAndCollect(
    `${company} interview process glassdoor reviews candidate experience`,
    3,
  )
  if (!content) return null
  return parseWithSchema(
    "List interview stages as short steps (e.g. 'Phone screen → Technical → System design → Team fit'). Glassdoor highlights as short phrases (max 4).",
    `Company: ${company}\n\nResearch:\n${content}`,
    CompanyInterviewSchema,
    "company_interview",
  )
}

async function handleCompanyNews(rawText: string, companyHint?: string) {
  const company = await resolveCompanyName(rawText, companyHint)
  if (!company) return null
  const content = await searchAndCollect(
    `${company} recent news funding announcements 2025 2026`,
    3,
  )
  if (!content) return null
  return parseWithSchema(
    "List max 4 recent news items. Each should be one short sentence (under 15 words).",
    `Company: ${company}\n\nResearch:\n${content}`,
    CompanyNewsSchema,
    "company_news",
  )
}

// --- Resume match handlers (require resumeText) ---

async function handleSkillMatch(rawText: string, _companyHint?: string, resumeText?: string) {
  if (!resumeText) return null
  return parseWithSchema(
    "Compare resume skills vs job requirements. List matched and missing skills as short names (e.g. 'Python', 'React', 'AWS'). Calculate match_percentage (0-100) based on how many required skills the candidate has. Be generous — count adjacent/transferable skills as matches.",
    `## Job Description\n${rawText}\n\n## Candidate Resume\n${resumeText}`,
    SkillMatchSchema,
    "skill_match",
  )
}

async function handleResumeStrengths(rawText: string, _companyHint?: string, resumeText?: string) {
  if (!resumeText) return null
  return parseWithSchema(
    "List 3-5 strengths as short phrases (under 10 words). List 3-5 talking points: specific things from their resume to mention in the interview (reference actual projects/metrics from resume). Keep each under 15 words.",
    `## Job Description\n${rawText}\n\n## Candidate Resume\n${resumeText}`,
    ResumeStrengthsSchema,
    "resume_strengths",
  )
}

async function handleGapAnalysis(rawText: string, _companyHint?: string, resumeText?: string) {
  if (!resumeText) return null
  return parseWithSchema(
    "List 2-4 gaps as short phrases (under 10 words). For each gap, give one actionable suggestion (under 15 words) on how to address it in the interview. Be constructive.",
    `## Job Description\n${rawText}\n\n## Candidate Resume\n${resumeText}`,
    GapAnalysisSchema,
    "gap_analysis",
  )
}

async function handlePrepQuestions(rawText: string) {
  return parseWithSchema(
    "Generate 6 likely interview questions for this role. Each needs: the question itself, a category (one of: Technical, Behavioral, System Design, Culture Fit, Problem Solving, Domain), and a short tip (under 12 words) on how to answer well. Make questions specific to the job description, not generic.",
    rawText,
    PrepQuestionsSchema,
    "prep_questions",
  )
}

async function handleSalaryIntel(rawText: string, companyHint?: string) {
  const company = await resolveCompanyName(rawText, companyHint)
  const content = await searchAndCollect(
    `${company} salary compensation range levels.fyi glassdoor 2025`,
    3,
  )
  return parseWithSchema(
    "Estimate the salary range for this specific role based on the research data. Give range_low, range_high, and median as formatted strings like '$150,000'. Use USD unless the role is clearly in another region. Provide 2-3 short notes (under 12 words each) about compensation context (e.g. 'Equity refresh every 2 years', 'Above market for series B').",
    `## Job Description\n${rawText}\n\nCompany: ${company}\n\n## Research\n${content}`,
    SalaryIntelSchema,
    "salary_intel",
  )
}

// --- Route handler ---

const handlers: Record<
  string,
  (rawText: string, companyHint?: string, resumeText?: string) => Promise<unknown>
> = {
  role: handleRole,
  topics: handleTopics,
  signals: handleSignals,
  "company-overview": handleCompanyOverview,
  "company-tech": handleCompanyTech,
  "company-interview": handleCompanyInterview,
  "company-news": handleCompanyNews,
  "skill-match": handleSkillMatch,
  "resume-strengths": handleResumeStrengths,
  "gap-analysis": handleGapAnalysis,
  "prep-questions": handlePrepQuestions,
  "salary-intel": handleSalaryIntel,
}

export async function POST(request: Request) {
  const { section, rawText, companyHint, resumeText } = await request.json()

  if (!section || !handlers[section]) {
    return NextResponse.json(
      { error: `Invalid section: ${section}` },
      { status: 400 },
    )
  }

  if (!rawText) {
    return NextResponse.json({ error: "rawText is required" }, { status: 400 })
  }

  try {
    const data = await handlers[section](rawText, companyHint, resumeText)
    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Analyze error [${section}]:`, error)
    return NextResponse.json(
      { error: `Failed to analyze: ${section}` },
      { status: 500 },
    )
  }
}
