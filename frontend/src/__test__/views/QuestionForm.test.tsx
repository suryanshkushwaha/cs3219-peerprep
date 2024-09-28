import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionForm from '../../views/QuestionForm';

describe('QuestionForm', () => {
  const mockOnSubmit = jest.fn();

  test('renders form fields correctly', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} initialData={null} />);
    expect(screen.getByPlaceholderText('Question Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Question Description')).toBeInTheDocument();
    expect(screen.getByText('Categories:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
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