import './globals.css';
import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/hooks/use-auth"
import { NavBar } from "@/components/nav-bar"
import AdminSeed from "@/components/admin-seed"

const _geistSans = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Leave Management System",
  description: "Manage leave requests efficiently",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <AdminSeed />
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
