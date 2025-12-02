"use client"

import { useEffect } from "react"
import { setAdminCredentials } from "@/lib/storage"

export default function AdminSeed() {
  useEffect(() => {
    try {
      // Seed default admin credentials if missing
      setAdminCredentials("icaljanemmanue@gmail.com", "1234567")
    } catch (e) {
      // ignore (e.g., SSR)
    }
  }, [])

  return null
}
