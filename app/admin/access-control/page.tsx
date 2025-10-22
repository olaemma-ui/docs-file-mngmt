"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search, AlertCircle, CheckCircle, Clock, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddToAccessListModal } from "@/components/modals/add-to-access-list-modal"

interface AccessListEntry {
  id: string
  email: string
  name: string
  reason: string
  addedDate: string
  addedBy: string
  expiryDate?: string
}

const mockBlacklist: AccessListEntry[] = [
  {
    id: "1",
    email: "blocked@company.com",
    name: "Blocked User",
    reason: "Suspicious activity detected",
    addedDate: "2024-03-01",
    addedBy: "Admin",
    expiryDate: "2024-06-01",
  },
  {
    id: "2",
    email: "terminated@company.com",
    name: "Terminated Employee",
    reason: "Employment terminated",
    addedDate: "2024-02-15",
    addedBy: "HR",
  },
]

const mockWhitelist: AccessListEntry[] = [
  {
    id: "1",
    email: "trusted@external.com",
    name: "Trusted Partner",
    reason: "External partner with elevated access",
    addedDate: "2024-01-10",
    addedBy: "Admin",
  },
  {
    id: "2",
    email: "vip@company.com",
    name: "VIP User",
    reason: "Executive with special access",
    addedDate: "2024-02-01",
    addedBy: "Admin",
  },
  {
    id: "3",
    email: "service@company.com",
    name: "Service Account",
    reason: "Automated service account",
    addedDate: "2024-01-20",
    addedBy: "System",
  },
]

export default function AccessControlPage() {
  const [blacklist, setBlacklist] = useState<AccessListEntry[]>(mockBlacklist)
  const [whitelist, setWhitelist] = useState<AccessListEntry[]>(mockWhitelist)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddToBlacklistModalOpen, setIsAddToBlacklistModalOpen] = useState(false)
  const [isAddToWhitelistModalOpen, setIsAddToWhitelistModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("blacklist")

  const filteredBlacklist = blacklist.filter(
    (entry) =>
      entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredWhitelist = whitelist.filter(
    (entry) =>
      entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddToBlacklist = (email: string, name: string, reason: string, expiryDate?: string) => {
    const newEntry: AccessListEntry = {
      id: String(blacklist.length + 1),
      email,
      name,
      reason,
      addedDate: new Date().toISOString().split("T")[0],
      addedBy: "Current Admin",
      expiryDate,
    }
    setBlacklist([...blacklist, newEntry])
    setIsAddToBlacklistModalOpen(false)
  }

  const handleAddToWhitelist = (email: string, name: string, reason: string) => {
    const newEntry: AccessListEntry = {
      id: String(whitelist.length + 1),
      email,
      name,
      reason,
      addedDate: new Date().toISOString().split("T")[0],
      addedBy: "Current Admin",
    }
    setWhitelist([...whitelist, newEntry])
    setIsAddToWhitelistModalOpen(false)
  }

  const handleRemoveFromBlacklist = (entryId: string) => {
    setBlacklist(blacklist.filter((e) => e.id !== entryId))
  }

  const handleRemoveFromWhitelist = (entryId: string) => {
    setWhitelist(whitelist.filter((e) => e.id !== entryId))
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
                <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">Access Control</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage blacklist and whitelist for user access</p>
              </div>
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
                  <p className="text-sm text-muted-foreground">Blacklisted Users</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{blacklist.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Whitelisted Users</p>
                  <p className="text-2xl font-mono font-semibold mt-1">{whitelist.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500/50" />
              </div>
            </Card>
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-mono font-semibold mt-1">
                    {blacklist.filter((e) => e.expiryDate).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500/50" />
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blacklist" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Blacklist
              </TabsTrigger>
              <TabsTrigger value="whitelist" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Whitelist
              </TabsTrigger>
            </TabsList>

            {/* Blacklist Tab */}
            <TabsContent value="blacklist" className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search blacklist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  onClick={() => setIsAddToBlacklistModalOpen(true)}
                  className="gap-2 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add to Blacklist
                </Button>
              </div>

              {/* Blacklist Table */}
              <Card className="border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Reason</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Added Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Expiry Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Added By</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlacklist.map((entry) => (
                        <tr key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{entry.name}</p>
                              <p className="text-sm text-muted-foreground">{entry.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entry.reason}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entry.addedDate}</td>
                          <td className="px-6 py-4">
                            {entry.expiryDate ? (
                              <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-0">
                                {entry.expiryDate}
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-0">Permanent</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entry.addedBy}</td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromBlacklist(entry.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {filteredBlacklist.length === 0 && (
                <Card className="p-8 text-center border border-border">
                  <p className="text-muted-foreground">No blacklisted users found</p>
                </Card>
              )}
            </TabsContent>

            {/* Whitelist Tab */}
            <TabsContent value="whitelist" className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search whitelist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  onClick={() => setIsAddToWhitelistModalOpen(true)}
                  className="gap-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add to Whitelist
                </Button>
              </div>

              {/* Whitelist Table */}
              <Card className="border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Reason</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Added Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Added By</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWhitelist.map((entry) => (
                        <tr key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{entry.name}</p>
                              <p className="text-sm text-muted-foreground">{entry.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entry.reason}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entry.addedDate}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{entry.addedBy}</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-0">
                              Active
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromWhitelist(entry.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {filteredWhitelist.length === 0 && (
                <Card className="p-8 text-center border border-border">
                  <p className="text-muted-foreground">No whitelisted users found</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      <AddToAccessListModal
        isOpen={isAddToBlacklistModalOpen}
        onClose={() => setIsAddToBlacklistModalOpen(false)}
        onAdd={handleAddToBlacklist}
        type="blacklist"
      />
      <AddToAccessListModal
        isOpen={isAddToWhitelistModalOpen}
        onClose={() => setIsAddToWhitelistModalOpen(false)}
        onAdd={handleAddToWhitelist}
        type="whitelist"
      />
    </div>
  )
}
