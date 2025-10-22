"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Shield, Lock, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive" | "pending"
  joinDate: string
  lastActive: string
  isBlacklisted: boolean
  isWhitelisted: boolean
}

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUpdateUser: (user: User) => void
}

const permissions = {
  admin: [
    { name: "Manage Users", description: "Add, edit, and remove users" },
    { name: "Manage Roles", description: "Create and modify roles" },
    { name: "View Audit Logs", description: "Access system audit logs" },
    { name: "Manage Permissions", description: "Configure permissions" },
    { name: "Edit Documents", description: "Create and modify documents" },
    { name: "Delete Documents", description: "Remove documents" },
    { name: "Share Documents", description: "Share with other users" },
  ],
  editor: [
    { name: "Edit Documents", description: "Create and modify documents" },
    { name: "Share Documents", description: "Share with other users" },
    { name: "View Documents", description: "Read documents" },
    { name: "Comment", description: "Add comments to documents" },
  ],
  viewer: [
    { name: "View Documents", description: "Read documents" },
    { name: "Comment", description: "Add comments to documents" },
    { name: "Download", description: "Download documents" },
  ],
}

export function UserDetailsModal({ isOpen, onClose, user, onUpdateUser }: UserDetailsModalProps) {
  const [editedUser, setEditedUser] = useState(user)
  const [hasChanges, setHasChanges] = useState(false)

  const handleRoleChange = (newRole: string) => {
    setEditedUser({ ...editedUser, role: newRole as "admin" | "editor" | "viewer" })
    setHasChanges(true)
  }

  const handleStatusChange = (newStatus: string) => {
    setEditedUser({ ...editedUser, status: newStatus as "active" | "inactive" | "pending" })
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdateUser(editedUser)
  }

  if (!isOpen) return null

  const roleIcon = {
    admin: <Shield className="w-4 h-4" />,
    editor: <Eye className="w-4 h-4" />,
    viewer: <Lock className="w-4 h-4" />,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl border border-border bg-background shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur">
          <h2 className="text-xl font-mono font-semibold text-foreground">User Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <p className="text-sm font-medium text-foreground mt-1">{editedUser.email}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <p className="text-sm font-medium text-foreground mt-1">{editedUser.name}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Join Date</label>
                <p className="text-sm font-medium text-foreground mt-1">{editedUser.joinDate}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Last Active</label>
                <p className="text-sm font-medium text-foreground mt-1">{editedUser.lastActive}</p>
              </div>
            </div>
          </div>

          {/* Role and Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Role & Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </label>
                <Select value={editedUser.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2">Status</label>
                <Select value={editedUser.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Permissions</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              {permissions[editedUser.role].map((perm, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{perm.name}</p>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs for Additional Settings */}
          <Tabs defaultValue="access" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="access">Access Control</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="access" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Whitelist Status</p>
                    <p className="text-xs text-muted-foreground">User is on the whitelist</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {editedUser.isWhitelisted ? "Whitelisted" : "Not Whitelisted"}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Blacklist Status</p>
                    <p className="text-xs text-muted-foreground">User is on the blacklist</p>
                  </div>
                  <div className="text-sm font-medium text-red-600">
                    {editedUser.isBlacklisted ? "Blacklisted" : "Not Blacklisted"}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Last Login</p>
                  <p className="text-xs text-muted-foreground mt-1">{editedUser.lastActive}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Account Created</p>
                  <p className="text-xs text-muted-foreground mt-1">{editedUser.joinDate}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 p-6 border-t border-border bg-background/95 backdrop-blur">
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
