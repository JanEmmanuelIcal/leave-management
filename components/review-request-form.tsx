"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { LeaveRequest, Employee } from "@/lib/storage"

interface ReviewRequestFormProps {
  request: LeaveRequest
  employee?: Employee
  onSubmit: (data: { approved: boolean; rejectionReason?: string }) => void
  onClose: () => void
}

export default function ReviewRequestForm({ request, employee, onSubmit, onClose }: ReviewRequestFormProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [action, setAction] = useState<"approve" | "reject" | null>(null)

  const handleApprove = () => {
    onSubmit({ approved: true })
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }
    onSubmit({ approved: false, rejectionReason })
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-700 p-4 rounded space-y-3">
        <div>
          <p className="text-sm text-slate-400">Employee</p>
          <p className="font-semibold">{employee?.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Department</p>
          <p className="font-semibold">{employee?.department}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Leave Period</p>
          <p className="font-semibold">
            {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Days Requested</p>
          <p className="font-semibold">{request.daysRequested} days</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Leave Type</p>
          <p className="font-semibold capitalize">{request.leaveType} Leave</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Reason</p>
          <p className="font-semibold">{request.reason}</p>
        </div>
      </div>

      {action === "reject" && (
        <div>
          <label className="block text-sm font-medium mb-2">Rejection Reason</label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
            className="w-full bg-slate-700 border border-slate-600 rounded text-white px-3 py-2 placeholder:text-slate-400"
            placeholder="Explain why this request is being rejected..."
            autoFocus
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 border-slate-600 text-white hover:bg-slate-700 bg-transparent"
        >
          Cancel
        </Button>
        {action === null ? (
          <>
            <Button
              onClick={() => setAction("reject")}
              variant="outline"
              className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
            >
              Reject
            </Button>
            <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
              Approve
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setAction(null)}
              variant="outline"
              className="flex-1 border-slate-600 text-white hover:bg-slate-700"
            >
              Back
            </Button>
            <Button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700">
              Confirm Reject
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
