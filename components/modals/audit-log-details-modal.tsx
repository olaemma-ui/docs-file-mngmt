"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Copy, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

interface AuditLogDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  log: AuditLog
}

export function AuditLogDetailsModal({ isOpen, onClose, log }: AuditLogDetailsModalProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl border border-border bg-background shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-mono font-semibold text-foreground">Audit Log Details</h2>
            <Badge
              className={`${
                log.status === "success"
                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                  : "bg-red-500/10 text-red-700 dark:text-red-400"
              } border-0`}
            >
              {log.status === "success" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
            </Badge>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Event Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Action</p>
                <p className="text-sm font-medium text-foreground mt-1">{log.action}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Timestamp</p>
                <p className="text-sm font-medium text-foreground mt-1">{log.timestamp}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Action Type</p>
                <p className="text-sm font-medium text-foreground mt-1">{log.actionType}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Log ID</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-medium text-foreground">{log.id}</p>
                  <button
                    onClick={() => copyToClipboard(log.id)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actor Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Actor Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Actor Name</p>
                <p className="text-sm font-medium text-foreground mt-1">{log.actor}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground mt-1">{log.actorEmail}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                <p className="text-xs text-muted-foreground">IP Address</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-medium text-foreground">{log.ipAddress}</p>
                  <button
                    onClick={() => copyToClipboard(log.ipAddress)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Target Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Target Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Target</p>
                <p className="text-sm font-medium text-foreground mt-1">{log.target}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Target Type</p>
                <p className="text-sm font-medium text-foreground mt-1">{log.targetType}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Details</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-foreground">{log.details}</p>
            </div>
          </div>

          {/* Changes (if any) */}
          {log.changes && Object.keys(log.changes).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Changes Made</h3>
              <div className="space-y-3">
                {Object.entries(log.changes).map(([field, change]) => (
                  <div key={field} className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-foreground uppercase mb-2">{field}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Before</p>
                        <p className="text-sm font-medium text-foreground mt-1">{change.old}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">After</p>
                        <p className="text-sm font-medium text-foreground mt-1">{change.new}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
