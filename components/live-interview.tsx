"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useConversation } from "@elevenlabs/react"
import { PhoneOff } from "lucide-react"

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
    ? `\n\n## Candidate Resume\nYou have the candidate's resume below. Use it to ask specific questions about their experience, projects, and skills. Reference their actual background when probing deeper.\n${resumeText}`
    : ""

  return `You are a senior hiring manager conducting a live mock interview for the position of ${roleLabel} at ${companyLabel}. This is a realistic, conversational interview — not a quiz.

## CRITICAL RULES
- Ask exactly ONE question at a time, then STOP and WAIT for the candidate to respond.
- NEVER list multiple questions in a single turn.
- NEVER number your questions out loud.
- Keep each of your turns SHORT — one question or one brief follow-up. No monologues.

## Interview Structure
1. OPENING (1 turn): Welcome the candidate warmly. Ask them to introduce themselves and share what interests them about this role.
2. BACKGROUND (1-2 questions): Ask about relevant experience from their resume or background that connects to this role.
3. TECHNICAL DEPTH (2-3 questions): Ask role-specific technical or domain questions drawn directly from the job requirements below. Adapt based on their answers — if they mention a relevant technology or project, dig deeper into it.
4. BEHAVIORAL (1-2 questions): Ask situational or behavioral questions relevant to the role (e.g., "Tell me about a time when..."). Pick scenarios that match the job's challenges.
5. CLOSING (1 turn): Ask if they have any questions for you. Then thank them warmly and tell them they'll hear back soon.

## How to Respond
- Listen carefully to each answer before deciding your next question.
- If an answer is vague or surface-level, ask a follow-up to probe deeper BEFORE moving on. For example: "Can you walk me through a specific example?" or "What was your role specifically in that?"
- If an answer is strong and detailed, acknowledge it briefly ("That's a great example") and move on to a new topic.
- Sound natural — use conversational transitions like "Great, thanks for sharing that. I'd like to shift gears a bit..." or "That's interesting. Building on that..."
- Do NOT read from a script. React to what the candidate actually says.
- Do NOT say "Question 3" or "Next question" — just ask it naturally.

## Job Description for Reference
${rawText}${resumeSection}

Remember: ONE question per turn. Wait for the answer. React to it. Then ask the next one.`
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
        firstMessage: `Hi there! Thanks for joining. I'm excited to chat with you about the ${roleLabel} position at ${companyLabel}. Before we dive into the specifics, I'd love to hear a bit about you — could you tell me about your background and what drew you to this role?`,
        language: "en",
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
      console.log("Message:", message)
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
  const isSpeaking = conversation.isSpeaking

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#09090b]">
      {/* Concentric rings + orb */}
      <div className="relative flex items-center justify-center">
        {/* Outermost ring */}
        <div
          className={`absolute h-[280px] w-[280px] rounded-full border transition-all duration-700 ${
            isSpeaking
              ? "border-[#3b82f6]/20 animate-ring-pulse"
              : "border-[#1c1c1e]"
          }`}
        />

        {/* Middle ring */}
        <div
          className={`absolute h-[240px] w-[240px] rounded-full border transition-all duration-700 ${
            isSpeaking
              ? "border-[#3b82f6]/30 animate-ring-pulse-delayed"
              : "border-[#1c1c1e]"
          }`}
        />

        {/* Main orb */}
        <div
          className={`relative flex h-[200px] w-[200px] items-center justify-center rounded-full border-2 bg-[#111113] transition-all duration-700 ${
            isSpeaking
              ? "border-[#3b82f6]/60 shadow-[0_0_80px_rgba(59,130,246,0.25),0_0_160px_rgba(59,130,246,0.1)] animate-orb-breathe"
              : isConnected
                ? "border-[#3b82f6]/30"
                : "border-[#27272a]"
          }`}
        >
          {/* Core circle — white when listening, blue glow when speaking, dark when standby */}
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

      {/* End interview */}
      <button
        onClick={handleEndInterview}
        disabled={!isConnected}
        className="absolute bottom-12 flex items-center gap-2 rounded-lg border border-[#27272a] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#52525b] transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-30"
      >
        <PhoneOff className="h-3.5 w-3.5" />
        End Interview
      </button>
    </div>
  )
}
