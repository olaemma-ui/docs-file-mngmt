
import { SidebarNav } from "@/components/sidebar-nav";
import { VersionTimeline } from "@/components/version-timeline";
import { VersionDetails } from "@/components/version-details";
import { VersionComparison } from "@/components/version-comparison";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { DocumentVersionsPage } from "./DocumentVersionsPage";


export default function Page({ params }: { params: { id: string } }) {
  return <DocumentVersionsPage params={{
    id: ""
  }}  />;
}