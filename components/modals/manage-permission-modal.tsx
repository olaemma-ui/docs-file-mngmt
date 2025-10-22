"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, AlertTriangle, Users, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Permission {
  id: string
  name: string
  description: string
  category: string
  riskLevel: "low" | "medium" | "high"
  rolesCount: number
  usersCount: number
}

interface ManagePermissionModalProps {
  isOpen: boolean
  onClose: () => void
  permission: Permission
}

const mockRoles = [
  { id: "1", name: "Admin", users: 2 },
  { id: "2", name: "Editor", users: 5 },
]

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@company.com", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane@company.com", role: "Admin" },
  { id: "3", name: "Bob Johnson", email: "bob@company.com", role: "Editor" },
  { id: "4", name: "Alice Brown", email: "alice@company.com", role: "Editor" },
  { id: "5", name: "Charlie Wilson", email: "charlie@company.com", role: "Editor" },
]

const riskColors = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function ManagePermissionModal({ isOpen, onClose, permission }: ManagePermissionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl border border-border bg-background shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur">
          <h2 className="text-xl font-mono font-semibold text-foreground">Permission Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Permission Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Permission Information</h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{permission.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                </div>
                <Badge className={`${riskColors[permission.riskLevel]} border-0`}>
                  {permission.riskLevel.charAt(0).toUpperCase() + permission.riskLevel.slice(1)} Risk
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium text-foreground mt-1">{permission.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned to Roles</p>
                  <p className="text-sm font-medium text-foreground mt-1">{permission.rolesCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="text-sm font-medium text-foreground mt-1">{permission.usersCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          {permission.riskLevel === "high" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">High Risk Permission</p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                  This permission grants significant access. Monitor usage carefully.
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="roles" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            </TabsList>

            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-3">
              {mockRoles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{role.name}</p>
                    <p className="text-xs text-muted-foreground">{role.users} users assigned</p>
                  </div>
                  <Badge className="bg-accent/20 text-accent border-0">Active</Badge>
                </div>
              ))}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-3">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0">{user.role}</Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {/* Audit Info */}
          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground uppercase">Audit Information</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="text-foreground font-medium mt-1">2024-01-15</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Modified</p>
                <p className="text-foreground font-medium mt-1">2024-03-10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 p-6 border-t border-border bg-background/95 backdrop-blur">
          <Button onClick={onClose} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
