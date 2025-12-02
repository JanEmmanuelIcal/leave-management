"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// select removed; not used in name/password login
import { getEmployees, addEmployee, verifyEmployeeCredentials, hasAdminPassword, setAdminPassword, verifyAdminPassword, setAdminCredentials, getAdminEmail } from "@/lib/storage"
import { useAuth } from "@/hooks/use-auth"
import { LogIn, Users } from "lucide-react"

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [userType, setUserType] = useState<"employee" | "admin">("employee")
  const [nameInput, setNameInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const router = useRouter()
  const { login, role } = useAuth()

  useEffect(() => {
    setIsClient(true)
    if (role) {
      router.push(role === "admin" ? "/admin" : "/employee")
    }
  }, [role, router])

  useEffect(() => {
    const emps = getEmployees()
    setEmployees(emps)
    if (emps.length > 0) {
      setSelectedEmployeeId(emps[0].id)
    }
    // ensure default admin credentials exist (set once)
    try {
      // default admin as requested by user
      setAdminCredentials("icaljanemmanue@gmail.com", "1234567")
    } catch (e) {
      // ignore in SSR
    }
  }, [])

  if (!isClient || role) return null

  const createOrFindEmployeeByName = (name: string, password?: string) => {
    const existing = employees.find((e) => e.name.toLowerCase() === name.toLowerCase())
    if (existing) return existing.id

    // create a basic employee profile with sensible defaults
    const newEmp = addEmployee({
      name,
      email: `${name.replace(/\s+/g, "").toLowerCase()}@example.com`,
      department: "General",
      position: "Employee",
      joinDate: new Date().toISOString(),
      annualLeave: 14,
      sickLeave: 7,
      password: password || "",
    })

    // update local state list
    setEmployees((prev) => [...prev, newEmp])
    setSelectedEmployeeId(newEmp.id)
    return newEmp.id
  }

  const handleLogin = () => {
    if (!nameInput || nameInput.trim() === "") {
      alert("Please enter your name")
      return
    }

    if (userType === "employee") {
      if (!passwordInput) {
        alert("Please enter your password")
        return
      }

      // find matching employee and verify password
      const empId = verifyEmployeeCredentials(nameInput.trim(), passwordInput)
      if (!empId) {
        alert("Invalid employee name or password")
        return
      }

      login("employee", empId)
      localStorage.setItem("userName", nameInput.trim())
      router.push("/employee")
    } else {
      // Admin flow: if no admin password set, initialize it
      if (!hasAdminPassword()) {
        if (!passwordInput) {
          alert("Please set an admin password")
          return
        }
        setAdminPassword(passwordInput)
        localStorage.setItem("adminName", nameInput.trim())
        login("admin")
        router.push("/admin")
        return
      }

      // Admin password exists; verify
      if (!verifyAdminPassword(passwordInput)) {
        alert("Invalid admin password")
        return
      }

      const storedEmail = getAdminEmail()
      // allow case-insensitive match for admin email; if stored email missing, attempt to seed again
      if (!storedEmail) {
        try {
          setAdminCredentials("icaljanemmanue@gmail.com", "1234567")
        } catch (e) {}
      }

      const stored = (storedEmail || getAdminEmail() || "").toLowerCase()
      if (stored && stored !== nameInput.trim().toLowerCase()) {
        alert("Invalid admin email")
        return
      }

      localStorage.setItem("adminName", nameInput.trim())
      login("admin")
      router.push("/admin")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Leave Management</h1>
          <p className="text-slate-300">Manage your leave requests efficiently</p>
        </div>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-center">Select Your Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="flex gap-4">
              <button
                onClick={() => setUserType("employee")}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  userType === "employee"
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-600 border-slate-500 hover:border-slate-400"
                }`}
              >
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="font-semibold">Employee</p>
              </button>
              <button
                onClick={() => setUserType("admin")}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  userType === "admin"
                    ? "bg-green-600 border-green-500"
                    : "bg-slate-600 border-slate-500 hover:border-slate-400"
                }`}
              >
                <LogIn className="h-6 w-6 mx-auto mb-2" />
                <p className="font-semibold">Admin</p>
              </button>
            </div>

            {/* Name input used for both Admin and Employee login. For employees we will create/find by name. */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-600 border border-slate-500 text-white"
                placeholder={userType === "employee" ? "Employee name or email" : "Admin email"}
              />

              {userType === "employee" && employees.length > 0 && (
                <p className="text-sm text-slate-400 mt-2">Tip: entering an existing name will sign you into that profile.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-600 border border-slate-500 text-white"
                placeholder={userType === "employee" ? "Employee password" : hasAdminPassword() ? "Admin password" : "Set a new admin password"}
              />
              {userType === "admin" && !hasAdminPassword() && (
                <p className="text-sm text-slate-400 mt-2">No admin password set — this will create one.</p>
              )}
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={!nameInput.trim() || !passwordInput.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {userType === "employee" ? "Login as Employee" : hasAdminPassword() ? "Login as Admin" : "Create Admin and Login"}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>First time? Start by</p>
          <Link href="/register" className="text-blue-400 hover:text-blue-300">
            registering as an employee
          </Link>
        </div>
      </div>
    </main>
  )
}
