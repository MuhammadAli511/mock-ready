"use client"

import { AnimatePresence, motion } from "motion/react"
import { useInterview } from "@/hooks/use-interview"
import { JobInputForm } from "@/components/job-input-form"
import { ScrapePreview } from "@/components/scrape-preview"
import { StateIndicator } from "@/components/state-indicator"
import { LiveInterview } from "@/components/live-interview"
import { Debrief } from "@/components/debrief"

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" as const },
}

export default function AppPage() {
  const {
    state,
    scrapeResult,
    resumeText,
    roleName,
    companyName,
    debrief,
    error,
    submitJob,
    startInterview,
    endInterview,
    reset,
  } = useInterview()

  return (
    <main
      className={`flex min-h-[calc(100svh-52px)] flex-col items-center p-6 ${
        state === "IDLE" ? "justify-center" : "pt-10"
      }`}
    >
      <AnimatePresence mode="wait">
        {state === "IDLE" && (
          <motion.div
            key="idle"
            {...pageTransition}
            className="flex w-full flex-col items-center gap-4"
          >
            {error && (
              <div className="w-full max-w-md rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <JobInputForm onSubmit={submitJob} isLoading={false} />
          </motion.div>
        )}

        {state === "SCRAPING" && (
          <motion.div key="scraping" {...pageTransition}>
            <StateIndicator state={state} />
          </motion.div>
        )}

        {state === "READY" && scrapeResult && (
          <motion.div key="ready" {...pageTransition} className="w-full">
            <ScrapePreview
              rawText={scrapeResult.rawText}
              resumeText={resumeText}
              onStartInterview={startInterview}
              onReset={reset}
            />
          </motion.div>
        )}

        {state === "IN_PROGRESS" && scrapeResult && (
          <motion.div key="interview" {...pageTransition} className="w-full">
            <LiveInterview
              rawText={scrapeResult.rawText}
              resumeText={resumeText}
              roleName={roleName ?? undefined}
              companyName={companyName ?? undefined}
              onEnd={endInterview}
            />
          </motion.div>
        )}

        {state === "SCORING" && (
          <motion.div key="scoring" {...pageTransition}>
            <StateIndicator state={state} />
          </motion.div>
        )}

        {state === "DEBRIEF" && debrief && (
          <motion.div key="debrief" {...pageTransition} className="w-full">
            <Debrief debrief={debrief} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
