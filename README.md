# MockReady

> **"From job posting to mock interview in seconds."**  
> ElevenHacks Season 1 — Hackathon 1 (Firecrawl × ElevenLabs)

---

## What MockReady Does

MockReady is a voice-powered AI career coach and interview simulator. The user describes their target role or pastes a job URL. Firecrawl scrapes the live job posting in real time. An LLM extracts the key requirements, skills, and company context. ElevenLabs then switches into an "interviewer" voice persona and conducts a full mock interview — questions drawn directly from the scraped job description. After the session, the user receives a scored debrief with feedback grounded in the actual job requirements.

The core "wow" moment: the user watches a real job posting get scraped live, then hears the AI's voice shift into an interviewer and immediately start asking tailored questions based on that exact JD.

---

## Tech Stack


| Layer        | Tool                                        |
| ------------ | ------------------------------------------- |
| Frontend     | Next.js 16 (App Router), React 19           |
| UI           | shadcn/ui, Tailwind CSS v4                  |
| Voice        | ElevenLabs Conversational AI / Agents API   |
| Web scraping | Firecrawl API                               |
| LLM          | OpenAI (structured outputs via Zod)         |
| State        | React hooks (`use-interview` state machine) |
| Deployment   | Vercel                                      |


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

---

## Key API Integrations

**Firecrawl** — Scrapes job posting URLs into clean markdown; search can find postings from keywords when no URL is given.

**ElevenLabs** — Conversational AI agent with runtime system-prompt overrides so each session is grounded in the scraped job brief; browser SDK handles the live audio session.

**OpenAI** — Section-based analysis of the posting, plus transcript scoring and debrief after the interview.

---

## Interview Session — State Machine

```
IDLE
  → user submits job input
SCRAPING
  → Firecrawl fetches job posting
READY
  → user reviews analysis, starts interview
IN_PROGRESS
  → ElevenLabs agent is live, mic is open
  → questions cycle, transcript builds
SCORING
  → transcript sent to scorer
DEBRIEF
  → results displayed
  → user can restart or try a different role
```

---

## Environment

Set `FIRECRAWL_API_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`, and `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` (server and public agent IDs must be the same). Run locally with `npm run dev` ([http://localhost:3000](http://localhost:3000)).