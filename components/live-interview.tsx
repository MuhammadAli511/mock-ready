"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useConversation } from "@elevenlabs/react"
import { AnimatePresence, motion } from "motion/react"
import { PhoneOff } from "lucide-react"
import type { TranscriptMessage } from "@/lib/types"

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
Start with a warm, professional welcome. Briefly introduce yourself (pick a realistic name and title, e.g. "I'm Sarah, Engineering Director here at ${companyLabel}"). Explain the format casually: "We'll spend about 30 minutes together — I'll ask about your background, dive into some technical topics, and leave time at the end for your questions."
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

  // Insight state
  const [currentInsight, setCurrentInsight] = useState<string | null>(null)
  const [insightVisible, setInsightVisible] = useState(false)
  const insightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const insightAbortRef = useRef<AbortController | null>(null)
  const lastInsightTimeRef = useRef<number>(0)

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
        firstMessage: `Hey, welcome! Thanks for taking the time to meet today. I'm Sarah, one of the hiring managers here at ${companyLabel}. I'll be running our conversation for the ${roleLabel} position. We'll spend about 30 minutes together — I'll ask about your background, get into some technical topics relevant to the role, and leave time at the end for any questions you have for me. Sound good? Alright — to kick things off, I'd love to hear a bit about you. Walk me through your background and what brought you to this opportunity.`,
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
      const newMsg: TranscriptMessage = {
        id: crypto.randomUUID(),
        role: message.role === "agent" ? "agent" : "user",
        message: message.message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMsg])

      if (message.role === "agent") {
        fetchInsight()
      }
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

      setCurrentInsight(data.insight)
      setInsightVisible(true)
      if (insightTimerRef.current) clearTimeout(insightTimerRef.current)

      insightTimerRef.current = setTimeout(() => {
        setInsightVisible(false)
      }, 8000)
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      console.error("Insight fetch error:", err)
    }
  }, [rawText, resumeText])

  // Auto-scroll transcript to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Cleanup insight on unmount
  useEffect(() => {
    return () => {
      insightAbortRef.current?.abort()
      if (insightTimerRef.current) clearTimeout(insightTimerRef.current)
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
      {/* AI Insight floating panel */}
      <AnimatePresence>
        {insightVisible && currentInsight !== null && (
          <motion.div
            key="insight-panel"
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{
              type: "spring",
              damping: 22,
              stiffness: 280,
              mass: 0.8,
            }}
            onClick={() => setInsightVisible(false)}
            className="absolute right-4 top-4 z-[70] max-w-[280px] cursor-pointer rounded-lg border border-[#eab308]/30 bg-[#111113]/95 px-4 py-3 backdrop-blur-md"
          >
            <div className="mb-1.5 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#eab308]">
                AI Insight
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-[#e4e4e7]">
              {currentInsight}
            </p>
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
                      {msg.role === "agent" ? "Sarah" : "You"}
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
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
