"use client"
import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Users,
  Building,
  MapPin,
  Briefcase,
  Coffee,
  Zap
} from 'lucide-react';

// Mock data types
interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeNo: string;
  company: string;
  branch: string;
  department: string;
  section: string;
  shift: string;
  timeEntries: { in: string; out: string }[];
  shiftHours: number;
  workingHours: number;
  hoursDifference: number;
  hasEarlyOT: boolean;
  hasPaidLunch: boolean;
  actualOT: number;
  totalOT: number;
  preApprOT: number;
  approvedOT: number;
  allowance: number;
  remark: 'late' | 'lateness' | 'late break in' | 'early out' | 'deficit hours' | 'on time' | null;
  status: 'approved' | 'pending';
}

// Mock data
const mockData: AttendanceRecord[] = [
  {
    id: '1',
    employeeName: 'Ahmad Rahman',
    employeeNo: 'EMP001',
    company: 'TechCorp',
    branch: 'KL Main',
    department: 'IT',
    section: 'Development',
    shift: '9AM-6PM',
    timeEntries: [
      { in: '08:45', out: '12:00' },
      { in: '13:00', out: '18:30' }
    ],
    shiftHours: 8,
    workingHours: 8.25,
    hoursDifference: 0.25,
    hasEarlyOT: true,
    hasPaidLunch: false,
    actualOT: 0.5,
    totalOT: 0.5,
    preApprOT: 1,
    approvedOT: 0.5,
    allowance: 25.50,
    remark: 'on time',
    status: 'approved'
  },
  {
    id: '2',
    employeeName: 'Siti Nurhaliza',
    employeeNo: 'EMP002',
    company: 'TechCorp',
    branch: 'KL Main',
    department: 'HR',
    section: 'Recruitment',
    shift: '9AM-6PM',
    timeEntries: [
      { in: '09:15', out: '12:00' },
      { in: '13:00', out: '18:00' }
    ],
    shiftHours: 8,
    workingHours: 7.75,
    hoursDifference: -0.25,
    hasEarlyOT: false,
    hasPaidLunch: true,
    actualOT: 0,
    totalOT: 0,
    preApprOT: 0,
    approvedOT: 0,
    allowance: 0,
    remark: 'late',
    status: 'pending'
  },
  {
    id: '3',
    employeeName: 'Raj Kumar',
    employeeNo: 'EMP003',
    company: 'TechCorp',
    branch: 'Penang',
    department: 'Finance',
    section: 'Accounting',
    shift: '8AM-5PM',
    timeEntries: [
      { in: '07:50', out: '12:00' },
      { in: '13:00', out: '17:45' }
    ],
    shiftHours: 8,
    workingHours: 8.75,
    hoursDifference: 0.75,
    hasEarlyOT: true,
    hasPaidLunch: false,
    actualOT: 0.75,
    totalOT: 0.75,
    preApprOT: 1,
    approvedOT: 0.75,
    allowance: 37.50,
    remark: null,
    status: 'approved'
  }
];

const companies = ['All', 'TechCorp', 'DataSoft', 'CloudSys'];
const branches = ['All', 'KL Main', 'Penang', 'JB Branch'];
const departments = ['All', 'IT', 'HR', 'Finance', 'Operations'];
const sections = ['All', 'Development', 'Recruitment', 'Accounting', 'Support'];

