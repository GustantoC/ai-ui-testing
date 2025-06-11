"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format, addDays, subDays, isAfter } from "date-fns"

// Mock data
const mockAttendanceData = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeNo: "EMP001",
    company: "Tech Corp",
    branch: "Main Branch",
    department: "IT",
    section: "Development",
    shift: "Day Shift",
    timeIn: "08:00",
    timeOut: "17:30",
    allInOuts: [
      { type: "In", time: "08:00" },
      { type: "Out", time: "12:00" },
      { type: "In", time: "13:00" },
      { type: "Out", time: "17:30" },
    ],
    shiftHours: 8.0,
    workingHours: 8.5,
    hoursDifference: 0.5,
    earlyOT: true,
    paidLunch: false,
    actualOT: 1.5,
    totalOT: 1.5,
    preApprOT: 2.0,
    approvedOT: 1.5,
    allowance: 25.5,
    remark: "On Time",
    status: "approved",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    employeeNo: "EMP002",
    company: "Tech Corp",
    branch: "Main Branch",
    department: "HR",
    section: "Recruitment",
    shift: "Day Shift",
    timeIn: "08:15",
    timeOut: "17:00",
    allInOuts: [
      { type: "In", time: "08:15" },
      { type: "Out", time: "12:00" },
      { type: "In", time: "13:00" },
      { type: "Out", time: "17:00" },
    ],
    shiftHours: 8.0,
    workingHours: 7.75,
    hoursDifference: -0.25,
    earlyOT: false,
    paidLunch: true,
    actualOT: 0,
    totalOT: 0,
    preApprOT: 0,
    approvedOT: 0,
    allowance: 0,
    remark: "Late",
    status: "pending",
  },
  {
    id: 3,
    employeeName: "Mike Johnson",
    employeeNo: "EMP003",
    company: "Tech Corp",
    branch: "Branch A",
    department: "Sales",
    section: "B2B",
    shift: "Day Shift",
    timeIn: "07:45",
    timeOut: "18:00",
    allInOuts: [
      { type: "In", time: "07:45" },
      { type: "Out", time: "12:00" },
      { type: "In", time: "13:00" },
      { type: "Out", time: "18:00" },
    ],
    shiftHours: 8.0,
    workingHours: 9.25,
    hoursDifference: 1.25,
    earlyOT: true,
    paidLunch: false,
    actualOT: 2.0,
    totalOT: 2.0,
    preApprOT: 2.0,
    approvedOT: 2.0,
    allowance: 40.0,
    remark: "Early In",
    status: "approved",
  },
]

