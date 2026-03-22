import { cn } from "@/lib/utils"

interface GlowProps {
  className?: string
}

export function Glow({ className }: GlowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 -translate-x-1/2",
        "h-[300px] w-[600px]",
        "bg-[radial-gradient(ellipse,rgba(59,130,246,0.08)_0%,transparent_70%)]",
        "animate-glow-pulse",
        className,
      )}
    />
  )
}
