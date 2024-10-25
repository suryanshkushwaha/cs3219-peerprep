import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { createMatchingRequest, listenToMatchStatus } from "../../api/matchingApi.ts";

const MatchingServiceMainView: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  //const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Waiting for a match...");
    startProgressBar(); // Start the progress bar
    
    try {
      await createMatchingRequest(userId, topic, difficulty);
      
      // Listen for match status updates using SSE
      /*const stopListening = listenToMatchStatus(
      userId!,
      (data) => {
      if (data.data.status === "matched") {
      stopProgressBar();
      setStatusMessage(`Match Found for ${topic} and ${difficulty}!`);
      setLoading(false);
      stopListening(); // Stop listening for further updates
      
      // Add "Go to Session" button when matched
      setTimeout(() => {
      navigate('/sessionStub', {
      state: {
      sessionId: data.data.userId,
      topic,
      difficulty,
      userId1: userId,
      userId2: data.data.userId,
      },
      });
      }, 2000);
      }
      }*/
      
      const stopListening = listenToMatchStatus(
        userId!,
        (data) => {
          setStatusMessage(data.message);
          if (data.message.includes("Session")) {
            setStatusMessage(data.message);
            console.log(data.message);
            setStatusMessage(`Match found for ${topic} and ${difficulty}!`);
            setLoading(false);
            stopListening();
          }
          
          setTimeout(() => {
            navigate('/sessionStub', {
              state: {
                sessionId: data.data.userId,
                topic,
                difficulty,
                userId1: userId,
                userId2: data.data.userId,
              },
            });
          }, 1000);
        },
        (error) => {
          setStatusMessage("Error: Unable to fetch match status.");
          console.log(error)
          setLoading(false);
          stopProgressBar();
          stopListening(); // Stop listening on error
        }
      );
    } catch (error) {
      setStatusMessage("Error: Failed to create match request.");
      setLoading(false);
      stopProgressBar();
    }
  };
  
  // Handle timeout after 30 seconds
  useEffect(() => {
    if (progress >= 100) {
      setLoading(false);
      setStatusMessage("Match timed out. Please try again.");
      stopProgressBar();
    }
  }, [progress]);
  
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
    
    {/* Loading bar */}
    {loading && (
      <div className="progress-bar-container">
      <div
      className="progress-bar"
      style={{ width: `${progress}%` }}
      ></div>
      </div>
    )}
    </div>
    </div>
  );
};

export default MatchingServiceMainView;

/*import { useNavigate, Link } from "react-router-dom";
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
console.log(error)
setLoading(false);
stopListening(); // Stop listening on error
}
);

} catch (error) {
setStatusMessage("Error: Failed to create match request.");
setLoading(false);
}

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
{/* Display status message *//*}
{statusMessage && <p>{statusMessage}</p>}
</div>
</div>
);
};

export default MatchingServiceMainView;
*/