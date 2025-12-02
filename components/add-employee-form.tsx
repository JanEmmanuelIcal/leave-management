"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddEmployeeFormProps {
  onSubmit: (data: {
    name: string
    email: string
    department: string
    position: string
    joinDate: string
    annualLeave: number
    sickLeave: number
    password?: string
  }) => void
  onSuccess?: () => void
}

export default function AddEmployeeForm({ onSubmit, onSuccess }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    joinDate: new Date().toISOString().split("T")[0],
    annualLeave: 20,
    sickLeave: 10,
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Leave") || name === "joinDate" ? value : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      annualLeave: Number.parseInt(formData.annualLeave.toString()),
      sickLeave: Number.parseInt(formData.sickLeave.toString()),
    })
    setFormData({
      name: "",
      email: "",
      department: "",
      position: "",
      joinDate: new Date().toISOString().split("T")[0],
      annualLeave: 20,
      sickLeave: 10,
      password: "",
    })
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="john@company.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <Input
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="HR"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <Input
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Manager"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Join Date</label>
          <Input
            name="joinDate"
            type="date"
            value={formData.joinDate}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Annual Leave (days)</label>
          <Input
            name="annualLeave"
            type="number"
            value={formData.annualLeave}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sick Leave (days)</label>
          <Input
            name="sickLeave"
            type="number"
            value={formData.sickLeave}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password (set by admin)</label>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Choose a password for employee"
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Add Employee
      </Button>
    </form>
  )
}
