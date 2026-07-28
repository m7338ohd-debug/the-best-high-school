import { Router } from 'express';
import { FinanceController } from './finance.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new FinanceController();

router.post('/fee-structures', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.createFeeStructure);
router.post('/generate-monthly-fees', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.generateMonthlyLedgers);
router.post('/collect', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.collectFee);
router.post('/adjustments', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.applyAdjustment);
router.post('/daily-cash-closing', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.closeDailyCash);
router.post('/refunds', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.processRefund);
router.post('/bank-deposits', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.recordBankDeposit);
router.get('/analytics', authMiddleware, controller.getAnalytics);
router.get('/forecast', authMiddleware, controller.getForecast);

// Finance Reports Module Endpoints
router.get('/reports/daily', authMiddleware, controller.getDailyReport);
router.get('/reports/monthly', authMiddleware, controller.getMonthlyReport);
router.get('/reports/due', authMiddleware, controller.getDueReport);
router.get('/reports/balance', authMiddleware, controller.getBalanceReport);
router.get('/reports/class/:classId', authMiddleware, controller.getClassWiseReport);
router.get('/reports/student/:studentId', authMiddleware, controller.getStudentReport);

router.get('/reconciliation', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.runReconciliation);

export const financeRoutes = router;
