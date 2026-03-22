"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Upload, FileText, X, Loader2 } from "lucide-react"

interface JobInputFormProps {
  onSubmit: (url: string, resumeFile: File | null) => Promise<void>
  isLoading: boolean
}

const steps = [
  { num: "01", label: "Analyze", desc: "We scrape and break down the job posting" },
  { num: "02", label: "Interview", desc: "Practice with an AI interviewer" },
  { num: "03", label: "Score", desc: "Get detailed feedback on every answer" },
]

const techBadges = ["ElevenLabs", "Firecrawl"]

export function JobInputForm({ onSubmit, isLoading }: JobInputFormProps) {
  const [url, setUrl] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    onSubmit(url.trim(), resumeFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setResumeFile(file)
  }

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-16 md:flex-row md:items-center md:gap-20">
      {/* Left — Hero content */}
      <div className="flex-1 md:max-w-[55%]">
        <h1 className="font-mono text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-[#fafafa] sm:text-6xl">
          Mock
          <br />
          Ready
        </h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-[#52525b]">
          From job posting to mock interview in seconds. Paste a link, practice
          with AI, get scored.
        </p>

        <div className="mt-10 space-y-4">
          {steps.map((s) => (
            <div key={s.num} className="flex items-baseline gap-4">
              <span className="font-mono text-lg font-extrabold tracking-tight text-[#27272a]">
                {s.num}
              </span>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#fafafa]">
                  {s.label}
                </span>
                <span className="ml-2 text-[12px] text-[#3f3f46]">
                  {s.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2">
          <span className="label-mono mr-1">Powered by</span>
          {techBadges.map((b) => (
            <span
              key={b}
              className="rounded border border-[#1c1c1e] px-2 py-1 font-mono text-[9px] text-[#3f3f46]"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full flex-shrink-0 md:w-[380px]">
        <div className="rounded-xl border border-[#1c1c1e] bg-[#111113] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="job-url"
                className="label-mono block"
              >
                Job Posting URL
              </label>
              <Input
                id="job-url"
                type="url"
                placeholder="https://boards.greenhouse.io/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="h-12 rounded-lg border-[#27272a] bg-[#18181b] text-sm text-[#fafafa] placeholder:text-[#3f3f46] focus-visible:ring-[#3b82f6]"
              />
            </div>

            <div className="space-y-2">
              <label className="label-mono block">
                Resume (optional)
              </label>
              {resumeFile ? (
                <div className="flex items-center gap-2 rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-3 text-sm">
                  <FileText className="h-4 w-4 shrink-0 text-[#52525b]" />
                  <span className="flex-1 truncate font-mono text-[11px] text-[#a1a1aa]">
                    {resumeFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeFile(null)
                      if (fileInputRef.current)
                        fileInputRef.current.value = ""
                    }}
                    className="shrink-0 text-[#3f3f46] transition-colors hover:text-[#fafafa]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#27272a] bg-transparent px-3 py-4 font-mono text-[11px] text-[#3f3f46] transition-colors hover:border-[#3f3f46] hover:text-[#a1a1aa]"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload PDF or TXT
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-[#fafafa] font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#09090b] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
