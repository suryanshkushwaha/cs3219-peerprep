import { Request, Response } from 'express';
import Question, { IQuestion } from '../models/questionModel';

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
  const { title, description, categories, difficulty } = req.body;
  console.log(req.body);
  try {
    // Check if a question with the same title already exists
    const existingQuestion = await Question.findOne({ title });
    if (existingQuestion) {
      res.status(400).json({ message: 'A question with this title already exists' });
      return;
    }

  const newQuestion = new Question({
    title,
    description,
    categories,
    difficulty
  });
  console.log(newQuestion);
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
  const { title } = req.body;

  try {
    // Check if another question with the same title exists (excluding the current question by ID)
    const duplicateQuestion = await Question.findOne({ title, _id: { $ne: req.params.id } });
    if (duplicateQuestion) {
      res.status(400).json({ message: 'A question with this title already exists' });
      return;
    }

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

// Get a random question from an array of questions
const getRandomQuestionFromArray = (questions: IQuestion[]): IQuestion | null => {
  if (questions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

// Get a random question by both topic and difficulty
const getRandomQuestionByTopicAndDifficultyHelper = (questions: IQuestion[], topic: string, difficulty: string): IQuestion | null => {
  const filteredQuestions = questions.filter(
    question => question.categories.includes(topic) && question.difficulty === difficulty
  );
  return getRandomQuestionFromArray(filteredQuestions);
};

/* 
   Can use the function below directly. It will take in a topic and difficulty
   to fetch a random question from MongoDB based on the given topic and difficulty.
   This function will handle everything, including fetching from MongoDB and
   selecting a random question with the specified filters.
*/
export const getRandomQuestionByTopicAndDifficulty = async (topic: string, difficulty: string): Promise<string | null> => {
  try {
    // Fetch questions from MongoDB
    const questions = await Question.find().lean();
    //return getRandomQuestionByTopicAndDifficultyHelper(questions, topic, difficulty);
    const question = getRandomQuestionByTopicAndDifficultyHelper(questions, topic, difficulty);
    return question ? question._id.toString() : null;
  } catch (error) {
    console.error('Error fetching random question at Helper:', error);
    throw new Error("Error fetching random question at Helper");
  }
};

// Define a route handler for fetching a random question
export const getRandomQuestionEndpoint = async (req: Request, res: Response): Promise<void> => {
  const { topic, difficulty } = req.query;

  try {
    //const question = await getRandomQuestionByTopicAndDifficulty(topic as string, difficulty as string);
    const questionId = await getRandomQuestionByTopicAndDifficulty(topic as string, difficulty as string);
    if (questionId) {
      res.status(200).json(questionId);
    } else {
      res.status(404).json({ message: 'No question found for the specified criteria.' });
    }
  } catch (error) {
    console.error('RRQ Failed at questionController Endpoint:', error);
    res.status(500).json({ message: 'RRQ Failed at questionController Endpoint.' });
  }
};

// Get a random question by topic and difficulty whole sale
export const getRandomQuestionByTopicAndDifficultyOld = async (topic: string, difficulty: string): Promise<IQuestion | null> => {
  try {
    // Find questions that match the topic and difficulty
    const questions = await Question.aggregate([
      { $match: { categories: topic, difficulty: difficulty } },
      { $sample: { size: 1 } } // Randomly select one document
    ]);

    // Return the random question or null if none is found
    return questions.length > 0 ? questions[0] : null;
  } catch (error) {
    console.error('Error fetching random question:', error);
    throw new Error("Failed to retrieve a random question");
  }
};

// Get all unique categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Question.distinct('categories');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

// Get all unique difficulties
export const getAllDifficulties = async (req: Request, res: Response): Promise<void> => {
  try {
    const difficulties = await Question.distinct('difficulty');
    res.status(200).json(difficulties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching difficulties', error });
  }
};

// Check if a specific category and difficulty combination exists
export const checkCategoryDifficultyAvailability = async (req: Request, res: Response): Promise<void> => {
  const { category, difficulty } = req.query;

  try {
    const question = await Question.findOne({ categories: category, difficulty: difficulty });
    if (question) {
      res.status(200).json({ available: true });
    } else {
      res.status(404).json({ available: false, message: 'No question found for the specified category and difficulty.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking category and difficulty availability', error });
  }
};

