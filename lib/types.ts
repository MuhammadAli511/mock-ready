export type InterviewState =
  | "IDLE"
  | "SCRAPING"
  | "READY"
  | "IN_PROGRESS"
  | "SCORING"
  | "DEBRIEF"

export interface JobInput {
  type: "url"
  url: string
  resumeText?: string
}

export interface ScrapeResult {
  rawText: string
  url?: string
  title?: string
}

// --- Per-section analysis types (used by /api/analyze) ---

export interface RoleAnalysis {
  role: string
  company: string
  seniority: string
  required_skills: string[]
  nice_to_have: string[]
}

export interface TopicsAnalysis {
  likely_interview_topics: string[]
}

export interface SignalsAnalysis {
  culture_signals: string[]
  red_flags: string[]
}

export interface CompanyOverview {
  name: string
  description: string
  industry: string
  headquarters: string
  employee_count: string
  founded: string
  website: string
  funding_stage: string
}

export interface CompanyTechProfile {
  tech_stack: string[]
  engineering_culture: string[]
}

export interface CompanyInterviewInfo {
  interview_process: string[]
  glassdoor_highlights: string[]
}

export interface CompanyNewsInfo {
  recent_news: string[]
}

// --- Resume / Match analysis types ---

export interface SkillMatch {
  matched_skills: string[]
  missing_skills: string[]
  match_percentage: number
}

export interface ResumeStrengths {
  strengths: string[]
  talking_points: string[]
}

export interface GapAnalysis {
  gaps: string[]
  suggestions: string[]
}

export interface PrepQuestions {
  questions: {
    question: string
    category: string
    tip: string
  }[]
}

export interface SalaryIntel {
  range_low: string
  range_high: string
  median: string
  currency: string
  notes: string[]
}

// --- Legacy combined types (kept for backward compat) ---

export interface InterviewBrief {
  role: string
  company: string
  seniority: string
  required_skills: string[]
  nice_to_have: string[]
  likely_interview_topics: string[]
  culture_signals: string[]
  red_flags: string[]
}

export interface CompanyProfile {
  name: string
  description: string
  industry: string
  headquarters: string
  employee_count: string
  founded: string
  website: string
  funding_stage: string
  tech_stack: string[]
  engineering_culture: string[]
  interview_process: string[]
  glassdoor_highlights: string[]
  recent_news: string[]
}

export interface QuestionScore {
  question: string
  answer_summary: string
  relevance: number
  depth: number
  communication: number
  feedback: string
}

export interface SessionDebrief {
  overall_score: number
  hire_signal: "strong_hire" | "hire" | "lean_hire" | "lean_no_hire" | "no_hire"
  summary: string
  question_scores: QuestionScore[]
  improvements: string[]
}
