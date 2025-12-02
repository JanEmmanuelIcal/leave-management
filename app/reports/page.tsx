"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Employee, type LeaveRequest, getEmployees, getRequests, getEmployeeLeaveBalance } from "@/lib/storage"
import { LogOut } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAuth } from "@/hooks/use-auth"

export default function ReportsPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [reportType, setReportType] = useState<"summary" | "monthly" | "department">("summary")
  const router = useRouter()
  const { role, logout } = useAuth()

  useEffect(() => {
    setEmployees(getEmployees())
    setRequests(getRequests())
    if (getEmployees().length > 0) {
      setSelectedEmployeeId(getEmployees()[0].id)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId)
  const leaveBalance = selectedEmployeeId ? getEmployeeLeaveBalance(selectedEmployeeId) : null

  // Summary Report Data
  const getSummaryData = () => {
    return employees.map((emp) => {
      const balance = getEmployeeLeaveBalance(emp.id)
      return {
        name: emp.name,
        used: balance!.annual.used,
        remaining: balance!.annual.remaining,
      }
    })
  }

  // Monthly Report Data
  const getMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthCounts = new Array(12).fill(0)

    requests
      .filter((r) => r.status === "approved")
      .forEach((req) => {
        const month = new Date(req.startDate).getMonth()
        monthCounts[month] += req.daysRequested
      })

    return months.map((month, index) => ({
      month,
      days: monthCounts[index],
    }))
  }

  // Department Report Data
  const getDepartmentData = () => {
    const deptMap: Record<
      string,
      { name: string; approved: number; pending: number; rejected: number; remaining: number }
    > = {}

    employees.forEach((emp) => {
      if (!deptMap[emp.department]) {
        deptMap[emp.department] = { name: emp.department, approved: 0, pending: 0, rejected: 0, remaining: 0 }
      }
    })

    requests.forEach((req) => {
      const emp = employees.find((e) => e.id === req.employeeId)
      if (emp && deptMap[emp.department]) {
        if (req.status === "approved") deptMap[emp.department].approved += req.daysRequested
        if (req.status === "pending") deptMap[emp.department].pending += req.daysRequested
        if (req.status === "rejected") deptMap[emp.department].rejected += req.daysRequested
      }
    })

    // Calculate remaining leaves per department
    employees.forEach((emp) => {
      const balance = getEmployeeLeaveBalance(emp.id)
      if (balance && deptMap[emp.department]) {
        deptMap[emp.department].remaining += balance.annual.remaining
      }
    })

    return Object.values(deptMap)
  }

  const getTopEmployeesData = () => {
    return employees
      .map((emp) => {
        const approvedDays = requests
          .filter((r) => r.employeeId === emp.id && r.status === "approved")
          .reduce((sum, r) => sum + r.daysRequested, 0)
        return {
          name: emp.name,
          department: emp.department,
          days: approvedDays,
        }
      })
      .sort((a, b) => b.days - a.days)
      .slice(0, 10)
  }

  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Leave Reports</h1>
          {role && (
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="summary">Employee Summary</SelectItem>
                <SelectItem value="monthly">Monthly Trends</SelectItem>
                <SelectItem value="department">Department Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportType === "summary" && (
            <div>
              <label className="block text-sm font-medium mb-2">Select Employee</label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Summary Report */}
        {reportType === "summary" && selectedEmployee && leaveBalance && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-700 border-slate-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Annual Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{leaveBalance.annual.total}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-700 border-slate-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Used Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">{leaveBalance.annual.used}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-700 border-slate-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Remaining Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{leaveBalance.annual.remaining}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-700 border-slate-600 text-white">
              <CardHeader>
                <CardTitle>Leave Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Used", value: leaveBalance.annual.used },
                        { name: "Remaining", value: leaveBalance.annual.remaining },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Monthly Report */}
        {reportType === "monthly" && (
          <div className="space-y-6">
            <Card className="bg-slate-700 border-slate-600 text-white">
              <CardHeader>
                <CardTitle>Monthly Leave Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getMonthlyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }}
                    />
                    <Bar dataKey="days" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600 text-white">
              <CardHeader>
                <CardTitle>Top Employees by Absences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getTopEmployeesData().length === 0 ? (
                    <p className="text-slate-400">No data available</p>
                  ) : (
                    getTopEmployeesData().map((emp, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-600 rounded">
                        <div>
                          <p className="font-semibold">{emp.name}</p>
                          <p className="text-sm text-slate-400">{emp.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-400">{emp.days} days</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Department Report */}
        {reportType === "department" && (
          <Card className="bg-slate-700 border-slate-600 text-white">
            <CardHeader>
              <CardTitle>Department Leave Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getDepartmentData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff" }} />
                  <Legend />
                  <Bar dataKey="approved" fill="#10b981" />
                  <Bar dataKey="pending" fill="#f59e0b" />
                  <Bar dataKey="rejected" fill="#ef4444" />
                  <Bar dataKey="remaining" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
