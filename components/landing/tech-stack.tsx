"use client"

import { motion } from "motion/react"
import { Mic, Search, Brain } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

const techCards = [
  {
    icon: Mic,
    name: "ElevenLabs",
    description:
      "Conversational AI voice agents for realistic, real-time mock interviews.",
  },
  {
    icon: Search,
    name: "Firecrawl",
    description:
      "Web scraping and search for deep job posting analysis and company research.",
  },
  {
    icon: Brain,
    name: "OpenAI",
    description:
      "Structured LLM analysis for role breakdown, interview scoring, and feedback.",
  },
]

export function TechStack() {
  return (
    <section className="px-6 py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-3xl"
      >
        <motion.div variants={item} className="mb-10 text-center">
          <p className="label-mono mb-4">Built With</p>
          <div className="inline-block rounded-full border border-[#27272a] bg-[#18181b] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#71717a]">
            ElevenLabs Hackathon 2026
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {techCards.map((card) => (
            <motion.div
              key={card.name}
              variants={item}
              className="rounded-xl border border-[#1c1c1e] bg-[#111113] p-6"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272a] bg-[#18181b]">
                <card.icon className="h-4 w-4 text-[#52525b]" />
              </div>
              <h3 className="mb-1 font-mono text-sm font-semibold text-[#fafafa]">
                {card.name}
              </h3>
              <p className="text-[12px] leading-relaxed text-[#52525b]">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
