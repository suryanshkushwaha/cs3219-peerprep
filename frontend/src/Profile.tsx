// src/Profile.tsx
import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUser } from './api/usersApi'; // Import the getUserProfile and updateUser functions
import { useParams } from 'react-router-dom'; // Import useParams to get userId from the URL
import { User } from './models/User'; // Import the User model

const Profile = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from the URL
  const [user, setUser] = useState<User | null>(null); // State to store user data
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for handling errors
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode

  // Form state for updating user details
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage

        if (token && userId) {
          const userData = await getUserProfile(userId, token); // Fetch the user profile data
          setUser(userData); // Set user data in state
          setFormData({
            username: userData.username,
            email: userData.email,
            password: '', // Leave password blank by default
          });
        } else {
          setError('No token or user ID found. Please log in.');
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProfile();
  }, [userId]); // Add userId to the dependency array

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token && userId) {
      try {
        const updatedUser = await updateUser(userId, formData, token); // Call the updateUser API

        // Update the local state directly with the new form data (no need to fetch again)
        setUser({
          ...updatedUser,
          username: formData.username,
          email: formData.email,
          // Password shouldn't be stored in state, so no need to update password in the UI
        });

        // Turn off editing mode
        setIsEditing(false);

      } catch (error) {
        console.error('Failed to update user', error);
        setError('Failed to update profile. Please try again later.');
      }
    }
  };

  if (loading) return <div>Loading...</div>; // Display loading state while fetching data
  if (error) return <div>{error}</div>; // Display an error message if an error occurred

  return (
    <div>
      {user ? (
        <>
          <h2>Profile: {user.username}</h2>
          <p>Email: {user.email}</p>
          <p>Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
          <p>Account Created: {new Date(user.createdAt).toLocaleString()}</p>
          
          {isEditing ? (
            // Edit form for user profile details
            <form onSubmit={handleSubmit}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Password (Leave blank to keep current password):</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default Profile;