function App() {
  useEffect(() => {
    document.title = 'Bolt New ';
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    company: 'All',
    branch: 'All',
    department: 'All',
    section: 'All'
  });
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return mockData.filter(record => {
      return (filters.company === 'All' || record.company === filters.company) &&
        (filters.branch === 'All' || record.branch === filters.branch) &&
        (filters.department === 'All' || record.department === filters.department) &&
        (filters.section === 'All' || record.section === filters.section);
    });
  }, [filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const stats = filteredData.reduce((acc, record) => ({
      totalWorkingHours: acc.totalWorkingHours + record.workingHours,
      totalOvertime: acc.totalOvertime + record.totalOT,
      totalLateness: acc.totalLateness + (record.remark === 'late' || record.remark === 'lateness' ? 1 : 0),
      totalShifts: acc.totalShifts + 1,
      totalHoursDifference: acc.totalHoursDifference + Math.abs(record.hoursDifference),
      totalAllowance: acc.totalAllowance + record.allowance,
      approvedCount: acc.approvedCount + (record.status === 'approved' ? 1 : 0),
      pendingCount: acc.pendingCount + (record.status === 'pending' ? 1 : 0)
    }), {
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

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
      // Don't allow future dates
      if (newDate > new Date()) return;
    }
    setSelectedDate(newDate);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-MY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRemarkBadge = (remark: AttendanceRecord['remark']) => {
    if (!remark) return null;

    const badgeColors = {
      'late': 'bg-red-100 text-red-800',
      'lateness': 'bg-red-100 text-red-800',
      'late break in': 'bg-orange-100 text-orange-800',
      'early out': 'bg-yellow-100 text-yellow-800',
      'deficit hours': 'bg-purple-100 text-purple-800',
      'on time': 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColors[remark]}`}>
        {remark}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#245AA6' }}>
            Daily Attendance Management
          </h1>
          <p className="text-gray-600">Manage and track employee attendance records</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="mr-2" size={20} style={{ color: '#245AA6' }} />
            Filter & Group By
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building size={16} className="inline mr-1" />
                Company
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
              >
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Branch
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
              >
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={16} className="inline mr-1" />
                Department
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Section
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.section}
                onChange={(e) => handleFilterChange('section', e.target.value)}
              >
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" size={20} style={{ color: '#245AA6' }} />
            Attendance Date
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => navigateDate('next')}
              disabled={selectedDate.toDateString() === new Date().toDateString()}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Selected: {formatDate(selectedDate)}
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Working Hours</p>
                <p className="text-2xl font-bold" style={{ color: '#245AA6' }}>
                  {summaryStats.totalWorkingHours.toFixed(1)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Overtime</p>
                <p className="text-2xl font-bold text-orange-600">
                  {summaryStats.totalOvertime.toFixed(1)}h
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
                <p className="text-2xl font-bold text-red-600">
                  {summaryStats.totalLateness}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Allowance</p>
                <p className="text-2xl font-bold text-green-600">
                  RM {summaryStats.totalAllowance.toFixed(2)}
                </p>
              </div>
              <div className="text-green-400 font-bold text-lg">RM</div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Attendance Records</h2>
            <p className="text-sm text-gray-600">{filteredData.length} employees found</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In/Out</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SH</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WH</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HD</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Early OT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Lunch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual OT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total OT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pre-Appr OT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved OT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.employeeNo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.shift}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        {record.timeEntries.map((entry, index) => (
                          <div key={index} className="flex space-x-2">
                            <span className="text-green-600">{entry.in}</span>
                            <span>-</span>
                            <span className="text-red-600">{entry.out}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.shiftHours}h
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.workingHours}h
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={record.hoursDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {record.hoursDifference > 0 ? '+' : ''}{record.hoursDifference}h
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className={`w-6 h-6 rounded-full border-2 ${record.hasEarlyOT ? 'bg-yellow-400 border-yellow-500' : 'bg-gray-200 border-gray-300'}`}>
                        {record.hasEarlyOT && <div className="w-full h-full rounded-full bg-yellow-400"></div>}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className={`w-6 h-6 rounded-full border-2 ${record.hasPaidLunch ? 'bg-yellow-400 border-yellow-500' : 'bg-gray-200 border-gray-300'}`}>
                        {record.hasPaidLunch && <Coffee size={14} className="text-yellow-700 m-auto" />}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.actualOT}h
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.totalOT}h
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.preApprOT}h
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.approvedOT}h
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      RM {record.allowance.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getRemarkBadge(record.remark)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {record.status === 'approved' ? (
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
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold" style={{ color: '#245AA6' }}>
                  Attendance Details
                </h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Employee Information */}
                <div>
                  <h4 className="text-md font-semibold mb-3 text-gray-900">Employee Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Employee Name</label>
                      <p className="text-sm text-gray-900">{selectedRecord.employeeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Employee No</label>
                      <p className="text-sm text-gray-900">{selectedRecord.employeeNo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company</label>
                      <p className="text-sm text-gray-900">{selectedRecord.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Branch</label>
                      <p className="text-sm text-gray-900">{selectedRecord.branch}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Department</label>
                      <p className="text-sm text-gray-900">{selectedRecord.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Section</label>
                      <p className="text-sm text-gray-900">{selectedRecord.section}</p>
                    </div>
                  </div>
                </div>

                {/* Attendance Details */}
                <div>
                  <h4 className="text-md font-semibold mb-3 text-gray-900">Attendance Details</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Shift</label>
                      <p className="text-sm text-gray-900">{selectedRecord.shift}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedDate)}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold mb-2 text-gray-700">Time Entries</h5>
                    <div className="space-y-2">
                      {selectedRecord.timeEntries.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">Entry #{index + 1}:</span>
                          <span className="text-sm font-medium text-green-600">In: {entry.in}</span>
                          <span className="text-sm font-medium text-red-600">Out: {entry.out}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Working Hours & Overtime */}
                <div>
                  <h4 className="text-md font-semibold mb-3 text-gray-900">Working Hours & Overtime</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Shift Hours</label>
                      <p className="text-sm text-gray-900">{selectedRecord.shiftHours}h</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Working Hours</label>
                      <p className="text-sm text-gray-900">{selectedRecord.workingHours}h</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Hours Difference</label>
                      <p className={`text-sm ${selectedRecord.hoursDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRecord.hoursDifference > 0 ? '+' : ''}{selectedRecord.hoursDifference}h
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Actual OT</label>
                      <p className="text-sm text-gray-900">{selectedRecord.actualOT}h</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Total OT</label>
                      <p className="text-sm text-gray-900">{selectedRecord.totalOT}h</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approved OT</label>
                      <p className="text-sm text-gray-900">{selectedRecord.approvedOT}h</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h4 className="text-md font-semibold mb-3 text-gray-900">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Early OT</label>
                      <p className="text-sm text-gray-900">{selectedRecord.hasEarlyOT ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Paid Lunch</label>
                      <p className="text-sm text-gray-900">{selectedRecord.hasPaidLunch ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Allowance</label>
                      <p className="text-sm text-gray-900">RM {selectedRecord.allowance.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="flex items-center space-x-2">
                        {selectedRecord.status === 'approved' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm text-gray-900 capitalize">{selectedRecord.status}</span>
                      </div>
                    </div>
                  </div>
                  {selectedRecord.remark && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600">Remark</label>
                      <div className="mt-1">
                        {getRemarkBadge(selectedRecord.remark)}
                      </div>
                    </div>
                  )}
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