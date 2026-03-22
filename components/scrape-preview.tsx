"use client"

import { motion } from "motion/react"
import { useSection } from "@/hooks/use-section"
import {
  Mic,
  RotateCcw,
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  TrendingUp,
  Loader2,
  DollarSign,
} from "lucide-react"
import type {
  RoleAnalysis,
  TopicsAnalysis,
  SignalsAnalysis,
  CompanyOverview,
  CompanyTechProfile,
  CompanyInterviewInfo,
  CompanyNewsInfo,
  SkillMatch,
  ResumeStrengths,
  GapAnalysis,
  PrepQuestions,
  SalaryIntel,
} from "@/lib/types"
import { PracticeCards } from "@/components/practice-cards"

// --- Shared helpers ---

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  if (!value || value === "Unknown") return null
  return (
    <div className="flex items-start gap-2.5 text-[11px]">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3f3f46]" />
      <span>
        <span className="text-[#52525b]">{label}:</span>{" "}
        <span className="text-[#a1a1aa]">{value}</span>
      </span>
    </div>
  )
}

function DashCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`h-full rounded-xl border border-[#1c1c1e] bg-[#111113] p-4 ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

function CardSkeleton({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <DashCard className={className}>
      <div className="mb-3 h-2.5 w-16 animate-pulse rounded bg-[#1c1c1e]" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-2 animate-pulse rounded bg-[#1c1c1e] ${i === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </DashCard>
  )
}

function BadgeSkeleton({ className }: { className?: string } = {}) {
  return (
    <DashCard className={className}>
      <div className="mb-3 h-2.5 w-16 animate-pulse rounded bg-[#1c1c1e]" />
      <div className="flex flex-wrap gap-1.5">
        {[56, 40, 64, 36, 48].map((w, i) => (
          <div
            key={i}
            className="h-5 animate-pulse rounded bg-[#1c1c1e]"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
    </DashCard>
  )
}

function DashBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-block rounded border border-[#27272a] bg-[#18181b] px-2 py-0.5 font-mono text-[10px] text-[#a1a1aa] ${className ?? ""}`}
    >
      {children}
    </span>
  )
}

function BlueDot() {
  return (
    <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#3b82f6]" />
  )
}

// --- Section cards ---

function RoleCard({ data }: { data: RoleAnalysis }) {
  return (
    <DashCard>
      <p className="label-mono mb-3">Required Skills</p>
      <div className="flex flex-wrap gap-1.5">
        {data.required_skills.map((s) => (
          <DashBadge key={s}>{s}</DashBadge>
        ))}
      </div>
      {data.nice_to_have.length > 0 && (
        <>
          <div className="my-3 h-px bg-[#1c1c1e]" />
          <p className="label-mono mb-2">Nice to Have</p>
          <div className="flex flex-wrap gap-1.5">
            {data.nice_to_have.map((s) => (
              <DashBadge key={s} className="border-transparent text-[#52525b]">
                {s}
              </DashBadge>
            ))}
          </div>
        </>
      )}
    </DashCard>
  )
}

function TopicsCard({ data }: { data: TopicsAnalysis }) {
  return (
    <DashCard>
      <p className="label-mono mb-3">Interview Topics</p>
      <ul className="space-y-2 text-[12px] text-[#a1a1aa]">
        {data.likely_interview_topics.map((t) => (
          <li key={t} className="flex items-start gap-2.5">
            <BlueDot />
            {t}
          </li>
        ))}
      </ul>
    </DashCard>
  )
}

function SignalsCard({ data }: { data: SignalsAnalysis }) {
  return (
    <DashCard>
      {data.culture_signals.length > 0 && (
        <>
          <p className="label-mono mb-3">Culture Signals</p>
          <div className="flex flex-wrap gap-1.5">
            {data.culture_signals.map((s) => (
              <DashBadge key={s}>{s}</DashBadge>
            ))}
          </div>
        </>
      )}
      {data.red_flags.length > 0 && (
        <>
          <div className="my-3 h-px bg-[#1c1c1e]" />
          <p className="label-mono mb-3">Red Flags</p>
          <div className="flex flex-wrap gap-1.5">
            {data.red_flags.map((f) => (
              <DashBadge
                key={f}
                className="border-red-500/20 bg-red-500/10 text-red-400"
              >
                {f}
              </DashBadge>
            ))}
          </div>
        </>
      )}
    </DashCard>
  )
}


