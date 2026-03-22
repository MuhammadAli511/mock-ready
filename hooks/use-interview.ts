"use client"

import { useState, useCallback } from "react"
import type { InterviewState, ScrapeResult, SessionDebrief } from "@/lib/types"

interface UseInterviewReturn {
  state: InterviewState
  scrapeResult: ScrapeResult | null
  resumeText: string | null
  debrief: SessionDebrief | null
  error: string | null
  submitJob: (url: string, resumeFile: File | null) => Promise<void>
  startInterview: () => void
  endInterview: (conversationId: string) => Promise<void>
  reset: () => void
}

export function useInterview(): UseInterviewReturn {
  const [state, setState] = useState<InterviewState>("IDLE")
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null)
  const [resumeText, setResumeText] = useState<string | null>(null)
  const [debrief, setDebrief] = useState<SessionDebrief | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submitJob = useCallback(async (url: string, resumeFile: File | null) => {
    setError(null)

    setState("SCRAPING")
    try {
      // Parse resume in parallel with scraping if a file is provided
      const scrapePromise = fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "url", url }),
      })

      let resumePromise: Promise<string | null> = Promise.resolve(null)
      if (resumeFile) {
        const formData = new FormData()
        formData.append("file", resumeFile)
        resumePromise = fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        }).then(async (res) => {
          if (!res.ok) return null
          const data = await res.json()
          return data.text as string
        })
      }

      const [scrapeRes, parsedResume] = await Promise.all([
        scrapePromise,
        resumePromise,
      ])

      if (!scrapeRes.ok) {
        const data = await scrapeRes.json()
        throw new Error(data.error || "Failed to scrape job posting")
      }

      const scrapeData: ScrapeResult = await scrapeRes.json()
      setScrapeResult(scrapeData)
      setResumeText(parsedResume)

      setState("READY")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setState("IDLE")
    }
  }, [])

  const startInterview = useCallback(() => {
    setState("IN_PROGRESS")
  }, [])

  const endInterview = useCallback(
    async (conversationId: string) => {
      setState("SCORING")
      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            rawText: scrapeResult?.rawText,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to score interview")
        }

        const debriefData: SessionDebrief = await res.json()
        setDebrief(debriefData)
        setState("DEBRIEF")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Scoring failed")
        setState("IDLE")
      }
    },
    [scrapeResult],
  )

  const reset = useCallback(() => {
    setState("IDLE")
    setScrapeResult(null)
    setResumeText(null)
    setDebrief(null)
    setError(null)
  }, [])

  return {
    state,
    scrapeResult,
    resumeText,
    debrief,
    error,
    submitJob,
    startInterview,
    endInterview,
    reset,
  }
}
