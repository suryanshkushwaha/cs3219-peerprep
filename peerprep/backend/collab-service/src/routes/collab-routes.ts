import { Router, Request, Response } from 'express';
import { createCollabSession, getCollabSession } from '../controller/collab-controller';

const router = Router();

// Directly pass `createSession` and `getSession` to avoid inference issues
router.post('/create', (req: Request, res: Response) => {
  createCollabSession(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
  getCollabSession(req, res);
});

export default router;
