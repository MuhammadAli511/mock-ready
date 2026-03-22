"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useConversation } from "@elevenlabs/react"
import { AnimatePresence, motion } from "motion/react"
import {
  PhoneOff,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  AlertTriangle,
  ArrowDown,
} from "lucide-react"
import type { TranscriptMessage } from "@/lib/types"

type InsightType = "mention" | "technique" | "warning" | "depth"

interface CoachInsight {
  id: string
  insight: string
  type: InsightType
  timestamp: Date
}

const insightConfig: Record<
  InsightType,
  { label: string; color: string; border: string; bg: string; icon: typeof Sparkles }
> = {
  mention: {
    label: "Mention",
    color: "text-[#3b82f6]",
    border: "border-[#3b82f6]/30",
    bg: "bg-[#3b82f6]/10",
    icon: Sparkles,
  },
  technique: {
    label: "Technique",
    color: "text-[#8b5cf6]",
    border: "border-[#8b5cf6]/30",
    bg: "bg-[#8b5cf6]/10",
    icon: Target,
  },
  warning: {
    label: "Heads Up",
    color: "text-[#f59e0b]",
    border: "border-[#f59e0b]/30",
    bg: "bg-[#f59e0b]/10",
    icon: AlertTriangle,
  },
  depth: {
    label: "Go Deeper",
    color: "text-[#22c55e]",
    border: "border-[#22c55e]/30",
    bg: "bg-[#22c55e]/10",
    icon: ArrowDown,
  },
}

interface LiveInterviewProps {
  rawText: string
  resumeText?: string | null
  roleName?: string
  companyName?: string
  onEnd: (conversationId: string) => void
}

