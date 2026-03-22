"use client"

import { motion } from "motion/react"

const steps = [
  {
    number: "01",
    title: "Paste a Job Link",
    description:
      "Drop any job posting URL and we scrape it instantly. We extract the role, required skills, company info, and build your personalized prep brief.",
    visual: "input",
  },
  {
    number: "02",
    title: "Practice with AI",
    description:
      "Start a live voice interview powered by ElevenLabs. The AI interviewer adapts to the specific role, asking relevant technical and behavioral questions.",
    visual: "orb",
  },
  {
    number: "03",
    title: "Get Your Score",
    description:
      "Receive a detailed debrief with scores on relevance, depth, and communication for every answer. Plus an overall hire signal and improvement tips.",
    visual: "score",
  },
]

function InputMock() {
  return (
    <div className="w-full max-w-[260px] rounded-lg border border-[#1c1c1e] bg-[#0d0d0f] p-4">
      <p className="label-mono mb-2">Job Posting URL</p>
      <div className="flex items-center rounded-md border border-[#27272a] bg-[#18181b] px-3 py-2">
        <span className="truncate font-mono text-[10px] text-[#52525b]">
          https://boards.greenhouse.io/acme
        </span>
        <span className="ml-0.5 inline-block h-3.5 w-[1.5px] animate-cursor-blink bg-[#3b82f6]" />
      </div>
      <div className="mt-3 rounded-md bg-[#fafafa] py-1.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#09090b]">
        Analyze
      </div>
    </div>
  )
}

function OrbMock() {
  return (
    <div className="flex h-[100px] w-full max-w-[260px] items-center justify-center rounded-lg border border-[#1c1c1e] bg-[#0d0d0f]">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-ring-pulse rounded-full border border-[#3b82f6]/20" />
        <div className="absolute inset-2 animate-ring-pulse-delayed rounded-full border border-[#3b82f6]/30" />
        <div className="h-8 w-8 animate-orb-breathe rounded-full bg-[radial-gradient(circle,#3b82f6_0%,#1d4ed8_100%)] shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
      </div>
    </div>
  )
}

function ScoreMock() {
  return (
    <div className="w-full max-w-[260px] rounded-lg border border-[#1c1c1e] bg-[#0d0d0f] p-4">
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-3xl font-extrabold tracking-tighter text-[#fafafa]">
          87
        </span>
        <span className="font-mono text-sm text-[#3f3f46]">/100</span>
        <span className="ml-auto rounded border border-[#27272a] bg-[#18181b] px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#22c55e]">
          Strong Hire
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {[
          { label: "Relevance", w: "80%" },
          { label: "Depth", w: "70%" },
          { label: "Communication", w: "90%" },
        ].map((bar) => (
          <div key={bar.label}>
            <span className="font-mono text-[8px] uppercase tracking-wider text-[#52525b]">
              {bar.label}
            </span>
            <div className="mt-0.5 h-[2px] overflow-hidden rounded-full bg-[#1c1c1e]">
              <div
                className="h-full rounded-full bg-[#fafafa]"
                style={{ width: bar.w }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const visualComponents: Record<string, () => React.JSX.Element> = {
  input: InputMock,
  orb: OrbMock,
  score: ScoreMock,
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <p className="label-mono mb-16 text-center">How It Works</p>

      <div className="relative mx-auto max-w-3xl">
        {/* Vertical connecting line — desktop only */}
        <div className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-[#1c1c1e] md:block" />

        <div className="space-y-16 md:space-y-24">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0
            const Visual = visualComponents[step.visual]

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
                className="relative"
              >
                {/* Center dot — desktop only */}
                <div className="absolute top-6 left-1/2 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#3b82f6] bg-[#09090b] md:block" />

                {/* Content grid */}
                <div className="flex flex-col items-center gap-6 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-12">
                  {/* Left side */}
                  <div
                    className={`flex w-full ${isLeft ? "flex-col md:items-end md:text-right" : "items-center justify-center"}`}
                  >
                    {isLeft ? (
                      <div className="max-w-[300px]">
                        <span className="font-mono text-4xl font-extrabold tracking-tight text-[#1c1c1e]">
                          {step.number}
                        </span>
                        <h3 className="mt-1 text-lg font-semibold text-[#fafafa]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#52525b]">
                          {step.description}
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-center md:justify-end">
                        <Visual />
                      </div>
                    )}
                  </div>

                  {/* Center spacer for the dot */}
                  <div className="hidden w-3 md:block" />

                  {/* Right side */}
                  <div
                    className={`flex w-full ${!isLeft ? "flex-col md:items-start md:text-left" : "items-center justify-center"}`}
                  >
                    {!isLeft ? (
                      <div className="max-w-[300px]">
                        <span className="font-mono text-4xl font-extrabold tracking-tight text-[#1c1c1e]">
                          {step.number}
                        </span>
                        <h3 className="mt-1 text-lg font-semibold text-[#fafafa]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#52525b]">
                          {step.description}
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-center md:justify-start">
                        <Visual />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
