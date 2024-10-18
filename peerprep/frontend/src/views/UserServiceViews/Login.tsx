// src/Login.tsx
import React, { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom"; // Import Link to navigate to signup

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to store error messages
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        const { token, user } = await loginUser(email, password); // Destructure token and user from the response
  
        // Store the token and admin status in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("isAdmin", JSON.stringify(user.isAdmin));
        localStorage.setItem("userId", user.id);
  
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
      <div>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p>{error}</p>} {/* Display error message */}

        {/* Add Sign-Up link here */}
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
        {/* Add button to navigate to the Question Management service */}
        <p>
          <button onClick={() => navigate("/questions")}>Go to Question Management</button> {/* Navigate to /questions */}
        </p>
      </div>
    );
};
  
export default Login;