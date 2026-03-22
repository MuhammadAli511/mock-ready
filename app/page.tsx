import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { BentoFeatures } from "@/components/landing/bento-features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { TechStack } from "@/components/landing/tech-stack"
import { BottomCta } from "@/components/landing/bottom-cta"

export default function LandingPage() {
  return (
    <main className="min-h-svh bg-[#09090b]">
      <Navbar />
      <Hero />
      <BentoFeatures />
      <HowItWorks />
      <TechStack />
      <BottomCta />
    </main>
  )
}
