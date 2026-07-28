import { apiClient, ApiResponseWrapper } from '../../../shared/services/api/apiClient';

export interface SchoolProfileData {
  schoolName: string;
  schoolCode: string;
  board?: string;
  principalName?: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface AcademicYearData {
  id: string;
  yearName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export class SchoolSettingsService {
  public static async getProfile(): Promise<SchoolProfileData> {
    const res = await apiClient.get<ApiResponseWrapper<SchoolProfileData>>('/school-profile');
    return res.data.data;
  }

  public static async updateProfile(data: Partial<SchoolProfileData>): Promise<SchoolProfileData> {
    const res = await apiClient.put<ApiResponseWrapper<SchoolProfileData>>('/school-profile', data);
    return res.data.data;
  }

  public static async getAcademicYears(): Promise<AcademicYearData[]> {
    const res = await apiClient.get<ApiResponseWrapper<AcademicYearData[]>>('/academic-years');
    return res.data.data;
  }

  public static async activateAcademicYear(id: string): Promise<AcademicYearData> {
    const res = await apiClient.patch<ApiResponseWrapper<AcademicYearData>>(`/academic-years/${id}/activate`);
    return res.data.data;
  }
}
