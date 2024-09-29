import { Question } from '../../models/Question';

describe('Question Model', () => {
  test('should have the correct structure', () => {
    const question: Question = {
      id: 1,
      title: 'Sample Question',
      description: 'This is a sample question',
      categories: ['algorithms', 'data-structures'],
      complexity: 'medium'
    };

    expect(question).toHaveProperty('id');
    expect(question).toHaveProperty('title');
    expect(question).toHaveProperty('description');
    expect(question).toHaveProperty('categories');
    expect(question).toHaveProperty('complexity');

    expect(typeof question.id).toBe('number');
    expect(typeof question.title).toBe('string');
    expect(typeof question.description).toBe('string');
    expect(Array.isArray(question.categories)).toBeTruthy();
    expect(typeof question.complexity).toBe('string');
  });

  test('should accept valid complexity values', () => {
    const validComplexities = ['easy', 'medium', 'hard'];
    
    validComplexities.forEach(complexity => {
      const question: Question = {
        id: 1,
        title: 'Test',
        description: 'Test',
        categories: [],
        complexity: complexity as 'easy' | 'medium' | 'hard'
      };
      expect(question.complexity).toBe(complexity);
    });
  });
});