function SalaryIntelCard({ data }: { data: SalaryIntel }) {
  return (
    <DashCard>
      <p className="label-mono mb-3">
        <DollarSign className="mr-1 inline h-3 w-3" />
        Compensation Range
      </p>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="font-mono text-lg font-extrabold tracking-tight text-[#fafafa]">
          {data.range_low}
        </span>
        <span className="text-[11px] text-[#3f3f46]">&ndash;</span>
        <span className="font-mono text-lg font-extrabold tracking-tight text-[#fafafa]">
          {data.range_high}
        </span>
        <span className="text-[10px] text-[#3f3f46]">{data.currency}</span>
      </div>
      <p className="mb-3 text-[11px] text-[#52525b]">
        Median: <span className="text-[#a1a1aa]">{data.median}</span>
      </p>
      {data.notes.length > 0 && (
        <ul className="space-y-1.5 text-[11px] text-[#3f3f46]">
          {data.notes.map((n, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#3f3f46]" />
              {n}
            </li>
          ))}
        </ul>
      )}
    </DashCard>
  )
}

function CompanyOverviewCard({ data }: { data: CompanyOverview }) {
  return (
    <DashCard>
      <p className="label-mono mb-3">Company</p>
      <p className="mb-1 text-[14px] font-semibold text-[#fafafa]">
        {data.name}
      </p>
      <p className="mb-4 text-[12px] leading-relaxed text-[#3f3f46]">
        {data.description}
      </p>
      <div className="space-y-2">
        <InfoRow icon={Building2} label="Industry" value={data.industry} />
        <InfoRow icon={MapPin} label="HQ" value={data.headquarters} />
        <InfoRow icon={Users} label="Employees" value={data.employee_count} />
        <InfoRow icon={Calendar} label="Founded" value={data.founded} />
        <InfoRow icon={Globe} label="Website" value={data.website} />
        <InfoRow icon={TrendingUp} label="Funding" value={data.funding_stage} />
      </div>
    </DashCard>
  )
}

