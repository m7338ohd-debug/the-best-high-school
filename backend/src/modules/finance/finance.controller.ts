import { Request, Response, NextFunction } from 'express';
import { FinanceService } from './finance.service.js';
import { FinanceAnalyticsService } from './services/finance-analytics.service.js';
import { FinanceReportService } from './services/finance-report.service.js';
import { FinanceReconciliationService } from './services/finance-reconciliation.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class FinanceController {
  private service: FinanceService;
  private analyticsService: FinanceAnalyticsService;
  private reportService: FinanceReportService;
  private reconciliationService: FinanceReconciliationService;

  constructor() {
    this.service = new FinanceService();
    this.analyticsService = new FinanceAnalyticsService();
    this.reportService = new FinanceReportService();
    this.reconciliationService = new FinanceReconciliationService();
  }

  createFeeStructure = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const structure = await this.service.createFeeStructure(req.body);
      ApiResponse.created(res, 'Fee structure created successfully', structure);
    } catch (error) {
      next(error);
    }
  };

  generateMonthlyLedgers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.generateMonthlyLedgers(req.body);
      ApiResponse.ok(res, 'Monthly fee ledgers generated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  collectFee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.collectFee(req.body);
      ApiResponse.created(res, 'Fee payment collected successfully', result);
    } catch (error) {
      next(error);
    }
  };

  applyAdjustment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adjustment = await this.service.applyAdjustment(req.body);
      ApiResponse.created(res, 'Financial adjustment applied successfully', adjustment);
    } catch (error) {
      next(error);
    }
  };

  closeDailyCash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const closing = await this.service.closeDailyCash(req.body);
      ApiResponse.created(res, 'Daily cash closed and locked successfully', closing);
    } catch (error) {
      next(error);
    }
  };

  processRefund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refund = await this.service.processRefund(req.body);
      ApiResponse.created(res, 'Refund processed successfully', refund);
    } catch (error) {
      next(error);
    }
  };

  recordBankDeposit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deposit = await this.service.recordBankDeposit(req.body);
      ApiResponse.created(res, 'Bank deposit recorded successfully', deposit);
    } catch (error) {
      next(error);
    }
  };

  getAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dashboard = await this.analyticsService.getExecutiveDashboard();
      ApiResponse.ok(res, 'Executive financial analytics retrieved', dashboard);
    } catch (error) {
      next(error);
    }
  };

  getForecast = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const forecast = await this.analyticsService.getRevenueForecast();
      ApiResponse.ok(res, 'Revenue forecast generated successfully', forecast);
    } catch (error) {
      next(error);
    }
  };

  getDailyReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.reportService.getDailyCollectionReport(req.query.date as string);
      ApiResponse.ok(res, 'Daily collection report generated', report);
    } catch (error) {
      next(error);
    }
  };

  getMonthlyReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.reportService.getMonthlyCollectionReport(
        req.query.month as string,
        req.query.year as string,
        req.query.classId as string
      );
      ApiResponse.ok(res, 'Monthly collection report generated', report);
    } catch (error) {
      next(error);
    }
  };

  getDueReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.reportService.getDueFeeReport(
        req.query.classId as string,
        req.query.sectionId as string
      );
      ApiResponse.ok(res, 'Due fee report generated', report);
    } catch (error) {
      next(error);
    }
  };

  getBalanceReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.reportService.getBalanceReport(
        req.query.classId as string,
        req.query.sectionId as string
      );
      ApiResponse.ok(res, 'Balance report generated', report);
    } catch (error) {
      next(error);
    }
  };

  getClassWiseReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.reportService.getClassWiseReport(
        req.params.classId,
        req.query.sectionId as string
      );
      ApiResponse.ok(res, 'Class wise fee report generated', report);
    } catch (error) {
      next(error);
    }
  };

  getStudentReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.reportService.getStudentFeeReport(req.params.studentId);
      ApiResponse.ok(res, 'Student fee report generated', report);
    } catch (error) {
      next(error);
    }
  };

  runReconciliation = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.reconciliationService.runHealthCheck();
      ApiResponse.ok(res, 'Financial reconciliation health check completed', report);
    } catch (error) {
      next(error);
    }
  };
}
