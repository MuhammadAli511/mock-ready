"use client"

import { motion } from "motion/react"

const skills = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "GraphQL",
  "Node.js",
]

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

export function ProductPreview() {
  return (
    <div
      className="mx-auto mt-16 w-full max-w-4xl"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: -4 }}
        animate={{ opacity: 1, y: 0, rotateX: 2 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="overflow-hidden rounded-xl border border-[#1c1c1e] bg-[#0d0d0f] shadow-2xl shadow-blue-500/5"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-[#1c1c1e] bg-[#111113] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/60" />
          </div>
          <div className="ml-3 flex-1 rounded-md bg-[#18181b] px-3 py-1">
            <span className="font-mono text-[10px] text-[#3f3f46]">
              mockready.app/app
            </span>
          </div>
        </div>

        {/* Dashboard content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="p-6 sm:p-8"
        >
          {/* Header row */}
          <motion.div
            variants={item}
            className="mb-6 flex flex-wrap items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold tracking-tight text-[#fafafa] sm:text-xl">
                  Senior Frontend Engineer
                </h3>
                <span className="rounded border border-[#27272a] bg-[#18181b] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#3b82f6]">
                  Senior
                </span>
              </div>
              <p className="mt-1 text-sm text-[#52525b]">
                Acme Inc &middot; San Francisco, CA
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#3b82f6] bg-[#3b82f6]/10">
                <span className="font-mono text-lg font-extrabold text-[#fafafa]">
                  87
                </span>
              </div>
            </div>
          </motion.div>

          {/* Skills row */}
          <motion.div variants={item} className="mb-6">
            <p className="label-mono mb-3">Required Skills</p>
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2"
            >
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={item}
                  className="inline-block rounded border border-[#27272a] bg-[#18181b] px-2.5 py-1 font-mono text-[10px] text-[#a1a1aa]"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom cards row */}
          <motion.div
            variants={item}
            className="grid gap-3 sm:grid-cols-3"
          >
            {/* Company card */}
            <div className="rounded-lg border border-[#1c1c1e] bg-[#111113] p-4">
              <p className="label-mono mb-2">Company</p>
              <p className="text-sm font-medium text-[#fafafa]">Acme Inc</p>
              <p className="mt-1 text-[11px] text-[#52525b]">
                Technology &middot; 500-1000 employees
              </p>
            </div>

            {/* Topics card */}
            <div className="rounded-lg border border-[#1c1c1e] bg-[#111113] p-4">
              <p className="label-mono mb-2">Interview Topics</p>
              <div className="flex flex-wrap gap-1.5">
                {["System Design", "React Patterns", "State Mgmt"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded bg-[#18181b] px-2 py-0.5 font-mono text-[9px] text-[#71717a]"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Signals card */}
            <div className="rounded-lg border border-[#1c1c1e] bg-[#111113] p-4">
              <p className="label-mono mb-2">Culture Signals</p>
              <div className="flex flex-wrap gap-1.5">
                {["Remote-first", "Eng-led", "Fast-paced"].map((s) => (
                  <span
                    key={s}
                    className="rounded bg-[#22c55e]/10 px-2 py-0.5 font-mono text-[9px] text-[#22c55e]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
