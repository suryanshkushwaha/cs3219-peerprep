import express from 'express';
import { getAllTopics, topicExists, getDifficulties } from '../controllers/databaseController';

const router = express.Router();

router.get('/topics', getAllTopics);
router.get('/topics/exists/:topicName', topicExists);
router.get('/difficulties', getDifficulties);
router.get('/difficulties/exists/:difficultyName', topicExists);

export default router;

