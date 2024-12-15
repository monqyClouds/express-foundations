import {Router} from 'express';
import * as authControllers from './auth.controller';

const router = Router();

router.post('/login', authControllers.login);

export default router;
