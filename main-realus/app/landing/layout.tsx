import type React from "react"
import { Metadata } from "next"
import { ModeToggle } from "@/components/mode-toggle"

export const metadata: Metadata = {
  title: "Realus - Real Estate Transaction Platform",
  description: "Streamline your real estate transactions with our powerful platform",
}

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      {children}
    </div>
  )
}

