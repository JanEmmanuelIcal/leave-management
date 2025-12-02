// LocalStorage management for leave data

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  annualLeave: number
  sickLeave: number
  createdAt: string
  password?: string
  status?: "pending" | "approved"
}

export interface LeaveRequest {
  id: string
  employeeId: string
  startDate: string
  endDate: string
  leaveType: "annual" | "sick" | "other"
  reason: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  daysRequested: number
  createdAt: string
  approvedAt?: string
  approvedBy?: string
  rejectionReason?: string
}

const EMPLOYEES_KEY = "leave_system_employees"
const REQUESTS_KEY = "leave_system_requests"
const ADMIN_EMAIL_KEY = "admin_email"
const ADMIN_PASSWORD_KEY = "admin_password"

export function getEmployees(): Employee[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(EMPLOYEES_KEY)
  return data ? JSON.parse(data) : []
}

export function addEmployee(employee: Omit<Employee, "id" | "createdAt">): Employee {
  const employees = getEmployees()
  const newEmployee: Employee = {
    ...employee,
    status: (employee as any).status || "approved",
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  employees.push(newEmployee)
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
  return newEmployee
}

export function verifyEmployeeCredentials(identifier: string, password: string): string | null {
  const employees = getEmployees()
  const id = identifier.trim().toLowerCase()
  const match = employees.find((e) => {
    const nameMatch = e.name.toLowerCase() === id
    const emailMatch = e.email.toLowerCase() === id
    return (nameMatch || emailMatch) && e.password === password && e.status === "approved"
  })
  return match ? match.id : null
}

export function setAdminPassword(password: string) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, password)
}

export function setAdminCredentials(email: string, password: string) {
  if (typeof window === "undefined") return
  if (!localStorage.getItem(ADMIN_EMAIL_KEY)) {
    localStorage.setItem(ADMIN_EMAIL_KEY, email)
  }
  if (!localStorage.getItem(ADMIN_PASSWORD_KEY)) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, password)
  }
}

export function hasAdminPassword(): boolean {
  return !!localStorage.getItem(ADMIN_PASSWORD_KEY)
}

export function getAdminEmail(): string | null {
  return localStorage.getItem(ADMIN_EMAIL_KEY)
}

export function verifyAdminPassword(password: string): boolean {
  const stored = localStorage.getItem(ADMIN_PASSWORD_KEY)
  if (!stored) return false
  return stored === password
}

export function updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
  const employees = getEmployees()
  const index = employees.findIndex((e) => e.id === id)
  if (index === -1) return null
  employees[index] = { ...employees[index], ...updates }
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
  return employees[index]
}

export function deleteEmployee(id: string): boolean {
  const employees = getEmployees()
  const filtered = employees.filter((e) => e.id !== id)
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(filtered))
  return filtered.length < employees.length
}

export function getRequests(): LeaveRequest[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(REQUESTS_KEY)
  return data ? JSON.parse(data) : []
}

export function addRequest(request: Omit<LeaveRequest, "id" | "createdAt">): LeaveRequest {
  const requests = getRequests()
  const newRequest: LeaveRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  requests.push(newRequest)
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  return newRequest
}

export function updateRequest(id: string, updates: Partial<LeaveRequest>): LeaveRequest | null {
  const requests = getRequests()
  const index = requests.findIndex((r) => r.id === id)
  if (index === -1) return null
  requests[index] = { ...requests[index], ...updates }
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  return requests[index]
}

export function getEmployeeLeaveBalance(employeeId: string) {
  const employees = getEmployees()
  const employee = employees.find((e) => e.id === employeeId)
  if (!employee) return null

  const requests = getRequests()
  const approvedRequests = requests.filter((r) => r.employeeId === employeeId && r.status === "approved")

  const usedAnnual = approvedRequests
    .filter((r) => r.leaveType === "annual")
    .reduce((sum, r) => sum + r.daysRequested, 0)

  const usedSick = approvedRequests.filter((r) => r.leaveType === "sick").reduce((sum, r) => sum + r.daysRequested, 0)

  return {
    annual: {
      total: employee.annualLeave,
      used: usedAnnual,
      remaining: employee.annualLeave - usedAnnual,
    },
    sick: {
      total: employee.sickLeave,
      used: usedSick,
      remaining: employee.sickLeave - usedSick,
    },
  }
}

export function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}
