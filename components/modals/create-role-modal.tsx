"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Shield } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Permission {
  id: string
  name: string
  category: string
}

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateRole: (name: string, description: string, permissions: string[], color: string) => void
  allPermissions: Permission[]
}

const colors = ["red", "blue", "green", "purple", "gray", "yellow"]

export function CreateRoleModal({ isOpen, onClose, onCreateRole, allPermissions }: CreateRoleModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState("blue")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!name) newErrors.name = "Role name is required"
    if (!description) newErrors.description = "Description is required"
    if (selectedPermissions.length === 0) newErrors.permissions = "Select at least one permission"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateRole(name, description, selectedPermissions, selectedColor)
      setName("")
      setDescription("")
      setSelectedPermissions([])
      setSelectedColor("blue")
      setErrors({})
    }
  }

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) => (prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]))
  }

  const groupedPermissions = allPermissions.reduce(
    (acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = []
      acc[perm.category].push(perm)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl border border-border bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-mono font-semibold text-foreground">Create New Role</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Role Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Role Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Content Manager"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={`${errors.name ? "border-destructive" : ""}`}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              placeholder="Describe the purpose of this role..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: "" })
              }}
              className={`w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                errors.description ? "border-destructive" : ""
              }`}
              rows={3}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Role Color</label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full bg-${color}-500 border-2 transition-all ${
                    selectedColor === color ? "border-foreground scale-110" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Assign Permissions</label>
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category} className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{category}</p>
                  <div className="space-y-2 pl-2">
                    {perms.map((perm) => (
                      <div key={perm.id} className="flex items-center gap-3">
                        <Checkbox
                          id={perm.id}
                          checked={selectedPermissions.includes(perm.id)}
                          onCheckedChange={() => togglePermission(perm.id)}
                        />
                        <label htmlFor={perm.id} className="text-sm text-foreground cursor-pointer">
                          {perm.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {errors.permissions && <p className="text-xs text-destructive mt-2">{errors.permissions}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            Create Role
          </Button>
        </div>
      </Card>
    </div>
  )
}
