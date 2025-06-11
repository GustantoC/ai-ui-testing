"use client"
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Hourglass } from 'lucide-react';
import dayjs from 'dayjs';

const employees = [
  {
    name: 'John Doe',
    no: 'EMP001',
    shift: 'Morning',
    ins: ['08:00'],
    outs: ['17:00'],
    sh: 9,
    wh: 8.5,
    hd: 0.5,
    earlyOt: true,
    paidLunch: true,
    actualOt: 1,
    totalOt: 2,
    preApprOt: 1,
    apprOt: 1,
    allowance: 30,
    remark: ['late', 'early out'],
    status: 'approved',
    company: 'Alpha',
    department: 'Sales',
    section: 'A'
  },
  // Add more employee data as needed
];

const DailyAttendancePage = () => {
  useEffect(() => {
    document.title = 'ChatGPT';
  }, []);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const incrementDate = (amount: number) => {
    const newDate = selectedDate.add(amount, 'day');
    if (newDate.isAfter(dayjs())) return;
    setSelectedDate(newDate);
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen text-[#245AA6]">
      <h1 className="text-2xl font-bold mb-4">Daily Attendance</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Select><SelectTrigger><SelectValue placeholder="Filter by Company" /></SelectTrigger><SelectContent><SelectItem value="Alpha">Alpha</SelectItem></SelectContent></Select>
        <Select><SelectTrigger><SelectValue placeholder="Filter by Branch" /></SelectTrigger><SelectContent><SelectItem value="HQ">HQ</SelectItem></SelectContent></Select>
        <Select><SelectTrigger><SelectValue placeholder="Filter by Department" /></SelectTrigger><SelectContent><SelectItem value="Sales">Sales</SelectItem></SelectContent></Select>
        <Select><SelectTrigger><SelectValue placeholder="Filter by Section" /></SelectTrigger><SelectContent><SelectItem value="A">A</SelectItem></SelectContent></Select>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Button variant="outline" onClick={() => incrementDate(-1)}><ChevronLeft /></Button>
        <Input type="date" value={selectedDate.format('YYYY-MM-DD')} onChange={e => {
          const newDate = dayjs(e.target.value);
          if (!newDate.isAfter(dayjs())) setSelectedDate(newDate);
        }} className="w-48" />
        <Button variant="outline" onClick={() => incrementDate(1)}><ChevronRight /></Button>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 flex gap-4">
          <div>Total WH: 8.5</div>
          <div>Total OT: 2</div>
          <div>Total Lateness: 1</div>
          <div>Total Shift: 1</div>
          <div>Total HD: 0.5</div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#245AA6] text-white">
              <th className="p-2 text-left">Employee Name</th>
              <th>Employee No</th>
              <th>Shift</th>
              <th>In</th>
              <th>Out</th>
              <th>SH</th>
              <th>WH</th>
              <th>HD</th>
              <th>Early OT</th>
              <th>Paid Lunch</th>
              <th>Actual OT</th>
              <th>Total OT</th>
              <th>Pre-Appr OT</th>
              <th>Approved OT</th>
              <th>Allowance (MYR)</th>
              <th>Remark</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                <td className="p-2">{emp.name}</td>
                <td>{emp.no}</td>
                <td>{emp.shift}</td>
                <td>{emp.ins.join(', ')}</td>
                <td>{emp.outs.join(', ')}</td>
                <td>{emp.sh}</td>
                <td>{emp.wh}</td>
                <td>{emp.hd}</td>
                <td>{emp.earlyOt && <Clock className="text-yellow-500 w-4 h-4 mx-auto" />}</td>
                <td>{emp.paidLunch && <Clock className="text-yellow-500 w-4 h-4 mx-auto" />}</td>
                <td>{emp.actualOt}</td>
                <td>{emp.totalOt}</td>
                <td>{emp.preApprOt}</td>
                <td>{emp.apprOt}</td>
                <td>{emp.allowance}</td>
                <td className="flex flex-wrap gap-1 justify-center">
                  {emp.remark.map((r, i) => <Badge key={i} variant="outline">{r}</Badge>)}
                </td>
                <td>{emp.status === 'approved' ? <CheckCircle className="text-green-500 w-4 h-4 mx-auto" /> : <Hourglass className="text-gray-500 w-4 h-4 mx-auto" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent>
          {selectedEmployee && (
            <div className="space-y-2 text-[#245AA6]">
              <h2 className="text-lg font-semibold">Attendance Detail</h2>
              <div>Name: {selectedEmployee.name}</div>
              <div>Employee No: {selectedEmployee.no}</div>
              <div>Company: {selectedEmployee.company}</div>
              <div>Department: {selectedEmployee.department}</div>
              <div>Section: {selectedEmployee.section}</div>
              <div>Shift: {selectedEmployee.shift}</div>
              <div>Date: {selectedDate.format('YYYY-MM-DD')}</div>
              <div>Ins: {selectedEmployee.ins.join(', ')}</div>
              <div>Outs: {selectedEmployee.outs.join(', ')}</div>
              <div>OT Details: Actual OT: {selectedEmployee.actualOt}, Approved OT: {selectedEmployee.apprOt}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyAttendancePage;
