"use client"

import { useState } from "react"
import { Lock, Globe, Users, Trash2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AccessUser {
  id: string
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
  avatar: string
}

const visibilityOptions = [
  {
    id: "private",
    name: "Private",
    description: "Only you can access",
    icon: Lock,
  },
  {
    id: "team",
    name: "Team",
    description: "Shared with team members",
    icon: Users,
  },
  {
    id: "public",
    name: "Public",
    description: "Anyone with link can access",
    icon: Globe,
  },
]

const rolePermissions = {
  owner: {
    view: true,
    edit: true,
    delete: true,
    share: true,
    manage: true,
  },
  editor: {
    view: true,
    edit: true,
    delete: false,
    share: true,
    manage: false,
  },
  viewer: {
    view: true,
    edit: false,
    delete: false,
    share: false,
    manage: false,
  },
}

const mockAccessUsers: AccessUser[] = [
  { id: "1", name: "You", email: "you@company.com", role: "owner", avatar: "Y" },
  { id: "2", name: "Sarah Johnson", email: "sarah@company.com", role: "editor", avatar: "SJ" },
  { id: "3", name: "Mike Chen", email: "mike@company.com", role: "viewer", avatar: "MC" },
]

export function FilePermissionsDialog({ fileName = "Document.pdf" }: { fileName?: string }) {
  const [open, setOpen] = useState(false)
  const [visibility, setVisibility] = useState<"private" | "team" | "public">("team")
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>(mockAccessUsers)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://docs.example.com/share/${Math.random().toString(36).substr(2, 9)}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRemoveAccess = (userId: string) => {
    setAccessUsers(accessUsers.filter((u) => u.id !== userId))
  }

  const handleChangeRole = (userId: string, newRole: "editor" | "viewer") => {
    setAccessUsers(accessUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Lock className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share & Permissions</DialogTitle>
          <DialogDescription>{fileName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Visibility Settings */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Visibility</label>
            <div className="grid grid-cols-3 gap-3">
              {visibilityOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setVisibility(option.id as any)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      visibility === option.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50",
                    )}
                  >
                    <Icon
                      className={cn("w-5 h-5 mb-2", visibility === option.id ? "text-accent" : "text-muted-foreground")}
                    />
                    <p className="text-sm font-medium text-foreground">{option.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Share Link */}
          {visibility === "public" && (
            <div className="space-y-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <label className="text-sm font-semibold text-foreground">Share Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`https://docs.example.com/share/abc123def456`}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                />
                <Button onClick={handleCopyLink} variant="outline" size="sm" className="gap-2 bg-transparent">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Access Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Access</label>
              <span className="text-xs text-muted-foreground">{accessUsers.length} people</span>
            </div>

            <div className="space-y-2">
              {accessUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-mono font-semibold text-accent">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.role === "owner" ? (
                      <Badge variant="outline">Owner</Badge>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value as any)}
                        className="px-2 py-1 rounded text-xs border border-border bg-card text-foreground hover:border-accent/50 transition-colors"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}

                    {user.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveAccess(user.id)}
                        className="p-1 rounded hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Legend */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Permission Levels</p>
            <div className="space-y-2">
              {Object.entries(rolePermissions).map(([role, perms]) => (
                <div key={role} className="text-xs">
                  <p className="font-medium text-foreground capitalize mb-1">{role}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(perms).map(([perm, allowed]) => (
                      <span
                        key={perm}
                        className={cn(
                          "px-2 py-1 rounded text-xs capitalize",
                          allowed
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : "bg-gray-500/10 text-gray-700 dark:text-gray-400",
                        )}
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