function TechCultureCard({ data }: { data: CompanyTechProfile }) {
  return (
    <DashCard>
      {data.tech_stack.length > 0 && (
        <>
          <p className="label-mono mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {data.tech_stack.map((t) => (
              <DashBadge key={t}>{t}</DashBadge>
            ))}
          </div>
        </>
      )}
      {data.engineering_culture.length > 0 && (
        <>
          <div className="my-3 h-px bg-[#1c1c1e]" />
          <p className="label-mono mb-3">Engineering Culture</p>
          <ul className="space-y-2 text-[12px] text-[#a1a1aa]">
            {data.engineering_culture.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <BlueDot />
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </DashCard>
  )
}

function InterviewIntelCard({ data }: { data: CompanyInterviewInfo }) {
  return (
    <DashCard>
      {data.interview_process.length > 0 && (
        <>
          <p className="label-mono mb-3">Interview Process</p>
          <ol className="space-y-2 text-[12px]">
            {data.interview_process.map((step, i) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#27272a] bg-[#18181b] font-mono text-[8px] text-[#52525b]">
                  {i + 1}
                </span>
                <span className="text-[#a1a1aa]">{step}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      {data.glassdoor_highlights.length > 0 && (
        <>
          <div className="my-3 h-px bg-[#1c1c1e]" />
          <p className="label-mono mb-3">Employee Reviews</p>
          <ul className="space-y-2 text-[12px] text-[#3f3f46]">
            {data.glassdoor_highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5">
                <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#3f3f46]" />
                {h}
              </li>
            ))}
          </ul>
        </>
      )}
    </DashCard>
  )
}

function NewsCard({ data }: { data: CompanyNewsInfo }) {
  if (!data.recent_news.length) return null
  return (
    <DashCard>
      <p className="label-mono mb-3">Recent News</p>
      <ul className="space-y-2 text-[12px] text-[#3f3f46]">
        {data.recent_news.map((n) => (
          <li key={n} className="flex items-start gap-2.5">
            <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[#3f3f46]" />
            {n}
          </li>
        ))}
      </ul>
    </DashCard>
  )
}

// --- Resume match cards ---

function SkillMatchCard({ data }: { data: SkillMatch }) {
  return (
    <DashCard>
      <p className="label-mono mb-2">Skill Match</p>
      <div className="mb-2 flex items-baseline gap-1">
        <span className="font-mono text-4xl font-extrabold tracking-tighter text-[#fafafa]">
          {data.match_percentage}
        </span>
        <span className="font-mono text-sm text-[#3f3f46]">%</span>
      </div>
      <div className="mb-4 h-[3px] overflow-hidden rounded-full bg-[#1c1c1e]">
        <div
          className="h-full rounded-full bg-[#3b82f6]"
          style={{ width: `${data.match_percentage}%` }}
        />
      </div>
      {data.matched_skills.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {data.matched_skills.map((s) => (
            <DashBadge
              key={s}
              className="border-green-500/20 bg-green-500/10 text-green-400"
            >
              {s}
            </DashBadge>
          ))}
        </div>
      )}
      {data.missing_skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.missing_skills.map((s) => (
            <DashBadge
              key={s}
              className="border-red-500/20 bg-red-500/10 text-red-400"
            >
              {s}
            </DashBadge>
          ))}
        </div>
      )}
    </DashCard>
  )
}

function StrengthsCard({ data }: { data: ResumeStrengths }) {
  return (
    <DashCard>
      {data.strengths.length > 0 && (
        <>
          <p className="label-mono mb-3">Your Strengths</p>
          <ul className="space-y-2 text-[12px] text-[#a1a1aa]">
            {data.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2.5">
                <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-green-500" />
                {s}
              </li>
            ))}
          </ul>
        </>
      )}
      {data.talking_points.length > 0 && (
        <>
          <div className="my-3 h-px bg-[#1c1c1e]" />
          <p className="label-mono mb-3">Talking Points</p>
          <ul className="space-y-2 text-[12px] text-[#a1a1aa]">
            {data.talking_points.map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <BlueDot />
                {t}
              </li>
            ))}
          </ul>
        </>
      )}
    </DashCard>
  )
}

function GapCard({ data }: { data: GapAnalysis }) {
  if (!data.gaps.length) return null
  return (
    <DashCard>
      <p className="label-mono mb-3">Gaps & Suggestions</p>
      <div className="space-y-3 text-[12px]">
        {data.gaps.map((gap, i) => (
          <div key={i}>
            <p className="flex items-start gap-2.5 text-[#a1a1aa]">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-amber-500" />
              {gap}
            </p>
            {data.suggestions[i] && (
              <p className="ml-3.5 mt-1 text-[#3f3f46]">
                &rarr; {data.suggestions[i]}
              </p>
            )}
          </div>
        ))}
      </div>
    </DashCard>
  )
}

// --- Main preview ---

interface ScrapePreviewProps {
  rawText: string
  companyHint?: string
  resumeText?: string | null
  onStartInterview: (roleName?: string, companyName?: string) => void
  onReset: () => void
}

