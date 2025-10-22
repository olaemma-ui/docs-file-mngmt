"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Mail, AlertCircle } from "lucide-react"

interface AddToAccessListModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (email: string, name: string, reason: string, expiryDate?: string) => void
  type: "blacklist" | "whitelist"
}

export function AddToAccessListModal({ isOpen, onClose, onAdd, type }: AddToAccessListModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [reason, setReason] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!email) newErrors.email = "Email is required"
    if (!email.includes("@")) newErrors.email = "Invalid email format"
    if (!name) newErrors.name = "Name is required"
    if (!reason) newErrors.reason = "Reason is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd(email, name, reason, expiryDate || undefined)
      setEmail("")
      setName("")
      setReason("")
      setExpiryDate("")
      setErrors({})
    }
  }

  if (!isOpen) return null

  const isBlacklist = type === "blacklist"
  const title = isBlacklist ? "Add to Blacklist" : "Add to Whitelist"
  const buttonColor = isBlacklist ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md border border-border bg-background p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-mono font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Warning */}
        {isBlacklist && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400">
              Blacklisted users will be denied access to the system
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={`${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>

          {/* Name Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={`${errors.name ? "border-destructive" : ""}`}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          {/* Reason Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2">Reason</label>
            <textarea
              placeholder={
                isBlacklist ? "e.g., Suspicious activity detected" : "e.g., External partner with elevated access"
              }
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (errors.reason) setErrors({ ...errors, reason: "" })
              }}
              className={`w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.reason ? "border-destructive" : ""
              }`}
              rows={3}
            />
            {errors.reason && <p className="text-xs text-destructive mt-1">{errors.reason}</p>}
          </div>

          {/* Expiry Date (Blacklist only) */}
          {isBlacklist && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2">Expiry Date (Optional)</label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty for permanent blacklist</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className={`flex-1 text-white ${buttonColor}`}>
            {isBlacklist ? "Add to Blacklist" : "Add to Whitelist"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
