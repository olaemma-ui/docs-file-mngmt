"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  avatar: string
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@company.com", role: "admin", avatar: "SJ" },
  { id: "2", name: "Mike Chen", email: "mike@company.com", role: "editor", avatar: "MC" },
  { id: "3", name: "Emma Davis", email: "emma@company.com", role: "editor", avatar: "ED" },
  { id: "4", name: "Alex Rodriguez", email: "alex@company.com", role: "viewer", avatar: "AR" },
]

const documentTypes = ["Document", "Spreadsheet", "Presentation", "Form", "Template"]

export function DocumentCreationDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("Document")
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [showMemberList, setShowMemberList] = useState(false)

  const handleAddMember = (memberId: string) => {
    if (!assignedMembers.includes(memberId)) {
      setAssignedMembers([...assignedMembers, memberId])
    }
    setShowMemberList(false)
  }

  const handleRemoveMember = (memberId: string) => {
    setAssignedMembers(assignedMembers.filter((id) => id !== memberId))
  }

  const handleCreate = () => {
    console.log({
      title,
      description,
      type,
      assignedMembers,
    })
    // Reset form
    setTitle("")
    setDescription("")
    setType("Document")
    setAssignedMembers([])
    setOpen(false)
  }

  const selectedMembers = mockTeamMembers.filter((m) => assignedMembers.includes(m.id))
  const availableMembers = mockTeamMembers.filter((m) => !assignedMembers.includes(m.id))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4" />
          Create Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>Create a new document and assign it to team members</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Document Type</label>
            <div className="grid grid-cols-5 gap-2">
              {documentTypes.map((docType) => (
                <button
                  key={docType}
                  onClick={() => setType(docType)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                    type === docType
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/50",
                  )}
                >
                  {docType}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Title</label>
            <Input
              placeholder="Enter document title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Description</label>
            <Textarea
              placeholder="Add a description for this document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary/50 border-border/50 min-h-24"
            />
          </div>

          {/* Team Assignment */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Assign to Team Members</label>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Assigned members ({selectedMembers.length})</p>
                <div className="space-y-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-mono font-semibold text-accent">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 rounded hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Member Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMemberList(!showMemberList)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-left text-sm hover:border-accent/50 transition-colors"
              >
                {availableMembers.length > 0 ? "Add team member..." : "All members assigned"}
              </button>

              {showMemberList && availableMembers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  {availableMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleAddMember(member.id)}
                      className="w-full px-4 py-3 text-left hover:bg-accent/5 transition-colors border-b border-border last:border-b-0 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-mono font-semibold text-accent">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="opacity-0 group-hover:opacity-100">
                        {member.role}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Create Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
