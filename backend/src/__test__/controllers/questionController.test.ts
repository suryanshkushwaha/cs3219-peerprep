import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server'; // Import the Express app
import Question, { IQuestion } from '../../models/questionModel';

// Setup MongoDB memory server before tests
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

// Clear the database after each test
afterEach(async () => {
  await Question.deleteMany({});
});

describe('Question Controller', () => {
  // Test: Create a new question
  it('should create a new question', async () => {
    const newQuestion: Partial<IQuestion> = {
      questionId: 1,
      title: 'What is Node.js?',
      description: 'Node.js is a runtime for JavaScript.',
      category: 'Programming',
      complexity: 'Easy',
    };

    const response = await request(app)
      .post('/api/questions')
      .send(newQuestion);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newQuestion.title);
  });

  // Test: Fetch all questions
  it('should fetch all questions', async () => {
    const questions = [
      { questionId: 1, title: 'Q1', description: 'Desc1', category: 'Cat1', complexity: 'Easy' },
      { questionId: 2, title: 'Q2', description: 'Desc2', category: 'Cat2', complexity: 'Medium' }
    ];
    await Question.insertMany(questions);

    const response = await request(app).get('/api/questions');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  // Test: Fetch a question by ID
  it('should fetch a question by ID', async () => {
    const question = new Question({
      questionId: 1,
      title: 'What is JavaScript?',
      description: 'A programming language.',
      category: 'Programming',
      complexity: 'Medium'
    });
    await question.save();

    const response = await request(app).get(`/api/questions/${question._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(question.title);
  });

  // Test: Update a question
  it('should update a question', async () => {
    const question = new Question({
      questionId: 1,
      title: 'What is Express.js?',
      description: 'A web framework for Node.js.',
      category: 'Programming',
      complexity: 'Easy'
    });
    await question.save();

    const updatedData = { title: 'Updated Title', description: 'Updated Description' };
    const response = await request(app)
      .put(`/api/questions/${question._id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
  });

  // Test: Delete a question
  it('should delete a question', async () => {
    const question = new Question({
      questionId: 1,
      title: 'What is MongoDB?',
      description: 'A NoSQL database.',
      category: 'Database',
      complexity: 'Easy'
    });
    await question.save();

    const response = await request(app).delete(`/api/questions/${question._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Question deleted successfully');
  });

  // Test: 404 on non-existent question
  it('should return 404 when fetching a non-existent question', async () => {
    const response = await request(app).get('/api/questions/612f1e78fd1b2a001c9d98b5');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Question not found');
  });
});
