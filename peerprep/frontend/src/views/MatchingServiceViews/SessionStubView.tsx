import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const SessionStubView: React.FC = () => {
  const location = useLocation();
  const { sessionId, topic, difficulty, userId1, userId2 } = location.state || {};

  return (
    <div>
      <Link to="/" className="top-left-link">Go to Login</Link>
      <Link to="/matching" className="top-right-link">Go to Matching</Link>
      <h2>Session Details</h2>
      <p>Session ID: {sessionId}</p>
      <p>Topic: {topic}</p>
      <p>Difficulty: {difficulty}</p>
      <p>User ID: {userId1}</p>
    </div>
  );
};

export default SessionStubView;