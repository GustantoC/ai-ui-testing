"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Coffee, CheckCircle, AlertCircle, X, Filter } from 'lucide-react';

// Mock data for demonstration
const mockAttendanceData = [
  {
    id: 1,
    employeeName: "John Smith",
    employeeNo: "EMP001",
    company: "TechCorp",
    branch: "Main Branch",
    department: "IT",
    section: "Development",
    shift: "09:00-18:00",
    timeRecords: [
      { type: "in", time: "08:45" },
      { type: "out", time: "12:00" },
      { type: "in", time: "13:00" },
      { type: "out", time: "18:15" }
    ],
    shiftHour: 8,
    workingHour: 8.25,
    hoursDifference: 0.25,
    earlyOT: true,
    paidLunch: false,
    actualOT: 1.5,
    totalOT: 1.5,
    preApprOT: 1.0,
    approvedOT: 1.0,
    allowance: 50.00,
    remark: "early",
    status: "approved"
  },
  {
    id: 2,
    employeeName: "Sarah Johnson",
    employeeNo: "EMP002",
    company: "TechCorp",
    branch: "Main Branch",
    department: "HR",
    section: "Recruitment",
    shift: "09:00-18:00",
    timeRecords: [
      { type: "in", time: "09:15" },
      { type: "out", time: "12:00" },
      { type: "in", time: "13:00" },
      { type: "out", time: "18:00" }
    ],
    shiftHour: 8,
    workingHour: 7.75,
    hoursDifference: -0.25,
    earlyOT: false,
    paidLunch: true,
    actualOT: 0,
    totalOT: 0,
    preApprOT: 0,
    approvedOT: 0,
    allowance: 0,
    remark: "late",
    status: "pending"
  },
  {
    id: 3,
    employeeName: "Mike Chen",
    employeeNo: "EMP003",
    company: "TechCorp",
    branch: "Branch A",
    department: "Finance",
    section: "Accounting",
    shift: "08:00-17:00",
    timeRecords: [
      { type: "in", time: "08:00" },
      { type: "out", time: "12:00" },
      { type: "in", time: "13:30" },
      { type: "out", time: "17:00" }
    ],
    shiftHour: 8,
    workingHour: 7.5,
    hoursDifference: -0.5,
    earlyOT: false,
    paidLunch: false,
    actualOT: 0,
    totalOT: 0,
    preApprOT: 0,
    approvedOT: 0,
    allowance: 0,
    remark: "late break in",
    status: "approved"
  }
];

