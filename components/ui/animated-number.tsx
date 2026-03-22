"use client"

import { useEffect, useState } from "react"

export function useAnimatedNumber(target: number, duration = 1000) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (target === 0) return

    const start = performance.now()
    let rafId: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration])

  return current
}
