"use client"

import { useState, useEffect } from "react"
import { X, Copy, Check, Sparkles, KeyRound, User, Phone, Shield, Building, Hash } from "lucide-react"
import { adminService } from "@/lib/services/admin-service"
import { Society, Cleaner } from "@/lib/types/api"

interface AddCleanerModalProps {
  isOpen: boolean
  onClose: () => void
  onCleanerAdded: (cleaner: Cleaner) => void
}

export function AddCleanerModal({ isOpen, onClose, onCleanerAdded }: AddCleanerModalProps) {
  const [societies, setSocieties] = useState<Society[]>([])
  const [loadingSocieties, setLoadingSocieties] = useState(true)

  // Form State
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [idRef, setIdRef] = useState("")
  const [selectedSocietyId, setSelectedSocietyId] = useState("")
  const [selectedTowers, setSelectedTowers] = useState<string[]>([])
  const [maxDailyCapacity, setMaxDailyCapacity] = useState(30)
  const [accessPin, setAccessPin] = useState("")
  
  // UI State
  const [copiedPin, setCopiedPin] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (isOpen) {
      // Load societies on modal open
      adminService.getSocieties().then((data) => {
        setSocieties(data)
        if (data.length > 0 && !selectedSocietyId) {
          setSelectedSocietyId(data[0].id)
          setSelectedTowers(data[0].towers)
        }
        setLoadingSocieties(false)
      })

      // Generate an initial random PIN if empty
      if (!accessPin) {
        generatePin()
      }
    }
  }, [isOpen])

  // Handle society change
  const handleSocietyChange = (societyId: string) => {
    setSelectedSocietyId(societyId)
    const soc = societies.find((s) => s.id === societyId)
    if (soc) {
      setSelectedTowers(soc.towers) // Select all towers by default
    } else {
      setSelectedTowers([])
    }
  }

  // Toggle tower checkbox selection
  const handleTowerToggle = (tower: string) => {
    if (selectedTowers.includes(tower)) {
      setSelectedTowers(selectedTowers.filter((t) => t !== tower))
    } else {
      setSelectedTowers([...selectedTowers, tower])
    }
  }

  // Generate 6-digit random PIN
  const generatePin = () => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString()
    setAccessPin(pin)
    setCopiedPin(false)
  }

  const handleCopyPin = () => {
    if (!accessPin) return
    navigator.clipboard.writeText(accessPin)
    setCopiedPin(true)
    setTimeout(() => setCopiedPin(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!fullName.trim()) {
      setErrorMsg("Full Name is required")
      return
    }
    if (!phone.trim()) {
      setErrorMsg("Phone Number is required")
      return
    }
    if (!selectedSocietyId) {
      setErrorMsg("Please select an assigned society")
      return
    }
    if (selectedTowers.length === 0) {
      setErrorMsg("Please select at least one assigned tower")
      return
    }
    if (!accessPin) {
      setErrorMsg("Please generate an Access PIN")
      return
    }

    const selectedSoc = societies.find((s) => s.id === selectedSocietyId)

    try {
      setIsSubmitting(true)
      const newCleaner = await adminService.addCleaner({
        fullName: fullName.trim(),
        phone: phone.trim(),
        status: "active",
        assignedSocietyId: selectedSocietyId,
        assignedSocietyName: selectedSoc ? selectedSoc.name : "",
        assignedTowers: selectedTowers,
        maxDailyCapacity: Number(maxDailyCapacity) || 30,
        accessPin: accessPin,
      })

      onCleanerAdded(newCleaner)
      resetForm()
      onClose()
    } catch (err) {
      setErrorMsg("Failed to add cleaner. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFullName("")
    setPhone("")
    setIdRef("")
    if (societies.length > 0) {
      setSelectedSocietyId(societies[0].id)
      setSelectedTowers(societies[0].towers)
    }
    setMaxDailyCapacity(30)
    generatePin()
    setErrorMsg("")
  }

  if (!isOpen) return null

  const selectedSoc = societies.find((s) => s.id === selectedSocietyId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0B0F12] border border-[#1E2C21] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2C21] bg-[#121914]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2E9E44]/20 border border-[#2E9E44]/40 text-[#7ED37F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#E2F0E4]">Onboard New Cleaner</h2>
              <p className="text-xs text-[#7C8C7E]">Register a cleaner and issue mobile access credentials</p>
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2E9E44]" /> Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#2E9E44]" /> Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
              />
            </div>
          </div>

          {/* Aadhaar / ID Ref & Daily Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#2E9E44]" /> Aadhaar / Govt ID Ref
              </label>
              <input
                type="text"
                placeholder="e.g. 4829-1029-3841"
                value={idRef}
                onChange={(e) => setIdRef(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] placeholder-[#536355] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#2E9E44]" /> Max Daily Capacity (Cars)
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

          {/* Society Picker */}
          <div>
            <label className="block text-xs font-medium text-[#A3B8A5] mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#2E9E44]" /> Assigned Society
            </label>
            {loadingSocieties ? (
              <div className="h-10 rounded-xl bg-[#141B15] border border-[#1E2C21] flex items-center px-3.5 text-xs text-[#7C8C7E]">
                Loading societies...
              </div>
            ) : (
              <select
                value={selectedSocietyId}
                onChange={(e) => handleSocietyChange(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#141B15] border border-[#1E2C21] text-xs text-[#E2F0E4] focus:outline-none focus:border-[#2E9E44] focus:ring-1 focus:ring-[#2E9E44] transition-all cursor-pointer"
              >
                {societies.map((soc) => (
                  <option key={soc.id} value={soc.id} className="bg-[#0B0F12] text-[#E2F0E4]">
                    {soc.name} ({soc.area}, {soc.city})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tower Checkboxes */}
          {selectedSoc && selectedSoc.towers.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-[#A3B8A5] mb-2">
                Select Assigned Towers / Blocks
              </label>
              <div className="flex flex-wrap gap-2.5">
                {selectedSoc.towers.map((tower) => {
                  const isChecked = selectedTowers.includes(tower)
                  return (
                    <button
                      key={tower}
                      type="button"
                      onClick={() => handleTowerToggle(tower)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                        isChecked
                          ? "bg-[#2E9E44]/20 border-[#2E9E44] text-[#7ED37F]"
                          : "bg-[#141B15] border-[#1E2C21] text-[#7C8C7E] hover:border-[#2E9E44]/50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isChecked ? "bg-[#2E9E44] border-[#2E9E44] text-white" : "border-[#2A3B2D]"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      {tower}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Credential Generator Section */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#121E14] to-[#18261B] border border-[#2E9E44]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#7ED37F]" />
                <span className="text-xs font-bold text-[#E2F0E4]">Mobile Access PIN</span>
              </div>
              <button
                type="button"
                onClick={generatePin}
                className="text-[11px] font-semibold text-[#7ED37F] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Generate New PIN
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#0B0F12]/80 border border-[#1E2C21] p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black tracking-widest text-[#7ED37F]">
                  {accessPin || "------"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E9E44]/20 text-[#7ED37F] border border-[#2E9E44]/40 font-medium">
                  6-Digit PIN
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyPin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2C21] hover:bg-[#2A3B2D] text-[#E2F0E4] text-xs font-medium transition-all"
              >
                {copiedPin ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#7C8C7E]" />
                    <span>Copy PIN</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#7C8C7E]">
              Cleaner will use this PIN along with their phone number to log in via the Mobile Cleaner App.
            </p>
          </div>

          {/* Actions */}
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2E9E44] to-[#166534] hover:from-[#35b54e] hover:to-[#1e7e40] text-white text-xs font-bold shadow-lg shadow-[#2E9E44]/20 border border-[#7ED37F]/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Onboarding Cleaner..." : "Complete Onboarding"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
