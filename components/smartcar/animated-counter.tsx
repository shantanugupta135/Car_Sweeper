'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  delay?: number
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1.5,
  suffix = '',
  prefix = '',
  decimals = 0,
  delay = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from)
  const countRef = useRef(from)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true)
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now() + delay

    const animateCount = () => {
      const now = Date.now()
      const elapsed = Math.max(0, now - startTime)
      const progress = Math.min(elapsed / (duration * 1000), 1)

      if (progress === 0) {
        requestAnimationFrame(animateCount)
        return
      }

      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = from + (to - from) * easeOut
      countRef.current = currentCount

      setCount(parseFloat(currentCount.toFixed(decimals)))

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    const frameId = requestAnimationFrame(animateCount)
    return () => cancelAnimationFrame(frameId)
  }, [isVisible, from, to, duration, decimals, delay])

  return (
    <span ref={ref} className="animate-counter inline-block">
      {prefix}
      {count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}
