import React from "react";
import { useLocation } from "react-router-dom";

const SessionStubView: React.FC = () => {
  const location = useLocation();
  const { sessionId, topic, difficulty, userId1, userId2 } = location.state || {};

  return (
    <div>
      <h2>Session Details</h2>
      <p>Session ID: {sessionId}</p>
      <p>Topic: {topic}</p>
      <p>Difficulty: {difficulty}</p>
      <p>User 1: {userId1}</p>
      <p>User 2: {userId2}</p>
    </div>
  );
};

export default SessionStubView;