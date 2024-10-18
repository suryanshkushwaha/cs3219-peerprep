import { Question } from '../../models/Question';

describe('Question Model', () => {
  test('should have the correct structure', () => {
    const question: Question = {
      _id: '1',
      title: 'Sample Question',
      description: 'This is a sample question',
      categories: ['algorithms', 'data-structures'],
      difficulty: 'medium'
    };

    expect(question).toHaveProperty('_id');
    expect(question).toHaveProperty('title');
    expect(question).toHaveProperty('description');
    expect(question).toHaveProperty('categories');
    expect(question).toHaveProperty('difficulty');

    expect(typeof question._id).toBe('string');
    expect(typeof question.title).toBe('string');
    expect(typeof question.description).toBe('string');
    expect(Array.isArray(question.categories)).toBeTruthy();
    expect(typeof question.difficulty).toBe('string');
  });

  test('should accept valid difficulty values', () => {
    const validComplexities = ['easy', 'medium', 'hard'];
    
    validComplexities.forEach(difficulty => {
      const question: Question = {
        _id: '1',
        title: 'Test',
        description: 'Test',
        categories: [],
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      };
      expect(question.difficulty).toBe(difficulty);
    });
  });
});