const DailyAttendancePage = () => {
  useEffect(() => {
    document.title = 'Claude';
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    company: '',
    branch: '',
    department: '',
    section: ''
  });
  const [groupBy, setGroupBy] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    return {
      companies: [...new Set(mockAttendanceData.map(emp => emp.company))],
      branches: [...new Set(mockAttendanceData.map(emp => emp.branch))],
      departments: [...new Set(mockAttendanceData.map(emp => emp.department))],
      sections: [...new Set(mockAttendanceData.map(emp => emp.section))]
    };
  }, []);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return mockAttendanceData.filter(emp => {
      return (
        (!filters.company || emp.company === filters.company) &&
        (!filters.branch || emp.branch === filters.branch) &&
        (!filters.department || emp.department === filters.department) &&
        (!filters.section || emp.section === filters.section)
      );
    });
  }, [filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalWorkingHours = filteredData.reduce((sum, emp) => sum + emp.workingHour, 0);
    const totalOvertime = filteredData.reduce((sum, emp) => sum + emp.totalOT, 0);
    const totalLateness = filteredData.filter(emp => emp.remark.includes('late')).length;
    const totalShift = filteredData.length;
    const totalHoursDifference = filteredData.reduce((sum, emp) => sum + emp.hoursDifference, 0);
    
    return {
      totalWorkingHours: totalWorkingHours.toFixed(2),
      totalOvertime: totalOvertime.toFixed(2),
      totalLateness,
      totalShift,
      totalHoursDifference: totalHoursDifference.toFixed(2)
    };
  }, [filteredData]);

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRemarkBadgeColor = (remark) => {
    if (remark.includes('late')) return 'bg-red-100 text-red-800';
    if (remark.includes('early')) return 'bg-green-100 text-green-800';
    if (remark.includes('deficit')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatTimeRecords = (records) => {
    return records.map((record, index) => (
      <span key={index} className={`inline-block px-2 py-1 rounded text-xs mr-1 mb-1 ${
        record.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {record.type.toUpperCase()}: {record.time}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Attendance</h1>
          <p className="text-gray-600">Manage and track employee attendance records</p>
        </div>

        {/* Filters and Date Picker */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filters */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" style={{ color: '#245AA6' }} />
                Filters & Grouping
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <select
                    value={filters.company}
                    onChange={(e) => handleFilterChange('company', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ focusRingColor: '#245AA6' }}
                  >
                    <option value="">All Companies</option>
                    {filterOptions.companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    value={filters.branch}
                    onChange={(e) => handleFilterChange('branch', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Branches</option>
                    {filterOptions.branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Departments</option>
                    {filterOptions.departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={filters.section}
                    onChange={(e) => handleFilterChange('section', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Sections</option>
                    {filterOptions.sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No Grouping</option>
                  <option value="company">Company</option>
                  <option value="branch">Branch</option>
                  <option value="department">Department</option>
                  <option value="section">Section</option>
                </select>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" style={{ color: '#245AA6' }} />
                Attendance Date
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleDateChange(-1)}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => handleDateChange(1)}
                  disabled={selectedDate.toDateString() === new Date().toDateString()}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{formatDate(selectedDate)}</p>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalWorkingHours}</div>
            <div className="text-sm text-gray-600">Total Working Hours</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalOvertime}</div>
            <div className="text-sm text-gray-600">Total Overtime</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalLateness}</div>
            <div className="text-sm text-gray-600">Total Lateness</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalShift}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold" style={{ color: '#245AA6' }}>{summaryStats.totalHoursDifference}</div>
            <div className="text-sm text-gray-600">Hours Difference</div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In/Out</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SH</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">WH</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">HD</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Early OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Lunch</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actual OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pre-Appr OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Approved OT</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Allowance (MYR)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openModal(employee)}
                  >
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                        <div className="text-sm text-gray-500">{employee.employeeNo}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{employee.shift}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {formatTimeRecords(employee.timeRecords)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">{employee.shiftHour}</td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">{employee.workingHour}</td>
                    <td className={`px-4 py-4 text-center text-sm font-medium ${employee.hoursDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {employee.hoursDifference > 0 ? '+' : ''}{employee.hoursDifference}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Clock className={`w-5 h-5 mx-auto ${employee.earlyOT ? 'text-yellow-500' : 'text-gray-300'}`} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Coffee className={`w-5 h-5 mx-auto ${employee.paidLunch ? 'text-yellow-500' : 'text-gray-300'}`} />
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">{employee.actualOT}</td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">{employee.totalOT}</td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">{employee.preApprOT}</td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">{employee.approvedOT}</td>
                    <td className="px-4 py-4 text-center text-sm text-gray-900">RM {employee.allowance.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRemarkBadgeColor(employee.remark)}`}>
                        {employee.remark}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {employee.status === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500 mx-auto" />
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-auto overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Attendance Details</h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employee Name</label>
                        <p className="text-gray-900">{selectedEmployee.employeeName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employee No</label>
                        <p className="text-gray-900">{selectedEmployee.employeeNo}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company</label>
                        <p className="text-gray-900">{selectedEmployee.company}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-gray-900">{selectedEmployee.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Section</label>
                        <p className="text-gray-900">{selectedEmployee.section}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date</label>
                        <p className="text-gray-900">{formatDate(selectedDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Shift</label>
                        <p className="text-gray-900">{selectedEmployee.shift}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Time Records</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formatTimeRecords(selectedEmployee.timeRecords)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Working Hours</label>
                        <p className="text-gray-900">{selectedEmployee.workingHour} hours</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Overtime Details</label>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-900">Actual OT: {selectedEmployee.actualOT} hours</p>
                          <p className="text-sm text-gray-900">Total OT: {selectedEmployee.totalOT} hours</p>
                          <p className="text-sm text-gray-900">Pre-Approved OT: {selectedEmployee.preApprOT} hours</p>
                          <p className="text-sm text-gray-900">Approved OT: {selectedEmployee.approvedOT} hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRemarkBadgeColor(selectedEmployee.remark)}`}>
                        {selectedEmployee.remark}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      {selectedEmployee.status === 'approved' ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Approved</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyAttendancePage;