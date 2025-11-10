"use client";
import { SidebarNav } from "@/components/sidebar-nav";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentDocuments } from "@/components/recent-documents";
import { FeaturesSection } from "@/components/features-section";
import { MarqueeSection } from "@/components/marquee-section";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Users, FileText } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 md:ml-64 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-mono font-semibold text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back! {"Here's"} your document management overview.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-4 md:p-8 space-y-8">
        {/* Stats Section */}
        <section>
          <DashboardStats />
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Upload Document",
              icon: <FileText className="w-5 h-5" />,
              href: "/documents",
            },
            {
              label: "Create Folder",
              icon: <FileText className="w-5 h-5" />,
              href: "/folders",
            },
            {
              label: "Invite Users",
              icon: <Users className="w-5 h-5" />,
              href: "/users",
            },
            {
              label: "View Analytics",
              icon: <TrendingUp className="w-5 h-5" />,
              href: "/analytics",
            },
          ].map((action, index) => (
            <Card
              key={index}
              className="p-4 hover:border-accent/50 transition-all cursor-pointer group"
              style={{
                animation: `fadeInUp 0.5s ease-out`,
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {action.label}
                </span>
              </div>
            </Card>
          ))}
        </section>

        {/* Recent Documents */}
        <section>
          <RecentDocuments />
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Marquee Section */}
        <MarqueeSection />

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-4 text-center text-sm text-muted-foreground">
          <p>Document Management System v1.0 • Built with Next.js and React</p>
        </footer>
      </div>
    </main>
  );
}
