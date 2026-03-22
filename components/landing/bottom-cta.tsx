"use client"

import Link from "next/link"
import { motion } from "motion/react"

export function BottomCta() {
  return (
    <section className="px-6 py-24 text-center">
      <div className="mx-auto mb-10 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent" />

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-2xl font-extrabold uppercase tracking-tight text-[#fafafa]"
      >
        Ready to practice?
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link
          href="/app"
          className="relative inline-block overflow-hidden rounded-lg bg-[#fafafa] px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#09090b] transition-opacity hover:opacity-90"
        >
          Get Started Free
          <span className="pointer-events-none absolute inset-0 animate-shimmer" />
        </Link>
      </motion.div>
    </section>
  )
}
