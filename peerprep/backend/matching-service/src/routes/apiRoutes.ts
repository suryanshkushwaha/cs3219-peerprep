import express from 'express';
import { createRequest } from '../controllers/requestController';
// import { startSession } from '../controllers/runnerController';

const router = express.Router();

router.post('/request', createRequest);
// router.post('/session', startSession);

export default router;
