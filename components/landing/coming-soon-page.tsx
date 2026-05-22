"use client"

import { ArrowLeft, Clock, Bell, Sparkles } from "lucide-react"
import Image from "next/image"

interface ComingSoonPageProps {
  pageName: string
  onBack: () => void
}

export function ComingSoonPage({ pageName, onBack }: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image src="/images/carsglow-logo.jpg" alt="CarsGlow" width={32} height={32} className="object-cover" />
            </div>
            <span className="font-bold text-foreground">CarsGlow</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg text-center">
          {/* Animated icon */}
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative w-full h-full bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
              <Sparkles className="w-16 h-16 text-primary animate-pulse" />
            </div>
          </div>

          {/* Page name badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary">{pageName}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Coming Soon
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            We&apos;re working hard to bring you something amazing. This page is under construction 
            and will be available soon. Stay tuned for updates!
          </p>

          {/* Features coming */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-card/50 border border-border">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Launching Soon</p>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border">
              <Bell className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Get Notified</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Homepage
          </button>

          {/* Contact info */}
          <p className="mt-8 text-sm text-muted-foreground">
            Have questions? Reach us on{" "}
            <a 
              href="https://wa.me/919953745105" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          2026 CarsGlow. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
