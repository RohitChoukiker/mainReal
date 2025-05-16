import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AuthProviderClient from "@/components/auth/auth-provider-client"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Realus",
  description: "Manage real estate transactions efficiently",
  icons: {
    icon: "/images/logo.png",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  // Add preconnect hints for external resources
  other: {
    "link": [
      { rel: "preconnect", href: "https://images.unsplash.com" },
      { rel: "dns-prefetch", href: "https://images.unsplash.com" },
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem
        >
          <AuthProviderClient>
            {children}
          </AuthProviderClient>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}