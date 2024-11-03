import { Router } from 'express';
import { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion, getRandomQuestionEndpoint } from '../controllers/questionController';

const router: Router = Router();

// Define routes for CRUD operations
router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestionById);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.get('/questions/random-question', getRandomQuestionEndpoint);

export default router;
