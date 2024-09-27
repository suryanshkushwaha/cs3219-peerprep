import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Question, fetchQuestions, createQuestion, updateQuestion, deleteQuestion } from '../api/questionApi';

interface FormData extends Omit<Question, 'id'> {
  id?: number;
}

const QuestionManagement: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    complexity: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestionsData();
  }, []);

  const fetchQuestionsData = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (err) {
      setError('Failed to fetch questions. Please try again.');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    if (!formData.title || !formData.description || !formData.category || !formData.complexity) {
      setError('All fields are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (formData.id) {
        await updateQuestion(formData.id, formData);
      } else {
        await createQuestion(formData);
      }
      fetchQuestionsData();
      setFormData({ title: '', description: '', category: '', complexity: '' });
      setError(null);
    } catch (err) {
      setError('Failed to save question. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestion(id);
      fetchQuestionsData();
    } catch (err) {
      setError('Failed to delete question. Please try again.');
    }
  };

  const handleEdit = (question: Question) => {
    setFormData(question);
    setError(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Question Management</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Question Title"
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Question Description"
          style={{ marginBottom: '10px', padding: '5px', width: '100%', height: '100px' }}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        >
          <option value="">Select Category</option>
          <option value="algorithms">Algorithms</option>
          <option value="data-structures">Data Structures</option>
        </select>
        <select
          name="complexity"
          value={formData.complexity}
          onChange={handleInputChange}
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        >
          <option value="">Select Complexity</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Submit</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Title</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Complexity</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{question.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{question.category}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{question.complexity}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => handleEdit(question)} style={{ marginRight: '5px', padding: '2px 5px' }}>Edit</button>
                <button onClick={() => handleDelete(question.id)} style={{ padding: '2px 5px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionManagement;