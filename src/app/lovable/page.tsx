"use client"
import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, TrendingUp, AlertCircle, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, addDays, subDays, isAfter } from 'date-fns';

// Mock data for demonstration
const mockAttendanceData = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeNo: "EMP001",
    company: "Tech Corp",
    branch: "Main Branch",
    department: "IT",
    section: "Development",
    shift: "9AM-6PM",
    clockIns: ["09:00", "13:00"],
    clockOuts: ["12:00", "18:30"],
    shiftHours: 8,
    workingHours: 8.5,
    hoursDifference: 0.5,
    earlyOT: true,
    paidLunch: false,
    actualOT: 0.5,
    totalOT: 0.5,
    preApprOT: 0,
    approvedOT: 0.5,
    allowance: 50.00,
    remark: "Late",
    status: "approved"
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    employeeNo: "EMP002",
    company: "Tech Corp",
    branch: "Main Branch", 
    department: "HR",
    section: "Recruitment",
    shift: "8AM-5PM",
    clockIns: ["08:00", "13:00"],
    clockOuts: ["12:00", "17:00"],
    shiftHours: 8,
    workingHours: 8,
    hoursDifference: 0,
    earlyOT: false,
    paidLunch: true,
    actualOT: 0,
    totalOT: 0,
    preApprOT: 0,
    approvedOT: 0,
    allowance: 0,
    remark: "On Time",
    status: "pending"
  },
  {
    id: 3,
    employeeName: "Mike Johnson",
    employeeNo: "EMP003",
    company: "Tech Corp",
    branch: "North Branch",
    department: "Sales",
    section: "Marketing",
    shift: "10AM-7PM",
    clockIns: ["10:15", "14:00"],
    clockOuts: ["13:00", "19:30"],
    shiftHours: 8,
    workingHours: 8.25,
    hoursDifference: 0.25,
    earlyOT: true,
    paidLunch: false,
    actualOT: 2.5,
    totalOT: 2.5,
    preApprOT: 2,
    approvedOT: 2,
    allowance: 75.00,
    remark: "Late Break In",
    status: "approved"
  }
];

