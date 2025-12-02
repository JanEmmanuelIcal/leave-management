"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type UserRole = "employee" | "admin" | null

interface AuthContextType {
  role: UserRole
  currentEmployeeId: string | null
  login: (role: UserRole, employeeId?: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(null)
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole
    const storedEmployeeId = localStorage.getItem("currentEmployee")

    if (storedRole) {
      setRole(storedRole)
      setCurrentEmployeeId(storedEmployeeId)
    }
    setIsLoading(false)
  }, [])

  const login = (newRole: UserRole, employeeId?: string) => {
    setRole(newRole)
    localStorage.setItem("userRole", newRole || "")

    if (newRole === "employee" && employeeId) {
      setCurrentEmployeeId(employeeId)
      localStorage.setItem("currentEmployee", employeeId)
    } else if (newRole === "admin") {
      setCurrentEmployeeId(null)
      localStorage.removeItem("currentEmployee")
    }
  }

  const logout = () => {
    setRole(null)
    setCurrentEmployeeId(null)
    localStorage.removeItem("userRole")
    localStorage.removeItem("currentEmployee")
    localStorage.removeItem("isAdmin")
  }

  return (
    <AuthContext.Provider value={{ role, currentEmployeeId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
