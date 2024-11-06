import { Router } from 'express';
import { assesCode } from '../controllers/gptController';

const router: Router = Router();

// Route for handling code assessment with GPT
router.post('/gpt/asses', assesCode);

export default router;