"use client"

import { useInterview } from "@/hooks/use-interview"
import { JobInputForm } from "@/components/job-input-form"
import { ScrapePreview } from "@/components/scrape-preview"
import { StateIndicator } from "@/components/state-indicator"
import { LiveInterview } from "@/components/live-interview"
import { Debrief } from "@/components/debrief"

export default function AppPage() {
  const {
    state,
    scrapeResult,
    resumeText,
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
      {state === "IDLE" && (
        <div className="flex w-full flex-col items-center gap-4">
          {error && (
            <div className="w-full max-w-md rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <JobInputForm onSubmit={submitJob} isLoading={false} />
        </div>
      )}

      {state === "SCRAPING" && <StateIndicator state={state} />}

      {state === "READY" && scrapeResult && (
        <ScrapePreview
          rawText={scrapeResult.rawText}
          resumeText={resumeText}
          onStartInterview={startInterview}
          onReset={reset}
        />
      )}

      {state === "IN_PROGRESS" && scrapeResult && (
        <LiveInterview
          rawText={scrapeResult.rawText}
          resumeText={resumeText}
          roleName={scrapeResult.title}
          onEnd={endInterview}
        />
      )}

      {state === "SCORING" && <StateIndicator state={state} />}

      {state === "DEBRIEF" && debrief && (
        <Debrief debrief={debrief} onReset={reset} />
      )}
    </main>
  )
}
