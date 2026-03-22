# MockReady

> **"From job posting to mock interview in seconds."**
> ElevenHacks Season 1 — Hackathon 1 (Firecrawl × ElevenLabs)

---

## What MockReady Does

MockReady is a voice-powered AI career coach and interview simulator. The user describes their target role or pastes a job URL. Firecrawl scrapes the live job posting in real time. An LLM extracts the key requirements, skills, and company context. ElevenLabs then switches into an "interviewer" voice persona and conducts a full mock interview — questions drawn directly from the scraped job description. After the session, the user receives a scored debrief with feedback grounded in the actual job requirements.

The core "wow" moment: the user watches a real job posting get scraped live, then hears the AI's voice shift into an interviewer and immediately start asking tailored questions based on that exact JD.

---

## Tech Stack


| Layer              | Tool                                           |
| ------------------ | ---------------------------------------------- |
| Frontend framework | Next.js 14 (App Router)                        |
| UI components      | shadcn/ui + Tailwind CSS                       |
| Voice (TTS + STT)  | ElevenLabs Conversational AI / Agents API      |
| Web scraping       | Firecrawl API                                  |
| LLM orchestration  | OpenAI                                         |
| State management   | React hooks + context (no external lib needed) |                                           |
| Deployment         | Vercel                                         |


---

## Core User Flow

```
1. User lands on /
   └── Inputs: job title + company  OR  pastes a job posting URL

2. Firecrawl scrapes the job URL (or searches for matching postings)
   └── Returns: raw job description text, company name, requirements, seniority

3. LLM parses the scraped content into a structured interview brief:
   └── { role, company, required_skills[], nice_to_have[], culture_signals[], red_flags[] }

4. ElevenLabs Conversational Agent is initialised with:
   └── System prompt injected with the interview brief
   └── Voice persona: "interviewer" (distinct from default assistant voice)
   └── Instructions: ask 5–8 role-relevant questions, probe for depth, follow up naturally

5. Live voice interview session begins in the browser
   └── User speaks answers via microphone
   └── Agent responds in real time with follow-up questions

6. Session ends → LLM scores the conversation:
   └── Per-question ratings (relevance, depth, communication)
   └── Overall hire/no-hire signal
   └── Written feedback with suggested improvements

7. User can re-run with a different job or retry the same one
```



## Key API Integrations

### Firecrawl

- Endpoint: `POST https://api.firecrawl.dev/v1/scrape`
- Input: job posting URL
- Output: clean markdown of the job description
- Fallback: if no URL is given, use Firecrawl `/search` to find matching job postings for a given title + company keyword

### ElevenLabs Conversational AI

- Use the **Conversational AI / Agents** product (not just TTS)
- The agent must be pre-configured in the ElevenLabs dashboard with a base system prompt
- At session start, inject a **dynamic system prompt override** containing the parsed job brief
- The interviewer persona should use a different voice ID than any "coach" or "assistant" voice to make the switch audible and dramatic
- Use the ElevenLabs JS/TS SDK for the browser-side audio stream

### LLM (OpenAI / Anthropic)

Two distinct LLM calls:

1. **Brief parser** — given raw scraped job text, return structured JSON: `{ role, company, seniority, required_skills, nice_to_have, likely_interview_topics, culture_signals }`
2. **Session scorer** — given the full transcript of the mock interview, return per-question scores + overall feedback + hire signal

---

## UI Screens (shadcn/ui Components to Use)


| Screen         | Key shadcn components                                                           |
| -------------- | ------------------------------------------------------------------------------- |
| Job input      | `Card`, `Input`, `Button`, `Tabs` (URL vs keyword)                              |
| Scrape preview | `Card`, `Badge` (skills tags), `ScrollArea`, `Separator`                        |
| Live interview | `Avatar` (interviewer), `Button` (mic), `Progress` (question counter)           |
| Debrief        | `Card`, `Progress` (per-question score), `Accordion` (feedback detail), `Badge` |


---

## Interview Session — State Machine

```
IDLE
  → user submits job input
SCRAPING
  → Firecrawl fetches job posting
PARSING
  → LLM structures the brief
READY
  → user reviews brief, clicks "Start Interview"
IN_PROGRESS
  → ElevenLabs agent is live, mic is open
  → questions cycle, transcript builds
SCORING
  → transcript sent to LLM scorer
DEBRIEF
  → results displayed
  → user can restart or try a different role
```

---

## Agentic Complexity (Hackathon Judging Notes)

This project demonstrates genuine agentic behaviour beyond a basic API call chain:

- **Tool chaining** — Firecrawl scrape feeds directly into LLM brief parser which feeds directly into ElevenLabs agent context injection. Each step's output is the next step's input.
- **Dynamic prompt injection** — the ElevenLabs agent receives a different system context for every single session based on live-scraped data. It is not a static chatbot.
- **Voice persona switching** — the same app uses two distinct ElevenLabs voices: a warm coaching voice for setup/debrief, and a formal interviewer voice for the live session. The audible switch is the demo's hero moment.
- **Multi-turn reasoning** — the agent follows up naturally based on user answers, does not just read from a list.
- **Scoring agent** — a second LLM pass analyses the full transcript against the original job requirements, closing the loop.

---

## Demo Script (for the submission video)

1. Open the app. Paste a real job URL — e.g. a Stripe or Vercel engineering role.
2. Show Firecrawl scraping it live (the raw text appearing on screen).
3. Show the parsed brief — skill tags popping up, company context loading.
4. Click "Start Interview." Hear the voice change. The first question is specific to that exact JD.
5. Answer one question out loud. Show the agent following up naturally.
6. End session. Show the scored debrief with written feedback.

Total demo runtime target: **60–90 seconds.**

---

## Hackathon Submission Checklist

- App deployed on Vercel with a public URL
- Firecrawl API used for live job scraping (required sponsor tech)
- ElevenLabs used for voice (required sponsor tech)
- Demo video recorded (60–90s, shows the voice switch moment)
- README and project description written
- Social post published with demo clip (earns +50 leaderboard points)
- Submitted before the deadline: **Thu 19 Mar · 5pm UK**

---

## Notes for the AI Coding Agent

- Prioritise the **happy path first**: URL input → scrape → brief → voice session → debrief. Get this working end-to-end before adding fallbacks.
- The voice session UI is the most important component. It should feel live and responsive — show a waveform or pulsing indicator when the agent is speaking.
- Keep API calls in `app/api/` route handlers, never expose API keys to the client.
- The `use-interview.ts` hook owns the state machine. Components should only read state and dispatch actions, not manage transitions themselves.
- Use `shadcn/ui` component primitives where possible rather than building from scratch. Install components with `npx shadcn@latest add <component>`.
- TypeScript strict mode is on. Define all types in `lib/types.ts` before wiring up components.

