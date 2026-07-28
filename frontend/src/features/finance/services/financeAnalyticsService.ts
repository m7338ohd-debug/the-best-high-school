import { apiClient, ApiResponseWrapper } from '../../../shared/services/api/apiClient';

export class FinanceAnalyticsService {
  public static async getAnalytics(): Promise<Record<string, unknown>> {
    const res = await apiClient.get<ApiResponseWrapper<Record<string, unknown>>>('/finance/analytics');
    return res.data.data;
  }

  public static async getForecast(): Promise<Record<string, unknown>> {
    const res = await apiClient.get<ApiResponseWrapper<Record<string, unknown>>>('/finance/forecast');
    return res.data.data;
  }

  public static async getDailyReport(date?: string): Promise<Record<string, unknown>> {
    const res = await apiClient.get<ApiResponseWrapper<Record<string, unknown>>>(`/finance/reports/daily${date ? `?date=${date}` : ''}`);
    return res.data.data;
  }

  public static async getReconciliation(): Promise<Record<string, unknown>> {
    const res = await apiClient.get<ApiResponseWrapper<Record<string, unknown>>>('/finance/reconciliation');
    return res.data.data;
  }
}
