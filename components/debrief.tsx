"use client"

import type { SessionDebrief } from "@/lib/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { RotateCcw } from "lucide-react"
import { useAnimatedNumber } from "@/components/ui/animated-number"

const hireSignalLabels: Record<string, string> = {
  strong_hire: "Strong Hire",
  hire: "Hire",
  lean_hire: "Lean Hire",
  lean_no_hire: "Lean No Hire",
  no_hire: "No Hire",
}

function ScoreBar({
  label,
  value,
  max = 10,
}: {
  label: string
  value: number
  max?: number
}) {
  const pct = (value / max) * 100
  return (
    <div>
      <div className="mb-1.5 flex justify-between">
        <span className="label-mono">{label}</span>
        <span className="font-mono text-[10px] text-[#a1a1aa]">
          {value}/{max}
        </span>
      </div>
      <div className="h-[2px] overflow-hidden rounded-full bg-[#1c1c1e]">
        <div
          className="h-full rounded-full bg-[#fafafa] transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

interface DebriefProps {
  debrief: SessionDebrief
  onReset: () => void
}

export function Debrief({ debrief, onReset }: DebriefProps) {
  const animatedScore = useAnimatedNumber(debrief.overall_score)
  const signalLabel =
    hireSignalLabels[debrief.hire_signal] ?? debrief.hire_signal

  const qs = debrief.question_scores
  const avg = (key: "relevance" | "depth" | "communication") =>
    qs.length ? Math.round(qs.reduce((s, q) => s + q[key], 0) / qs.length) : 0

  return (
    <div className="mx-auto w-full max-w-4xl animate-fade-up space-y-10 py-8">
      {/* Two-column top section */}
      <div className="grid gap-10 md:grid-cols-[1fr_1.5fr]">
        {/* Left — Score hero */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-7xl font-extrabold tracking-tighter text-[#fafafa]">
              {animatedScore}
            </span>
            <span className="font-mono text-lg text-[#3f3f46]">/100</span>
          </div>
          <div className="mt-3 inline-block rounded border border-[#27272a] bg-[#18181b] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#a1a1aa]">
            {signalLabel}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#52525b]">
            {debrief.summary}
          </p>

          {/* Average score bars */}
          {qs.length > 0 && (
            <div className="mt-8 space-y-3">
              <p className="label-mono mb-4">Average Scores</p>
              <ScoreBar label="Relevance" value={avg("relevance")} />
              <ScoreBar label="Depth" value={avg("depth")} />
              <ScoreBar label="Communication" value={avg("communication")} />
            </div>
          )}
        </div>

        {/* Right — Question breakdown */}
        {qs.length > 0 && (
          <div>
            <p className="label-mono mb-4">Question Breakdown</p>
            <Accordion type="multiple" className="w-full">
              {qs.map((q, i) => (
                <AccordionItem
                  key={i}
                  value={`q-${i}`}
                  className="border-[#1c1c1e]"
                >
                  <AccordionTrigger className="py-3 text-left text-sm hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#27272a] bg-[#18181b] font-mono text-[9px] text-[#52525b]">
                        {i + 1}
                      </span>
                      <span className="text-[#fafafa]">{q.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4 pt-1">
                    <p className="text-sm text-[#52525b]">
                      <span className="font-medium text-[#a1a1aa]">
                        Your answer:{" "}
                      </span>
                      {q.answer_summary}
                    </p>
                    <div className="space-y-2.5">
                      <ScoreBar label="Relevance" value={q.relevance} />
                      <ScoreBar label="Depth" value={q.depth} />
                      <ScoreBar
                        label="Communication"
                        value={q.communication}
                      />
                    </div>
                    <p className="text-[12px] leading-relaxed text-[#3f3f46]">
                      {q.feedback}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>

      {/* Improvements */}
      {debrief.improvements.length > 0 && (
        <div className="rounded-xl border border-[#1c1c1e] bg-[#111113] p-6">
          <p className="label-mono mb-4">Areas for Improvement</p>
          <ul className="space-y-3 text-sm">
            {debrief.improvements.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[#52525b]"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#3b82f6]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#27272a] py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#52525b] transition-colors hover:border-[#3f3f46] hover:text-[#fafafa]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        New Interview
      </button>
    </div>
  )
}
