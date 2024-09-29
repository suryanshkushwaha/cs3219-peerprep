import { Request, Response } from 'express';
import Question from '../models/questionModel';

// Get all questions
export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
};

// Get a single question by ID
export const getQuestionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error });
  }
};

// Create a new question
export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  const { title, description, categories, complexity } = req.body;

  try {
    // Check if a question with the same title already exists
    const existingQuestion = await Question.findOne({ title });
    if (existingQuestion) {
      res.status(400).json({ message: 'A question with this title already exists' });
      return;
    }

  const categoriesArray = typeof categories === 'string' && categories.length > 0 
    ? categories.split(',').map(cat => cat.trim())  // Ensure to trim whitespace
    : [];

  const newQuestion = new Question({
    title,
    description,
    categories: categoriesArray, // Convert comma-separated string to array
    complexity
  });

    // Save the new question, questionId will be auto-assigned
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error creating question:", error); // Log the actual error for debugging
    res.status(500).json({ message: 'Error creating question', error });
  }
};

// Update a question
export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedQuestion) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error });
  }
};

// Delete a question
export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error });
  }
};
