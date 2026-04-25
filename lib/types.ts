export interface Student {
  _id: string;
  name: string;
  matricNumber: string;
  email: string;
  department: string;
  level: number;
  semester: number;
  completedCourses: string[];
  createdAt: Date;
}

export interface Course {
  _id: string;
  code: string;
  title: string;
  units: number;
  department: string;
  level: number;
  semester: number;
  compulsory: boolean;
  prerequisites: string[];
  createdAt: Date;
}

export interface Registration {
  _id: string;
  studentId: string | Student;
  session: string;
  semester: number;
  courses: string[];
  totalUnits: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  createdAt: Date;
}

export interface ValidationWarning {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  courses?: string[];
}

export interface DashboardStats {
  totalStudents?: number;
  totalCourses?: number;
  pendingRegistrations?: number;
  approvedRegistrations?: number;
  totalRegistrations?: number;
  currentUnits?: number;
  maxUnits?: number;
  completedCourses?: number;
}