import React from 'react';
import { Question } from '../../models/Question';

interface QuestionListProps {
  questions: Question[];
  onDelete: (id: string) => void;
  onEdit: (question: Question) => void;
  onSelect: (question: Question) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onDelete, onEdit, onSelect }) => {
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
          <th>Difficulty</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => (
          <tr key={question._id} onClick={() => onSelect(question)}>
            <td>{question.questionId}</td>
            <td>{question.title}</td>
            <td>{question.categories.join(', ')}</td>
            <td className="description-cell">{question.description}</td>
            <td>{question.difficulty}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(question)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(question._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuestionList;