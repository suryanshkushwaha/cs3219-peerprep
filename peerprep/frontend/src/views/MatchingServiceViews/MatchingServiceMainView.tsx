import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Request } from "../../models/Request";
import { getMatchStatus } from "../../api/matchingApi.ts";
import { createMatchingRequest } from "../../api/matchingApi.ts";
import { MatchingRequestResponse } from "../../api/matchingApi.ts";

const MatchingServiceMainView: React.FC = () => {
  // State for topic and difficulty
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const userId = localStorage.getItem('userId'); // Retrieve token from localStorage

  // Handle input changes
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopic(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
  };

  // Handle form submission
  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace placeholder alert with actual matching logic
    //alert(`Matching for Topic: ${topic}, Difficulty: ${difficulty}, User: ${userId}`);
    const res: MatchingRequestResponse = createMatchingRequest(userId, topic, difficulty);
    console.log("-------- DATA RECEIVED -----")
    console.log(res.data);
    alert(res);
    // Reset state
    setTopic('');
    setDifficulty('');
  };*/

   // Timer logic: Update time remaining every second
   useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => (prev ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer
    }
  }, [timeRemaining]);

  // Polling backend for match status
  const checkMatchStatus = async () => {
    try {
      const response: MatchingRequestResponse = await getMatchStatus(userId!);
      if (response.data.status === "matched") {
        setStatusMessage("Success! Match found.");
        setLoading(false); // Stop loading
        return true;
      }
    } catch (error) {
      setStatusMessage("Error: Unable to fetch match status.");
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeRemaining(30); // Set 30 seconds countdown
    setStatusMessage("Waiting for a match...");

    try {
      await createMatchingRequest(userId, topic, difficulty);

      // Poll for match status every 3 seconds
      const interval = setInterval(async () => {
        const matched = await checkMatchStatus();
        if (matched || timeRemaining === 0) {
          clearInterval(interval); // Stop polling
          if (timeRemaining === 0) setStatusMessage("Failure: No match found. Try again.");
        }
      }, 3000);
    } catch (error) {
      setStatusMessage("Error: Failed to create match request.");
      setLoading(false); // Stop loading
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

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
        {/* Display status message and timer */}
        {statusMessage && <p>{statusMessage}</p>}
        {timeRemaining !== null && <p>Time Remaining: {timeRemaining}s</p>}
      </div>
    </div>
  );
};

export default MatchingServiceMainView;