export default function AttendancePage() {
  useEffect(() => {
    document.title = 'V0 Dev';
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    company: "",
    branch: "",
    department: "",
    section: "",
  })

  const handleDateChange = (days: number) => {
    const newDate = days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days))
    if (!isAfter(newDate, new Date())) {
      setSelectedDate(newDate)
    }
  }

  const openModal = (employee: any) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }

  // Calculate summary data
  const summaryData = {
    totalWorkingHours: mockAttendanceData.reduce((sum, emp) => sum + emp.workingHours, 0),
    totalOvertime: mockAttendanceData.reduce((sum, emp) => sum + emp.totalOT, 0),
    totalLateness: mockAttendanceData.filter((emp) => emp.remark.includes("Late")).length,
    totalShifts: mockAttendanceData.length,
    totalHoursDifference: mockAttendanceData.reduce((sum, emp) => sum + emp.hoursDifference, 0),
    totalAllowance: mockAttendanceData.reduce((sum, emp) => sum + emp.allowance, 0),
  }

  const getRemarkBadgeColor = (remark: string) => {
    if (remark.includes("Late")) return "bg-red-100 text-red-800"
    if (remark.includes("Early")) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === "pending") return <AlertCircle className="h-5 w-5 text-yellow-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Daily Attendance</h1>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Date Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Select value={filters.company} onValueChange={(value) => setFilters({ ...filters, company: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-corp">Tech Corp</SelectItem>
                    <SelectItem value="business-inc">Business Inc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select value={filters.branch} onValueChange={(value) => setFilters({ ...filters, branch: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Branch</SelectItem>
                    <SelectItem value="branch-a">Branch A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select
                  value={filters.department}
                  onValueChange={(value) => setFilters({ ...filters, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <Select value={filters.section} onValueChange={(value) => setFilters({ ...filters, section: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="recruitment">Recruitment</SelectItem>
                    <SelectItem value="b2b">B2B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateChange(-1)}
                    disabled={format(subDays(selectedDate, 1), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-40">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "dd/MM/yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => isAfter(date, new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateChange(1)}
                    disabled={isAfter(addDays(selectedDate, 1), new Date())}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button style={{ backgroundColor: "#245AA6" }} className="text-white">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold" style={{ color: "#245AA6" }}>
                {summaryData.totalWorkingHours.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Total Working Hours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold" style={{ color: "#245AA6" }}>
                {summaryData.totalOvertime.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Total Overtime</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold" style={{ color: "#245AA6" }}>
                {summaryData.totalLateness}
              </div>
              <div className="text-sm text-gray-600">Total Lateness</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold" style={{ color: "#245AA6" }}>
                {summaryData.totalShifts}
              </div>
              <div className="text-sm text-gray-600">Total Shifts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold" style={{ color: "#245AA6" }}>
                {summaryData.totalHoursDifference.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Hours Difference</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold" style={{ color: "#245AA6" }}>
                RM {summaryData.totalAllowance.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Allowance</div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records - {format(selectedDate, "dd MMMM yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Employee No</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>In</TableHead>
                    <TableHead>Out</TableHead>
                    <TableHead>SH</TableHead>
                    <TableHead>WH</TableHead>
                    <TableHead>HD</TableHead>
                    <TableHead>Early OT</TableHead>
                    <TableHead>Paid Lunch</TableHead>
                    <TableHead>Actual OT</TableHead>
                    <TableHead>Total OT</TableHead>
                    <TableHead>Pre-Appr OT</TableHead>
                    <TableHead>Approved OT</TableHead>
                    <TableHead>Allowance</TableHead>
                    <TableHead>Remark</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendanceData.map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => openModal(employee)}
                    >
                      <TableCell className="font-medium">{employee.employeeName}</TableCell>
                      <TableCell>{employee.employeeNo}</TableCell>
                      <TableCell>{employee.shift}</TableCell>
                      <TableCell>{employee.timeIn}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {employee.allInOuts.map((inOut, index) => (
                            <div key={index} className="text-xs">
                              <span
                                className={`inline-block w-6 text-center rounded ${inOut.type === "In" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {inOut.type}
                              </span>{" "}
                              {inOut.time}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{employee.shiftHours}</TableCell>
                      <TableCell>{employee.workingHours}</TableCell>
                      <TableCell className={employee.hoursDifference >= 0 ? "text-green-600" : "text-red-600"}>
                        {employee.hoursDifference > 0 ? "+" : ""}
                        {employee.hoursDifference}
                      </TableCell>
                      <TableCell>
                        <div className={`w-6 h-6 rounded-full ${employee.earlyOT ? "bg-yellow-400" : "bg-gray-200"}`} />
                      </TableCell>
                      <TableCell>
                        <div
                          className={`w-6 h-6 rounded-full ${employee.paidLunch ? "bg-yellow-400" : "bg-gray-200"}`}
                        />
                      </TableCell>
                      <TableCell>{employee.actualOT}</TableCell>
                      <TableCell>{employee.totalOT}</TableCell>
                      <TableCell>{employee.preApprOT}</TableCell>
                      <TableCell>{employee.approvedOT}</TableCell>
                      <TableCell>RM {employee.allowance.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getRemarkBadgeColor(employee.remark)}>{employee.remark}</Badge>
                      </TableCell>
                      <TableCell>{getStatusIcon(employee.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Attendance Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Employee Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {selectedEmployee.employeeName}
                      </div>
                      <div>
                        <span className="font-medium">Employee No:</span> {selectedEmployee.employeeNo}
                      </div>
                      <div>
                        <span className="font-medium">Company:</span> {selectedEmployee.company}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span> {selectedEmployee.department}
                      </div>
                      <div>
                        <span className="font-medium">Section:</span> {selectedEmployee.section}
                      </div>
                      <div>
                        <span className="font-medium">Shift:</span> {selectedEmployee.shift}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Attendance Date</h3>
                    <div className="text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(selectedDate, "dd MMMM yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Time Records</h3>
                  <div className="space-y-2">
                    {selectedEmployee.allInOuts.map((record, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        <Clock className="h-4 w-4" />
                        <span
                          className={`px-2 py-1 rounded text-xs ${record.type === "In" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {record.type}
                        </span>
                        <span className="font-mono">{record.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Overtime Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Actual OT:</span> {selectedEmployee.actualOT} hours
                    </div>
                    <div>
                      <span className="font-medium">Total OT:</span> {selectedEmployee.totalOT} hours
                    </div>
                    <div>
                      <span className="font-medium">Pre-Approved OT:</span> {selectedEmployee.preApprOT} hours
                    </div>
                    <div>
                      <span className="font-medium">Approved OT:</span> {selectedEmployee.approvedOT} hours
                    </div>
                    <div>
                      <span className="font-medium">Early OT:</span> {selectedEmployee.earlyOT ? "Yes" : "No"}
                    </div>
                    <div>
                      <span className="font-medium">Paid Lunch:</span> {selectedEmployee.paidLunch ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
