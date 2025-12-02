"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addEmployee } from "@/lib/storage"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [department, setDepartment] = useState("")
  const [position, setPosition] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill all required fields")
      return
    }

    // create registration with pending status
    addEmployee({
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      position: position.trim(),
      joinDate: new Date().toISOString(),
      annualLeave: 0,
      sickLeave: 0,
      password: password,
      status: "pending",
    })

    setMessage("Registration submitted. Wait for admin approval.")
    setName("")
    setEmail("")
    setPassword("")
    setDepartment("")
    setPosition("")

    // optionally redirect to login
    setTimeout(() => router.push("/login"), 1200)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-center">Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <Input value={position} onChange={(e) => setPosition(e.target.value)} className="bg-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-700 text-white" />
              </div>

              <Button type="submit" className="w-full bg-blue-600">Register</Button>
            </form>
            {message && <p className="text-sm text-slate-300">{message}</p>}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
