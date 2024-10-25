import { useNavigate, Link } from "react-router-dom";
import React, { useState } from 'react';
import { createMatchingRequest } from "../../api/matchingApi.ts";
import { listenToMatchStatus } from "../../api/matchingApi.ts"; // Make sure this is correctly implemented for SSE

const MatchingServiceMainView: React.FC = () => {
  // State for topic and difficulty
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const userId = sessionStorage.getItem('userId'); // Retrieve token from sessionStorage

  // Handle input changes
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopic(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Waiting for a match...");

    try {
      // Create a new matching request
      await createMatchingRequest(userId, topic, difficulty);

      // Use server-sent events to listen for match status updates
      const stopListening = listenToMatchStatus(
        userId!,
        (data) => {
          setStatusMessage(data.message);
        },
        (error) => {
          setStatusMessage("Error: Unable to fetch match status.");
          setLoading(false);
          stopListening(); // Stop listening on error
        }
      );

    } catch (error) {
      setStatusMessage("Error: Failed to create match request.");
      setLoading(false);
    }

    // Reset form state
    setTopic("");
    setDifficulty("");
  };

  return (
    <div className="matching-container">
      <Link to="/" className="top-left-link">Go to Login</Link>
      <Link to="/questions" className="top-right-link">Go to Questions</Link>
      <div className="matching-form">
        <h2>Select a Topic and Difficulty</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section category-group">
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

          <div className="form-section">
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Matching..." : "Submit"}
          </button>
        </form>
        {/* Display status message */}
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </div>
  );
};

export default MatchingServiceMainView;