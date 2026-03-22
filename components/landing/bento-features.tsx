"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { useAnimatedNumber } from "@/components/ui/animated-number"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

const badgeVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
}

const analysisSkills = [
  "React",
  "TypeScript",
  "Next.js",
  "System Design",
  "GraphQL",
  "Node.js",
]

const matchedSkills = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind",
]

function ScoreCounter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const score = useAnimatedNumber(isInView ? 87 : 0)

  return (
    <div ref={ref} className="mt-4 flex items-center gap-6">
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-5xl font-extrabold tracking-tighter text-[#fafafa]">
          {score}
        </span>
        <span className="font-mono text-lg text-[#3f3f46]">/100</span>
      </div>
      <div className="flex-1 space-y-2.5">
        {[
          { label: "Relevance", pct: 80 },
          { label: "Depth", pct: 70 },
          { label: "Communication", pct: 90 },
        ].map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between">
              <span className="label-mono">{bar.label}</span>
              <span className="font-mono text-[9px] text-[#3f3f46]">
                {bar.pct / 10}/10
              </span>
            </div>
            <div className="h-[2px] overflow-hidden rounded-full bg-[#1c1c1e]">
              <div
                className="h-full rounded-full bg-[#fafafa] transition-all duration-1000 ease-out"
                style={{ width: isInView ? `${bar.pct}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VoiceOrb() {
  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 animate-ring-pulse rounded-full border border-[#3b82f6]/20" />
        {/* Middle ring */}
        <div className="absolute inset-2 animate-ring-pulse-delayed rounded-full border border-[#3b82f6]/30" />
        {/* Core orb */}
        <div className="relative h-10 w-10 animate-orb-breathe rounded-full bg-[radial-gradient(circle,#3b82f6_0%,#1d4ed8_100%)] shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
      </div>
    </div>
  )
}

function SkillMatchRing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const pct = useAnimatedNumber(isInView ? 92 : 0)

  return (
    <div ref={ref} className="mt-4 flex flex-col items-center gap-4">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#1c1c1e"
            strokeWidth="3"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={
              isInView
                ? `${2 * Math.PI * 34 * (1 - 0.92)}`
                : `${2 * Math.PI * 34}`
            }
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute font-mono text-lg font-extrabold text-[#fafafa]">
          {pct}%
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {matchedSkills.map((s) => (
          <span
            key={s}
            className="rounded bg-[#22c55e]/10 px-2 py-0.5 font-mono text-[9px] text-[#22c55e]"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function BentoFeatures() {
  return (
    <section id="features" className="px-6 py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-3"
      >
        {/* Smart Analysis — col-span-2 */}
        <motion.div
          variants={cardVariant}
          className="overflow-hidden rounded-xl border border-[#1c1c1e] bg-[#111113] p-6 md:col-span-2"
        >
          <p className="label-mono mb-1">Smart Analysis</p>
          <p className="mb-4 text-[12px] leading-relaxed text-[#52525b]">
            Scrapes job posts and builds a complete prep brief with company
            research, role breakdown, and interview topics.
          </p>
          <div>
            <p className="mb-2 font-mono text-sm font-medium text-[#fafafa]">
              Senior Frontend Engineer
              <span className="ml-2 text-[#52525b]">&middot; Acme Inc</span>
            </p>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-2"
            >
              {analysisSkills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={badgeVariant}
                  className="inline-block rounded border border-[#27272a] bg-[#18181b] px-2.5 py-1 font-mono text-[10px] text-[#a1a1aa]"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Live AI Interview — tall card */}
        <motion.div
          variants={cardVariant}
          className="flex flex-col rounded-xl border border-[#1c1c1e] bg-[#111113] p-6"
        >
          <p className="label-mono mb-1">Live AI Interview</p>
          <p className="mb-auto text-[12px] leading-relaxed text-[#52525b]">
            Voice-powered mock interview tailored to the specific role and
            company.
          </p>
          <VoiceOrb />
        </motion.div>

        {/* Detailed Debrief — col-span-2 */}
        <motion.div
          variants={cardVariant}
          className="rounded-xl border border-[#1c1c1e] bg-[#111113] p-6 md:col-span-2"
        >
          <p className="label-mono mb-1">Detailed Debrief</p>
          <p className="text-[12px] leading-relaxed text-[#52525b]">
            Question-by-question scores with actionable feedback and a hire
            signal.
          </p>
          <ScoreCounter />
        </motion.div>

        {/* Resume Match — small card */}
        <motion.div
          variants={cardVariant}
          className="flex flex-col items-center rounded-xl border border-[#1c1c1e] bg-[#111113] p-6"
        >
          <p className="label-mono mb-1 self-start">Resume Match</p>
          <p className="mb-auto self-start text-[12px] leading-relaxed text-[#52525b]">
            See how your skills align with the role.
          </p>
          <SkillMatchRing />
        </motion.div>
      </motion.div>
    </section>
  )
}
