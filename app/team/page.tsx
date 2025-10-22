"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Plus, Mail, Trash2, Shield, Edit2, Search, MoreVertical } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "pending"
  joinedDate: string
  avatar: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "admin",
    status: "active",
    joinedDate: "2024-01-15",
    avatar: "SJ",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@company.com",
    role: "editor",
    status: "active",
    joinedDate: "2024-02-20",
    avatar: "MC",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@company.com",
    role: "viewer",
    status: "pending",
    joinedDate: "2024-03-10",
    avatar: "ED",
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    email: "alex@company.com",
    role: "editor",
    status: "active",
    joinedDate: "2024-01-05",
    avatar: "AR",
  },
]

const roleColors = {
  admin: "bg-red-500/10 text-red-700 dark:text-red-400",
  editor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  viewer: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
}

const statusColors = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [members, setMembers] = useState(mockTeamMembers)

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !selectedRole || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">Team Members</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your team and assign roles</p>
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                <Plus className="w-4 h-4" />
                Invite Member
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Members", value: "4", icon: Users },
              { label: "Active", value: "3", icon: Users },
              { label: "Pending", value: "1", icon: Mail },
              { label: "Admins", value: "1", icon: Shield },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="p-4 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                      <p className="text-2xl font-mono font-semibold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Filters and Search */}
          <Card className="p-4 border border-border/50">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50"
                />
              </div>

              {/* Role Filter */}
              <div className="flex gap-2">
                {["admin", "editor", "viewer"].map((role) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                    className="capitalize"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Team Members Table */}
          <Card className="border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="px-6 py-4 text-left text-sm font-mono font-semibold text-foreground">Member</th>
                    <th className="px-6 py-4 text-left text-sm font-mono font-semibold text-foreground">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-mono font-semibold text-foreground">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-mono font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-mono font-semibold text-foreground">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-mono font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-mono font-semibold text-accent">
                            {member.avatar}
                          </div>
                          <span className="text-sm font-medium text-foreground">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{member.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColors[member.role]}`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[member.status]}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{member.joinedDate}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Role Definitions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                role: "Admin",
                description: "Full access to all documents, team management, and settings",
                permissions: ["Create/Edit/Delete", "Manage Team", "View Analytics", "System Settings"],
              },
              {
                role: "Editor",
                description: "Can create, edit, and share documents with team members",
                permissions: ["Create/Edit/Delete", "Share Documents", "View Analytics", "Team Collaboration"],
              },
              {
                role: "Viewer",
                description: "Read-only access to shared documents and folders",
                permissions: ["View Documents", "Download Files", "View Comments", "Limited Access"],
              },
            ].map((roleInfo, index) => (
              <Card key={index} className="p-4 border border-border/50">
                <h3 className="font-mono font-semibold text-foreground mb-2">{roleInfo.role}</h3>
                <p className="text-sm text-muted-foreground mb-4">{roleInfo.description}</p>
                <ul className="space-y-2">
                  {roleInfo.permissions.map((perm, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
