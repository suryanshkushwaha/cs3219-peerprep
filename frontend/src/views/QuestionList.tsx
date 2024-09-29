import React from 'react';
import { Question } from '../models/Question';

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
    <table className="question-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Categories</th>
          <th>Description</th>
          <th>Complexity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => (
          <tr key={question.id}>
            <td>{question.id}</td>
            <td>{question.title}</td>
            <td>{question.categories.join(', ')}</td>
            <td className="description-cell">{question.description}</td>
            <td>{question.complexity}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(question)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(question.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuestionList;