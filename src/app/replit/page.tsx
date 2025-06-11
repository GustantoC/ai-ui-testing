"use client"
import { useEffect, useState } from "react";
import { format, addDays, subDays, isBefore, startOfToday } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  AlertTriangle,
  CalendarCheck,
  TrendingUp,
  Circle,
  CheckCircle,
  X,
} from "lucide-react";

// Dummy Data
const companies = [
  { id: 1, name: "Main Office" },
  { id: 2, name: "Subsidiary Co." },
];

const branches = [
  { id: 1, name: "Headquarters", companyId: 1 },
  { id: 2, name: "East Branch", companyId: 1 },
  { id: 3, name: "West Branch", companyId: 2 },
];

const departments = [
  { id: 1, name: "Human Resources", branchId: 1 },
  { id: 2, name: "Information Technology", branchId: 1 },
  { id: 3, name: "Finance", branchId: 2 },
  { id: 4, name: "Operations", branchId: 3 },
];

const sections = [
  { id: 1, name: "Recruitment", departmentId: 1 },
  { id: 2, name: "Payroll", departmentId: 1 },
  { id: 3, name: "Development", departmentId: 2 },
  { id: 4, name: "Support", departmentId: 2 },
];

const employees = [
  { id: 1, employeeNo: "EMP001", name: "Ahmad Rahman", companyId: 1, branchId: 1, departmentId: 2, sectionId: 3, shift: "09:00-18:00" },
  { id: 2, employeeNo: "EMP002", name: "Sarah Lee", companyId: 1, branchId: 1, departmentId: 1, sectionId: 1, shift: "08:30-17:30" },
  { id: 3, employeeNo: "EMP003", name: "Michael Chen", companyId: 1, branchId: 1, departmentId: 2, sectionId: 3, shift: "10:00-19:00" },
  { id: 4, employeeNo: "EMP004", name: "Diana Wong", companyId: 1, branchId: 2, departmentId: 3, sectionId: 2, shift: "09:00-18:00" },
  { id: 5, employeeNo: "EMP005", name: "James Kumar", companyId: 2, branchId: 3, departmentId: 4, sectionId: 4, shift: "08:00-17:00" },
];

const attendanceRecords = [
  {
    id: 1,
    employeeId: 1,
    date: "2025-06-11",
    dayIn: "08:45",
    lunchOut: "12:30",
    lunchIn: "13:30",
    dayOut: "18:15",
    shiftHours: 8.0,
    workingHours: 8.5,
    hoursDifference: 0.5,
    hasEarlyOT: true,
    hasPaidLunch: false,
    actualOT: 0.5,
    totalOT: 0.5,
    preApprOT: 0.5,
    approvedOT: 0.5,
    allowance: 25.0,
    remarks: [],
    status: "approved"
  },
  {
    id: 2,
    employeeId: 2,
    date: "2025-06-11",
    dayIn: "08:45",
    lunchOut: "12:00",
    lunchIn: "13:00",
    dayOut: "17:35",
    shiftHours: 8.0,
    workingHours: 7.8,
    hoursDifference: -0.2,
    hasEarlyOT: false,
    hasPaidLunch: true,
    actualOT: 0.0,
    totalOT: 0.0,
    preApprOT: 0.0,
    approvedOT: 0.0,
    allowance: 0.0,
    remarks: ["late", "deficit_hours"],
    status: "pending"
  },
  {
    id: 3,
    employeeId: 3,
    date: "2025-06-11",
    dayIn: "09:50",
    lunchOut: "13:00",
    lunchIn: "14:00",
    dayOut: "20:30",
    shiftHours: 8.0,
    workingHours: 9.7,
    hoursDifference: 1.7,
    hasEarlyOT: true,
    hasPaidLunch: false,
    actualOT: 1.5,
    totalOT: 1.7,
    preApprOT: 2.0,
    approvedOT: 1.5,
    allowance: 75.0,
    remarks: [],
    status: "approved"
  },
  {
    id: 4,
    employeeId: 4,
    date: "2025-06-11",
    dayIn: "09:20",
    lunchOut: "12:30",
    lunchIn: "13:45",
    dayOut: "17:45",
    shiftHours: 8.0,
    workingHours: 7.2,
    hoursDifference: -0.8,
    hasEarlyOT: false,
    hasPaidLunch: false,
    actualOT: 0.0,
    totalOT: 0.0,
    preApprOT: 0.0,
    approvedOT: 0.0,
    allowance: 0.0,
    remarks: ["lateness", "late_break_in", "early_out"],
    status: "pending"
  },
  {
    id: 5,
    employeeId: 5,
    date: "2025-06-11",
    dayIn: "07:45",
    lunchOut: "12:00",
    lunchIn: "13:00",
    dayOut: "19:00",
    shiftHours: 8.0,
    workingHours: 10.2,
    hoursDifference: 2.2,
    hasEarlyOT: true,
    hasPaidLunch: true,
    actualOT: 2.0,
    totalOT: 2.2,
    preApprOT: 2.5,
    approvedOT: 2.0,
    allowance: 100.0,
    remarks: [],
    status: "approved"
  }
];

// UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = "default",
  size = "default",
  className = "" 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "icon";
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" 
    : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeClasses = size === "icon" ? "h-9 w-9" : "px-4 py-2 h-9";

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Select = ({ 
  value, 
  onValueChange, 
  disabled = false, 
  placeholder, 
  children 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
  disabled?: boolean; 
  placeholder?: string;
  children: React.ReactNode;
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    disabled={disabled}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
  >
    {children}
  </select>
);

const Badge = ({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "destructive" | "outline";
}) => {
  const variantClasses = {
    default: "bg-gray-900 text-gray-50",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-500 text-red-50",
    outline: "border border-gray-200 text-gray-900"
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

const Dialog = ({ 
  open, 
  onClose, 
  children 
}: { 
  open: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-gray-900">
    {children}
  </h2>
);

export default function AttendanceStandalone() {
  useEffect(() => {
    document.title = 'Replit';
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const today = startOfToday();
  const dateString = format(selectedDate, "yyyy-MM-dd");

  // Filter data based on selections
  const getFilteredData = () => {
    const records = attendanceRecords.filter(record => record.date === dateString);
    
    return records.map(record => {
      const employee = employees.find(emp => emp.id === record.employeeId)!;
      const company = companies.find(comp => comp.id === employee.companyId)!;
      const branch = branches.find(br => br.id === employee.branchId)!;
      const department = departments.find(dept => dept.id === employee.departmentId)!;
      const section = sections.find(sect => sect.id === employee.sectionId)!;

      return {
        ...record,
        employee,
        company,
        branch,
        department,
        section,
      };
    }).filter(record => {
      if (selectedCompany !== "all" && record.company.id !== parseInt(selectedCompany)) return false;
      if (selectedBranch !== "all" && record.branch.id !== parseInt(selectedBranch)) return false;
      if (selectedDepartment !== "all" && record.department.id !== parseInt(selectedDepartment)) return false;
      if (selectedSection !== "all" && record.section.id !== parseInt(selectedSection)) return false;
      return true;
    });
  };

  const filteredRecords = getFilteredData();

  // Calculate summary
  const summary = {
    totalEmployees: filteredRecords.length,
    totalWorkingHours: Math.round(filteredRecords.reduce((sum, r) => sum + r.workingHours, 0) * 100) / 100,
    totalOvertime: Math.round(filteredRecords.reduce((sum, r) => sum + r.totalOT, 0) * 100) / 100,
    totalLateness: Math.round(filteredRecords
      .filter(r => r.remarks.includes("late") || r.remarks.includes("lateness"))
      .reduce((sum, r) => sum + Math.abs(r.hoursDifference), 0) * 100) / 100,
    totalShifts: filteredRecords.length,
    hoursDifference: Math.round(filteredRecords.reduce((sum, r) => sum + r.hoursDifference, 0) * 100) / 100,
  };

  // Get filter options based on selections
  const getFilterOptions = () => {
    const filteredBranches = selectedCompany !== "all" 
      ? branches.filter(b => b.companyId === parseInt(selectedCompany))
      : [];
    
    const filteredDepartments = selectedBranch !== "all"
      ? departments.filter(d => d.branchId === parseInt(selectedBranch))
      : [];
    
    const filteredSections = selectedDepartment !== "all"
      ? sections.filter(s => s.departmentId === parseInt(selectedDepartment))
      : [];

    return { filteredBranches, filteredDepartments, filteredSections };
  };

  const { filteredBranches, filteredDepartments, filteredSections } = getFilterOptions();

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subDays(selectedDate, 1) : addDays(selectedDate, 1);
    if (!isBefore(newDate, addDays(today, 1))) return;
    setSelectedDate(newDate);
  };

  const openModal = (record: any) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  const getRemarkBadgeVariant = (remark: string) => {
    switch (remark) {
      case "late":
      case "lateness":
        return "default";
      case "late_break_in":
        return "secondary";
      case "early_out":
      case "deficit_hours":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRemarkText = (remark: string) => {
    switch (remark) {
      case "late":
        return "Late";
      case "lateness":
        return "Lateness";
      case "late_break_in":
        return "Late Break In";
      case "early_out":
        return "Early Out";
      case "deficit_hours":
        return "Deficit Hours";
      default:
        return remark;
    }
  };

  const formatOutTimes = (record: any) => {
    const times = [];
    if (record.lunchOut) times.push(`${record.lunchOut} (Lunch Out)`);
    if (record.lunchIn) times.push(`${record.lunchIn} (Lunch In)`);
    if (record.dayOut) times.push(`${record.dayOut} (Day Out)`);
    return times;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Daily Attendance Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin User</span>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: "#245AA6" }}
              >
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Filters & Date Selection</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Date Picker with Navigation */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("prev")}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" style={{ color: "#245AA6" }} />
                <input
                  type="date"
                  value={dateString}
                  max={format(today, "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--focus-ring-color": "#245AA6" } as any}
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("next")}
                disabled={!isBefore(selectedDate, today)}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Company Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Company</label>
                <Select 
                  value={selectedCompany} 
                  onValueChange={(value) => {
                    setSelectedCompany(value);
                    setSelectedBranch("all");
                    setSelectedDepartment("all");
                    setSelectedSection("all");
                  }}
                >
                  <option value="all">All Companies</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id.toString()}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Branch</label>
                <Select 
                  value={selectedBranch} 
                  onValueChange={(value) => {
                    setSelectedBranch(value);
                    setSelectedDepartment("all");
                    setSelectedSection("all");
                  }}
                  disabled={selectedCompany === "all"}
                >
                  <option value="all">All Branches</option>
                  {filteredBranches.map((branch) => (
                    <option key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Department</label>
                <Select 
                  value={selectedDepartment} 
                  onValueChange={(value) => {
                    setSelectedDepartment(value);
                    setSelectedSection("all");
                  }}
                  disabled={selectedBranch === "all"}
                >
                  <option value="all">All Departments</option>
                  {filteredDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Section Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Section</label>
                <Select 
                  value={selectedSection} 
                  onValueChange={setSelectedSection}
                  disabled={selectedDepartment === "all"}
                >
                  <option value="all">All Sections</option>
                  {filteredSections.map((section) => (
                    <option key={section.id} value={section.id.toString()}>
                      {section.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5" style={{ color: "#245AA6" }} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-lg font-semibold text-gray-900">{summary.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Working Hours</p>
                  <p className="text-lg font-semibold text-gray-900">{summary.totalWorkingHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Overtime</p>
                  <p className="text-lg font-semibold text-gray-900">{summary.totalOvertime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Lateness</p>
                  <p className="text-lg font-semibold text-gray-900">{summary.totalLateness}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarCheck className="h-5 w-5" style={{ color: "#245AA6" }} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                  <p className="text-lg font-semibold text-gray-900">{summary.totalShifts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Hours Difference</p>
                  <p className={`text-lg font-semibold ${summary.hoursDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {summary.hoursDifference >= 0 ? '+' : ''}{summary.hoursDifference}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records - {format(selectedDate, "MMMM dd, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Employee Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Employee No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Shift</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">SH</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">WH</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">HD</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Early OT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Paid Lunch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Actual OT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Total OT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Pre-Appr OT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Approved OT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Allowance (MYR)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Remark</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr 
                      key={record.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => openModal(record)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.employee.employeeNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.employee.shift}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.dayIn || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          {formatOutTimes(record).map((time, index) => (
                            <div key={index} className="text-xs">{time}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.shiftHours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.workingHours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={record.hoursDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {record.hoursDifference >= 0 ? '+' : ''}{record.hoursDifference}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {record.hasEarlyOT ? (
                          <Circle className="h-4 w-4 text-yellow-500 fill-current mx-auto" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {record.hasPaidLunch ? (
                          <Circle className="h-4 w-4 text-yellow-500 fill-current mx-auto" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.actualOT}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.totalOT}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.preApprOT}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.approvedOT}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.allowance.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {record.remarks.map((remark, index) => (
                            <Badge key={index} variant={getRemarkBadgeVariant(remark)}>
                              {getRemarkText(remark)}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {record.status === "approved" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <Circle className="h-5 w-5 text-yellow-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        <Dialog open={modalOpen} onClose={closeModal}>
          {selectedRecord && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Attendance Details</DialogTitle>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={closeModal}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              <div className="px-6 py-4 space-y-6">
                {/* Employee Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Employee Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employee Name</p>
                      <p className="text-sm text-gray-900">{selectedRecord.employee.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employee No</p>
                      <p className="text-sm text-gray-900">{selectedRecord.employee.employeeNo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Company</p>
                      <p className="text-sm text-gray-900">{selectedRecord.company.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Branch</p>
                      <p className="text-sm text-gray-900">{selectedRecord.branch.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Department</p>
                      <p className="text-sm text-gray-900">{selectedRecord.department.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Section</p>
                      <p className="text-sm text-gray-900">{selectedRecord.section.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Shift</p>
                      <p className="text-sm text-gray-900">{selectedRecord.employee.shift}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Selected Date</p>
                      <p className="text-sm text-gray-900">{format(selectedDate, "MMMM dd, yyyy")}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendance Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Day In</p>
                      <p className="text-sm text-gray-900">{selectedRecord.dayIn || "Not recorded"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Day Out</p>
                      <p className="text-sm text-gray-900">{selectedRecord.dayOut || "Not recorded"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Lunch Out</p>
                      <p className="text-sm text-gray-900">{selectedRecord.lunchOut || "Not recorded"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Lunch In</p>
                      <p className="text-sm text-gray-900">{selectedRecord.lunchIn || "Not recorded"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Shift Hours</p>
                      <p className="text-sm text-gray-900">{selectedRecord.shiftHours}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Working Hours</p>
                      <p className="text-sm text-gray-900">{selectedRecord.workingHours}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Hours Difference</p>
                      <p className={`text-sm ${selectedRecord.hoursDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRecord.hoursDifference >= 0 ? '+' : ''}{selectedRecord.hoursDifference}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className={`text-sm ${selectedRecord.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedRecord.status === 'approved' ? 'Approved' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Overtime Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Actual OT</p>
                      <p className="text-sm text-gray-900">{selectedRecord.actualOT} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total OT</p>
                      <p className="text-sm text-gray-900">{selectedRecord.totalOT} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pre-Approved OT</p>
                      <p className="text-sm text-gray-900">{selectedRecord.preApprOT} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved OT</p>
                      <p className="text-sm text-gray-900">{selectedRecord.approvedOT} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Allowance</p>
                      <p className="text-sm text-gray-900">MYR {selectedRecord.allowance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Early OT</p>
                      <p className="text-sm text-gray-900">{selectedRecord.hasEarlyOT ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paid Lunch</p>
                      <p className="text-sm text-gray-900">{selectedRecord.hasPaidLunch ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {selectedRecord.remarks.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Remarks</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.remarks.map((remark: string, index: number) => (
                        <Badge key={index} variant={getRemarkBadgeVariant(remark)}>
                          {getRemarkText(remark)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </Dialog>
      </main>
    </div>
  );
}