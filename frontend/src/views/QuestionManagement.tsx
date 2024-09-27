import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm.tsx';
import QuestionList from './QuestionList.tsx';
import QuestionController from '../controllers/QuestionController.tsx';
import { Question } from '../models/Question.tsx';

const QuestionManagement: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const fetchedQuestions = await QuestionController.fetchQuestions();
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError('Failed to fetch questions. Please try again.');
    }
  };

  const handleSubmit = async (formData: Omit<Question, 'id'>) => {
    try {
      if (editingQuestion) {
        await QuestionController.updateQuestion(editingQuestion.id, formData);
      } else {
        await QuestionController.createQuestion(formData);
      }
      fetchQuestions();
      setEditingQuestion(null);
      setError(null);
    } catch (err) {
      setError('Failed to save question. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await QuestionController.deleteQuestion(id);
      fetchQuestions();
    } catch (err) {
      setError('Failed to delete question. Please try again.');
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
  };

  return (
    <div>
      <h1>Question Management</h1>
      {error && <div className="error">{error}</div>}
      <QuestionForm onSubmit={handleSubmit} initialData={editingQuestion} />
      <QuestionList
        questions={questions}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default QuestionManagement;