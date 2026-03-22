"use client"

import { useState, useEffect, useRef } from "react"

export function useSection<T>(
  section: string,
  rawText: string | null,
  companyHint?: string,
  resumeText?: string | null,
): { data: T | null; isLoading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!rawText || fetchedRef.current) return
    fetchedRef.current = true

    setIsLoading(true)
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, rawText, companyHint, resumeText }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed")
        return res.json()
      })
      .then((result) => setData(result as T))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [section, rawText, companyHint, resumeText])

  return { data, isLoading, error }
}
