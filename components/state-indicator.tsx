"use client"

import type { InterviewState } from "@/lib/types"

const stateConfig: Record<string, { label: string }> = {
  SCRAPING: { label: "Analyzing job posting..." },
  SCORING: { label: "Scoring your interview..." },
}

export function StateIndicator({ state }: { state: InterviewState }) {
  const config = stateConfig[state]
  if (!config) return null

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-2 w-2 animate-pulse rounded-full bg-[#3b82f6]" />
      <p className="text-sm text-[#a1a1aa]">{config.label}</p>
      <div className="h-[2px] w-48 overflow-hidden rounded-full bg-[#1c1c1e]">
        <div className="h-full w-1/4 animate-slide-indeterminate rounded-full bg-[#3b82f6]" />
      </div>
    </div>
  )
}
