import Link from "next/link"
import { Glow } from "@/components/ui/glow"

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6">
      <Glow className="-top-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div
          className="mb-8 inline-block animate-fade-up rounded-full border border-[#27272a] bg-[#18181b] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#71717a]"
          style={{ animationDelay: "0ms" }}
        >
          AI-Powered Interview Prep
        </div>

        <h1
          className="animate-fade-up text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-[#fafafa] opacity-0 sm:text-7xl"
          style={{ animationDelay: "100ms" }}
        >
          Ace your next
          <br />
          interview
        </h1>

        <p
          className="mx-auto mt-6 max-w-md animate-fade-up text-base leading-relaxed text-[#52525b] opacity-0"
          style={{ animationDelay: "200ms" }}
        >
          Paste a job link. Get a live AI interviewer.
          <br />
          Walk in prepared.
        </p>

        <div
          className="mt-10 flex animate-fade-up items-center justify-center gap-3 opacity-0"
          style={{ animationDelay: "300ms" }}
        >
          <Link
            href="/app"
            className="rounded-lg bg-[#fafafa] px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#09090b] transition-opacity hover:opacity-90"
          >
            Start Practicing
          </Link>
          <a
            href="#how-it-works"
            className="rounded-lg border border-[#27272a] px-7 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#a1a1aa] transition-colors hover:border-[#3f3f46] hover:text-[#fafafa]"
          >
            How It Works
          </a>
        </div>

        <div
          className="mx-auto mt-16 h-px w-[60px] animate-fade-up bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-0"
          style={{ animationDelay: "500ms" }}
        />
      </div>
    </section>
  )
}
