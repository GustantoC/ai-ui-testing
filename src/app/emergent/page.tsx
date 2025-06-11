"use client"
import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  X,
  Filter,
  User
} from "lucide-react";
import { format, subDays, addDays, isAfter, isSameDay } from "date-fns";
import "./App.css";

// Mock data for attendance
const mockAttendanceData = [
  {
    id: 1,
    employeeName: "Ahmad Hassan",
    employeeNo: "EMP001",
    company: "Company A",
    branch: "Branch A",
    department: "Engineering",
    section: "Software Dev",
    shift: "Morning (08:00-17:00)",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    entries: [
      { type: "in", time: "07:45" },
      { type: "out", time: "12:00" },
      { type: "in", time: "13:00" },
      { type: "out", time: "17:30" }
    ],
    shiftHours: 8.0,
    workingHours: 8.25,
    hoursDifference: 0.25,
    earlyOT: true,
    paidLunch: false,
    actualOT: 0.5,
    totalOT: 0.5,
    preApprOT: 0.5,
    approvedOT: 0.5,
    allowance: 25.50,
    remark: "Early In",
    status: "approved"
  },
  {
    id: 2,
    employeeName: "Sarah Lee",
    employeeNo: "EMP002",
    company: "Company A",
    branch: "Branch B",
    department: "HR",
    section: "Recruitment",
    shift: "Morning (08:00-17:00)",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    entries: [
      { type: "in", time: "08:15" },
      { type: "out", time: "12:00" },
      { type: "in", time: "13:00" },
      { type: "out", time: "17:00" }
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
    allowance: 15.00,
    remark: "Late",
    status: "pending"
  },
  {
    id: 3,
    employeeName: "David Wong",
    employeeNo: "EMP003",
    company: "Company B",
    branch: "Branch A",
    department: "Sales",
    section: "Business Dev",
    shift: "Afternoon (14:00-23:00)",
    shiftStart: "14:00",
    shiftEnd: "23:00",
    entries: [
      { type: "in", time: "13:45" },
      { type: "out", time: "18:00" },
      { type: "in", time: "19:00" },
      { type: "out", time: "23:45" }
    ],
    shiftHours: 8.0,
    workingHours: 8.75,
    hoursDifference: 0.75,
    earlyOT: true,
    paidLunch: false,
    actualOT: 0.75,
    totalOT: 0.75,
    preApprOT: 1.0,
    approvedOT: 0.75,
    allowance: 35.25,
    remark: "Overtime",
    status: "approved"
  },
  {
    id: 4,
    employeeName: "Maria Santos",
    employeeNo: "EMP004",
    company: "Company A",
    branch: "Branch A",
    department: "Finance",
    section: "Accounting",
    shift: "Morning (08:00-17:00)",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    entries: [
      { type: "in", time: "08:00" },
      { type: "out", time: "16:30" }
    ],
    shiftHours: 8.0,
    workingHours: 7.5,
    hoursDifference: -0.5,
    earlyOT: false,
    paidLunch: false,
    actualOT: 0,
    totalOT: 0,
    preApprOT: 0,
    approvedOT: 0,
    allowance: 0,
    remark: "Early Out",
    status: "pending"
  },
  {
    id: 5,
    employeeName: "James Chen",
    employeeNo: "EMP005",
    company: "Company B",
    branch: "Branch B",
    department: "Engineering",
    section: "QA",
    shift: "Morning (08:00-17:00)",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    entries: [
      { type: "in", time: "07:30" },
      { type: "out", time: "12:00" },
      { type: "in", time: "13:00" },
      { type: "out", time: "18:00" }
    ],
    shiftHours: 8.0,
    workingHours: 9.5,
    hoursDifference: 1.5,
    earlyOT: true,
    paidLunch: true,
    actualOT: 1.5,
    totalOT: 1.5,
    preApprOT: 2.0,
    approvedOT: 1.5,
    allowance: 45.75,
    remark: "Extended Hours",
    status: "approved"
  },
  {
    id: 6,
    employeeName: "Lisa Kumar",
    employeeNo: "EMP006",
    company: "Company A",
    branch: "Branch B",
    department: "Marketing",
    section: "Digital",
    shift: "Morning (08:00-17:00)",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    entries: [
      { type: "in", time: "08:45" },
      { type: "out", time: "12:15" },
      { type: "in", time: "13:45" },
      { type: "out", time: "17:00" }
    ],
    shiftHours: 8.0,
    workingHours: 6.75,
    hoursDifference: -1.25,
    earlyOT: false,
    paidLunch: false,
    actualOT: 0,
    totalOT: 0,
    preApprOT: 0,
    approvedOT: 0,
    allowance: 0,
    remark: "Late Break In",
    status: "pending"
  },
  {
    id: 7,
    employeeName: "Robert Taylor",
    employeeNo: "EMP007",
    company: "Company B",
    branch: "Branch A",
    department: "Operations",
    section: "Logistics",
    shift: "Night (22:00-06:00)",
    shiftStart: "22:00",
    shiftEnd: "06:00",
    entries: [
      { type: "in", time: "21:45" },
      { type: "out", time: "02:00" },
      { type: "in", time: "02:30" },
      { type: "out", time: "06:15" }
    ],
    shiftHours: 8.0,
    workingHours: 8.0,
    hoursDifference: 0,
    earlyOT: true,
    paidLunch: true,
    actualOT: 0.25,
    totalOT: 0.25,
    preApprOT: 0.5,
    approvedOT: 0.25,
    allowance: 12.50,
    remark: "Night Shift",
    status: "approved"
  },
  {
    id: 8,
    employeeName: "Emily Davis",
    employeeNo: "EMP008",
    company: "Company A",
    branch: "Branch A",
    department: "HR",
    section: "Admin",
    shift: "Morning (08:00-17:00)",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    entries: [
      { type: "in", time: "08:00" },
      { type: "out", time: "12:00" },
      { type: "in", time: "13:00" },
      { type: "out", time: "17:00" }
    ],
    shiftHours: 8.0,
    workingHours: 8.0,
    hoursDifference: 0,
    earlyOT: false,
    paidLunch: false,
    actualOT: 0,
    totalOT: 0,
    preApprOT: 0,
    approvedOT: 0,
    allowance: 0,
    remark: "On Time",
    status: "approved"
  },
  {
    id: 9,
    employeeName: "Michael Brown",
    employeeNo: "EMP009",
    company: "Company B",
    branch: "Branch B",
    department: "Finance",
    section: "Treasury",
    shift: "Morning (08:00-17:00)",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    entries: [
      { type: "in", time: "09:30" },
      { type: "out", time: "12:00" },
      { type: "in", time: "13:00" },
      { type: "out", time: "19:00" }
    ],
    shiftHours: 8.0,
    workingHours: 8.5,
    hoursDifference: 0.5,
    earlyOT: false,
    paidLunch: false,
    actualOT: 0.5,
    totalOT: 0.5,
    preApprOT: 0.5,
    approvedOT: 0.5,
    allowance: 22.75,
    remark: "Lateness",
    status: "pending"
  },
  {
    id: 10,
    employeeName: "Jennifer Wilson",
    employeeNo: "EMP010",
    company: "Company A",
    branch: "Branch B",
    department: "Engineering",
    section: "DevOps",
    shift: "Flexible (09:00-18:00)",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    entries: [
      { type: "in", time: "08:30" },
      { type: "out", time: "12:30" },
      { type: "in", time: "13:30" },
      { type: "out", time: "18:30" }
    ],
    shiftHours: 8.0,
    workingHours: 9.0,
    hoursDifference: 1.0,
    earlyOT: true,
    paidLunch: true,
    actualOT: 1.0,
    totalOT: 1.0,
    preApprOT: 1.0,
    approvedOT: 1.0,
    allowance: 38.50,
    remark: "Flexible Hours",
    status: "approved"
  }
];

interface Employee {
  id: number;
  employeeName: string;
  employeeNo: string;
  company: string;
  branch: string;
  department: string;
  section: string;
  shift: string;
  timeRecords: Array<{ type: string; time: string }>;
  shiftHour: number;
  workingHour: number;
  hoursDifference: number;
  earlyOT: boolean;
  paidLunch: boolean;
  actualOT: number;
  totalOT: number;
  preApprOT: number;
  approvedOT: number;
  allowance: number;
  remark: string;
  status: string;
  entries?: Array<any>;
  shiftHours?: number;
  workingHours?: number;
}

function App() {
  useEffect(() => {
    document.title = 'Emergent ';
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    branch: "",
    department: "",
    section: ""
  });
  
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return mockAttendanceData.filter(employee => {
      return (
        (!filters.company || employee.company === filters.company) &&
        (!filters.branch || employee.branch === filters.branch) &&
        (!filters.department || employee.department === filters.department) &&
        (!filters.section || employee.section === filters.section)
      );
    });
  }, [filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const stats = filteredData.reduce((acc, employee) => {
      acc.totalEmployees += 1;
      acc.totalWorkingHours += employee.workingHours;
      acc.totalOvertime += employee.totalOT;
      acc.totalLateness += employee.remark.includes('Late') || employee.remark.includes('Lateness') ? 1 : 0;
      acc.totalShifts += 1;
      acc.totalHoursDifference += Math.abs(employee.hoursDifference);
      acc.totalAllowance += employee.allowance;
      acc.approvedCount += employee.status === 'approved' ? 1 : 0;
      acc.pendingCount += employee.status === 'pending' ? 1 : 0;
      return acc;
    }, {
      totalEmployees: 0,
      totalWorkingHours: 0,
      totalOvertime: 0,
      totalLateness: 0,
      totalShifts: 0,
      totalHoursDifference: 0,
      totalAllowance: 0,
      approvedCount: 0,
      pendingCount: 0
    });
    return stats;
  }, [filteredData]);

  // Get unique filter options
  const getUniqueOptions = (field) => {
    return [...new Set(mockAttendanceData.map(item => item[field]))];
  };

  const handleDateChange = (days) => {
    const newDate = days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days));
    if (!isAfter(newDate, new Date())) {
      setSelectedDate(newDate);
    }
  };

  const handleDateSelect = (event) => {
    const newDate = new Date(event.target.value);
    if (!isAfter(newDate, new Date())) {
      setSelectedDate(newDate);
      setShowDatePicker(false);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formatDateForInput = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const getRemarkBadge = (remark) => {
    const badgeClasses = {
      "Late": "bg-red-100 text-red-800 border border-red-200",
      "Lateness": "bg-red-100 text-red-800 border border-red-200",
      "Late Break In": "bg-orange-100 text-orange-800 border border-orange-200",
      "Early Out": "bg-yellow-100 text-yellow-800 border border-yellow-200",
      "Early In": "bg-green-100 text-green-800 border border-green-200",
      "On Time": "bg-blue-100 text-blue-800 border border-blue-200",
      "Overtime": "bg-purple-100 text-purple-800 border border-purple-200",
      "Extended Hours": "bg-indigo-100 text-indigo-800 border border-indigo-200",
      "Night Shift": "bg-gray-100 text-gray-800 border border-gray-200",
      "Flexible Hours": "bg-teal-100 text-teal-800 border border-teal-200"
    };

    const badgeClass = badgeClasses[remark] || "bg-gray-100 text-gray-800 border border-gray-200";

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
        {remark}
      </span>
    );
  };

  const formatEntries = (entries) => {
    return entries.map((entry, index) => (
      <span key={index} className="text-sm">
        {entry.type === 'in' ? '→' : '←'} {entry.time}
        {index < entries.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">
            Daily Attendance Report
          </h1>
          
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-2 text-white rounded-lg transition-all duration-200 hover:opacity-80"
              style={{ backgroundColor: '#245AA6' }}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="relative" ref={datePickerRef}>
              <div 
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={toggleDatePicker}
              >
                <Calendar size={18} className="text-gray-500" />
                <span className="font-medium text-gray-900">
                  {format(selectedDate, 'dd MMM yyyy')}
                </span>
              </div>
              
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-10 p-4 min-w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Select Date</h3>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    type="date"
                    value={formatDateForInput(selectedDate)}
                    onChange={handleDateSelect}
                    max={formatDateForInput(new Date())}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ '--tw-ring-color': '#245AA6' } as React.CSSProperties}
                  />
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => {
                        setSelectedDate(new Date());
                        setShowDatePicker(false);
                      }}
                      className="px-3 py-1 text-sm text-white rounded-md transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#245AA6' }}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => handleDateChange(1)}
              disabled={isSameDay(selectedDate, new Date())}
              className={`p-2 text-white rounded-lg transition-all duration-200 ${
                isSameDay(selectedDate, new Date()) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:opacity-80'
              }`}
              style={{ backgroundColor: '#245AA6' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={18} style={{ color: '#245AA6' }} />
            <h2 className="text-lg font-semibold text-gray-900">Filter & Group By</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <select
                value={filters.company}
                onChange={(e) => setFilters({...filters, company: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ '--tw-ring-color': '#245AA6' } as React.CSSProperties}
              >
                <option value="">All Companies</option>
                {getUniqueOptions('company').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                value={filters.branch}
                onChange={(e) => setFilters({...filters, branch: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ '--tw-ring-color': '#245AA6' } as React.CSSProperties}
              >
                <option value="">All Branches</option>
                {getUniqueOptions('branch').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ '--tw-ring-color': '#245AA6' } as React.CSSProperties}
              >
                <option value="">All Departments</option>
                {getUniqueOptions('department').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                value={filters.section}
                onChange={(e) => setFilters({...filters, section: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ '--tw-ring-color': '#245AA6' } as React.CSSProperties}
              >
                <option value="">All Sections</option>
                {getUniqueOptions('section').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalEmployees}</div>
              <div className="text-xs text-gray-600">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalWorkingHours.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Working Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalOvertime.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Total OT</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summaryStats.totalLateness}</div>
              <div className="text-xs text-gray-600">Late Cases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalShifts}</div>
              <div className="text-xs text-gray-600">Total Shifts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{summaryStats.totalHoursDifference.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Hours Diff</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">RM {summaryStats.totalAllowance.toFixed(2)}</div>
              <div className="text-xs text-gray-600">Allowances</div>
            </div>
            <div className="text-center">
              <div className="text-sm">
                <span className="text-green-600 font-bold">{summaryStats.approvedCount}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-orange-600 font-bold">{summaryStats.pendingCount}</span>
              </div>
              <div className="text-xs text-gray-600">Approved/Pending</div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: '#245AA6' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Emp No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Shift</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">In/Out</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">SH</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">WH</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">HD</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Early OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Paid Lunch</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actual OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Total OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Pre-Appr OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Approved OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Allowance</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Remark</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((employee, index) => (
                  <tr 
                    key={employee.id} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                    onClick={() => openModal(employee)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: '#245AA6' }}>
                            {employee.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.employeeNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{employee.shift}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatEntries(employee.entries)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{employee.shiftHours}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{employee.workingHours}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-center font-medium ${
                      employee.hoursDifference > 0 ? 'text-green-600' : employee.hoursDifference < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {employee.hoursDifference > 0 ? '+' : ''}{employee.hoursDifference}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className={`w-6 h-6 rounded-full mx-auto ${employee.earlyOT ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className={`w-6 h-6 rounded-full mx-auto ${employee.paidLunch ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{employee.actualOT}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{employee.totalOT}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{employee.preApprOT}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{employee.approvedOT}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium">
                      RM {employee.allowance.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {getRemarkBadge(employee.remark)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {employee.status === 'approved' ? (
                        <CheckCircle size={20} className="text-green-500 mx-auto" />
                      ) : (
                        <AlertCircle size={20} className="text-orange-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Attendance Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User size={18} className="mr-2" style={{ color: '#245AA6' }} />
                      Employee Information
                    </h3>
                    <div className="space-y-2">
                      <div><span className="font-medium">Name:</span> {selectedEmployee.employeeName}</div>
                      <div><span className="font-medium">Employee No:</span> {selectedEmployee.employeeNo}</div>
                      <div><span className="font-medium">Company:</span> {selectedEmployee.company}</div>
                      <div><span className="font-medium">Branch:</span> {selectedEmployee.branch}</div>
                      <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                      <div><span className="font-medium">Section:</span> {selectedEmployee.section}</div>
                    </div>
                  </div>

                  {/* Shift Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Clock size={18} className="mr-2" style={{ color: '#245AA6' }} />
                      Shift Information
                    </h3>
                    <div className="space-y-2">
                      <div><span className="font-medium">Shift:</span> {selectedEmployee.shift}</div>
                      <div><span className="font-medium">Date:</span> {format(selectedDate, 'dd MMM yyyy')}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedEmployee.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Details */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Time Entries</h4>
                        <div className="space-y-1">
                          {selectedEmployee?.entries?.map((entry, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                entry.type === 'in' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {entry.type.toUpperCase()}
                              </span>
                              <span className="text-sm">{entry.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Working Hours</h4>
                        <div className="space-y-1 text-sm">
                          <div>Shift Hours: {selectedEmployee.shiftHours}</div>
                          <div>Working Hours: {selectedEmployee.workingHours}</div>
                          <div className={`font-medium ${
                            selectedEmployee.hoursDifference > 0 ? 'text-green-600' : 
                            selectedEmployee.hoursDifference < 0 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            Hours Difference: {selectedEmployee.hoursDifference > 0 ? '+' : ''}{selectedEmployee.hoursDifference}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overtime Details */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Overtime Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">Actual OT</div>
                        <div className="text-lg font-semibold" style={{ color: '#245AA6' }}>{selectedEmployee.actualOT}h</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Total OT</div>
                        <div className="text-lg font-semibold" style={{ color: '#245AA6' }}>{selectedEmployee.totalOT}h</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Pre-Approved OT</div>
                        <div className="text-lg font-semibold" style={{ color: '#245AA6' }}>{selectedEmployee.preApprOT}h</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Approved OT</div>
                        <div className="text-lg font-semibold" style={{ color: '#245AA6' }}>{selectedEmployee.approvedOT}h</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${selectedEmployee.earlyOT ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Early OT</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${selectedEmployee.paidLunch ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Paid Lunch</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Allowance and Remarks */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Allowance</h3>
                    <div className="text-2xl font-bold text-green-600">
                      RM {selectedEmployee.allowance.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Remark</h3>
                    {getRemarkBadge(selectedEmployee.remark)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;