function buildInterviewerPrompt(
  roleLabel: string,
  companyLabel: string,
  rawText: string,
  resumeText?: string | null,
) {
  const resumeSection = resumeText
    ? `\n\n## Candidate Resume\nYou have the candidate's resume below. Use it to personalize every phase of the interview — reference their actual projects, past roles, and skills when asking questions. If they claim expertise in something, test it. If they have gaps relative to the job requirements, probe around those areas diplomatically.\n${resumeText}`
    : ""

  return `You are a seasoned senior hiring manager at ${companyLabel} conducting a realistic, end-to-end mock interview for the ${roleLabel} position. You have conducted hundreds of interviews and you know exactly how to evaluate candidates — with warmth but rigor. This is NOT a quiz or a scripted Q&A. This is a real conversation that mirrors what the candidate would experience in an actual interview loop.

## ABSOLUTE RULES — NEVER BREAK THESE
- Ask exactly ONE question at a time, then STOP and WAIT for the candidate's full response.
- NEVER list multiple questions, bullet points, or numbered items in a single turn.
- NEVER say "Question 1", "Next question", "Moving on to question 2", or anything that breaks the fourth wall.
- Keep every turn SHORT — one question or one brief follow-up. Maximum 2-3 sentences before the question itself.
- You are the interviewer, not a tutor. Do NOT explain why you're asking something or coach the candidate mid-interview.
- Do NOT compliment every answer. Only acknowledge genuinely strong responses. If an answer is mediocre, just move on naturally.

## INTERVIEW FLOW — Follow this structure in order

### Phase 1: INTRODUCTION & WARMUP (1-2 turns)
Start with a warm, professional welcome. Briefly introduce yourself (pick a realistic name and title, e.g. "I'm John, Engineering Director here at ${companyLabel}"). Explain the format casually: "We'll spend about 30 minutes together — I'll ask about your background, dive into some technical topics, and leave time at the end for your questions."
Then ask them to walk you through their background and what brought them to this opportunity. Listen carefully — their answer seeds your follow-up questions for the rest of the interview.

### Phase 2: EXPERIENCE & BACKGROUND (2-3 questions)
Dig into their relevant experience. ${resumeText ? "Use their resume to ask pointed questions — don't ask what you can already read, instead ask for depth behind the bullet points." : "Ask about their most relevant past work."}
Good questions for this phase:
- "You mentioned [X project/role] — what was the hardest technical challenge you faced there, and how did you approach it?"
- "What was your specific contribution vs. the broader team's work on that?"
- "If you could go back and redo that project, what would you change?"
Probe for specifics. If they give a vague answer, push: "Can you walk me through that more concretely?" or "What did that look like day-to-day?"

### Phase 3: TECHNICAL DEEP-DIVE (3-4 questions)
This is the core of the interview. Ask role-specific technical questions drawn DIRECTLY from the job requirements in the job description below. These should feel like real problems, not textbook trivia.
Approach:
- Start with a medium-difficulty question related to their strongest claimed skill
- Based on their answer, either go deeper (if they're strong) or pivot to a different technical area (if they're struggling)
- Include at least one scenario/design question: "How would you approach...", "Walk me through how you'd design...", "If you had to build..."
- If they mention a technology or architecture, ask follow-ups that test real understanding vs. surface familiarity: "What tradeoffs did you consider?", "What would break first at scale?", "How did you handle [edge case]?"
Do NOT ask generic questions like "What is REST?" — ask questions that require them to THINK and APPLY knowledge to the specific role.

### Phase 4: CULTURE & BEHAVIORAL (2-3 questions)
Transition naturally: "I'd love to shift gears and talk about how you work with teams."
Ask behavioral questions using the STAR format expectation (Situation, Task, Action, Result) — but don't SAY "use the STAR format." Just ask the question and evaluate if their answer naturally covers those elements.
Draw these from signals in the job description about team dynamics, culture, and working style. Good examples:
- "Tell me about a time you disagreed with a technical decision on your team. How did you handle it?"
- "Describe a situation where you had to deliver something under a very tight deadline. What tradeoffs did you make?"
- "Have you ever had to onboard onto a large, unfamiliar codebase? How did you ramp up?"
- "Tell me about a time you made a mistake in production. What happened and what did you learn?"
If their answer lacks depth, push once: "What was the outcome?" or "How did the team react to that?"

### Phase 5: COMPENSATION & LOGISTICS (1-2 turns)
Transition smoothly: "We're getting toward the end — I want to make sure we cover a few practical things."
Ask about their compensation expectations naturally and professionally:
- "Do you have a sense of what you're targeting in terms of total compensation for your next role?"
- If they give a range, acknowledge it neutrally: "That's helpful context, thank you."
- If they deflect or ask about the budget, give a realistic-sounding range based on the role level and say something like: "We're flexible within that band depending on experience."
Also ask about timeline and availability:
- "What does your timeline look like? Are you considering other opportunities?"
- "When would you ideally be able to start?"

### Phase 6: CANDIDATE QUESTIONS & CLOSING (1-2 turns)
Ask: "We have a few minutes left — what questions do you have for me about the role, the team, or ${companyLabel}?"
Answer their questions in character as a real hiring manager would — be enthusiastic about the company but authentic, not salesy.
Then wrap up warmly and professionally:
- Thank them for their time
- Tell them what to expect next: "You'll hear from our recruiting team within the next few days with feedback and next steps."
- End with something warm: "It was really great talking with you. Best of luck!"

## CONVERSATIONAL STYLE
- Sound like a real human in a real interview. Use natural transitions: "That's a great point, actually that reminds me...", "Interesting — let me ask you something related...", "Got it. Switching gears a bit..."
- Match the candidate's energy. If they're nervous, be a bit warmer. If they're confident, be more direct.
- Use the candidate's name occasionally if they introduce themselves.
- Don't be afraid of brief pauses or short acknowledgments: "Mm, okay.", "Right.", "Got it."
- Vary your question style — some direct, some scenario-based, some follow-ups.
- If the candidate asks you a question mid-interview (like "Does that make sense?" or "Am I on the right track?"), give a brief neutral response and continue.

## EVALUATION MINDSET (Internal — never say this aloud)
You are silently evaluating: technical competence, communication clarity, depth of experience, problem-solving approach, cultural fit, and self-awareness. But you NEVER share your evaluation during the interview. Stay neutral and professional throughout.

## Job Description
${rawText}${resumeSection}

Remember: This is a REAL interview simulation. One question at a time. React to what they actually say. Follow the phases in order but let the conversation flow naturally within each phase.`
}

