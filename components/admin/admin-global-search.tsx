"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Building2, Car, Search, Sparkles, User } from "lucide-react"
import { adminService } from "@/lib/services/admin-service"
import { useNavigation, type Screen } from "@/lib/navigation-context"

type ResultKind = "cleaner" | "society" | "consumer" | "vehicle"

interface SearchResult {
  id: string
  kind: ResultKind
  label: string
  sublabel: string
  screen: Screen
}

const KIND_META: Record<ResultKind, { icon: typeof User; tint: string; noun: string }> = {
  cleaner: { icon: Sparkles, tint: "text-[#7ED37F]", noun: "Cleaner" },
  society: { icon: Building2, tint: "text-[#F4A300]", noun: "Society" },
  consumer: { icon: User, tint: "text-[#3B82F6]", noun: "Consumer" },
  vehicle: { icon: Car, tint: "text-[#E2F0E4]", noun: "Vehicle" },
}

/**
 * Quick-jump across the portal. The header search box used to be decorative;
 * this indexes cleaners, societies, consumers and their vehicles once, then
 * filters client-side as the admin types.
 */
export function AdminGlobalSearch() {
  const { navigate } = useNavigation()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState<SearchResult[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    async function buildIndex() {
      try {
        const [cleaners, societies, consumers] = await Promise.all([
          adminService.getCleaners(),
          adminService.getSocieties(),
          adminService.getConsumers(),
        ])
        if (cancelled) return

        const entries: SearchResult[] = [
          ...cleaners.map((c) => ({
            id: `cleaner-${c.id}`,
            kind: "cleaner" as const,
            label: c.fullName,
            sublabel: `${c.phone} · ${c.assignedSocietyName || "Unassigned"}`,
            screen: "admin-cleaners" as Screen,
          })),
          ...societies.map((s) => ({
            id: `society-${s.id}`,
            kind: "society" as const,
            label: s.name,
            sublabel: [s.area, s.city].filter(Boolean).join(", "),
            screen: "admin-societies" as Screen,
          })),
          ...consumers.map((c) => ({
            id: `consumer-${c.id}`,
            kind: "consumer" as const,
            label: c.fullName,
            sublabel: `${c.societyName || "—"} · ${c.flatNo || c.tower || ""}`.trim(),
            screen: "admin-consumers" as Screen,
          })),
          ...consumers.flatMap((c) =>
            c.registeredVehicles.map((v) => ({
              id: `vehicle-${v.id}`,
              kind: "vehicle" as const,
              label: v.registrationNumber,
              sublabel: `${[v.make, v.model].filter(Boolean).join(" ")} · ${c.fullName}`,
              screen: "admin-consumers" as Screen,
            })),
          ),
        ]

        setIndex(entries)
      } catch {
        // A failed index just means no quick-jump; the screens still load.
      }
    }

    buildIndex()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function onClickAway(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickAway)
    return () => document.removeEventListener("mousedown", onClickAway)
  }, [])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (needle.length < 2) return []
    return index
      .filter((r) => r.label.toLowerCase().includes(needle) || r.sublabel.toLowerCase().includes(needle))
      .slice(0, 8)
  }, [query, index])

  function jump(result: SearchResult) {
    navigate(result.screen)
    setQuery("")
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="flex-1 max-w-md hidden md:block relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8C7E]" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false)
            if (e.key === "Enter" && results.length > 0) jump(results[0])
          }}
          placeholder="Search cleaners, societies, consumers, vehicles..."
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#182019]/80 border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#7C8C7E] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
        />
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-[#1E2C21] bg-[#141A16] shadow-2xl shadow-black/50 overflow-hidden z-50">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-xs text-[#7C8C7E]">No matches for “{query.trim()}”.</p>
          ) : (
            results.map((result) => {
              const meta = KIND_META[result.kind]
              const Icon = meta.icon
              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => jump(result)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#1E2C21]/70 transition-colors"
                >
                  <Icon className={`w-4 h-4 shrink-0 ${meta.tint}`} />
                  <span className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#E2F0E4] truncate">{result.label}</span>
                    <span className="text-[11px] text-[#7C8C7E] truncate">{result.sublabel}</span>
                  </span>
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-[#3D4E3F] shrink-0">
                    {meta.noun}
                  </span>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
