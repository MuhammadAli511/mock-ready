import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"

export default function LandingPage() {
  return (
    <main className="min-h-svh bg-[#09090b]">
      <Navbar />
      <Hero />
      <Features />
    </main>
  )
}