export function ScrapePreview({
  rawText,
  companyHint,
  resumeText,
  onStartInterview,
  onReset,
}: ScrapePreviewProps) {
  const role = useSection<RoleAnalysis>("role", rawText, companyHint)
  const topics = useSection<TopicsAnalysis>("topics", rawText)
  const signals = useSection<SignalsAnalysis>("signals", rawText)
  const prepQuestions = useSection<PrepQuestions>(
    "prep-questions",
    rawText,
    companyHint,
  )
  const salaryIntel = useSection<SalaryIntel>(
    "salary-intel",
    rawText,
    companyHint,
  )
  const overview = useSection<CompanyOverview>(
    "company-overview",
    rawText,
    companyHint,
  )
  const tech = useSection<CompanyTechProfile>(
    "company-tech",
    rawText,
    companyHint,
  )
  const interview = useSection<CompanyInterviewInfo>(
    "company-interview",
    rawText,
    companyHint,
  )
  const news = useSection<CompanyNewsInfo>("company-news", rawText, companyHint)

  const skillMatch = useSection<SkillMatch>(
    "skill-match",
    resumeText ? rawText : null,
    undefined,
    resumeText,
  )
  const strengths = useSection<ResumeStrengths>(
    "resume-strengths",
    resumeText ? rawText : null,
    undefined,
    resumeText,
  )
  const gaps = useSection<GapAnalysis>(
    "gap-analysis",
    resumeText ? rawText : null,
    undefined,
    resumeText,
  )

  // Track loading — CTA disabled until core sections load
  const coreLoading =
    role.isLoading ||
    topics.isLoading ||
    signals.isLoading ||
    overview.isLoading ||
    prepQuestions.isLoading

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="mx-auto w-full max-w-5xl"
    >
      {/* Header with CTA */}
      <div className="mb-6 flex items-start justify-between">
        {role.data ? (
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#fafafa]">
              {role.data.role}
            </h1>
            <p className="label-mono mt-1">
              {role.data.company} &middot; {role.data.seniority}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-7 w-64 animate-pulse rounded bg-[#1c1c1e]" />
            <div className="h-3 w-36 animate-pulse rounded bg-[#1c1c1e]" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="rounded-md p-1.5 text-[#3f3f46] transition-colors hover:text-[#a1a1aa]"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              onStartInterview(role.data?.role, role.data?.company)
            }
            disabled={coreLoading}
            className="flex items-center gap-2 rounded-lg bg-[#fafafa] px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#09090b] transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            {coreLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Mic className="h-3.5 w-3.5" />
            )}
            Start Interview
          </button>
        </div>
      </div>

      {/* Resume match row */}
      {resumeText && (
        <div className="mb-3 grid gap-2 sm:grid-cols-3">
          {skillMatch.isLoading ? (
            <CardSkeleton lines={4} />
          ) : skillMatch.data ? (
            <SkillMatchCard data={skillMatch.data} />
          ) : null}
          {strengths.isLoading ? (
            <CardSkeleton lines={3} />
          ) : strengths.data ? (
            <StrengthsCard data={strengths.data} />
          ) : null}
          {gaps.isLoading ? (
            <CardSkeleton lines={3} />
          ) : gaps.data ? (
            <GapCard data={gaps.data} />
          ) : null}
        </div>
      )}

      {/* Main grid — flat, cards are direct children so rows align */}
      <div className="grid gap-2 md:grid-cols-2">
        {role.isLoading ? (
          <BadgeSkeleton />
        ) : role.data ? (
          <RoleCard data={role.data} />
        ) : null}
        {overview.isLoading ? (
          <CardSkeleton lines={6} />
        ) : overview.data ? (
          <CompanyOverviewCard data={overview.data} />
        ) : null}

        {topics.isLoading ? (
          <CardSkeleton lines={4} />
        ) : topics.data ? (
          <TopicsCard data={topics.data} />
        ) : null}
        {tech.isLoading ? (
          <BadgeSkeleton />
        ) : tech.data ? (
          <TechCultureCard data={tech.data} />
        ) : null}

        {signals.isLoading ? (
          <BadgeSkeleton />
        ) : signals.data ? (
          <SignalsCard data={signals.data} />
        ) : null}
        {interview.isLoading ? (
          <CardSkeleton lines={5} />
        ) : interview.data ? (
          <InterviewIntelCard data={interview.data} />
        ) : null}

        {prepQuestions.isLoading ? (
          <CardSkeleton lines={6} className="md:col-span-2" />
        ) : prepQuestions.data ? (
          <div className="md:col-span-2">
            <PracticeCards data={prepQuestions.data} />
          </div>
        ) : null}

        {news.isLoading ? (
          <CardSkeleton lines={3} />
        ) : news.data ? (
          <NewsCard data={news.data} />
        ) : null}
        {salaryIntel.isLoading ? (
          <CardSkeleton lines={3} />
        ) : salaryIntel.data ? (
          <SalaryIntelCard data={salaryIntel.data} />
        ) : null}
      </div>
    </motion.div>
  )
}
