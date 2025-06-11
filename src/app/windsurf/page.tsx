"use client";
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { format, addDays, subDays } from 'date-fns';
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  LunchDining as LunchDiningIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface AttendanceData {
  employeeName: string;
  employeeNo: string;
  shift: string;
  ins: string[];
  outs: string[];
  shiftHours: number;
  workingHours: number;
  hoursDifference: number;
  earlyOT: boolean;
  paidLunch: boolean;
  actualOT: number;
  totalOT: number;
  preApprOT: number;
  approvedOT: number;
  allowance: number;
  remarks: string[];
  status: 'approved' | 'pending';
}

const mockData: AttendanceData[] = [
  {
    employeeName: 'John Doe',
    employeeNo: 'E001',
    shift: 'Day Shift',
    ins: ['08:00', '13:30'],
    outs: ['12:00', '17:30'],
    shiftHours: 8,
    workingHours: 8.5,
    hoursDifference: 0.5,
    earlyOT: true,
    paidLunch: false,
    actualOT: 0.5,
    totalOT: 0.5,
    preApprOT: 0,
    approvedOT: 0.5,
    allowance: 50,
    remarks: ['late'],
    status: 'approved',
  },
  // Add more mock data as needed
];

const AttendancePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Windsurf ';
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('company');
  const [selectedGroup, setSelectedGroup] = useState('department');
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceData | null>(null);

  const handleDateChange = (direction: 'prev' | 'next') => {
    setSelectedDate((prev) => {
      const newDate = direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1);
      return newDate;
    });
  };

  const getAttendanceSummary = (data: AttendanceData[]) => {
    return {
      totalWorkingHours: data.reduce((sum, item) => sum + item.workingHours, 0),
      totalOvertime: data.reduce((sum, item) => sum + item.totalOT, 0),
      totalLateness: data.filter((item) => item.remarks.includes('late')).length,
      totalShift: data.length,
      totalHoursDifference: data.reduce((sum, item) => sum + item.hoursDifference, 0),
    };
  };

  const filteredData = mockData;
  const attendanceSummary = getAttendanceSummary(filteredData);

  const handleAttendanceClick = (attendance: AttendanceData) => {
    setSelectedAttendance(attendance);
  };

  const handleCloseModal = () => {
    setSelectedAttendance(null);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ArrowLeftIcon />}
              onClick={() => handleDateChange('prev')}
            >
              Previous Day
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              {format(selectedDate, 'PPP')}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              endIcon={<ArrowRightIcon />}
              onClick={() => handleDateChange('next')}
            >
              Next Day
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter By</InputLabel>
              <Select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as string)}
                label="Filter By"
              >
                <MenuItem value="company">Company</MenuItem>
                <MenuItem value="branch">Branch</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="section">Section</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Group By</InputLabel>
              <Select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value as string)}
                label="Group By"
              >
                <MenuItem value="company">Company</MenuItem>
                <MenuItem value="branch">Branch</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="section">Section</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Chip
              label={`Total Working Hours: ${attendanceSummary.totalWorkingHours.toFixed(2)}h`}
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Chip
              label={`Total Overtime: ${attendanceSummary.totalOvertime.toFixed(2)}h`}
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Chip
              label={`Total Lateness: ${attendanceSummary.totalLateness}`}
              color="error"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Chip
              label={`Total Hours Difference: ${attendanceSummary.totalHoursDifference.toFixed(2)}h`}
              color="warning"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee No</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>In</TableCell>
              <TableCell>Out</TableCell>
              <TableCell>SH</TableCell>
              <TableCell>WH</TableCell>
              <TableCell>HD</TableCell>
              <TableCell>Early OT</TableCell>
              <TableCell>Paid Lunch</TableCell>
              <TableCell>Actual OT</TableCell>
              <TableCell>Total OT</TableCell>
              <TableCell>Pre-Appr OT</TableCell>
              <TableCell>Approved OT</TableCell>
              <TableCell>Allowance (MYR)</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((attendance) => (
              <TableRow
                key={attendance.employeeNo}
                onClick={() => handleAttendanceClick(attendance)}
                hover
              >
                <TableCell>{attendance.employeeName}</TableCell>
                <TableCell>{attendance.employeeNo}</TableCell>
                <TableCell>{attendance.shift}</TableCell>
                <TableCell>
                  {attendance.ins.map((inTime, index) => (
                    <Typography key={index}>{inTime}</Typography>
                  ))}
                </TableCell>
                <TableCell>
                  {attendance.outs.map((outTime, index) => (
                    <Typography key={index}>{outTime}</Typography>
                  ))}
                </TableCell>
                <TableCell>{attendance.shiftHours}</TableCell>
                <TableCell>{attendance.workingHours}</TableCell>
                <TableCell>{attendance.hoursDifference}</TableCell>
                <TableCell>
                  {attendance.earlyOT && <WarningIcon color="warning" />}
                </TableCell>
                <TableCell>
                  {attendance.paidLunch && <LunchDiningIcon color="warning" />}
                </TableCell>
                <TableCell>{attendance.actualOT}</TableCell>
                <TableCell>{attendance.totalOT}</TableCell>
                <TableCell>{attendance.preApprOT}</TableCell>
                <TableCell>{attendance.approvedOT}</TableCell>
                <TableCell>{attendance.allowance}</TableCell>
                <TableCell>
                  {attendance.remarks.map((remark) => (
                    <Chip
                      key={remark}
                      label={remark}
                      size="small"
                      color={
                        remark.includes('late') ? 'error' :
                        remark.includes('early') ? 'warning' :
                        'default'
                      }
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {attendance.status === 'approved' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <HourglassEmptyIcon color="warning" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={selectedAttendance !== null} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Attendance Details</DialogTitle>
        <DialogContent>
          {selectedAttendance && (
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Employee Name:</Typography>
                  <Typography>{selectedAttendance.employeeName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Employee No:</Typography>
                  <Typography>{selectedAttendance.employeeNo}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Company:</Typography>
                  <Typography>Company Name</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Department:</Typography>
                  <Typography>Department Name</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Section:</Typography>
                  <Typography>Section Name</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Shift:</Typography>
                  <Typography>{selectedAttendance.shift}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Date:</Typography>
                  <Typography>{format(selectedDate, 'PPP')}</Typography>
                </Grid>
              </Grid>
              <Divider />
              <Typography variant="subtitle1">Attendance Details:</Typography>
              <Box>
                {selectedAttendance.ins.map((inTime, index) => (
                  <Typography key={`in-${index}`}>
                    In: {inTime}
                  </Typography>
                ))}
                {selectedAttendance.outs.map((outTime, index) => (
                  <Typography key={`out-${index}`}>
                    Out: {outTime}
                  </Typography>
                ))}
              </Box>
              <Divider />
              <Typography variant="subtitle1">Overtime Details:</Typography>
              <Box>
                <Typography>Actual OT: {selectedAttendance.actualOT}</Typography>
                <Typography>Total OT: {selectedAttendance.totalOT}</Typography>
                <Typography>Pre-Approved OT: {selectedAttendance.preApprOT}</Typography>
                <Typography>Approved OT: {selectedAttendance.approvedOT}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendancePage;