import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import QuestionController from '../controllers/QuestionController';
import { Question } from '../models/Question';

const QuestionManagement: React.FC = () => {
  const sampleQuestions: Question[] = [
    {
      id: 1,
      title: 'Binary Search Algorithm',
      description: 'Implement a binary search on a sorted array.',
      categories: ['algorithms'],
      difficulty: 'medium',
    },
    {
      id: 2,
      title: 'Linked List Reversal',
      description: 'Reverse a singly linked list.',
      categories: ['data-structures'],
      difficulty: 'easy',
    },
    {
      id: 3,
      title: 'Knapsack Problem',
      description: 'Solve the knapsack problem using dynamic programming.',
      categories: ['dynamic-programming'],
      difficulty: 'hard',
    },
    {
      id: 4,
      title: 'Graph Traversal',
      description: 'Implement DFS and BFS for graph traversal.',
      categories: ['graphs'],
      difficulty: 'medium',
    },
    {
      id: 5,
      title: 'String Anagram Check',
      description: 'Write a function to check if two strings are anagrams.',
      categories: ['strings'],
      difficulty: 'easy',
    },
  ];


  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---- Uncomment this block to fetch questions from the API ---- 
  const [questions, setQuestions] = useState<Question[]>([]);
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
      setSelectedQuestion(null);
      setError(null);
    } catch (err) {
      setError('Failed to save question. Please try again.');
    }
  };
  */

  /* ---- Comment out this below block if you are fetching questions from the API ---- */
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const handleSubmit = (formData: Omit<Question, 'id'>) => {
    if (editingQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id ? { ...editingQuestion, ...formData } : q
      );
      setQuestions(updatedQuestions);
    } else {
      const newQuestion: Question = {
        id: questions.length + 1,
        ...formData,
      };
      setQuestions([...questions, newQuestion]);
    }
    setEditingQuestion(null);
    setSelectedQuestion(null);
  };
  /* ---- Comment out this above block if you are fetching questions from the API ---- */


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

  const handleSelect = (question: Question) => {
    setSelectedQuestion(question);
  };

  return (
    <div className="container">
      <div className="left-panel">
        <section className="form-section">
          <h2>{editingQuestion ? 'Edit Question' : 'Add a New Question'}</h2>
          <QuestionForm onSubmit={handleSubmit} initialData={editingQuestion} />
        </section>
        {error && <div className="error-message">{error}</div>}
        <section className="list-section">
          <h2>Question List</h2>
          <QuestionList
            questions={questions}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onSelect={handleSelect}
          />
        </section>
      </div>

      <div className="right-panel">
        <h2>Question Details</h2>
        {selectedQuestion ? (
          <div>
            <h3>{selectedQuestion.title}</h3>
            <p>{selectedQuestion.description}</p>
            <p><strong>Categories:</strong> {selectedQuestion.categories.join(', ')}</p>
            <p><strong>Difficulty:</strong> {selectedQuestion.difficulty}</p>
          </div>
        ) : (
          <p>Please select a question from the list to view details.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionManagement;
