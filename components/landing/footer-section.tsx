"use client"

import { Droplets } from "lucide-react"

const footerLinks = {
  Product: ["Features", "Pricing", "How It Works", "FAQ"],
  Company: ["About Us", "Careers", "Blog", "Press"],
  Support: ["Help Center", "Contact", "Complaints", "Privacy Policy"],
  Cities: ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad"],
}

export function FooterSection() {
  return (
    <footer className="relative border-t border-border bg-card/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-foreground text-lg">SmartCar Care</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India&apos;s premium doorstep car care platform. Waterless. Smart. Daily.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2026 SmartCar Care. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</button>
            <button className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</button>
            <button className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
