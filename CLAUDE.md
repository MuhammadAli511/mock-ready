# Mock Ready

AI-powered mock interview prep app. Scrapes job postings, analyzes them with LLMs, conducts live voice interviews via ElevenLabs, then scores performance.

## Commands

```bash
npm run dev          # Start dev server (Turbopack) on localhost:3000
npm run build        # Production build
npm run lint         # ESLint (next core-web-vitals + typescript)
npm run format       # Prettier (write mode)
npm run typecheck    # tsc --noEmit
```

## Architecture

Next.js 16 App Router, single-page app with client-side state machine.

### State Machine Flow

`IDLE → SCRAPING → READY → IN_PROGRESS → SCORING → DEBRIEF`

Driven by `hooks/use-interview.ts`. Each state maps to a UI component in `app/page.tsx`.

### API Routes (`app/api/`)

| Route | Purpose | External Service |
|-------|---------|-----------------|
| `/api/scrape` | Scrape job posting (URL, keyword search, or paste) | Firecrawl |
| `/api/parse` | Legacy: extract interview brief from raw text | OpenAI |
| `/api/analyze` | Section-based analysis (role, topics, signals, company, resume match) | OpenAI + Firecrawl |
| `/api/enrich` | Legacy: build full company profile from web research | Firecrawl + OpenAI |
| `/api/score` | Score interview transcript after session ends | ElevenLabs + OpenAI |
| `/api/signed-url` | Get signed URL for ElevenLabs conversation | ElevenLabs |
| `/api/parse-resume` | Extract text from PDF/txt resume uploads | unpdf |

### Key Files

- `hooks/use-interview.ts` — Main state machine, orchestrates the full flow
- `hooks/use-section.ts` — Generic hook for lazy-loading analysis sections via `/api/analyze`
- `lib/types.ts` — All shared TypeScript types
- `components/live-interview.tsx` — ElevenLabs voice conversation UI (WebRTC)
- `components/scrape-preview.tsx` — Job analysis dashboard with tabbed sections

## Environment

Required in `.env`:

```
FIRECRAWL_API_KEY=
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID=
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=
```

Both `ELEVENLABS_AGENT_ID` (server-side) and `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` (client-side) must be set to the same ElevenLabs agent ID.

## Code Style

- **No semicolons**, double quotes, trailing commas (es5), 2-space indent, 80 char width
- Prettier with `prettier-plugin-tailwindcss` — Tailwind classes auto-sorted
- Path alias: `@/*` maps to project root
- shadcn/ui with `radix-nova` style, `neutral` base color, CSS variables
- UI components in `components/ui/`, app components in `components/`

## Tech Stack

- Next.js 16, React 19, TypeScript (strict)
- Tailwind CSS v4 (PostCSS plugin, no tailwind.config — uses `app/globals.css`)
- Zod v4 for schema validation
- OpenAI SDK with `zodResponseFormat` for structured outputs (model: `gpt-5.4-nano`)
- ElevenLabs JS SDK + `@elevenlabs/react` for conversational AI
- Firecrawl for web scraping and search

## Gotchas

- `/api/analyze` is a **multiplexed route** — the `section` field in the request body selects which handler runs. Valid sections: `role`, `topics`, `signals`, `company-overview`, `company-tech`, `company-interview`, `company-news`, `skill-match`, `resume-strengths`, `gap-analysis`
- Resume-dependent sections (`skill-match`, `resume-strengths`, `gap-analysis`) return null if no `resumeText` is provided
- `use-section.ts` uses a `fetchedRef` to prevent duplicate fetches in React strict mode
- The ElevenLabs conversation uses `overrides` to inject the job description as the agent's system prompt at runtime
- Firecrawl's `search()` returns results under `.web` — items need to be cast as `Record<string, unknown>` to access `.markdown`
- `.env` is gitignored (listed in `.gitignore`)
