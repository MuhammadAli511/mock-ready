import Link from "next/link"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background">
      <header className="fixed top-0 z-50 w-full border-b border-[#1c1c1e] bg-[#09090b]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="text-[14px] font-bold tracking-tight text-[#fafafa]"
          >
            MockReady
          </Link>
        </div>
      </header>
      <div className="pt-[52px]">{children}</div>
    </div>
  )
}
