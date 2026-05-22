"use client"

import { MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"

const WHATSAPP_URL = "https://wa.me/919953745105?text=Hi%20CarsGlow%2C%20I%27d%20like%20to%20know%20more%20about%20your%20premium%20car%20cleaning%20service."

export function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show button after a short delay on page load
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    window.open(WHATSAPP_URL, "_blank")
  }

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3 animate-bounce-subtle">
          {/* Notification badge */}
          <div className="animate-slide-in-right">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-4 max-w-xs border border-primary/20">
              <p className="text-sm font-semibold text-foreground mb-1">Need Help?</p>
              <p className="text-xs text-muted-foreground">Chat on WhatsApp for instant support</p>
            </div>
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={handleClick}
            className="group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse hover:animate-none"
            title="Chat on WhatsApp"
            aria-label="Open WhatsApp chat"
          >
            <MessageCircle className="w-8 h-8" />
            <span className="absolute w-5 h-5 rounded-full bg-red-500 -top-1 -right-1 flex items-center justify-center text-xs font-bold text-white animate-bounce">
              1
            </span>
          </button>

          {/* Mobile-only: Show CTA text below button */}
          <div className="md:hidden text-right">
            <p className="text-xs font-semibold text-foreground">Chat on WhatsApp</p>
          </div>
        </div>
      )}
    </>
  )
}
