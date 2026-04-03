'use client'

import { useEffect, useRef } from 'react'

interface FloatingParticlesProps {
  count?: number
  density?: 'low' | 'medium' | 'high'
  className?: string
}

export function FloatingParticles({ count = 20, density = 'medium', className = '' }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const particles = Array.from({ length: count }).map((_, i) => {
      const particle = document.createElement('div')
      const size = Math.random() * 4 + 2
      const left = Math.random() * 100
      const duration = Math.random() * 8 + 12
      const delay = Math.random() * 5

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.8), rgba(0, 212, 255, 0.1));
        border-radius: 50%;
        left: ${left}%;
        bottom: -20px;
        opacity: ${Math.random() * 0.5 + 0.3};
        animation: float-particle ${duration}s ease-in infinite;
        animation-delay: ${delay}s;
        filter: blur(0.5px);
      `

      containerRef.current?.appendChild(particle)
      return particle
    })

    return () => {
      particles.forEach(p => p.remove())
    }
  }, [count])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ perspective: '1000px' }}
    />
  )
}
