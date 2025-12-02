"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  type Employee,
  type LeaveRequest,
  getEmployees,
  getRequests,
  addRequest,
  getEmployeeLeaveBalance,
  calculateDaysBetween,
} from "@/lib/storage"
import { Plus, CheckCircle, Clock, XCircle } from "lucide-react"
import LeaveRequestForm from "@/components/leave-request-form"
import { RoleGuard } from "@/components/role-guard"
import { useAuth } from "@/hooks/use-auth"

export default function EmployeePage() {
  return (
    <RoleGuard allowedRoles={["employee"]}>
      <EmployeeDashboard />
    </RoleGuard>
  )
}

function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [leaveBalance, setLeaveBalance] = useState<any>(null)
  const { currentEmployeeId } = useAuth()

  useEffect(() => {
    const emps = getEmployees()
    setEmployees(emps)
  }, [])

  useEffect(() => {
    if (currentEmployeeId) {
      const allRequests = getRequests()
      setRequests(allRequests.filter((r: LeaveRequest) => r.employeeId === currentEmployeeId))
      setLeaveBalance(getEmployeeLeaveBalance(currentEmployeeId))
    }
  }, [currentEmployeeId])

  const handleAddRequest = (data: any) => {
    if (!currentEmployeeId) return
    const daysRequested = calculateDaysBetween(data.startDate, data.endDate)
    const newRequest = addRequest({
      employeeId: currentEmployeeId,
      ...data,
      daysRequested,
      status: "pending",
    })
    setRequests([...requests, newRequest])
    setLeaveBalance(getEmployeeLeaveBalance(currentEmployeeId))
    setIsOpen(false)
  }

  const selectedEmployee = employees.find((e: Employee) => e.id === currentEmployeeId)
  const pendingCount = requests.filter((r: LeaveRequest) => r.status === "pending").length
  const approvedCount = requests.filter((r: LeaveRequest) => r.status === "approved").length
  const rejectedCount = requests.filter((r: LeaveRequest) => r.status === "rejected").length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Leave Dashboard</h1>

        {employees.length === 0 ? (
          <Card className="bg-slate-700 border-slate-600 text-white text-center py-8">
            <p className="text-slate-300">No employees in the system. Please add an employee first.</p>
          </Card>
        ) : (
          <>
            {selectedEmployee && leaveBalance && (
              <>
                <Card className="bg-slate-700 border-slate-600 text-white mb-8">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{selectedEmployee.name}</CardTitle>
                        <p className="text-slate-400 mt-1">
                          {selectedEmployee.department} • {selectedEmployee.position}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Email</p>
                        <p className="font-semibold">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Join Date</p>
                        <p className="font-semibold">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Leave Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card className="bg-slate-700 border-slate-600 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-300">Annual Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-400">{leaveBalance.annual.remaining}</div>
                      <p className="text-sm text-slate-400 mt-1">of {leaveBalance.annual.total} days remaining</p>
                      <p className="text-xs text-slate-500 mt-1">{leaveBalance.annual.used} days used</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-slate-600 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-300">Sick Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-400">{leaveBalance.sick.remaining}</div>
                      <p className="text-sm text-slate-400 mt-1">of {leaveBalance.sick.total} days remaining</p>
                      <p className="text-xs text-slate-500 mt-1">{leaveBalance.sick.used} days used</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-slate-600 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-300">Request Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-400">{requests.length}</div>
                      <p className="text-sm text-slate-400 mt-1">
                        {pendingCount} pending • {approvedCount} approved
                      </p>
                      {rejectedCount > 0 && <p className="text-xs text-red-400">{rejectedCount} rejected</p>}
                    </CardContent>
                  </Card>
                </div>

                {/* Submit Request Button */}
                <div className="mb-8">
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Submit Leave Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Submit Leave Request</DialogTitle>
                      </DialogHeader>
                      <LeaveRequestForm
                        employee={selectedEmployee}
                        leaveBalance={leaveBalance}
                        onSubmit={handleAddRequest}
                        onSuccess={() => setIsOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Requests List */}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Request History</h2>
                  {requests.length === 0 ? (
                    <Card className="bg-slate-700 border-slate-600 text-white text-center py-6">
                      <p className="text-slate-300">No leave requests yet. Submit your first request above.</p>
                    </Card>
                  ) : (
                    requests.map((req) => (
                      <Card key={req.id} className="bg-slate-700 border-slate-600 text-white">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(req.status)}
                                <span className="font-semibold capitalize">{req.status}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-sm text-slate-400">
                                  {req.leaveType === "annual" ? "Annual" : req.leaveType === "sick" ? "Sick" : "Other"}{" "}
                                  Leave
                                </span>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">
                                {new Date(req.startDate).toLocaleDateString()} to{" "}
                                {new Date(req.endDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-slate-400">{req.reason}</p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-xl font-bold text-blue-400">{req.daysRequested}</div>
                              <p className="text-xs text-slate-400">days</p>
                            </div>
                          </div>
                          {req.rejectionReason && (
                            <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded text-sm text-slate-200">
                              <p className="font-semibold mb-1">Rejection Reason:</p>
                              <p>{req.rejectionReason}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}