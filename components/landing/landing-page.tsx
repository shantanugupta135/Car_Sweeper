"use client"

import { LandingHeader } from "./landing-header"
import { HeroSection } from "./hero-section"
import { ProblemSection } from "./problem-section"
import { HowItWorksSection } from "./how-it-works-section"
import { FeaturesSection } from "./features-section"
import { PricingSection } from "./pricing-section"
import { CTASection } from "./cta-section"
import { FooterSection } from "./footer-section"

export function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onNavigate={onNavigate} />

      <HeroSection onNavigate={onNavigate} />

      {/* Problem */}
      <ProblemSection />

      {/* How it works */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* Features */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Pricing */}
      <div id="pricing">
        <PricingSection onNavigate={onNavigate} />
      </div>

      {/* CTA */}
      <CTASection onNavigate={onNavigate} />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
