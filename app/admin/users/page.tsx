"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  MoreVertical,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Lock,
  Unlock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { AddUserModal } from "@/components/modals/add-user-modal"
import { UserDetailsModal } from "@/components/modals/user-details-modal"

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

const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 minutes ago",
    isBlacklisted: false,
    isWhitelisted: true,
  },
  {
    id: "2",
    email: "editor@company.com",
    name: "Editor User",
    role: "editor",
    status: "active",
    joinDate: "2024-02-20",
    lastActive: "1 hour ago",
    isBlacklisted: false,
    isWhitelisted: true,
  },
  {
    id: "3",
    email: "viewer@company.com",
    name: "Viewer User",
    role: "viewer",
    status: "pending",
    joinDate: "2024-03-10",
    lastActive: "Never",
    isBlacklisted: false,
    isWhitelisted: false,
  },
  {
    id: "4",
    email: "blocked@company.com",
    name: "Blocked User",
    role: "viewer",
    status: "inactive",
    joinDate: "2024-01-05",
    lastActive: "30 days ago",
    isBlacklisted: true,
    isWhitelisted: false,
  },
]

const roleColors = {
  admin: "bg-red-500/10 text-red-700 dark:text-red-400",
  editor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  viewer: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
}

const statusColors = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400",
  inactive: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false)
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddUser = (email: string, name: string, role: string) => {
    const newUser: User = {
      id: String(users.length + 1),
      email,
      name,
      role: role as "admin" | "editor" | "viewer",
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Never",
      isBlacklisted: false,
      isWhitelisted: false,
    }
    setUsers([...users, newUser])
    setIsAddUserModalOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const handleToggleBlacklist = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, isBlacklisted: !u.isBlacklisted } : u)))
  }

  const handleToggleWhitelist = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, isWhitelisted: !u.isWhitelisted } : u)))
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
                <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">User Management</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage users, roles, permissions, and access control
                </p>
              </div>
              <Button
                onClick={() => setIsAddUserModalOpen(true)}
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{users.length}</p>
                </div>
                <Shield className="w-8 h-8 text-accent/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-mono font-semibold mt-1">
                    {users.filter((u) => u.status === "active").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Blacklisted</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{users.filter((u) => u.isBlacklisted).length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-mono font-semibold mt-1">
                    {users.filter((u) => u.status === "pending").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500/50" />
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="p-4 border border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-2">
                  <Button
                    variant={filterRole === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole("all")}
                  >
                    All Roles
                  </Button>
                  <Button
                    variant={filterRole === "admin" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole("admin")}
                  >
                    Admin
                  </Button>
                  <Button
                    variant={filterRole === "editor" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole("editor")}
                  >
                    Editor
                  </Button>
                  <Button
                    variant={filterRole === "viewer" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRole("viewer")}
                  >
                    Viewer
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                  >
                    All Status
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterStatus === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("pending")}
                  >
                    Pending
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Join Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Last Active</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Access</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${roleColors[user.role]} border-0`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${statusColors[user.status]} border-0`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.joinDate}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.lastActive}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {user.isWhitelisted && (
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-0 text-xs">
                              Whitelisted
                            </Badge>
                          )}
                          {user.isBlacklisted && (
                            <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-0 text-xs">
                              Blacklisted
                            </Badge>
                          )}
                        </div>
                      </td>
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
                                setSelectedUser(user)
                                setIsUserDetailsModalOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleWhitelist(user.id)}>
                              {user.isWhitelisted ? (
                                <>
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Remove from Whitelist
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Add to Whitelist
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleBlacklist(user.id)}>
                              {user.isBlacklisted ? (
                                <>
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Remove from Blacklist
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4 mr-2" />
                                  Add to Blacklist
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
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

          {filteredUsers.length === 0 && (
            <Card className="p-8 text-center border border-border">
              <p className="text-muted-foreground">No users found matching your criteria</p>
            </Card>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
      {selectedUser && (
        <UserDetailsModal
          isOpen={isUserDetailsModalOpen}
          onClose={() => {
            setIsUserDetailsModalOpen(false)
            setSelectedUser(null)
          }}
          user={selectedUser}
          onUpdateUser={(updatedUser) => {
            setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
            setIsUserDetailsModalOpen(false)
            setSelectedUser(null)
          }}
        />
      )}
    </div>
  )
}
