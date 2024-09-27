import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionList from '../../views/QuestionList';

describe('QuestionList', () => {
  const mockQuestions = [
    { id: 1, title: 'Question 1', description: 'Description 1', categories: ['algorithms'], complexity: 'easy' },
    { id: 2, title: 'Question 2', description: 'Description 2', categories: ['data-structures', 'graphs'], complexity: 'medium' },
  ];
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  test('renders questions correctly', () => {
    render(<QuestionList questions={mockQuestions} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
    expect(screen.getByText('algorithms')).toBeInTheDocument();
    expect(screen.getByText('data-structures, graphs')).toBeInTheDocument();
    expect(screen.getByText('easy')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<QuestionList questions={mockQuestions} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<QuestionList questions={mockQuestions} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[1]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockQuestions[1]);
  });

  test('renders empty message when no questions', () => {
    render(<QuestionList questions={[]} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    expect(screen.getByText('No questions available.')).toBeInTheDocument();
  });
});