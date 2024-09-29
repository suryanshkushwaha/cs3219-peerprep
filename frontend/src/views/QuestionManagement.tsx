import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import { Question } from '../models/Question';

const QuestionManagement: React.FC = () => {
  // Sample data for testing
  const sampleQuestions: Question[] = [
    {
      id: 1,
      title: 'Binary Search Algorithm',
      description: 'Implement a binary search on a sorted array.',
      categories: ['algorithms'],
      complexity: 'medium',
    },
    {
      id: 2,
      title: 'Linked List Reversal',
      description: 'Reverse a singly linked list.',
      categories: ['data-structures'],
      complexity: 'easy',
    },
    {
      id: 3,
      title: 'Knapsack Problem',
      description: 'Solve the knapsack problem using dynamic programming.',
      categories: ['dynamic-programming'],
      complexity: 'hard',
    },
    {
      id: 4,
      title: 'Graph Traversal',
      description: 'Implement DFS and BFS for graph traversal.',
      categories: ['graphs'],
      complexity: 'medium',
    },
    {
      id: 5,
      title: 'String Anagram Check',
      description: 'Write a function to check if two strings are anagrams.',
      categories: ['strings'],
      complexity: 'easy',
    },
  ];

  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Disable backend fetch for now
  useEffect(() => {
    // fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Simulate successful fetch with sample data
      setQuestions(sampleQuestions);
    } catch (err) {
      setError('Failed to fetch questions. Please try again.');
    }
  };

  const handleSubmit = async (formData: Omit<Question, 'id'>) => {
    try {
      if (editingQuestion) {
        // Handle update logic (for testing, just update the local state)
        const updatedQuestions = questions.map((q) =>
          q.id === editingQuestion.id ? { ...editingQuestion, ...formData } : q
        );
        setQuestions(updatedQuestions);
      } else {
        // Handle create logic (for testing, just add to the local state)
        const newQuestion: Question = {
          id: questions.length + 1,
          ...formData,
        };
        setQuestions([...questions, newQuestion]);
      }
      setEditingQuestion(null);
      setError(null);
    } catch (err) {
      setError('Failed to save question. Please try again.');
    }
  };

  const handleDelete = (id: number) => {
    // Handle delete logic (for testing, just remove from local state)
    const filteredQuestions = questions.filter((q) => q.id !== id);
    setQuestions(filteredQuestions);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
  };

  return (
    <div className="question-management">
      <h2>Question Management</h2>
      
      {error && <div className="error-message">{error}</div>}

      <section className="form-section">
        <h2>{editingQuestion ? "Edit Question" : "Add a New Question"}</h2>
        <QuestionForm onSubmit={handleSubmit} initialData={editingQuestion} />
      </section>

      <section className="list-section">
        <h2>Question List</h2>
        <QuestionList
          questions={questions}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </section>
    </div>
  );
};

export default QuestionManagement;

/*import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import QuestionController from '../controllers/QuestionController';
import { Question } from '../models/Question';

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
    <div className="question-management">
      <h1>Question Management</h1>
      
      {error && <div className="error-message">{error}</div>}

      <section className="form-section">
        <h2>{editingQuestion ? "Edit Question" : "Add a New Question"}</h2>
        <QuestionForm onSubmit={handleSubmit} initialData={editingQuestion} />
      </section>

      <section className="list-section">
        <h2>Question List</h2>
        <QuestionList
          questions={questions}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </section>
    </div>
  );
};

export default QuestionManagement;
*/