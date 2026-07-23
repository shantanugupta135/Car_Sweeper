"use client"

import Image from "next/image"

const WHATSAPP_URL = "https://wa.me/919953745105"

interface FooterSectionProps {
  onNavigate?: (page: string) => void
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

export function FooterSection({ onNavigate }: FooterSectionProps) {
  const handleLinkClick = (link: string) => {
    // Links that scroll to sections on the landing page
    const sectionLinks: Record<string, string> = {
      "Features": "features",
      "Pricing": "pricing",
      "How It Works": "how-it-works",
      "About Us": "about",
    }

    // Links that open WhatsApp
    const whatsappLinks = ["Contact", "Help Center", "Complaints"]

    // Links that navigate to coming soon pages
    const comingSoonLinks = [
      "FAQ", "Careers", "Blog", "Press", 
      "Privacy Policy", "Terms", "Privacy", "Cookies",
      "Bangalore", "Mumbai", "Delhi NCR", "Hyderabad"
    ]

    if (sectionLinks[link]) {
      scrollToSection(sectionLinks[link])
    } else if (whatsappLinks.includes(link)) {
      window.open(WHATSAPP_URL, "_blank")
    } else if (comingSoonLinks.includes(link) && onNavigate) {
      onNavigate(`coming-soon:${link}`)
    }
  }

  const footerLinks = {
    Product: ["Features", "Pricing", "How It Works", "FAQ"],
    Company: ["About Us", "Careers", "Blog", "Press"],
    Support: ["Help Center", "Contact", "Complaints", "Privacy Policy"],
    Cities: ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad"],
  }

  return (
    <footer className="relative border-t border-border bg-card/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg overflow-hidden">
                <Image src="/images/carsglow-logo.jpg" alt="CarsGlow" width={36} height={36} className="object-cover" />
              </div>
              <span className="font-bold text-foreground text-lg">CarsGlow</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              India&apos;s premium doorstep car care platform. Waterless. Smart. Daily.
            </p>
            {/* WhatsApp contact */}
            <a 
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium hover:bg-green-500/20 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with us
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <button 
                      onClick={() => handleLinkClick(link)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
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
            2026 CarsGlow. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleLinkClick("Terms")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </button>
            <button 
              onClick={() => handleLinkClick("Privacy")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </button>
            <button 
              onClick={() => handleLinkClick("Cookies")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
