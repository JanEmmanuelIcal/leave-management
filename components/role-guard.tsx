"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RoleGuardProps {
  allowedRoles: string[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!role || !allowedRoles.includes(role))) {
      router.push("/login")
    }
  }, [role, isLoading, allowedRoles, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  if (!role || !allowedRoles.includes(role)) {
    return null
  }

  return <>{children}</>
}