import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Question, { IQuestion } from '../../models/questionModel';

// Connect to the MongoDB Memory Server before tests
let mongoServer: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Question Model', () => {
  // Test: Create a valid question
  it('should create a question with valid data', async () => {
    const question = new Question({
        questionId: 1,
        title: 'What is Node.js?',
        description: 'Node.js is a runtime for JavaScript.',
        category: 'Programming',
        complexity: 'Easy',
      });
    const savedQuestion = await question.save();

    expect(savedQuestion._id).toBeDefined();
    expect(savedQuestion.questionId).toBe(question.questionId);
  });

  // Test: Prevent duplicate question IDs
  it('should not create a question with duplicate questionId', async () => {
    const question1 = new Question({
        questionId: 1,
        title: 'First Question',
        description: 'Description for first question.',
        category: 'General',
        complexity: 'Easy',
      });
    await question1.save();

    const question2 = new Question({
        questionId: 1,
        title: 'First Question',
        description: 'Description for first question.',
        category: 'General',
        complexity: 'Easy',
      });
    await expect(question2.save()).rejects.toThrow();
  });

  // Test: Require fields
  it('should require title field', async () => {
    const questionData: Partial<IQuestion> = {
      questionId: 2,
      description: 'Missing title',
      category: 'General',
      complexity: 'Medium',
    };

    const question = new Question(questionData);
    await expect(question.save()).rejects.toThrow();
  });
});
