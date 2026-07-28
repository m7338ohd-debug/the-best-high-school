import { apiClient, ApiResponseWrapper } from '../../../shared/services/api/apiClient';

export interface StudentListItem {
  id: string;
  admissionNo: string;
  studentName: string;
  className: string;
  sectionName: string;
  fatherName: string;
  emergencyContact: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED';
}

export class StudentService {
  public static async getStudents(): Promise<StudentListItem[]> {
    const res = await apiClient.get<ApiResponseWrapper<StudentListItem[]>>('/students');
    return res.data.data;
  }

  public static async admitStudent(payload: Record<string, unknown>): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/students/admission', payload);
    return res.data.data;
  }

  public static async bulkPromote(payload: Record<string, unknown>): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/students/bulk-promote', payload);
    return res.data.data;
  }
}
