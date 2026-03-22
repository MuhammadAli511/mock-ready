import Link from "next/link"

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#1c1c1e] bg-[#09090b]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-[15px] font-bold tracking-tight text-[#fafafa]"
        >
          MockReady
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <a
            href="#features"
            className="text-xs text-[#71717a] transition-colors hover:text-[#a1a1aa]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-xs text-[#71717a] transition-colors hover:text-[#a1a1aa]"
          >
            How it works
          </a>
        </nav>

        <Link
          href="/app"
          className="rounded-md bg-[#fafafa] px-4 py-1.5 text-[11px] font-semibold text-[#09090b] transition-opacity hover:opacity-90"
        >
          Get Started
        </Link>
      </div>
    </header>
  )
}
