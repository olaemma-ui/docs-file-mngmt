"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, Edit, Trash2, Plus, Lock, Unlock } from "lucide-react"
import { AuditLogDetailsModal } from "@/components/modals/audit-log-details-modal"

interface AuditLog {
  id: string
  timestamp: string
  action: string
  actionType: "create" | "update" | "delete" | "access" | "permission_change" | "blacklist" | "whitelist"
  actor: string
  actorEmail: string
  target: string
  targetType: string
  details: string
  ipAddress: string
  status: "success" | "failed"
  changes?: Record<string, { old: string; new: string }>
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-03-15 14:32:10",
    action: "User Created",
    actionType: "create",
    actor: "Admin User",
    actorEmail: "admin@company.com",
    target: "john.doe@company.com",
    targetType: "User",
    details: "New user created with Editor role",
    ipAddress: "192.168.1.100",
    status: "success",
    changes: {
      role: { old: "N/A", new: "Editor" },
      status: { old: "N/A", new: "Pending" },
    },
  },
  {
    id: "2",
    timestamp: "2024-03-15 13:45:22",
    action: "Role Updated",
    actionType: "update",
    actor: "Admin User",
    actorEmail: "admin@company.com",
    target: "Editor",
    targetType: "Role",
    details: "Added 'Delete Documents' permission to Editor role",
    ipAddress: "192.168.1.100",
    status: "success",
    changes: {
      permissions: { old: "7 permissions", new: "8 permissions" },
    },
  },
  {
    id: "3",
    timestamp: "2024-03-15 12:15:45",
    action: "User Blacklisted",
    actionType: "blacklist",
    actor: "Admin User",
    actorEmail: "admin@company.com",
    target: "suspicious@company.com",
    targetType: "User",
    details: "User added to blacklist due to suspicious activity",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "4",
    timestamp: "2024-03-15 11:30:00",
    action: "Permission Granted",
    actionType: "permission_change",
    actor: "Admin User",
    actorEmail: "admin@company.com",
    target: "jane.smith@company.com",
    targetType: "User",
    details: "Granted 'Manage Users' permission",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2024-03-15 10:20:15",
    action: "User Deleted",
    actionType: "delete",
    actor: "Admin User",
    actorEmail: "admin@company.com",
    target: "terminated@company.com",
    targetType: "User",
    details: "User account deleted after employment termination",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "6",
    timestamp: "2024-03-15 09:45:30",
    action: "Failed Login Attempt",
    actionType: "access",
    actor: "Unknown",
    actorEmail: "unknown@external.com",
    target: "System",
    targetType: "System",
    details: "Failed login attempt with invalid credentials",
    ipAddress: "203.0.113.45",
    status: "failed",
  },
  {
    id: "7",
    timestamp: "2024-03-14 16:20:00",
    action: "User Whitelisted",
    actionType: "whitelist",
    actor: "Admin User",
    actorEmail: "admin@company.com",
    target: "partner@external.com",
    targetType: "User",
    details: "External partner added to whitelist",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "8",
    timestamp: "2024-03-14 14:10:45",
    action: "Role Created",
    actionType: "create",
    actor: "Admin User",
    actorEmail: "admin@company.com",
    target: "Content Manager",
    targetType: "Role",
    details: "New custom role created with specific permissions",
    ipAddress: "192.168.1.100",
    status: "success",
  },
]

const actionTypeColors = {
  create: "bg-green-500/10 text-green-700 dark:text-green-400",
  update: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  delete: "bg-red-500/10 text-red-700 dark:text-red-400",
  access: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  permission_change: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  blacklist: "bg-red-500/10 text-red-700 dark:text-red-400",
  whitelist: "bg-green-500/10 text-green-700 dark:text-green-400",
}

const actionTypeIcons = {
  create: <Plus className="w-4 h-4" />,
  update: <Edit className="w-4 h-4" />,
  delete: <Trash2 className="w-4 h-4" />,
  access: <Eye className="w-4 h-4" />,
  permission_change: <Lock className="w-4 h-4" />,
  blacklist: <Lock className="w-4 h-4" />,
  whitelist: <Unlock className="w-4 h-4" />,
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterActionType, setFilterActionType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesActionType = filterActionType === "all" || log.actionType === filterActionType
    const matchesStatus = filterStatus === "all" || log.status === filterStatus
    return matchesSearch && matchesActionType && matchesStatus
  })

  const handleExportLogs = () => {
    const csv = [
      ["Timestamp", "Action", "Actor", "Target", "Status", "IP Address"],
      ...filteredLogs.map((log) => [log.timestamp, log.action, log.actor, log.target, log.status, log.ipAddress]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
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
                <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">Audit Logs</h1>
                <p className="text-sm text-muted-foreground mt-1">Track all system activities and user actions</p>
              </div>
              <Button onClick={handleExportLogs} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
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
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{logs.length}</p>
                </div>
                <Eye className="w-8 h-8 text-accent/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-2xl font-mono font-semibold mt-1">
                    {logs.filter((l) => l.status === "success").length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-mono font-semibold mt-1">
                    {logs.filter((l) => l.status === "failed").length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-red-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-mono font-semibold mt-1">
                    {logs.filter((l) => l.timestamp.includes("2024-03-15")).length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-500/50" />
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="p-4 border border-border space-y-4">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by actor, target, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-2">
                <Button
                  variant={filterActionType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActionType("all")}
                >
                  All Actions
                </Button>
                <Button
                  variant={filterActionType === "create" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActionType("create")}
                >
                  Create
                </Button>
                <Button
                  variant={filterActionType === "update" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActionType("update")}
                >
                  Update
                </Button>
                <Button
                  variant={filterActionType === "delete" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActionType("delete")}
                >
                  Delete
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
                  variant={filterStatus === "success" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("success")}
                >
                  Success
                </Button>
                <Button
                  variant={filterStatus === "failed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("failed")}
                >
                  Failed
                </Button>
              </div>
            </div>
          </Card>

          {/* Audit Logs Table */}
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Timestamp</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Target</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">IP Address</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{log.timestamp}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${actionTypeColors[log.actionType]}`}>
                            {actionTypeIcons[log.actionType]}
                          </div>
                          <span className="text-sm font-medium text-foreground">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{log.actor}</p>
                          <p className="text-xs text-muted-foreground">{log.actorEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{log.target}</p>
                          <p className="text-xs text-muted-foreground">{log.targetType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${
                            log.status === "success"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-red-500/10 text-red-700 dark:text-red-400"
                          } border-0`}
                        >
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{log.ipAddress}</td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log)
                            setIsDetailsModalOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {filteredLogs.length === 0 && (
            <Card className="p-8 text-center border border-border">
              <p className="text-muted-foreground">No audit logs found matching your criteria</p>
            </Card>
          )}
        </div>
      </main>

      {/* Modals */}
      {selectedLog && (
        <AuditLogDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedLog(null)
          }}
          log={selectedLog}
        />
      )}
    </div>
  )
}
