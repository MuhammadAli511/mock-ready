"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Glow } from "@/components/ui/glow"
import { ProductPreview } from "@/components/landing/product-preview"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20">
      {/* Background effects */}
      <Glow className="-top-[200px] h-[600px] w-[900px]" />

      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute top-[10%] left-[15%] h-[300px] w-[300px] animate-float rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.04)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute right-[10%] top-[30%] h-[250px] w-[250px] animate-float-delayed rounded-full bg-[radial-gradient(ellipse,rgba(139,92,246,0.04)_0%,transparent_70%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <motion.div
          variants={item}
          className="mb-8 inline-block rounded-full border border-[#27272a] bg-[#18181b] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#71717a]"
        >
          AI-Powered Interview Prep
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-[#fafafa] sm:text-7xl"
        >
          Ace your next
          <br />
          interview
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#52525b]"
        >
          Paste a job link. Get a live AI interviewer.
          <br />
          Walk in prepared.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <Link
            href="/app"
            className="rounded-lg bg-[#fafafa] px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#09090b] transition-opacity hover:opacity-90"
          >
            Start Practicing
          </Link>
          <a
            href="#how-it-works"
            className="rounded-lg border border-[#27272a] px-7 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#a1a1aa] transition-colors hover:border-[#3f3f46] hover:text-[#fafafa]"
          >
            How It Works
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="mx-auto mt-16 h-px w-[60px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent"
        />
      </motion.div>

      {/* Product preview */}
      <div className="relative z-10">
        <ProductPreview />
      </div>
    </section>
  )
}
