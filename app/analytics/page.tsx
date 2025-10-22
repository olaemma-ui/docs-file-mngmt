"use client"
import { SidebarNav } from "@/components/sidebar-nav"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, FileText, Activity } from "lucide-react"

const chartData = [
  { month: "Jan", uploads: 400, downloads: 240, views: 1200 },
  { month: "Feb", uploads: 300, downloads: 221, views: 1221 },
  { month: "Mar", uploads: 200, downloads: 229, views: 1229 },
  { month: "Apr", uploads: 278, downloads: 200, views: 1200 },
  { month: "May", uploads: 189, downloads: 221, views: 1221 },
  { month: "Jun", uploads: 239, downloads: 250, views: 1229 },
]

const pieData = [
  { name: "PDF", value: 35 },
  { name: "DOCX", value: 25 },
  { name: "XLSX", value: 20 },
  { name: "Other", value: 20 },
]

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899"]

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Track document activity and usage metrics</p>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Views", value: "12,847", icon: <Activity className="w-6 h-6" />, trend: "+23%" },
              { label: "Active Users", value: "1,234", icon: <Users className="w-6 h-6" />, trend: "+12%" },
              { label: "Documents", value: "2,847", icon: <FileText className="w-6 h-6" />, trend: "+8%" },
              { label: "Growth", value: "34%", icon: <TrendingUp className="w-6 h-6" />, trend: "+5%" },
            ].map((stat, index) => (
              <Card key={index} className="p-6 hover:border-accent/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">{stat.icon}</div>
                  <span className="text-xs font-semibold text-accent">{stat.trend}</span>
                </div>
                <h3 className="text-sm text-muted-foreground mb-1">{stat.label}</h3>
                <p className="text-3xl font-mono font-semibold text-foreground">{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart */}
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-lg font-mono font-semibold text-foreground mb-6">Activity Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="downloads" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Pie Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-mono font-semibold text-foreground mb-6">File Types</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-mono font-semibold text-foreground mb-6">Monthly Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                />
                <Legend />
                <Bar dataKey="uploads" fill="#3b82f6" />
                <Bar dataKey="downloads" fill="#06b6d4" />
                <Bar dataKey="views" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>
    </div>
  )
}
