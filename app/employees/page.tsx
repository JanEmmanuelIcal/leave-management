"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { type Employee, getEmployees, addEmployee, deleteEmployee } from "@/lib/storage"
import { Trash2, Plus } from "lucide-react"
import AddEmployeeForm from "@/components/add-employee-form"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setEmployees(getEmployees())
  }, [])

  const handleAddEmployee = (data: any) => {
    const newEmployee = addEmployee(data)
    setEmployees([...employees, newEmployee])
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id)
      setEmployees(employees.filter((e) => e.id !== id))
    }
  }

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employees</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <AddEmployeeForm onSubmit={handleAddEmployee} onSuccess={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>

        {filteredEmployees.length === 0 ? (
          <Card className="bg-slate-700 border-slate-600 text-white text-center py-8">
            <p className="text-slate-300">No employees found. Add your first employee!</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredEmployees.map((emp) => (
              <Card key={emp.id} className="bg-slate-700 border-slate-600 text-white">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{emp.name}</CardTitle>
                      <p className="text-sm text-slate-300 mt-1">{emp.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(emp.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-slate-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Department</p>
                      <p className="font-semibold">{emp.department}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Position</p>
                      <p className="font-semibold">{emp.position}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Annual Leave</p>
                      <p className="font-semibold text-blue-300">{emp.annualLeave} days</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Sick Leave</p>
                      <p className="font-semibold text-green-300">{emp.sickLeave} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
