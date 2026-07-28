"use client"

import { useEffect, useState } from "react"
import { Building, Check, Hash, KeyRound, Sparkles, User, X } from "lucide-react"
import { adminService } from "@/lib/services/admin-service"
import type { Cleaner, Society } from "@/lib/types/api"

interface EditCleanerModalProps {
  cleaner: Cleaner | null
  onClose: () => void
  onCleanerUpdated: (cleaner: Cleaner) => void
}

const STATUS_OPTIONS: { value: Cleaner["status"]; label: string; hint: string }[] = [
  { value: "active", label: "Active", hint: "Receives jobs in the daily roster" },
  { value: "on_leave", label: "On Leave", hint: "Temporarily skipped when assigning work" },
  { value: "inactive", label: "Inactive", hint: "Removed from assignment entirely" },
]

/**
 * Edit an existing cleaner: coverage, capacity, and duty status.
 *
 * Status matters operationally — `generate_daily_jobs` only assigns work to
 * cleaners marked `active`, so putting someone on leave here re-routes tomorrow's
 * roster to their colleagues.
 */
export function EditCleanerModal({ cleaner, onClose, onCleanerUpdated }: EditCleanerModalProps) {
  const [societies, setSocieties] = useState<Society[]>([])
  const [fullName, setFullName] = useState("")
  const [status, setStatus] = useState<Cleaner["status"]>("active")
  const [selectedTowers, setSelectedTowers] = useState<string[]>([])
  const [maxDailyCapacity, setMaxDailyCapacity] = useState(30)
  const [accessPin, setAccessPin] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!cleaner) return
    setFullName(cleaner.fullName)
    setStatus(cleaner.status)
    setSelectedTowers(cleaner.assignedTowers)
    setMaxDailyCapacity(cleaner.maxDailyCapacity)
    setAccessPin(cleaner.accessPin)
    setErrorMsg("")
    adminService.getSocieties().then(setSocieties).catch(() => setSocieties([]))
  }, [cleaner])

  if (!cleaner) return null

  const society = societies.find((s) => s.id === cleaner.assignedSocietyId)
  const availableTowers = society?.towers ?? cleaner.assignedTowers

  const toggleTower = (tower: string) =>
    setSelectedTowers((prev) => (prev.includes(tower) ? prev.filter((t) => t !== tower) : [...prev, tower]))

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setErrorMsg("")

    if (!fullName.trim()) return setErrorMsg("Full name is required")
    if (selectedTowers.length === 0) return setErrorMsg("Assign at least one tower")

    try {
      setSubmitting(true)
      const updated = await adminService.updateCleaner(cleaner!.id, {
        fullName: fullName.trim(),
        status,
        assignedTowers: selectedTowers,
        maxDailyCapacity: Number(maxDailyCapacity) || 30,
        accessPin,
      })
      onCleanerUpdated(updated)
      onClose()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not save changes.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0B0F12] border border-[#1E2C21] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2C21] bg-[#121914]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2E9E44]/20 border border-[#2E9E44]/40 text-[#7ED37F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#E2F0E4]">Edit Cleaner</h2>
              <p className="text-xs text-[#7C8C7E]">
                {cleaner.phone} · {cleaner.assignedSocietyName || "Unassigned"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7C8C7E] hover:text-white hover:bg-[#1E2C21] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2E9E44]" /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#2E9E44]" /> Max Daily Capacity
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={maxDailyCapacity}
                onChange={(e) => setMaxDailyCapacity(Number(e.target.value))}
                className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A3B8A5] mb-2">Duty Status</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  title={option.hint}
                  className={`px-3 py-2.5 rounded-xl text-left border transition-all ${
                    status === option.value
                      ? "bg-[#2E9E44]/20 border-[#2E9E44] text-[#7ED37F]"
                      : "bg-[#141B15] border-[#1E2C21] text-[#7C8C7E] hover:border-[#2E9E44]/50"
                  }`}
                >
                  <span className="block text-xs font-semibold">{option.label}</span>
                  <span className="block text-[10px] leading-tight mt-0.5 opacity-80">{option.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A3B8A5] mb-2 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#2E9E44]" /> Assigned Towers
            </label>
            <div className="flex flex-wrap gap-2.5">
              {availableTowers.length === 0 ? (
                <p className="text-xs text-[#7C8C7E]">This society has no towers configured yet.</p>
              ) : (
                availableTowers.map((tower) => {
                  const isChecked = selectedTowers.includes(tower)
                  return (
                    <button
                      key={tower}
                      type="button"
                      onClick={() => toggleTower(tower)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                        isChecked
                          ? "bg-[#2E9E44]/20 border-[#2E9E44] text-[#7ED37F]"
                          : "bg-[#141B15] border-[#1E2C21] text-[#7C8C7E] hover:border-[#2E9E44]/50"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isChecked ? "bg-[#2E9E44] border-[#2E9E44] text-white" : "border-[#2A3B2D]"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      {tower}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#2E9E44]" /> Staff Reference PIN
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={accessPin}
                onChange={(e) => setAccessPin(e.target.value.replace(/\D/g, ""))}
                className="flex-1 h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] font-mono tracking-widest text-sm text-[#7ED37F] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
              />
              <button
                type="button"
                onClick={() => setAccessPin(Math.floor(100000 + Math.random() * 900000).toString())}
                className="px-3 py-2.5 rounded-xl bg-[#1E2C21] hover:bg-[#2A3B2D] text-[#E2F0E4] text-xs font-medium transition-all"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#7C8C7E] hover:text-white hover:bg-[#1E2C21] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2E9E44] to-[#166534] hover:from-[#35b54e] hover:to-[#1e7e40] text-white text-xs font-bold shadow-lg shadow-[#2E9E44]/20 border border-[#7ED37F]/30 transition-all disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
