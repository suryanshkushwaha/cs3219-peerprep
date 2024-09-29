import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionManagement from '../../views/QuestionManagement';
import QuestionController from '../../controllers/QuestionController';

jest.mock('../../controllers/QuestionController');

describe('QuestionManagement', () => {
  const mockQuestions = [
    { id: 1, title: 'Test Question', description: 'Test Description', categories: ['algorithms'], complexity: 'easy' }
  ];

  beforeEach(() => {
    (QuestionController.fetchQuestions as jest.Mock).mockResolvedValue(mockQuestions);
  });

  test('renders question management form and list', async () => {
    render(<QuestionManagement />);
    expect(screen.getByText('Question Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Question Title')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Test Question')).toBeInTheDocument();
    });
  });

  test('handles form submission for new question', async () => {
    const newQuestion = { id: 2, title: 'New Question', description: 'New Description', categories: ['data-structures'], complexity: 'medium' };
    (QuestionController.createQuestion as jest.Mock).mockResolvedValue(newQuestion);
    
    render(<QuestionManagement />);
    
    fireEvent.change(screen.getByPlaceholderText('Question Title'), { target: { value: 'New Question' } });
    fireEvent.change(screen.getByPlaceholderText('Question Description'), { target: { value: 'New Description' } });
    fireEvent.click(screen.getByLabelText('data-structures'));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'medium' } });
    
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(QuestionController.createQuestion).toHaveBeenCalledWith({
        title: 'New Question',
        description: 'New Description',
        categories: ['data-structures'],
        complexity: 'medium'
      });
    });
  });

  test('handles question deletion', async () => {
    render(<QuestionManagement />);
    await waitFor(() => {
      expect(screen.getByText('Test Question')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(QuestionController.deleteQuestion).toHaveBeenCalledWith(1);
    });
  });

  test('handles question editing', async () => {
    render(<QuestionManagement />);
    await waitFor(() => {
      expect(screen.getByText('Test Question')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByDisplayValue('Test Question')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('Test Question'), { target: { value: 'Updated Question' } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(QuestionController.updateQuestion).toHaveBeenCalledWith(1, expect.objectContaining({
        title: 'Updated Question',
        description: 'Test Description',
        categories: ['algorithms'],
        complexity: 'easy'
      }));
    });
  });

  test('displays error message on API failure', async () => {
    (QuestionController.fetchQuestions as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<QuestionManagement />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch questions. Please try again.')).toBeInTheDocument();
    });
  });
});