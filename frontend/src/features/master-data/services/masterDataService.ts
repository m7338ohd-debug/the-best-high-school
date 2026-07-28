import { apiClient, ApiResponseWrapper } from '../../../shared/services/api/apiClient';

export interface ClassData {
  id: string;
  className: string;
  displayName?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SectionData {
  id: string;
  classId: string;
  sectionName: string;
  capacity: number;
  roomNumber?: string;
}

export interface FeeCategoryData {
  id: string;
  categoryName: string;
  code: string;
  isRecurring: boolean;
  isMandatory: boolean;
}

export class MasterDataService {
  public static async getClasses(): Promise<ClassData[]> {
    const res = await apiClient.get<ApiResponseWrapper<ClassData[]>>('/classes');
    return res.data.data;
  }

  public static async createClass(data: { className: string; displayName?: string }): Promise<ClassData> {
    const res = await apiClient.post<ApiResponseWrapper<ClassData>>('/classes', data);
    return res.data.data;
  }

  public static async getFeeCategories(): Promise<FeeCategoryData[]> {
    const res = await apiClient.get<ApiResponseWrapper<FeeCategoryData[]>>('/fee-categories');
    return res.data.data;
  }
}
