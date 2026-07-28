import { apiClient, ApiResponseWrapper } from '../../../shared/services/api/apiClient';

export interface FeeCollectionPayload {
  studentId: string;
  feeLedgerId: string;
  amount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CARD' | 'CHEQUE';
  referenceNo?: string;
  remarks?: string;
}

export class FinanceService {
  public static async collectFee(payload: FeeCollectionPayload): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/finance/collect', payload);
    return res.data.data;
  }

  public static async generateMonthlyFees(payload: { academicYearId: string; monthYear: string; dueDate: string }): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/finance/generate-monthly-fees', payload);
    return res.data.data;
  }

  public static async closeDailyCash(payload: { closingDate: string; actualCashCount: number; closingRemarks?: string; closedBy: string }): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/finance/daily-cash-closing', payload);
    return res.data.data;
  }

  public static async recordBankDeposit(payload: { depositDate: string; bankName: string; depositAmount: number; depositedBy: string }): Promise<unknown> {
    const res = await apiClient.post<ApiResponseWrapper<unknown>>('/finance/bank-deposits', payload);
    return res.data.data;
  }

  public static async verifyIntegrity(): Promise<unknown> {
    const res = await apiClient.get<ApiResponseWrapper<unknown>>('/finance/integrity-check');
    return res.data.data;
  }
}
