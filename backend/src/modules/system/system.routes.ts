import { Router } from 'express';
import { SystemController } from './system.controller.js';

const router = Router();
const controller = new SystemController();

router.get('/config', controller.getConfig);
router.put('/config', controller.updateConfig);
router.get('/subscription', controller.getSubscription);
router.post('/backup', controller.triggerBackup);
router.post('/restore', controller.restoreBackup);
router.get('/health', controller.getHealth);
router.get('/backups', controller.getBackups);
router.post('/send-invitation', controller.sendInvitation);
router.get('/tenants', controller.getTenants);
router.put('/tenants/:id/toggle', controller.toggleTenant);

export const systemRoutes = router;