const Index = () => {
  useEffect(() => {
    document.title = 'Lovable ';
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = mockAttendanceData.filter(employee => {
    return (selectedCompany === "all" || employee.company === selectedCompany) &&
           (selectedBranch === "all" || employee.branch === selectedBranch) &&
           (selectedDepartment === "all" || employee.department === selectedDepartment) &&
           (selectedSection === "all" || employee.section === selectedSection);
  });

  const summaryStats = {
    totalWorkingHours: filteredData.reduce((sum, emp) => sum + emp.workingHours, 0),
    totalOvertime: filteredData.reduce((sum, emp) => sum + emp.totalOT, 0),
    totalLateness: filteredData.filter(emp => emp.remark.includes("Late")).length,
    totalShifts: filteredData.length,
    totalHoursDifference: filteredData.reduce((sum, emp) => sum + emp.hoursDifference, 0),
    totalAllowance: filteredData.reduce((sum, emp) => sum + emp.allowance, 0)
  };

  const handleDateChange = (days) => {
    const newDate = days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days));
    if (!isAfter(newDate, new Date())) {
      setSelectedDate(newDate);
    }
  };

  const openEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const getRemarkBadge = (remark) => {
    const remarkLower = remark.toLowerCase();
    if (remarkLower.includes("late")) {
      return <Badge variant="destructive">{remark}</Badge>;
    } else if (remarkLower.includes("early out") || remarkLower.includes("deficit")) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">{remark}</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800">{remark}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Daily Attendance</h1>
          <p className="text-muted-foreground mt-2">Manage and track employee attendance records</p>
        </div>

        {/* Filters and Date Picker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Filters & Date Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Filter Controls */}
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="Tech Corp">Tech Corp</SelectItem>
                  <SelectItem value="Other Corp">Other Corp</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="Main Branch">Main Branch</SelectItem>
                  <SelectItem value="North Branch">North Branch</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Recruitment">Recruitment</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Picker */}
              <div className="col-span-2 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDateChange(-1)}
                  disabled={format(subDays(selectedDate, 1), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-background min-w-0 flex-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{format(selectedDate, 'dd MMM yyyy')}</span>
                </div>
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
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Working Hours</p>
                  <p className="text-xl font-bold">{summaryStats.totalWorkingHours.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Overtime</p>
                  <p className="text-xl font-bold">{summaryStats.totalOvertime.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Lateness</p>
                  <p className="text-xl font-bold">{summaryStats.totalLateness}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Shifts</p>
                  <p className="text-xl font-bold">{summaryStats.totalShifts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Hours Difference</p>
                <p className="text-xl font-bold">{summaryStats.totalHoursDifference.toFixed(1)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Allowance</p>
                <p className="text-xl font-bold">RM {summaryStats.totalAllowance.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Employee Name</th>
                    <th className="text-left p-2 font-medium">Employee No</th>
                    <th className="text-left p-2 font-medium">Shift</th>
                    <th className="text-left p-2 font-medium">In/Out</th>
                    <th className="text-left p-2 font-medium">SH</th>
                    <th className="text-left p-2 font-medium">WH</th>
                    <th className="text-left p-2 font-medium">HD</th>
                    <th className="text-center p-2 font-medium">Early OT</th>
                    <th className="text-center p-2 font-medium">Paid Lunch</th>
                    <th className="text-left p-2 font-medium">Actual OT</th>
                    <th className="text-left p-2 font-medium">Total OT</th>
                    <th className="text-left p-2 font-medium">Pre-Appr OT</th>
                    <th className="text-left p-2 font-medium">Approved OT</th>
                    <th className="text-left p-2 font-medium">Allowance</th>
                    <th className="text-left p-2 font-medium">Remark</th>
                    <th className="text-center p-2 font-medium">Status</th>
                    <th className="text-center p-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{employee.employeeName}</td>
                      <td className="p-2">{employee.employeeNo}</td>
                      <td className="p-2">{employee.shift}</td>
                      <td className="p-2">
                        <div className="space-y-1">
                          {employee.clockIns.map((timeIn, index) => (
                            <div key={index} className="text-xs">
                              In: {timeIn} | Out: {employee.clockOuts[index] || 'N/A'}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-2">{employee.shiftHours}</td>
                      <td className="p-2">{employee.workingHours}</td>
                      <td className="p-2">{employee.hoursDifference}</td>
                      <td className="p-2 text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto ${employee.earlyOT ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                      </td>
                      <td className="p-2 text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto ${employee.paidLunch ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                      </td>
                      <td className="p-2">{employee.actualOT}</td>
                      <td className="p-2">{employee.totalOT}</td>
                      <td className="p-2">{employee.preApprOT}</td>
                      <td className="p-2">{employee.approvedOT}</td>
                      <td className="p-2">RM {employee.allowance.toFixed(2)}</td>
                      <td className="p-2">{getRemarkBadge(employee.remark)}</td>
                      <td className="p-2 text-center">
                        {employee.status === 'approved' ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEmployeeModal(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Employee Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Attendance Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee Name</label>
                    <p className="font-medium">{selectedEmployee.employeeName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee No</label>
                    <p className="font-medium">{selectedEmployee.employeeNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="font-medium">{selectedEmployee.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Section</label>
                    <p className="font-medium">{selectedEmployee.section}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shift</label>
                    <p className="font-medium">{selectedEmployee.shift}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Selected Date</label>
                  <p className="font-medium">{format(selectedDate, 'dd MMMM yyyy')}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Clock In/Out Details</label>
                  <div className="mt-2 space-y-2">
                    {selectedEmployee.clockIns.map((timeIn, index) => (
                      <div key={index} className="flex justify-between p-2 bg-muted rounded">
                        <span>Session {index + 1}</span>
                        <span>In: {timeIn} - Out: {selectedEmployee.clockOuts[index] || 'Not clocked out'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Overtime Details</label>
                  <div className="mt-2 grid grid-cols-2 gap-4 p-3 bg-muted rounded">
                    <div>
                      <span className="text-sm">Actual OT: {selectedEmployee.actualOT} hrs</span>
                    </div>
                    <div>
                      <span className="text-sm">Total OT: {selectedEmployee.totalOT} hrs</span>
                    </div>
                    <div>
                      <span className="text-sm">Pre-Approved OT: {selectedEmployee.preApprOT} hrs</span>
                    </div>
                    <div>
                      <span className="text-sm">Approved OT: {selectedEmployee.approvedOT} hrs</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
