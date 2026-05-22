"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
  { label: "Pricing", href: "#pricing" },
]

export function LandingHeader({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-background/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg overflow-hidden">
            <Image src="/images/carsglow-logo.jpg" alt="CarsGlow" width={36} height={36} className="object-cover" />
          </div>
          <span className="font-bold text-foreground text-lg">CarsGlow</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop auth buttons - Hidden but code kept intact */}
        <div className="hidden md:flex items-center gap-3 invisible">
          <button
            onClick={() => onNavigate("phone-login")}
            className="px-5 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-card transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => onNavigate("phone-login")}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.25)]"
          >
            Sign Up Free
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center text-foreground">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-4 gap-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-border invisible">
              <button
                onClick={() => { setMenuOpen(false); onNavigate("phone-login") }}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-card transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => { setMenuOpen(false); onNavigate("phone-login") }}
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
