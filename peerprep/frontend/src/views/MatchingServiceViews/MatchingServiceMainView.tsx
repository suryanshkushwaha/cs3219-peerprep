import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';


const MatchingServiceMainView: React.FC = () => {
  // State for topic and difficulty
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');

  // Handle input changes
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopic(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace placeholder alert with actual matching logic
    alert(`Matching for Topic: ${topic}, Difficulty: ${difficulty}`);
    // Reset state
    setTopic('');
    setDifficulty('');
  };

  return (
    <div className="matching-container">
      <Link to="/" className="top-left-link">Go to Login</Link>
      <Link to="/questions" className="top-right-link">Go to Questions</Link>
      <div className="matching-form">
        <h2>Select a Topic and Difficulty</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group category-group">
            <select
              name="topic"
              value={topic}
              onChange={handleTopicChange}
              required
            >
              <option value="">Select Topic</option>
              <option value="algorithms">Algorithms</option>
              <option value="data-structures">Data Structures</option>
              <option value="dynamic-programming">Dynamic Programming</option>
              <option value="graphs">Graphs</option>
              <option value="strings">Strings</option>
            </select>
          </div>

          <div className="form-group">
            <select
              name="difficulty"
              value={difficulty}
              onChange={handleDifficultyChange}
              required
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MatchingServiceMainView;