"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type LeaveRequest, type Employee, getRequests, getEmployees, updateRequest } from "@/lib/storage"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import ReviewRequestForm from "@/components/review-request-form"
import { RoleGuard } from "@/components/role-guard"

function AdminDashboard() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [searchEmployee, setSearchEmployee] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    setRequests(getRequests())
    setEmployees(getEmployees())
  }, [])

  const handleReview = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setIsOpen(true)
  }

  const handleApproveReject = (data: { approved: boolean; rejectionReason?: string }) => {
    if (!selectedRequest) return

    const updated = updateRequest(selectedRequest.id, {
      status: data.approved ? "approved" : "rejected",
      approvedAt: new Date().toISOString(),
      approvedBy: "Admin",
      rejectionReason: data.rejectionReason,
    })

    if (updated) {
      setRequests(requests.map((r) => (r.id === updated.id ? updated : r)))
      setIsOpen(false)
      setSelectedRequest(null)
    }
  }

  const filteredRequests = requests.filter((req) => {
    let matches = true

    if (filter !== "all" && req.status !== filter) {
      matches = false
    }

    if (searchEmployee) {
      const emp = employees.find((e) => e.id === req.employeeId)
      if (!emp || !emp.name.toLowerCase().includes(searchEmployee.toLowerCase())) {
        matches = false
      }
    }

    if (startDate && new Date(req.startDate) < new Date(startDate)) {
      matches = false
    }

    if (endDate && new Date(req.endDate) > new Date(endDate)) {
      matches = false
    }

    return matches
  })

  const getEmployee = (employeeId: string) => {
    return employees.find((e) => e.id === employeeId)
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }

  const topEmployeesWithAbsences = employees
    .map((emp) => {
      const approvedDays = requests
        .filter((r) => r.employeeId === emp.id && r.status === "approved")
        .reduce((sum, r) => sum + r.daysRequested, 0)
      return { name: emp.name, department: emp.department, days: approvedDays }
    })
    .sort((a, b) => b.days - a.days)
    .slice(0, 5)
    .filter((e) => e.days > 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card
            className={`border-slate-600 text-white ${filter === "all" ? "bg-slate-600" : "bg-slate-700"} cursor-pointer`}
            onClick={() => setFilter("all")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
            </CardContent>
          </Card>

          <Card
            className={`border-slate-600 text-white ${filter === "pending" ? "bg-slate-600" : "bg-slate-700"} cursor-pointer`}
            onClick={() => setFilter("pending")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card
            className={`border-slate-600 text-white ${filter === "approved" ? "bg-slate-600" : "bg-slate-700"} cursor-pointer`}
            onClick={() => setFilter("approved")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card
            className={`border-slate-600 text-white ${filter === "rejected" ? "bg-slate-600" : "bg-slate-700"} cursor-pointer`}
            onClick={() => setFilter("rejected")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requests List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Leave Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Search employee..."
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Start Date"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="End Date"
                />
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <Card className="bg-slate-700 border-slate-600 text-white text-center py-8">
                <p className="text-slate-300">No {filter === "all" ? "requests" : filter + " requests"} found.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((req) => {
                  const employee = getEmployee(req.employeeId)
                  return (
                    <Card key={req.id} className="bg-slate-700 border-slate-600 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {req.status === "approved" && <CheckCircle className="h-5 w-5 text-green-400" />}
                              {req.status === "pending" && <Clock className="h-5 w-5 text-yellow-400" />}
                              {req.status === "rejected" && <XCircle className="h-5 w-5 text-red-400" />}
                              <span className="font-semibold">{employee?.name}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-sm text-slate-400">{employee?.department}</span>
                            </div>
                            <p className="text-sm text-slate-300 mb-1">
                              {new Date(req.startDate).toLocaleDateString()} to{" "}
                              {new Date(req.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-slate-400">{req.reason}</p>
                          </div>
                          <div className="text-right ml-4 flex flex-col items-end gap-2">
                            <div>
                              <div className="text-xl font-bold text-blue-400">{req.daysRequested}</div>
                              <p className="text-xs text-slate-400">
                                {req.leaveType === "annual" ? "Annual" : req.leaveType === "sick" ? "Sick" : "Other"}{" "}
                                days
                              </p>
                            </div>
                            {req.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleReview(req)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Top Employees with Most Absences */}
          <div>
            <Card className="bg-slate-700 border-slate-600 text-white sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Top Absences</CardTitle>
              </CardHeader>
              <CardContent>
                {topEmployeesWithAbsences.length === 0 ? (
                  <p className="text-slate-400 text-sm">No approved leaves yet</p>
                ) : (
                  <div className="space-y-3">
                    {topEmployeesWithAbsences.map((emp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-600 rounded">
                        <div>
                          <p className="font-semibold text-sm">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-400">{emp.days}</p>
                          <p className="text-xs text-slate-400">days</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      {selectedRequest && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Review Leave Request</DialogTitle>
            </DialogHeader>
            <ReviewRequestForm
              request={selectedRequest}
              employee={getEmployee(selectedRequest.employeeId)}
              onSubmit={handleApproveReject}
              onClose={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  )
}

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminDashboard />
    </RoleGuard>
  )
}