import React from 'react';
import { Question } from '../models/Question.tsx';

interface QuestionListProps {
  questions: Question[];
  onDelete: (id: number) => void;
  onEdit: (question: Question) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onDelete, onEdit }) => {
  if (questions.length === 0) {
    return <p>No questions available.</p>;
  }
  
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Categories</th>
          <th>Complexity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => (
          <tr key={question.id}>
            <td>{question.title}</td>
            <td>{question.categories.join(', ')}</td>
            <td>{question.complexity}</td>
            <td>
              <button onClick={() => onEdit(question)}>Edit</button>
              <button onClick={() => onDelete(question.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuestionList;