import { Request, Response } from 'express';
import Topic from '../models/topicModel';
import Difficulty from '../models/difficultyModel';

// Get all topics
export const getAllTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topics', error });
  }
};

// Check if a topic exists
export const topicExists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topicName } = req.params;
    const topic = await Topic.findOne({ name: topicName });
    if (topic) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false, message: 'Topic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking topic', error });
  }
};

// Get all difficulties
export const getDifficulties = async (req: Request, res: Response): Promise<void> => {
  try {
    const difficulties = await Difficulty.find();
    res.status(200).json(difficulties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching difficulties', error });
  }
};

// Check if a difficulty exists
export const difficultyExists = async (req: Request, res: Response): Promise<void> => {
    try {
      const { difficultyName } = req.params;
      const topic = await Topic.findOne({ name: difficultyName });
      if (topic) {
        res.status(200).json({ exists: true });
      } else {
        res.status(404).json({ exists: false, message: 'Difficulty not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error checking difficulty', error });
    }
  };