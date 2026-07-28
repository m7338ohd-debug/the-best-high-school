import { Router } from 'express';
import { AuthController } from './auth.controller.js';

const router = Router();
const controller = new AuthController();

router.post('/register-school', controller.registerSchool);
router.post('/login', controller.login);

export const authRoutes = router;
