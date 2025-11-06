"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  Folder,
  Settings,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  Shield,
  Lock,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/", icon: <Home className="w-5 h-5" /> },
      { label: "Documents", href: "/documents", icon: <FileText className="w-5 h-5" /> },
      { label: "Folders", href: "/folders", icon: <Folder className="w-5 h-5" /> },
      { label: "Search", href: "/search", icon: <Search className="w-5 h-5" /> },
      // { label: "Analytics", href: "/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    ],
  },
  {
    title: "Team",
    items: [{ label: "Team Members", href: "/team", icon: <Users className="w-5 h-5" /> }],
  },
  {
    title: "Administration",
    items: [
      { label: "User Management", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
      { label: "Roles", href: "/admin/roles", icon: <Shield className="w-5 h-5" /> },
      // { label: "Permissions", href: "/admin/permissions", icon: <Lock className="w-5 h-5" /> },
      // { label: "Access Control", href: "/admin/access-control", icon: <Lock className="w-5 h-5" /> },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: <Clock className="w-5 h-5" /> },
    ],
  },
  {
    title: "Settings",
    items: [{ label: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> }],
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out z-40",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-mono font-semibold text-sidebar-foreground">DocHub</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Enterprise Document Management</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, index) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                        "hover:bg-sidebar-accent/10",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                          : "text-sidebar-foreground hover:text-sidebar-primary",
                      )}
                      style={{
                        animation: `slideInLeft 0.5s ease-in both`,
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/10 transition-colors group">
            <LogOut className="w-5 h-5 group-hover:text-accent transition-colors" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
