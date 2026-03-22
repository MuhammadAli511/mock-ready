import Link from "next/link"
import { Search, Mic, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Search,
    label: "Smart Analysis",
    description:
      "Scrapes job posts and builds a complete prep brief with company research",
  },
  {
    icon: Mic,
    label: "Live AI Interview",
    description:
      "Voice-powered mock interview tailored to the specific role",
  },
  {
    icon: BarChart3,
    label: "Detailed Debrief",
    description:
      "Question-by-question scores with actionable feedback",
  },
]

const steps = [
  { number: "01", text: "Paste a job URL" },
  { number: "02", text: "Practice with AI" },
  { number: "03", text: "Review your score" },
]

const techBadges = [
  "ElevenLabs Agents",
  "Firecrawl",
]

export function Features() {
  return (
    <>
      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-[#1c1c1e] bg-[#111113] p-6"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272a] bg-[#18181b]">
                <f.icon className="h-4 w-4 text-[#52525b]" />
              </div>
              <div className="label-mono mb-2">{f.label}</div>
              <div className="text-[12px] leading-relaxed text-[#52525b]">
                {f.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <p className="label-mono mb-10 text-center">How it works</p>
          <div className="flex items-start justify-center gap-16 sm:gap-20">
            {steps.map((s) => (
              <div key={s.number} className="text-center">
                <div className="mb-2 font-mono text-4xl font-extrabold tracking-tight text-[#fafafa]">
                  {s.number}
                </div>
                <div className="text-[12px] text-[#52525b]">{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built with */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-mono mb-4">Built With</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-md border border-[#1c1c1e] bg-[#111113] px-3 py-1.5 font-mono text-[10px] text-[#52525b]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#1c1c1e] px-6 py-24 text-center">
        <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-tight text-[#fafafa]">
          Ready to practice?
        </h2>
        <Link
          href="/app"
          className="inline-block rounded-lg bg-[#fafafa] px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#09090b] transition-opacity hover:opacity-90"
        >
          Get Started Free
        </Link>
      </section>
    </>
  )
}