export function LiveInterview({
  rawText,
  resumeText,
  roleName,
  companyName,
  onEnd,
}: LiveInterviewProps) {
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const conversationIdRef = useRef<string | null>(null)
  const startedRef = useRef(false)
  const endedRef = useRef(false)

  // Transcript state
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const messagesRef = useRef<TranscriptMessage[]>([])
  messagesRef.current = messages
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Streaming agent response state
  const [streamingText, setStreamingText] = useState<string | null>(null)
  const streamingTextRef = useRef<string>("")

  // Coach state
  const [coachEnabled, setCoachEnabled] = useState(true)
  const [insights, setInsights] = useState<CoachInsight[]>([])
  const [insightLoading, setInsightLoading] = useState(false)
  const insightAbortRef = useRef<AbortController | null>(null)
  const lastInsightTimeRef = useRef<number>(0)
  const insightsEndRef = useRef<HTMLDivElement>(null)

  const roleLabel = roleName || "this role"
  const companyLabel = companyName || "the company"

  const overrides = useMemo(
    () => ({
      agent: {
        prompt: {
          prompt: buildInterviewerPrompt(
            roleLabel,
            companyLabel,
            rawText,
            resumeText,
          ),
        },
        language: "en",
        firstMessage: `Hey, welcome! I'm John from ${companyLabel}. Thanks for chatting with me about the ${roleLabel} role. To get us started — tell me a bit about yourself and what drew you to this opportunity.`,
      },
    }),
    [rawText, resumeText, roleLabel, companyLabel],
  )

  const conversation = useConversation({
    overrides,
    onConnect: () => {
      console.log("ElevenLabs connected")
      setConnectionError(null)
    },
    onDisconnect: () => {
      console.log("ElevenLabs disconnected")
      if (conversationIdRef.current && endedRef.current) {
        onEnd(conversationIdRef.current)
      }
    },
    onError: (message: string) => {
      console.error("Conversation error:", message)
      setConnectionError(message)
    },
    onMessage: (message) => {
      if (message.role === "agent") {
        // Finalize the streaming message with the complete text
        setStreamingText(null)
        streamingTextRef.current = ""
        const newMsg: TranscriptMessage = {
          id: crypto.randomUUID(),
          role: "agent",
          message: message.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, newMsg])
        fetchInsight()
      } else {
        const newMsg: TranscriptMessage = {
          id: crypto.randomUUID(),
          role: "user",
          message: message.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, newMsg])
      }
    },
    onAgentChatResponsePart: (part) => {
      if (part.type === "start") {
        streamingTextRef.current = ""
        setStreamingText("")
      } else if (part.type === "delta") {
        streamingTextRef.current += part.text
        setStreamingText(streamingTextRef.current)
      }
      // "stop" is handled by onMessage finalizing the message
    },
    onModeChange: (mode) => {
      console.log("Mode change:", mode)
    },
  })

  const startSession = useCallback(async () => {
    if (startedRef.current) return
    startedRef.current = true

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })

      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
      if (!agentId)
        throw new Error("NEXT_PUBLIC_ELEVENLABS_AGENT_ID is not set")

      const convId = await conversation.startSession({
        agentId,
        connectionType: "webrtc",
      })

      conversationIdRef.current = convId ?? null
      console.log("Conversation started:", convId)
    } catch (err) {
      startedRef.current = false
      setConnectionError(
        err instanceof Error ? err.message : "Failed to start interview",
      )
    }
  }, [conversation])

  useEffect(() => {
    startSession()
  }, [startSession])

  const handleEndInterview = useCallback(async () => {
    endedRef.current = true
    await conversation.endSession()
    if (conversationIdRef.current) {
      onEnd(conversationIdRef.current)
    }
  }, [conversation, onEnd])

  const fetchInsight = useCallback(async () => {
    if (!coachEnabled) return

    const now = Date.now()
    if (now - lastInsightTimeRef.current < 10_000) return
    lastInsightTimeRef.current = now

    if (insightAbortRef.current) insightAbortRef.current.abort()
    const controller = new AbortController()
    insightAbortRef.current = controller

    const recent = messagesRef.current.slice(-8)
    const recentTranscript = recent
      .map(
        (m) =>
          `${m.role === "agent" ? "Interviewer" : "Candidate"}: ${m.message}`,
      )
      .join("\n\n")

    setInsightLoading(true)

    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          resumeText: resumeText ?? undefined,
          recentTranscript,
        }),
        signal: controller.signal,
      })

      if (!res.ok) return

      const data = await res.json()
      if (!data.insight) return

      const newInsight: CoachInsight = {
        id: crypto.randomUUID(),
        insight: data.insight,
        type: data.type ?? "mention",
        timestamp: new Date(),
      }

      setInsights((prev) => [...prev, newInsight])
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      console.error("Insight fetch error:", err)
    } finally {
      setInsightLoading(false)
    }
  }, [rawText, resumeText, coachEnabled])

  // Auto-scroll transcript to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingText])

  // Auto-scroll insights to bottom
  useEffect(() => {
    insightsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [insights])

  // Cleanup insight on unmount
  useEffect(() => {
    return () => {
      insightAbortRef.current?.abort()
    }
  }, [])

  // Debounce the transition to "listening" — only show it after 2s of
  // persistent non-speaking state so the UI doesn't flicker.
  const rawSpeaking = conversation.isSpeaking
  const [debouncedSpeaking, setDebouncedSpeaking] = useState(rawSpeaking)
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (rawSpeaking) {
      if (speakingTimerRef.current) {
        clearTimeout(speakingTimerRef.current)
        speakingTimerRef.current = null
      }
      setDebouncedSpeaking(true)
    } else {
      speakingTimerRef.current = setTimeout(() => {
        setDebouncedSpeaking(false)
      }, 2000)
    }
    return () => {
      if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current)
    }
  }, [rawSpeaking])

  if (connectionError) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#09090b]">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-6 py-4 text-sm text-destructive">
          {connectionError}
        </div>
        <button
          onClick={() => {
            setConnectionError(null)
            startedRef.current = false
            endedRef.current = false
            startSession()
          }}
          className="mt-4 rounded-lg border border-[#27272a] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[#a1a1aa] transition-colors hover:border-[#3f3f46] hover:text-[#fafafa]"
        >
          Retry
        </button>
      </div>
    )
  }

  const isConnected = conversation.status === "connected"
  const isSpeaking = debouncedSpeaking
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#09090b]">
      {/* Coach toggle */}
      <div className="absolute left-4 top-4 z-[70]">
        <button
          onClick={() => setCoachEnabled(!coachEnabled)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-all ${
            coachEnabled
              ? "border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6]"
              : "border-[#27272a] text-[#3f3f46] hover:border-[#3f3f46]"
          }`}
        >
          {coachEnabled ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
          Coach {coachEnabled ? "On" : "Off"}
        </button>
      </div>

      {/* AI Coach panel — right side */}
      <AnimatePresence>
        {coachEnabled && insights.length > 0 && (
          <motion.div
            key="coach-panel"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 280,
              mass: 0.8,
            }}
            className="absolute right-4 top-4 z-[70] flex w-[300px] max-h-[calc(100vh-240px)] flex-col rounded-xl border border-[#1c1c1e] bg-[#111113]/95 backdrop-blur-md"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-[#1c1c1e] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#3b82f6]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#a1a1aa]">
                  Live Coach
                </span>
              </div>
              <span className="font-mono text-[9px] text-[#3f3f46]">
                {insights.length} tip{insights.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Insights list */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {insights.map((item, i) => {
                const config = insightConfig[item.type] ?? insightConfig.mention
                const Icon = config.icon
                const isLatest = i === insights.length - 1

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: isLatest ? 1 : 0.5, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-lg border p-3 transition-opacity ${
                      isLatest
                        ? `${config.border} ${config.bg}`
                        : "border-transparent bg-transparent"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Icon className={`h-3 w-3 ${config.color}`} />
                      <span
                        className={`font-mono text-[9px] uppercase tracking-[0.15em] ${config.color}`}
                      >
                        {config.label}
                      </span>
                      <span className="ml-auto font-mono text-[8px] text-[#3f3f46]">
                        {item.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p
                      className={`text-[12px] leading-relaxed ${
                        isLatest ? "text-[#e4e4e7]" : "text-[#52525b]"
                      }`}
                    >
                      {item.insight}
                    </p>
                  </motion.div>
                )
              })}
              {insightLoading && (
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3b82f6]" />
                  <span className="font-mono text-[9px] text-[#3f3f46]">
                    Thinking...
                  </span>
                </div>
              )}
              <div ref={insightsEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upper section: orb + status */}
      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Concentric rings + orb */}
        <div className="relative flex items-center justify-center">
          {/* Outermost ring */}
          <div
            className={`absolute h-[280px] w-[280px] rounded-full border transition-all duration-700 ${
              isSpeaking
                ? "animate-ring-pulse border-[#3b82f6]/20"
                : "border-[#1c1c1e]"
            }`}
          />

          {/* Middle ring */}
          <div
            className={`absolute h-[240px] w-[240px] rounded-full border transition-all duration-700 ${
              isSpeaking
                ? "animate-ring-pulse-delayed border-[#3b82f6]/30"
                : "border-[#1c1c1e]"
            }`}
          />

          {/* Main orb */}
          <div
            className={`relative flex h-[200px] w-[200px] items-center justify-center rounded-full border-2 bg-[#111113] transition-all duration-700 ${
              isSpeaking
                ? "animate-orb-breathe border-[#3b82f6]/60 shadow-[0_0_80px_rgba(59,130,246,0.25),0_0_160px_rgba(59,130,246,0.1)]"
                : isConnected
                  ? "border-[#3b82f6]/30"
                  : "border-[#27272a]"
            }`}
          >
            <div
              className={`h-[60px] w-[60px] rounded-full transition-all duration-500 ${
                isSpeaking
                  ? "bg-[#3b82f6]/20 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                  : isConnected
                    ? "bg-[#fafafa]"
                    : "bg-[#1c1c1e]"
              }`}
            />
          </div>
        </div>

        {/* Status */}
        <div className="mt-12 text-center">
          <p className="label-mono">
            {!isConnected
              ? "Connecting..."
              : isSpeaking
                ? "Interviewer is speaking"
                : "Listening to your answer"}
          </p>
        </div>
      </div>

      {/* End interview button */}
      <div className="flex justify-center py-3">
        <button
          onClick={handleEndInterview}
          disabled={!isConnected}
          className="flex items-center gap-2 rounded-lg border border-[#27272a] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#52525b] transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-30"
        >
          <PhoneOff className="h-3.5 w-3.5" />
          End Interview
        </button>
      </div>

      {/* Bottom transcript drawer */}
      <div className="border-t border-[#1c1c1e] bg-[#09090b]/80">
        <div className="px-6 pt-3 pb-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#52525b]">
            Live Transcript
          </span>
        </div>
        <div className="h-[180px] overflow-y-auto px-6 pb-4">
          {messages.length === 0 ? (
            <p className="pt-6 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-[#3f3f46]">
              Transcript will appear here...
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          msg.role === "agent" ? "#3b82f6" : "#22c55e",
                      }}
                    />
                    <span
                      className="font-mono text-[10px] font-medium"
                      style={{
                        color:
                          msg.role === "agent" ? "#3b82f6" : "#22c55e",
                      }}
                    >
                      {msg.role === "agent" ? "John" : "You"}
                    </span>
                    <span className="font-mono text-[9px] text-[#3f3f46]">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="pl-[11px] text-[13px] leading-relaxed text-[#d4d4d8]">
                    {msg.message}
                  </p>
                </div>
              ))}
              {streamingText !== null && (
                <div>
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
                    <span className="font-mono text-[10px] font-medium text-[#3b82f6]">
                      John
                    </span>
                  </div>
                  <p className="pl-[11px] text-[13px] leading-relaxed text-[#d4d4d8]">
                    {streamingText}
                    <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-[#3b82f6]" />
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
