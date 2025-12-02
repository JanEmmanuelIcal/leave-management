"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Employee, calculateDaysBetween } from "@/lib/storage"
import { AlertCircle } from "lucide-react"

interface LeaveRequestFormProps {
  employee: Employee
  leaveBalance: any
  onSubmit: (data: {
    startDate: string
    endDate: string
    leaveType: "annual" | "sick" | "other"
    reason: string
  }) => void
  onSuccess?: () => void
}

export default function LeaveRequestForm({ employee, leaveBalance, onSubmit, onSuccess }: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "annual" as "annual" | "sick" | "other",
    reason: "",
  })

  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      leaveType: value as "annual" | "sick" | "other",
    }))
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end dates")
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("End date must be after start date")
      return
    }

    if (!formData.reason.trim()) {
      setError("Please provide a reason for leave")
      return
    }

    const daysRequested = calculateDaysBetween(formData.startDate, formData.endDate)

    onSubmit(formData)
    setFormData({
      startDate: "",
      endDate: "",
      leaveType: "annual",
      reason: "",
    })
    onSuccess?.()
  }

  const daysRequested =
    formData.startDate && formData.endDate ? calculateDaysBetween(formData.startDate, formData.endDate) : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex gap-3 p-3 bg-red-700/90 border border-red-600 rounded-md text-base text-white font-medium">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-base font-semibold mb-1 text-white">Start Date</label>
          <Input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 border-2 border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-base font-semibold mb-1 text-white">End Date</label>
          <Input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 border-2 border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {daysRequested > 0 && (
        <div className="p-3 bg-blue-800/85 border border-blue-500 rounded-md text-base text-white font-semibold">
          <p>
            <span className="font-semibold">Days Requested:</span> {daysRequested} days
          </p>
        </div>
      )}

      <div>
        <label className="block text-base font-semibold mb-1 text-white">Leave Type</label>
        <Select value={formData.leaveType} onValueChange={handleSelectChange}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-10 px-3 rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600 text-white">
            <SelectItem value="annual">Annual Leave</SelectItem>
            <SelectItem value="sick">Sick Leave</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-base font-semibold mb-1 text-white">Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={4}
          className="w-full bg-slate-700 border-slate-600 rounded-md text-white px-3 py-3 placeholder:text-slate-400 text-base font-medium"
          placeholder="Explain the reason for your leave request..."
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Submit Request
      </Button>
    </form>
  )
}
