import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  companyId: integer("company_id").notNull(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  branchId: integer("branch_id").notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  departmentId: integer("department_id").notNull(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeNo: text("employee_no").notNull().unique(),
  name: text("name").notNull(),
  companyId: integer("company_id").notNull(),
  branchId: integer("branch_id").notNull(),
  departmentId: integer("department_id").notNull(),
  sectionId: integer("section_id").notNull(),
  shift: text("shift").notNull(), // Format: "09:00-18:00"
});

export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  date: text("date").notNull(), // Format: "YYYY-MM-DD"
  dayIn: text("day_in"), // Format: "HH:MM"
  lunchOut: text("lunch_out"), // Format: "HH:MM"
  lunchIn: text("lunch_in"), // Format: "HH:MM"
  dayOut: text("day_out"), // Format: "HH:MM"
  shiftHours: decimal("shift_hours", { precision: 4, scale: 2 }).notNull(),
  workingHours: decimal("working_hours", { precision: 4, scale: 2 }).notNull(),
  hoursDifference: decimal("hours_difference", { precision: 4, scale: 2 }).notNull(),
  hasEarlyOT: boolean("has_early_ot").default(false),
  hasPaidLunch: boolean("has_paid_lunch").default(false),
  actualOT: decimal("actual_ot", { precision: 4, scale: 2 }).default("0"),
  totalOT: decimal("total_ot", { precision: 4, scale: 2 }).default("0"),
  preApprOT: decimal("pre_appr_ot", { precision: 4, scale: 2 }).default("0"),
  approvedOT: decimal("approved_ot", { precision: 4, scale: 2 }).default("0"),
  allowance: decimal("allowance", { precision: 8, scale: 2 }).default("0"),
  remarks: text("remarks").array(), // Array of remarks like ["late", "lateness", "early_out"]
  status: text("status").notNull().default("pending"), // "approved" or "pending"
});

export const insertCompanySchema = createInsertSchema(companies).omit({ id: true });
export const insertBranchSchema = createInsertSchema(branches).omit({ id: true });
export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true });
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });
export const insertAttendanceRecordSchema = createInsertSchema(attendanceRecords).omit({ id: true });

export type Company = typeof companies.$inferSelect;
export type Branch = typeof branches.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;

// Detailed attendance data for API responses
export interface AttendanceWithDetails extends AttendanceRecord {
  employee: Employee;
  company: Company;
  branch: Branch;
  department: Department;
  section: Section;
}

export interface AttendanceSummary {
  totalEmployees: number;
  totalWorkingHours: number;
  totalOvertime: number;
  totalLateness: number;
  totalShifts: number;
  hoursDifference: number;
}
