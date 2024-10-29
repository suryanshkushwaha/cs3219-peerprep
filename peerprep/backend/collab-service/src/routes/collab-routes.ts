import { Router, Request, Response } from 'express';
import { createSession, getSession } from '../controller/collab-controller';

const router = Router();

// Directly pass `createSession` and `getSession` to avoid inference issues
router.post('/create', (req: Request, res: Response) => {
  createSession(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
  getSession(req, res);
});

export default router;
