"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Shield } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  color: string
  isSystem: boolean
}

interface Permission {
  id: string
  name: string
  category: string
}

interface EditRoleModalProps {
  isOpen: boolean
  onClose: () => void
  role: Role
  onUpdateRole: (role: Role) => void
  allPermissions: Permission[]
}

const colors = ["red", "blue", "green", "purple", "gray", "yellow"]

export function EditRoleModal({ isOpen, onClose, role, onUpdateRole, allPermissions }: EditRoleModalProps) {
  const [editedRole, setEditedRole] = useState(role)
  const [hasChanges, setHasChanges] = useState(false)

  const handleNameChange = (newName: string) => {
    setEditedRole({ ...editedRole, name: newName })
    setHasChanges(true)
  }

  const handleDescriptionChange = (newDescription: string) => {
    setEditedRole({ ...editedRole, description: newDescription })
    setHasChanges(true)
  }

  const handleColorChange = (newColor: string) => {
    setEditedRole({ ...editedRole, color: newColor })
    setHasChanges(true)
  }

  const togglePermission = (permId: string) => {
    const newPermissions = editedRole.permissions.includes(permId)
      ? editedRole.permissions.filter((p) => p !== permId)
      : [...editedRole.permissions, permId]
    setEditedRole({ ...editedRole, permissions: newPermissions })
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdateRole(editedRole)
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
          <h2 className="text-xl font-mono font-semibold text-foreground">Edit Role</h2>
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
              value={editedRole.name}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={editedRole.isSystem}
            />
            {editedRole.isSystem && (
              <p className="text-xs text-muted-foreground mt-1">System roles cannot be renamed</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={editedRole.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              rows={3}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Role Color</label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full bg-${color}-500 border-2 transition-all ${
                    editedRole.color === color ? "border-foreground scale-110" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Permissions</label>
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category} className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{category}</p>
                  <div className="space-y-2 pl-2">
                    {perms.map((perm) => (
                      <div key={perm.id} className="flex items-center gap-3">
                        <Checkbox
                          id={perm.id}
                          checked={editedRole.permissions.includes(perm.id)}
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
          </div>

          {/* User Count Info */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{editedRole.userCount}</span> users are assigned to this role
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  )
}
