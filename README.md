# MockReady

> **"From job posting to mock interview in seconds."**  
> ElevenHacks Season 1 — Hackathon 1 (Firecrawl × ElevenLabs)

---


https://github.com/user-attachments/assets/f6340afe-6466-43fd-9731-e72ad69d76fa


---

## What MockReady Does

MockReady is a voice-powered AI career coach and interview simulator. The marketing site lives at **`/`**; the product runs at **`/app`**.

Users can paste a job posting URL, search by job title and company keywords, or paste raw job text. **Firecrawl** scrapes or searches the web; an **OpenAI** pipeline (structured outputs with **Zod**) turns the posting into section-based analysis: role fit, likely topics, culture signals, company research (overview, tech stack, interview process, news), **prep questions** with tips, **salary intel**, and—when a resume is uploaded—**skill match**, **resume strengths**, and **gap analysis**. Optional **resume upload** (PDF or text via **unpdf**) feeds those resume-aware sections and is injected into the live interview context.

**ElevenLabs** conversational AI runs the mock interview in the browser (WebRTC) with runtime prompt overrides grounded in the job (and resume). A toggleable **live coach** streams short coaching tips from **`/api/insight`**, powered by **Cerebras** (OpenAI-compatible API), using the latest transcript plus job and resume context. After the session, the app pulls the ElevenLabs conversation transcript and scores it with OpenAI into a **debrief** (scores, hire signal, per-question feedback).

The core “wow” moment: watch a real posting analyzed into a dashboard of cards, then hear the interviewer ask tailored questions—and optionally get whispered coaching during the call.

---

## Tech Stack

| Layer | Tool |
| ----- | ---- |
| Framework | **Next.js 16** (App Router), **React 19** |
| UI | **shadcn/ui** (radix-nova), **Radix UI**, **Tailwind CSS v4** (PostCSS), **lucide-react** |
| Motion | **motion** (Framer Motion) |
| Theming | **next-themes** (app defaults to dark) |
| Voice | **ElevenLabs** (`@elevenlabs/react`, `@elevenlabs/elevenlabs-js`) |
| Web scraping | **Firecrawl** (`@mendable/firecrawl-js`) |
| LLM | **OpenAI** SDK, structured outputs via **Zod v4** |
| Live coach | **Cerebras** API (`gpt-oss-120b`) via OpenAI-compatible client |
| Resume PDF | **unpdf** |
| State | React hooks (`use-interview` state machine, `use-section` for lazy analysis) |
| Styling utilities | **class-variance-authority**, **clsx**, **tailwind-merge**, **tw-animate-css** |
| Tooling | **TypeScript** (strict), **ESLint** (next core-web-vitals + typescript), **Prettier** + **prettier-plugin-tailwindcss** |
| Deployment | Vercel (typical) |

---

## Routes & UX

| Path | Purpose |
| ---- | ------- |
| `/` | Landing page: hero, bento features, how-it-works, tech stack, CTAs into the product |
| `/app` | Full flow: job input → scrape → analysis dashboard → live interview → debrief |

The `/app` shell uses a fixed header with a link back to the landing site.

---

## Core User Flow

```
1. User opens /app
   └── Enters: job URL, or keyword search (title + company), or pasted text
   └── Optionally attaches a resume (.pdf or .txt)

2. POST /api/scrape — paste, URL scrape, or keyword search (Firecrawl)
   └── Optional parallel POST /api/parse-resume for resume text

3. READY — dashboard loads analysis sections on demand (POST /api/analyze per section)
   └── Prep questions appear in a carousel with flip cards (question / tip)
   └── Core sections (role, topics, signals, prep questions) gate the “Start interview” CTA

4. Live interview — ElevenLabs agent with injected job (+ resume) context
   └── Optional coach panel: POST /api/insight for real-time tips (Cerebras)

5. End session — POST /api/score fetches ElevenLabs transcript by conversation id, scores with OpenAI

6. DEBRIEF — animated overall score, accordion per-question breakdown, improvements

7. User can reset and try another role or posting
```

---

## API Routes (`app/api/`)

| Route | Role |
| ----- | ---- |
| `POST /api/scrape` | Modes: `paste`, `url`, `keyword` — returns job text and metadata |
| `POST /api/analyze` | Multiplexed by `section` — see sections below |
| `POST /api/parse` | Legacy single-shot **InterviewBrief** from raw text |
| `POST /api/parse-resume` | Multipart file → extracted text (cap 10k chars) |
| `POST /api/enrich` | Legacy full **CompanyProfile** via Firecrawl search + OpenAI |
| `POST /api/score` | Transcript + job context → **SessionDebrief** |
| `GET /api/signed-url` | ElevenLabs signed URL for the conversational agent |
| `POST /api/insight` | Job + transcript (+ optional resume) → short coaching JSON (Cerebras) |

**`/api/analyze` sections:** `role`, `topics`, `signals`, `company-overview`, `company-tech`, `company-interview`, `company-news`, `skill-match`, `resume-strengths`, `gap-analysis`, `prep-questions`, `salary-intel`. Resume-only sections need `resumeText`.

---

## Interview Session — State Machine

```
IDLE
  → user submits job input (+ optional resume)
SCRAPING
  → Firecrawl / paste path; optional resume parse
READY
  → user reviews analysis, starts interview (after core sections load)
IN_PROGRESS
  → ElevenLabs agent live; optional coach insights
SCORING
  → transcript fetched and scored
DEBRIEF
  → results displayed; user can reset
```

---

## Environment

Create a `.env` (not committed) with:

```
FIRECRAWL_API_KEY=
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID=
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=
CEREBRAS_API_KEY=
```

`ELEVENLABS_AGENT_ID` and `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` must be the same agent ID. **`CEREBRAS_API_KEY`** is required for the live coach (`/api/insight`); without it, coach requests return 500.

Run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm run format`.
