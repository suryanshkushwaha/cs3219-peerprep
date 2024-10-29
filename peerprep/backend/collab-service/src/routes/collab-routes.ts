import express from 'express';
import { createSession, getSession } from '../controller/collab-controller';

const router = express.Router();

// Wrap async handlers in a function that calls `next` with errors
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/create', asyncHandler(createSession));
router.get('/:id', asyncHandler(getSession));

export default router;

