"use client"
import React, { useEffect, useState } from 'react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Select, MenuItem, FormControl, InputLabel, Typography,
  Box, Button, IconButton, Modal, Chip
} from '@mui/material';
import {
  ArrowLeft, ArrowRight, CheckCircle, Pending,
  AccessTime, LunchDining
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components with proper Next.js/TypeScript syntax
const PageContainer = styled('div')({
  backgroundColor: '#F8FAFC',
  minHeight: '100vh',
  padding: '2rem'
});

const HeaderSection = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
});

const FilterSection = styled('div')({
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  flexWrap: 'wrap'
});

const SummaryCards = styled('div')({
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  flexWrap: 'wrap'
});

const SummaryCard = styled(Paper)({
  padding: '1rem',
  minWidth: '150px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

const DatePickerContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
});

const StyledTable = styled(Table)({
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  color: '#245AA6'
});

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = styled(Chip)<StatusBadgeProps>(({ status }) => ({
  backgroundColor: status === 'Approved' ? '#E8F5E9' : '#FFF8E1',
  color: status === 'Approved' ? '#2E7D32' : '#F57F17',
  fontWeight: 'bold'
}));

const ModalContent = styled(Paper)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  maxWidth: '90vw'
});

// Mock data
const mockEmployees = [
  {
    id: 1,
    name: 'John Doe',
    employeeNo: 'EMP001',
    company: 'Company A',
    branch: 'Branch 1',
    department: 'IT',
    section: 'Development',
    shift: '9:00 AM - 6:00 PM',
    attendance: {
      ins: ['08:55 AM', '01:05 PM'],
      outs: ['12:55 PM', '06:30 PM'],
      shiftHours: 8,
      workingHours: 8.5,
      hoursDifference: 0.5,
      hasEarlyOT: true,
      hasPaidLunch: false,
      actualOT: 1.5,
      totalOT: 1.5,
      preApprovedOT: 1,
      approvedOT: 1,
      allowance: 50,
      remark: 'late',
      status: 'Approved'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    employeeNo: 'EMP002',
    company: 'Company A',
    branch: 'Branch 1',
    department: 'HR',
    section: 'Recruitment',
    shift: '8:30 AM - 5:30 PM',
    attendance: {
      ins: ['08:25 AM', '12:35 PM'],
      outs: ['12:25 PM', '05:25 PM'],
      shiftHours: 8,
      workingHours: 7.5,
      hoursDifference: -0.5,
      hasEarlyOT: false,
      hasPaidLunch: true,
      actualOT: 0,
      totalOT: 0,
      preApprovedOT: 0,
      approvedOT: 0,
      allowance: 0,
      remark: 'early out',
      status: 'Pending'
    }
  },
  // Add more mock data as needed
];

const AttendancePage: React.FC = () => {
  useEffect(() => {
    document.title = 'DeepSeek ';
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState({
    company: '',
    branch: '',
    department: '',
    section: ''
  });
  const [groupBy, setGroupBy] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Handle date navigation
  const handlePrevDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    if (format(addDays(selectedDate, 1), 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd')) {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  // Calculate summary data
  const summaryData = {
    totalWorkingHours: mockEmployees.reduce((sum, emp) => sum + emp.attendance.workingHours, 0),
    totalOvertime: mockEmployees.reduce((sum, emp) => sum + emp.attendance.totalOT, 0),
    totalLateness: mockEmployees.filter(emp => emp.attendance.remark.includes('late')).length,
    totalShift: mockEmployees.length,
    totalHoursDifference: mockEmployees.reduce((sum, emp) => sum + emp.attendance.hoursDifference, 0)
  };

  // Handle filter changes
  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle row click to show details
  const handleRowClick = (employee: any) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <PageContainer>
      <HeaderSection>
        <Typography variant="h4" fontWeight="bold" color="#245AA6">
          Daily Attendance
        </Typography>
        <DatePickerContainer>
          <IconButton onClick={handlePrevDay}>
            <ArrowLeft />
          </IconButton>
          <TextField
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(parseISO(e.target.value))}
            inputProps={{
              max: format(new Date(), 'yyyy-MM-dd')
            }}
          />
          <IconButton 
            onClick={handleNextDay} 
            disabled={format(selectedDate, 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd')}
          >
            <ArrowRight />
          </IconButton>
        </DatePickerContainer>
      </HeaderSection>

      <FilterSection>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Company</InputLabel>
          <Select
            name="company"
            value={filter.company}
            onChange={handleFilterChange}
            label="Company"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Company A">Company A</MenuItem>
            <MenuItem value="Company B">Company B</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Branch</InputLabel>
          <Select
            name="branch"
            value={filter.branch}
            onChange={handleFilterChange}
            label="Branch"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Branch 1">Branch 1</MenuItem>
            <MenuItem value="Branch 2">Branch 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            value={filter.department}
            onChange={handleFilterChange}
            label="Department"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Section</InputLabel>
          <Select
            name="section"
            value={filter.section}
            onChange={handleFilterChange}
            label="Section"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Development">Development</MenuItem>
            <MenuItem value="Recruitment">Recruitment</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Group By</InputLabel>
          <Select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            label="Group By"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="company">Company</MenuItem>
            <MenuItem value="branch">Branch</MenuItem>
            <MenuItem value="department">Department</MenuItem>
            <MenuItem value="section">Section</MenuItem>
          </Select>
        </FormControl>
      </FilterSection>

      <SummaryCards>
        <SummaryCard>
          <Typography variant="subtitle2" color="textSecondary">Total Working Hours</Typography>
          <Typography variant="h6" fontWeight="bold">{summaryData.totalWorkingHours.toFixed(1)}</Typography>
        </SummaryCard>
        <SummaryCard>
          <Typography variant="subtitle2" color="textSecondary">Total Overtime</Typography>
          <Typography variant="h6" fontWeight="bold">{summaryData.totalOvertime.toFixed(1)}</Typography>
        </SummaryCard>
        <SummaryCard>
          <Typography variant="subtitle2" color="textSecondary">Total Lateness</Typography>
          <Typography variant="h6" fontWeight="bold">{summaryData.totalLateness}</Typography>
        </SummaryCard>
        <SummaryCard>
          <Typography variant="subtitle2" color="textSecondary">Total Shift</Typography>
          <Typography variant="h6" fontWeight="bold">{summaryData.totalShift}</Typography>
        </SummaryCard>
        <SummaryCard>
          <Typography variant="subtitle2" color="textSecondary">Total Hours Difference</Typography>
          <Typography variant="h6" fontWeight="bold">{summaryData.totalHoursDifference.toFixed(1)}</Typography>
        </SummaryCard>
      </SummaryCards>

      <TableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell>Employee No</StyledTableCell>
              <StyledTableCell>Shift</StyledTableCell>
              <StyledTableCell>In</StyledTableCell>
              <StyledTableCell>Out</StyledTableCell>
              <StyledTableCell>SH</StyledTableCell>
              <StyledTableCell>WH</StyledTableCell>
              <StyledTableCell>HD</StyledTableCell>
              <StyledTableCell>Early OT</StyledTableCell>
              <StyledTableCell>Paid Lunch</StyledTableCell>
              <StyledTableCell>Actual OT</StyledTableCell>
              <StyledTableCell>Total OT</StyledTableCell>
              <StyledTableCell>Pre-Appr OT</StyledTableCell>
              <StyledTableCell>Approved OT</StyledTableCell>
              <StyledTableCell>Allowance (MYR)</StyledTableCell>
              <StyledTableCell>Remark</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockEmployees.map((employee) => (
              <TableRow 
                key={employee.id} 
                hover 
                onClick={() => handleRowClick(employee)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.employeeNo}</TableCell>
                <TableCell>{employee.shift}</TableCell>
                <TableCell>{employee.attendance.ins.join(', ')}</TableCell>
                <TableCell>{employee.attendance.outs.join(', ')}</TableCell>
                <TableCell>{employee.attendance.shiftHours}</TableCell>
                <TableCell>{employee.attendance.workingHours}</TableCell>
                <TableCell>
                  {employee.attendance.hoursDifference > 0 ? 
                    `+${employee.attendance.hoursDifference}` : 
                    employee.attendance.hoursDifference}
                </TableCell>
                <TableCell>
                  {employee.attendance.hasEarlyOT ? (
                    <AccessTime sx={{ color: '#FFC107' }} />
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {employee.attendance.hasPaidLunch ? (
                    <LunchDining sx={{ color: '#FFC107' }} />
                  ) : '-'}
                </TableCell>
                <TableCell>{employee.attendance.actualOT}</TableCell>
                <TableCell>{employee.attendance.totalOT}</TableCell>
                <TableCell>{employee.attendance.preApprovedOT}</TableCell>
                <TableCell>{employee.attendance.approvedOT}</TableCell>
                <TableCell>{employee.attendance.allowance.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge
                    label={employee.attendance.remark}
                    status={employee.attendance.status}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {employee.attendance.status === 'Approved' ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Pending color="warning" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>

      {/* Detail Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent>
          {selectedEmployee && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Attendance Details
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <Box component="span" fontSize="1.5rem">×</Box>
                </IconButton>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight="bold" color="#245AA6">
                  {selectedEmployee.name} ({selectedEmployee.employeeNo})
                </Typography>
                <Typography variant="body2">
                  {selectedEmployee.company} • {selectedEmployee.department} • {selectedEmployee.section}
                </Typography>
              </Box>

              <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mb={3}>
                <Box>
                  <Typography variant="subtitle2">Shift</Typography>
                  <Typography>{selectedEmployee.shift}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Date</Typography>
                  <Typography>{format(selectedDate, 'MMMM d, yyyy')}</Typography>
                </Box>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  Attendance Records
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedEmployee.attendance.ins.map((time: string, index: number) => (
                        <TableRow key={`in-${index}`}>
                          <TableCell>In {index + 1}</TableCell>
                          <TableCell>{time}</TableCell>
                        </TableRow>
                      ))}
                      {selectedEmployee.attendance.outs.map((time: string, index: number) => (
                        <TableRow key={`out-${index}`}>
                          <TableCell>Out {index + 1}</TableCell>
                          <TableCell>{time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  Overtime Details
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Actual OT</Typography>
                    <Typography>{selectedEmployee.attendance.actualOT} hours</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Total OT</Typography>
                    <Typography>{selectedEmployee.attendance.totalOT} hours</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Pre-Approved OT</Typography>
                    <Typography>{selectedEmployee.attendance.preApprovedOT} hours</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Approved OT</Typography>
                    <Typography>{selectedEmployee.attendance.approvedOT} hours</Typography>
                  </Box>
                </Box>
              </Box>

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button 
                  variant="contained" 
                  onClick={handleCloseModal} 
                  sx={{ backgroundColor: '#245AA6', '&:hover': { backgroundColor: '#1a4a8a' } }}
                >
                  Close
                </Button>
              </Box>
            </>
          )}
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default AttendancePage;