"use client";
import { SidebarNav } from "@/components/sidebar-nav";
import type React from "react";

import { Bell, Lock, Palette, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: Array<{
    label: string;
    description: string;
    value?: boolean;
  }>;
}

const settings: SettingSection[] = [
  {
    title: "Notifications",
    description: "Manage how you receive notifications",
    icon: <Bell className="w-6 h-6" />,
    items: [
      {
        label: "Email Notifications",
        description: "Receive updates via email",
        value: true,
      },
      {
        label: "Document Alerts",
        description: "Get notified when documents are shared",
        value: true,
      },
      {
        label: "Weekly Digest",
        description: "Receive weekly activity summary",
        value: false,
      },
    ],
  },
  {
    title: "Security",
    description: "Manage your account security settings",
    icon: <Lock className="w-6 h-6" />,
    items: [
      {
        label: "Two-Factor Authentication",
        description: "Enable 2FA for added security",
        value: false,
      },
      {
        label: "Session Timeout",
        description: "Auto-logout after 30 minutes",
        value: true,
      },
      {
        label: "Login Alerts",
        description: "Get notified of new login attempts",
        value: true,
      },
    ],
  },
  {
    title: "Appearance",
    description: "Customize your interface",
    icon: <Palette className="w-6 h-6" />,
    items: [
      {
        label: "Dark Mode",
        description: "Use dark theme by default",
        value: true,
      },
      {
        label: "Compact View",
        description: "Use compact layout",
        value: false,
      },
      {
        label: "Animations",
        description: "Enable interface animations",
        value: true,
      },
    ],
  },
  {
    title: "Data & Privacy",
    description: "Manage your data and privacy settings",
    icon: <Database className="w-6 h-6" />,
    items: [
      {
        label: "Data Collection",
        description: "Allow analytics data collection",
        value: true,
      },
      {
        label: "Activity Logs",
        description: "Keep detailed activity logs",
        value: true,
      },
      {
        label: "Backup Data",
        description: "Automatic daily backups",
        value: true,
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <main className="flex-1 md:ml-64 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your preferences and account settings
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 md:p-8 max-w-4xl">
        <div className="space-y-6">
          {settings.map((section, sectionIndex) => (
            <Card
              key={section.title}
              className="p-6 hover:border-accent/50 transition-all"
              style={{
                animation: `fadeInUp 0.5s ease-out`,
                animationDelay: `${sectionIndex * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-lg font-mono font-semibold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <Label className="text-sm font-medium text-foreground">
                        {item.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                    <Switch defaultChecked={item.value} />
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <h2 className="text-lg font-mono font-semibold text-destructive mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Irreversible actions that require caution
            </p>
            <Button variant="destructive">Delete Account</Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
