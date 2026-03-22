"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight, RotateCcw, Lightbulb } from "lucide-react"
import type { PrepQuestions } from "@/lib/types"

interface PracticeCardsProps {
  data: PrepQuestions
}

export function PracticeCards({ data }: PracticeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [direction, setDirection] = useState(0)

  const questions = data.questions
  if (!questions.length) return null

  const current = questions[currentIndex]

  const goTo = (index: number, dir: number) => {
    setFlipped(false)
    setDirection(dir)
    setCurrentIndex(index)
  }

  const prev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1, -1)
  }

  const next = () => {
    if (currentIndex < questions.length - 1) goTo(currentIndex + 1, 1)
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <p className="label-mono">
          <Lightbulb className="mr-1 inline h-3 w-3" />
          Practice Cards
        </p>
        <span className="font-mono text-[10px] text-[#3f3f46]">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Card */}
      <div className="relative h-[200px] w-full [perspective:800px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div
              onClick={() => setFlipped(!flipped)}
              className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
              style={{
                transition: "transform 0.4s ease",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front — Question */}
              <div className="absolute inset-0 flex flex-col justify-between rounded-xl border border-[#1c1c1e] bg-[#111113] p-5 [backface-visibility:hidden]">
                <div>
                  <span className="mb-3 inline-block rounded border border-[#27272a] bg-[#18181b] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#52525b]">
                    {current.category}
                  </span>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#fafafa]">
                    {current.question}
                  </p>
                </div>
                <p className="font-mono text-[9px] text-[#3f3f46]">
                  Tap to reveal tip
                </p>
              </div>

              {/* Back — Tip */}
              <div className="absolute inset-0 flex flex-col justify-between rounded-xl border border-[#3b82f6]/20 bg-[#111113] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div>
                  <span className="label-mono mb-3 inline-block">
                    Coaching Tip
                  </span>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#a1a1aa]">
                    {current.tip}
                  </p>
                </div>
                <p className="font-mono text-[9px] text-[#3f3f46]">
                  Tap to see question
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 font-mono text-[10px] text-[#52525b] transition-colors hover:text-[#fafafa] disabled:opacity-20"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Prev
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? "w-4 bg-[#3b82f6]"
                  : "w-1.5 bg-[#27272a] hover:bg-[#3f3f46]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={currentIndex === questions.length - 1}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 font-mono text-[10px] text-[#52525b] transition-colors hover:text-[#fafafa] disabled:opacity-20"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
