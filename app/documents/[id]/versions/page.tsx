"use client"
import { SidebarNav } from "@/components/sidebar-nav"
import { VersionTimeline } from "@/components/version-timeline"
import { VersionDetails } from "@/components/version-details"
import { VersionComparison } from "@/components/version-comparison"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { useState } from "react"

export default function DocumentVersionsPage({ params }: { params: { id: string } }) {
  const [selectedVersion, setSelectedVersion] = useState<string>("v5")
  const [compareMode, setCompareMode] = useState(false)
  const [compareWithVersion, setCompareWithVersion] = useState<string>("v4")

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">
                    Q4 Financial Report.pdf
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">Version History & Management</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-lg font-mono font-semibold text-foreground mb-6">Version History</h2>
                <VersionTimeline selectedVersion={selectedVersion} onSelectVersion={setSelectedVersion} />
              </Card>
            </div>

            {/* Details & Comparison */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="details">Version Details</TabsTrigger>
                    <TabsTrigger value="compare">Compare Versions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <VersionDetails version={selectedVersion} />
                  </TabsContent>

                  <TabsContent value="compare" className="space-y-4">
                    <VersionComparison
                      version1={selectedVersion}
                      version2={compareWithVersion}
                      onChangeCompareVersion={setCompareWithVersion}
                    />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border pt-8 pb-4 mt-8 text-center text-sm text-muted-foreground">
            <p>Document Management System v1.0 • Version Control</p>
          </footer>
        </div>
      </main>
    </div>
  )
}
