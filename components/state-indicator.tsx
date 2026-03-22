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
    <div className="flex flex-col items-center gap-6">
      {/* Pulsing orb */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-ring-pulse rounded-full border border-[#3b82f6]/20" />
        <div className="absolute inset-2 animate-ring-pulse-delayed rounded-full border border-[#3b82f6]/30" />
        <div className="absolute inset-4 rounded-full border border-[#3b82f6]/10" />
        <div className="h-10 w-10 animate-orb-breathe rounded-full bg-[radial-gradient(circle,#3b82f6_0%,#1d4ed8_100%)] shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
      </div>

      <p className="text-sm text-[#a1a1aa]">{config.label}</p>

      <div className="h-[2px] w-48 overflow-hidden rounded-full bg-[#1c1c1e]">
        <div className="h-full w-1/4 animate-slide-indeterminate rounded-full bg-[#3b82f6]" />
      </div>
    </div>
  )
}
