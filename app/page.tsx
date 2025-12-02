"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileText, BarChart3, LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { role, logout } = useAuth()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // If logged-in user is an employee, redirect them directly to the employee dashboard
    if (isClient && role === "employee") {
      router.replace("/employee")
    }
  }, [isClient, role, router])

  if (!isClient) return null

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-5xl font-bold mb-4">Leave Management System</h1>
            <p className="text-xl text-slate-300">Manage employee leave requests efficiently and effectively</p>
          </div>
          {role && (
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>

        {/* Action Button */}
        {!role && (
          <Link href="/login">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 mb-12">
              <LogIn className="h-5 w-5" />
              Get Started
            </Button>
          </Link>
        )}

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href={role ? (role === "admin" ? "/admin" : "/employee") : "/login"}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-slate-700 border-slate-600 text-white">
              <CardHeader>
                <Calendar className="h-8 w-8 mb-2 text-blue-400" />
                <CardTitle>Employee Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">Request and track your leave</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href={role === "admin" ? "/admin" : "/login"}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-slate-700 border-slate-600 text-white">
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-green-400" />
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">Approve or reject requests</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-slate-700 border-slate-600 text-white">
              <CardHeader>
                <BarChart3 className="h-8 w-8 mb-2 text-purple-400" />
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">View leave summaries</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/employees">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-slate-700 border-slate-600 text-white">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-orange-400" />
                <CardTitle>Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">Manage employee profiles</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Feature Overview */}
        <Card className="bg-slate-700 border-slate-600 text-white">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Add and manage employee profiles with leave allocations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Submit leave requests with dates and reasons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Admin approval or rejection of requests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Track used and remaining leave days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Generate monthly leave summaries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✓</span>
                <span>Real-time leave balance updates</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
