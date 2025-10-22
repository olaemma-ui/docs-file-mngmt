"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit, Trash2, Lock, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ManagePermissionModal } from "@/components/modals/manage-permission-modal"

interface Permission {
  id: string
  name: string
  description: string
  category: string
  riskLevel: "low" | "medium" | "high"
  rolesCount: number
  usersCount: number
}

const mockPermissions: Permission[] = [
  {
    id: "1",
    name: "Manage Users",
    description: "Add, edit, and remove users from the system",
    category: "User Management",
    riskLevel: "high",
    rolesCount: 1,
    usersCount: 2,
  },
  {
    id: "2",
    name: "Manage Roles",
    description: "Create, edit, and delete roles",
    category: "User Management",
    riskLevel: "high",
    rolesCount: 1,
    usersCount: 2,
  },
  {
    id: "3",
    name: "View Audit Logs",
    description: "Access system audit logs and activity history",
    category: "System",
    riskLevel: "medium",
    rolesCount: 1,
    usersCount: 2,
  },
  {
    id: "4",
    name: "Edit Documents",
    description: "Create and modify documents",
    category: "Documents",
    riskLevel: "medium",
    rolesCount: 2,
    usersCount: 8,
  },
  {
    id: "5",
    name: "Delete Documents",
    description: "Permanently remove documents",
    category: "Documents",
    riskLevel: "high",
    rolesCount: 1,
    usersCount: 2,
  },
  {
    id: "6",
    name: "Share Documents",
    description: "Share documents with other users",
    category: "Documents",
    riskLevel: "low",
    rolesCount: 2,
    usersCount: 8,
  },
  {
    id: "7",
    name: "View Documents",
    description: "Read and view documents",
    category: "Documents",
    riskLevel: "low",
    rolesCount: 3,
    usersCount: 15,
  },
  {
    id: "8",
    name: "Comment",
    description: "Add comments to documents",
    category: "Documents",
    riskLevel: "low",
    rolesCount: 3,
    usersCount: 15,
  },
]

const riskColors = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions)
  const [isManagePermissionModalOpen, setIsManagePermissionModalOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterRisk, setFilterRisk] = useState<string>("all")

  const categories = Array.from(new Set(permissions.map((p) => p.category)))

  const filteredPermissions = permissions.filter((perm) => {
    const matchesCategory = filterCategory === "all" || perm.category === filterCategory
    const matchesRisk = filterRisk === "all" || perm.riskLevel === filterRisk
    return matchesCategory && matchesRisk
  })

  const handleDeletePermission = (permId: string) => {
    setPermissions(permissions.filter((p) => p.id !== permId))
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
                <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">Permission Management</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage system permissions and access controls</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Permissions</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{permissions.length}</p>
                </div>
                <Lock className="w-8 h-8 text-accent/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-mono font-semibold mt-1">
                    {permissions.filter((p) => p.riskLevel === "high").length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-red-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{categories.length}</p>
                </div>
                <Lock className="w-8 h-8 text-blue-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-mono font-semibold mt-1">
                    {permissions.reduce((sum, p) => sum + p.usersCount, 0)}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-500/50" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 border border-border">
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-2">
                <Button
                  variant={filterCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory("all")}
                >
                  All Categories
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={filterCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterRisk === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk("all")}
                >
                  All Risk Levels
                </Button>
                <Button
                  variant={filterRisk === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk("low")}
                >
                  Low
                </Button>
                <Button
                  variant={filterRisk === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk("medium")}
                >
                  Medium
                </Button>
                <Button
                  variant={filterRisk === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk("high")}
                >
                  High
                </Button>
              </div>
            </div>
          </Card>

          {/* Permissions Table */}
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Permission</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Risk Level</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Roles</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Users</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermissions.map((perm) => (
                    <tr key={perm.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{perm.name}</p>
                          <p className="text-sm text-muted-foreground">{perm.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-muted text-foreground border-0">{perm.category}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${riskColors[perm.riskLevel]} border-0`}>
                          {perm.riskLevel.charAt(0).toUpperCase() + perm.riskLevel.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{perm.rolesCount}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{perm.usersCount}</td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPermission(perm)
                                setIsManagePermissionModalOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePermission(perm.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Permission
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* Modals */}
      {selectedPermission && (
        <ManagePermissionModal
          isOpen={isManagePermissionModalOpen}
          onClose={() => {
            setIsManagePermissionModalOpen(false)
            setSelectedPermission(null)
          }}
          permission={selectedPermission}
        />
      )}
    </div>
  )
}
