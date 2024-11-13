// src/Login.tsx
import React, { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom"; // Import Link to navigate to signup

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to store error messages
    const navigate = useNavigate();
    
    // Temp stubs needed to move into Collab stub
    const topic = "algorithms";
    const difficulty = "easy"; 
    const sessionId ="session1";
    const questionId="Q-42: Write an algorithm for Radix Sort";
  
    const handleLogin = async () => {
      try {
        const { token, user } = await loginUser(email, password); // Destructure token and user from the response
  
        // Store the token and admin status in sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("isAdmin", JSON.stringify(user.isAdmin));
        sessionStorage.setItem("userId", user.id);
  
        // Redirect based on admin status
        if (user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/profile/" + user.id);
        }
      } catch (error) {
        console.error("Login failed", error);
        setError("Login failed. Please check your credentials and try again."); // Set error message
      }
    };

    return (
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <div className="form-section">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          <div className="form-section">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          <button onClick={handleLogin} className="submit-btn">Login</button>
  
          {error && <p className="error-message">{error}</p>}
  
          <p>
            Don't have an account?
            <p><Link to="/signup" className="link">Sign up here</Link></p>
          </p>
        </div>
      </div>
    );
};
  
export default Login;