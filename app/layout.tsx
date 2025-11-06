import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Mono, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Document Management System",
  description: "Enterprise document management with version control and RBAC",
  generator: "v0.app",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${manrope.variable} font-body antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
