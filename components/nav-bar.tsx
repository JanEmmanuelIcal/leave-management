"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LogOut } from "lucide-react"

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, logout } = useAuth()

  const isActive = (path: string) => pathname?.startsWith(path)



  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-400 hover:text-blue-300">
          Leave Management
        </Link>
        <div className="flex gap-2 flex-wrap justify-end items-center">
          {!role && (
            <Link href="/">
              <Button
                variant={isActive("/") && pathname === "/" ? "default" : "ghost"}
                className="text-white hover:bg-slate-800"
              >
                Home
              </Button>
            </Link>
          )}

          {role === "admin" && (
            <>
              <Link href="/admin">
                <Button variant={isActive("/admin") ? "default" : "ghost"} className="text-white hover:bg-slate-800">
                  Dashboard
                </Button>
              </Link>
              <Link href="/employees">
                <Button variant={isActive("/employees") ? "default" : "ghost"} className="text-white hover:bg-slate-800">
                  Employees
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant={isActive("/reports") ? "default" : "ghost"} className="text-white hover:bg-slate-800">
                  Reports
                </Button>
              </Link>
            </>
          )}

          {role === "employee" && (
            <>
              <Link href="/employee">
                <Button variant={isActive("/employee") ? "default" : "ghost"} className="text-white hover:bg-slate-800">
                  My Dashboard
                </Button>
              </Link>
            </>
          )}

          {!role && (
            <>
              
              
            </>
          )}

          {role && (
            <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-red-900 gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
