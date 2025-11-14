import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SidebarNav } from "@/components/sidebar-nav";
import { Toaster } from "sonner";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Document Management System",
  description: "BertAndre document management with version control and RBAC",
  generator: "Tejumola Emmanuel Olamide",
  creator: "Tejumola Emmanuel Olamide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMono.variable} ${manrope.variable} font-body antialiased`}
      >
        <div className="min-h-screen bg-background">
          {/* Sidebar Navigation */}
          <SidebarNav />

          {/* Main Content */}
          {children}
        </div>
        <Analytics />
        <Toaster/>
      </body>
    </html>
  );
}
