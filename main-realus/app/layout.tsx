import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Realus",
  description: "Manage real estate transactions efficiently",
  icons: {
    icon: "https://media.licdn.com/dms/image/v2/D5603AQHmEWlSaHZdLA/profile-displayphoto-shrink_800_800/B56ZW.htATHQAc-/0/1742658263861?e=1749081600&v=beta&t=mTRhjzGItzWf447ef8UT50nKBCx9dQVeG5DBholizdM",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'