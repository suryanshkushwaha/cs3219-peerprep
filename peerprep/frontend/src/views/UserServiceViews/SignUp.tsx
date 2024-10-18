import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link and useNavigate for navigation
import { createUser } from "../../api/usersApi"; // Import the createUser API
import { AxiosError } from "axios"; // Import AxiosError for error handling

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // State to handle error messages
  const [success, setSuccess] = useState<boolean>(false); // State to track success
  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Basic validation before proceeding
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Call the createUser API
      await createUser(username, email, password);

      // On successful sign-up, display success message and reset error
      setSuccess(true);
      setError(null);

    } catch (error) {
      // Check if the error is an AxiosError (from axios) to safely access the response
      if (error instanceof AxiosError && error.response) {
        console.error("Sign up failed", error);

        // Handle specific API error messages
        if (error.response.status === 409) {
          setError("Username or email already exists.");
        } else if (error.response.status === 400) {
          setError("Please fill in all fields.");
        } else {
          setError("Sign up failed. Please try again.");
        }
      } else {
        // Handle non-Axios errors or unknown error types
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleSignUp}>Sign Up</button>
      
      {error && <p>{error}</p>} {/* Display error message */}
      
      {/* Display success message and login link after successful sign-up */}
      {success && (
        <div>
          <p>Account created successfully! You can now <Link to="/">log in</Link>.</p>
        </div>
      )}
    </div>
  );
};

export default SignUp;