import { Router, Request, Response, RequestHandler } from 'express';
import { login, register } from '../controllers/auth';

const router = Router();

router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);

export default router;