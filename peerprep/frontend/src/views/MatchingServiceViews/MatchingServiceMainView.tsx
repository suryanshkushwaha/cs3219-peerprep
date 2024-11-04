import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { createMatchingRequest, listenToMatchStatus, deleteMatchingRequest} from "../../api/matchingApi.ts";
import { ApiError } from "../../api/matchingApi";

const MatchingServiceMainView: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string>('Q');
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [matchFound, setMatchFound] = useState<boolean>(false); 
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle input changes
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopic(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
  };

  // Start the loading bar animation (30 seconds total)
  const startProgressBar = () => {
    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / 30, 100)); // Update every second
    }, 1000);
  };

  // Stop the loading bar animation
  const stopProgressBar = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
  };

  const getValueAfterDelimiter = (input: string): string | null => {
    // Split the input string using "-Q" as the delimiter
    const parts = input.split("-Q");

    // Check if there is a part after the delimiter
    if (parts.length > 1) {
        return parts[1]; // Return the part after "-Q"
    } else {
        return "Empty Q"
    }
    return null;
};

  const handleSetQuestionId = (fullSessionId: string) => {
    const parsedQuestionId = getValueAfterDelimiter(fullSessionId);
    if (parsedQuestionId != null) {
        setQuestionId(parsedQuestionId);
    }
  }

  // Function to listen to match status, declared outside handleSubmit
  const startListeningToMatchStatus = () => {
    const stopListening = listenToMatchStatus(
      userId!,
      (data) => {
        setStatusMessage(data.message);
        if (data.message.includes("Session")) {
          setStatusMessage(data.message);
          setSessionId(data.message);
          handleSetQuestionId(data.message);
          console.log(data.message);
          setMatchFound(true); // Set match status to true
          stopProgressBar();
          setStatusMessage(`Match found for ${topic} and ${difficulty}!`);
          setLoading(false);
          stopListening();
        }
    },
      (error) => {
        setStatusMessage("Match timed out. Please try again.");
        console.error(error);
        setLoading(false);
        stopProgressBar();
        stopListening();
      }
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMatchFound(false); // Reset match status
    setStatusMessage("Waiting for a match...");
    startProgressBar(); // Start the progress bar

    try {
      // Attempt to create a matching request
      await createMatchingRequest(userId, topic, difficulty);

      // If successful, listen for match status updates
      startListeningToMatchStatus();
    } catch (error) {
      // Check if the error code is 409, indicating an active session
      if (error instanceof ApiError && (error.message === "You are already in an active session" || error.message === "You are already looking for a match in the matching queue")) {
        // Start listening to the existing session status as if the request was successful
        startListeningToMatchStatus();
      } else {
        // Handle other errors
        setStatusMessage("Error: Failed to create match request.");
        setLoading(false);
        stopProgressBar();
      }
    }
  };

  // Handle timeout after 30 seconds
  useEffect(() => {
    if (progress >= 100) {
      setLoading(false);
      //setStatusMessage("Match timed out. Please try again.");
      stopProgressBar();
    }
  }, [progress]);

  // Handle delete request
  const handleDeleteRequest = () => {
    deleteMatchingRequest(userId!); // Fire-and-forget API request
  };

  // Handle navigation to session stub
  const goToSession = () => {
    navigate('/sessionStub', {
      state: {
        sessionId: userId,
        topic,
        difficulty,
        userId1: userId,
        userId2: 'OtherUserId', // Replace with actual matched user ID from the data
      },
    });
  };

  return (
    <div className="matching-container">
      <Link to="/" className="top-left-link">Go to Login</Link>
      <Link to="/questions" className="top-right-link">Go to Questions</Link>

      <div className="matching-form">
        <h2>Select a Topic and Difficulty</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section category-group">
            <select name="topic" value={topic} onChange={handleTopicChange} required>
              <option value="">Select Topic</option>
              <option value="algorithms">Algorithms</option>
              <option value="data-structures">Data Structures</option>
              <option value="dynamic-programming">Dynamic Programming</option>
              <option value="graphs">Graphs</option>
              <option value="strings">Strings</option>
            </select>
          </div>

          <div className="form-section">
            <select name="difficulty" value={difficulty} onChange={handleDifficultyChange} required>
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
        {statusMessage && <p className="status-message">{statusMessage}</p>}

        {/* Show "Go to Session" link if match is found */}
        {matchFound && (
            <button
              onClick={() => navigate("/collabFull/" + topic + "/" + difficulty + "/" + questionId + "/" + sessionId)}
              className="center-link"
            >
            Go to Session
            </button>
        )}

        {/* Loading bar */}
        {loading && (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        {/* Add the cancel button below the loading bar */}
        {loading && !matchFound && (
          <>
            {/* Cancel button to remove the matching request */}
          <button
            onClick={() => {
              handleDeleteRequest(); // Fire-and-forget API request, no error handling
            }}
            className="cancel-btn"
          >
          Cancel Matching
          </button>
  </>
)}
        
      </div>
    </div>
  );
};

export default MatchingServiceMainView;

/*
          <Link
          to={{
            pathname: "/sessionStub",
          }}
          state={{
            sessionId: sessionId, // Replace with the actual session ID if different
            topic,
            difficulty,
            userId1: userId,
          }}
          className="center-link"
          >
          Go to Session
          </Link>

*/