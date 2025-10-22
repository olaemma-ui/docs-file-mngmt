"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreVertical, Edit, Trash2, Users, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CreateRoleModal } from "@/components/modals/create-role-modal"
import { EditRoleModal } from "@/components/modals/edit-role-modal"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  color: string
  isSystem: boolean
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: [
      "manage_users",
      "manage_roles",
      "manage_permissions",
      "view_audit_logs",
      "edit_documents",
      "delete_documents",
      "share_documents",
    ],
    userCount: 2,
    color: "red",
    isSystem: true,
  },
  {
    id: "2",
    name: "Editor",
    description: "Can create and edit documents",
    permissions: ["edit_documents", "share_documents", "view_documents", "comment"],
    userCount: 5,
    color: "blue",
    isSystem: true,
  },
  {
    id: "3",
    name: "Viewer",
    description: "Read-only access to documents",
    permissions: ["view_documents", "comment", "download"],
    userCount: 8,
    color: "gray",
    isSystem: true,
  },
  {
    id: "4",
    name: "Content Manager",
    description: "Manages content and approves documents",
    permissions: ["edit_documents", "view_documents", "approve_documents", "comment"],
    userCount: 3,
    color: "purple",
    isSystem: false,
  },
]

const allPermissions = [
  { id: "manage_users", name: "Manage Users", category: "User Management" },
  { id: "manage_roles", name: "Manage Roles", category: "User Management" },
  { id: "manage_permissions", name: "Manage Permissions", category: "User Management" },
  { id: "view_audit_logs", name: "View Audit Logs", category: "System" },
  { id: "edit_documents", name: "Edit Documents", category: "Documents" },
  { id: "delete_documents", name: "Delete Documents", category: "Documents" },
  { id: "share_documents", name: "Share Documents", category: "Documents" },
  { id: "view_documents", name: "View Documents", category: "Documents" },
  { id: "comment", name: "Comment", category: "Documents" },
  { id: "download", name: "Download", category: "Documents" },
  { id: "approve_documents", name: "Approve Documents", category: "Documents" },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false)

  const handleCreateRole = (name: string, description: string, permissions: string[], color: string) => {
    const newRole: Role = {
      id: String(roles.length + 1),
      name,
      description,
      permissions,
      userCount: 0,
      color,
      isSystem: false,
    }
    setRoles([...roles, newRole])
    setIsCreateRoleModalOpen(false)
  }

  const handleUpdateRole = (updatedRole: Role) => {
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
    setIsEditRoleModalOpen(false)
    setSelectedRole(null)
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId))
  }

  const colorMap = {
    red: "bg-red-500/10 text-red-700 dark:text-red-400",
    blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    green: "bg-green-500/10 text-green-700 dark:text-green-400",
    purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    gray: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
    yellow: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">Role Management</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage user roles with custom permissions
                </p>
              </div>
              <Button
                onClick={() => setIsCreateRoleModalOpen(true)}
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Plus className="w-4 h-4" />
                Create Role
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Roles</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{roles.length}</p>
                </div>
                <Shield className="w-8 h-8 text-accent/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Roles</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{roles.filter((r) => r.isSystem).length}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Custom Roles</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{roles.filter((r) => !r.isSystem).length}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500/50" />
              </div>
            </Card>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="border border-border p-6 hover:border-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${role.color}-500`} />
                    <div>
                      <h3 className="font-semibold text-foreground">{role.name}</h3>
                      {role.isSystem && (
                        <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0 text-xs mt-1">
                          System Role
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRole(role)
                          setIsEditRoleModalOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      {!role.isSystem && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteRole(role.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Role
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

                {/* Users Count */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{role.userCount} users assigned</span>
                </div>

                {/* Permissions */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase">Permissions</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.slice(0, 3).map((perm) => {
                      const permObj = allPermissions.find((p) => p.id === perm)
                      return (
                        <Badge
                          key={perm}
                          className={`${colorMap[role.color as keyof typeof colorMap]} border-0 text-xs`}
                        >
                          {permObj?.name}
                        </Badge>
                      )
                    })}
                    {role.permissions.length > 3 && (
                      <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onCreateRole={handleCreateRole}
        allPermissions={allPermissions}
      />
      {selectedRole && (
        <EditRoleModal
          isOpen={isEditRoleModalOpen}
          onClose={() => {
            setIsEditRoleModalOpen(false)
            setSelectedRole(null)
          }}
          role={selectedRole}
          onUpdateRole={handleUpdateRole}
          allPermissions={allPermissions}
        />
      )}
    </div>
  )
}
