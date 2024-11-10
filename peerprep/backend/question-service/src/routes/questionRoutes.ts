import { Router } from 'express';
import { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion, getRandomQuestionEndpoint, getAllCategories, getAllDifficulties, checkCategoryDifficultyAvailability } from '../controllers/questionController';

const router: Router = Router();

// Define routes for CRUD operations
router.get('/questions/random-question', getRandomQuestionEndpoint);
router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestionById);
router.get('/categories', getAllCategories);
router.get('/difficulties', getAllDifficulties);
router.get('/availability', checkCategoryDifficultyAvailability);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);



export default router;
