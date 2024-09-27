import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionManagement from '../components/QuestionManagement';
import * as api from '../api/questionApi';

jest.mock('../api/questionApi');

describe('QuestionManagement', () => {
  beforeEach(() => {
    (api.fetchQuestions as jest.Mock).mockResolvedValue([
      { id: 1, title: 'Test Question', description: 'Test Description', category: 'algorithms', complexity: 'easy' }
    ]);
  });

  test('renders question management form', () => {
    render(<QuestionManagement />);
    expect(screen.getByText('Question Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Question Title')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('displays fetched questions', async () => {
    render(<QuestionManagement />);
    await waitFor(() => {
      expect(screen.getByText('Test Question')).toBeInTheDocument();
    });
  });

  test('handles form submission', async () => {
    (api.createQuestion as jest.Mock).mockResolvedValue({ id: 2, title: 'New Question', description: 'New Description', category: 'data-structures', complexity: 'medium' });
    
    render(<QuestionManagement />);
    
    fireEvent.change(screen.getByPlaceholderText('Question Title'), { target: { value: 'New Question' } });
    fireEvent.change(screen.getByPlaceholderText('Question Description'), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByRole('combobox', { name: /category/i }), { target: { value: 'data-structures' } });
    fireEvent.change(screen.getByRole('combobox', { name: /complexity/i }), { target: { value: 'medium' } });
    
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(api.createQuestion).toHaveBeenCalledWith({
        title: 'New Question',
        description: 'New Description',
        category: 'data-structures',
        complexity: 'medium'
      });
    });
  });

  // Add more tests for edit, delete, and error handling as needed
});