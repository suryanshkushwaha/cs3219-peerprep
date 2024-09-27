import React, { useState, useEffect } from 'react';
import { Question } from '../models/Question';

interface QuestionFormProps {
  onSubmit: (formData: Omit<Question, 'id'>) => void;
  initialData: Partial<Question> | null;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Question, 'id'>>({
    title: '',
    description: '',
    categories: [],
    complexity: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        categories: initialData.categories || [],
        complexity: initialData.complexity || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      categories: checked
        ? [...prevData.categories, value]
        : prevData.categories.filter(cat => cat !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', categories: [], complexity: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Question Title"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Question Description"
        required
      />
      <div>
        <label>Categories:</label>
        {['algorithms', 'data-structures', 'dynamic-programming', 'graphs', 'strings'].map(category => (
          <label key={category}>
            <input
              type="checkbox"
              name="categories"
              value={category}
              checked={formData.categories.includes(category)}
              onChange={handleCategoryChange}
            />
            {category}
          </label>
        ))}
      </div>
      <select
        name="complexity"
        value={formData.complexity}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Complexity</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button type="submit">{initialData ? 'Update' : 'Submit'}</button>
    </form>
  );
};

export default QuestionForm;