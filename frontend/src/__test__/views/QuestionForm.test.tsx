import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionForm from '../../views/QuestionForm';

describe('QuestionForm', () => {
  const mockOnSubmit = jest.fn();
  const initialData = {
    title: 'Initial Title',
    description: 'Initial Description',
    categories: ['algorithms'],
    complexity: 'easy'
  };

  test('renders form fields correctly', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} initialData={null} />);
    expect(screen.getByPlaceholderText('Question Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Question Description')).toBeInTheDocument();
    expect(screen.getByText('Categories:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('populates form with initial data', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} initialData={initialData} />);
    expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Description')).toBeInTheDocument();
    expect(screen.getByLabelText('algorithms')).toBeChecked();
    expect(screen.getByDisplayValue('easy')).toBeInTheDocument();
  });

  test('updates form fields on user input', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} initialData={null} />);
    
    fireEvent.change(screen.getByPlaceholderText('Question Title'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByPlaceholderText('Question Description'), { target: { value: 'New Description' } });
    fireEvent.click(screen.getByLabelText('data-structures'));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'medium' } });

    expect(screen.getByDisplayValue('New Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New Description')).toBeInTheDocument();
    expect(screen.getByLabelText('data-structures')).toBeChecked();
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
  });

  test('calls onSubmit with form data when submitted', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} initialData={null} />);
    
    fireEvent.change(screen.getByPlaceholderText('Question Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByPlaceholderText('Question Description'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByLabelText('graphs'));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'hard' } });
    
    fireEvent.click(screen.getByText('Submit'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Title',
      description: 'Test Description',
      categories: ['graphs'],
      complexity: 'hard'
    });
  });
});