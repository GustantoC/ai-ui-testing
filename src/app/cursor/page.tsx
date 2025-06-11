'use client';

import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Select, 
  DatePicker, 
  Modal, 
  Badge, 
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  LeftOutlined, 
  RightOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface AttendanceData {
  key: string;
  employeeName: string;
  employeeNo: string;
  shift: string;
  ins: string[];
  outs: string[];
  shiftHours: number;
  workingHours: number;
  hoursDifference: number;
  hasEarlyOT: boolean;
  hasPaidLunch: boolean;
  actualOT: number;
  totalOT: number;
  preApprovedOT: number;
  approvedOT: number;
  allowance: number;
  remark: string;
  status: 'approved' | 'pending';
  company: string;
  department: string;
  section: string;
}

const AttendancePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Cursor';
  }, []);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedFilter, setSelectedFilter] = useState('company');
  const [selectedGroup, setSelectedGroup] = useState('company');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceData | null>(null);

  // Mock data - replace with actual data in production
  const mockData: AttendanceData[] = [
    {
      key: '1',
      employeeName: 'John Doe',
      employeeNo: 'EMP001',
      shift: 'Morning',
      ins: ['08:00', '13:00'],
      outs: ['12:00', '17:00'],
      shiftHours: 8,
      workingHours: 8,
      hoursDifference: 0,
      hasEarlyOT: true,
      hasPaidLunch: false,
      actualOT: 1,
      totalOT: 1,
      preApprovedOT: 1,
      approvedOT: 1,
      allowance: 50,
      remark: 'late',
      status: 'approved',
      company: 'Company A',
      department: 'IT',
      section: 'Development'
    },
    // Add more mock data as needed
  ];

  const columns: ColumnsType<AttendanceData> = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Employee No',
      dataIndex: 'employeeNo',
      key: 'employeeNo',
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
    },
    {
      title: 'In',
      dataIndex: 'ins',
      key: 'ins',
      render: (ins: string[]) => ins.join(', '),
    },
    {
      title: 'Out',
      dataIndex: 'outs',
      key: 'outs',
      render: (outs: string[]) => outs.join(', '),
    },
    {
      title: 'SH',
      dataIndex: 'shiftHours',
      key: 'shiftHours',
    },
    {
      title: 'WH',
      dataIndex: 'workingHours',
      key: 'workingHours',
    },
    {
      title: 'HD',
      dataIndex: 'hoursDifference',
      key: 'hoursDifference',
    },
    {
      title: 'Early OT',
      dataIndex: 'hasEarlyOT',
      key: 'hasEarlyOT',
      render: (hasEarlyOT: boolean) => (
        <ClockCircleOutlined style={{ color: hasEarlyOT ? '#FFD700' : '#ccc' }} />
      ),
    },
    {
      title: 'Paid Lunch',
      dataIndex: 'hasPaidLunch',
      key: 'hasPaidLunch',
      render: (hasPaidLunch: boolean) => (
        <DollarOutlined style={{ color: hasPaidLunch ? '#FFD700' : '#ccc' }} />
      ),
    },
    {
      title: 'Actual OT',
      dataIndex: 'actualOT',
      key: 'actualOT',
    },
    {
      title: 'Total OT',
      dataIndex: 'totalOT',
      key: 'totalOT',
    },
    {
      title: 'Pre-Appr OT',
      dataIndex: 'preApprovedOT',
      key: 'preApprovedOT',
    },
    {
      title: 'Approved OT',
      dataIndex: 'approvedOT',
      key: 'approvedOT',
    },
    {
      title: 'Allowance (MYR)',
      dataIndex: 'allowance',
      key: 'allowance',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      render: (remark: string) => (
        <Badge 
          status={
            remark === 'late' ? 'error' :
            remark === 'early out' ? 'warning' :
            'default'
          } 
          text={remark}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        status === 'approved' ? 
          <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      ),
    },
  ];

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handlePrevDay = () => {
    setSelectedDate(selectedDate.subtract(1, 'day'));
  };

  const handleNextDay = () => {
    setSelectedDate(selectedDate.add(1, 'day'));
  };

  const handleRowClick = (record: AttendanceData) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Title level={2} style={{ color: '#245AA6', marginBottom: '24px' }}>
        Daily Attendance
      </Title>

      {/* Filters and Date Selection */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <Select
                value={selectedFilter}
                onChange={setSelectedFilter}
                style={{ width: 120 }}
              >
                <Option value="company">Company</Option>
                <Option value="branch">Branch</Option>
                <Option value="department">Department</Option>
                <Option value="section">Section</Option>
              </Select>
              <Select
                value={selectedGroup}
                onChange={setSelectedGroup}
                style={{ width: 120 }}
              >
                <Option value="company">Company</Option>
                <Option value="branch">Branch</Option>
                <Option value="department">Department</Option>
                <Option value="section">Section</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<LeftOutlined />} onClick={handlePrevDay} />
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
              <Button icon={<RightOutlined />} onClick={handleNextDay} />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic title="Total Working Hours" value={120} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Total Overtime" value={15} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Total Lateness" value={5} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Total Shift" value={8} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Hours Difference" value={-2} />
          </Card>
        </Col>
      </Row>

      {/* Attendance Table */}
      <Table
        columns={columns}
        dataSource={mockData}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' }
        })}
      />

      {/* Detail Modal */}
      <Modal
        title="Attendance Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><strong>Employee Name:</strong> {selectedRecord.employeeName}</p>
                <p><strong>Employee No:</strong> {selectedRecord.employeeNo}</p>
                <p><strong>Company:</strong> {selectedRecord.company}</p>
                <p><strong>Department:</strong> {selectedRecord.department}</p>
                <p><strong>Section:</strong> {selectedRecord.section}</p>
              </Col>
              <Col span={12}>
                <p><strong>Shift:</strong> {selectedRecord.shift}</p>
                <p><strong>Date:</strong> {selectedDate.format('YYYY-MM-DD')}</p>
                <p><strong>In Times:</strong> {selectedRecord.ins.join(', ')}</p>
                <p><strong>Out Times:</strong> {selectedRecord.outs.join(', ')}</p>
                <p><strong>Working Hours:</strong> {selectedRecord.workingHours}</p>
              </Col>
            </Row>
            <div style={{ marginTop: '24px' }}>
              <Title level={4}>Overtime Details</Title>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <p><strong>Actual OT:</strong> {selectedRecord.actualOT}</p>
                  <p><strong>Total OT:</strong> {selectedRecord.totalOT}</p>
                </Col>
                <Col span={8}>
                  <p><strong>Pre-Approved OT:</strong> {selectedRecord.preApprovedOT}</p>
                  <p><strong>Approved OT:</strong> {selectedRecord.approvedOT}</p>
                </Col>
                <Col span={8}>
                  <p><strong>Allowance:</strong> MYR {selectedRecord.allowance}</p>
                  <p><strong>Status:</strong> {selectedRecord.status}</p>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AttendancePage;
