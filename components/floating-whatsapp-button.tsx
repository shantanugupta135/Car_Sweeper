"use client"

import { MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"

const WHATSAPP_URL = "https://wa.me/919953745105"

export function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 transition-all duration-500 transform ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
      }`}
    >
      <button
        onClick={() => window.open(WHATSAPP_URL, "_blank")}
        className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
      >
        {/* Pulsing background effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Animated glow ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse-ring" />

        {/* Icon */}
        <MessageCircle className="w-7 h-7 relative z-10 transition-transform group-hover:-rotate-12" />

        {/* Tooltip */}
        <div className="absolute right-20 bg-card border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground whitespace-nowrap shadow-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          Chat with us on WhatsApp
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-card border-l border-t border-border rotate-45" />
        </div>
      </button>
    </div>
  )
}
