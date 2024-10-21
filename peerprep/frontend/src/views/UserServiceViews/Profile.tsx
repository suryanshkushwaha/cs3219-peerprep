// src/Profile.tsx
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../api/usersApi'; // Import the getUserProfile function
import { useParams, Link } from 'react-router-dom'; // Import useParams to get userId from the URL
import { User } from '../../models/User'; // Import the User model

const Profile = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from the URL
  const [user, setUser] = useState<User | null>(null); // State to store user data
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for handling errors

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage

        if (token && userId) {
          const userData = await getUserProfile(userId, token); // Fetch the user profile data
          setUser(userData); // Set user data in state
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

  if (loading) return <div>Loading...</div>; // Display loading state while fetching data
  if (error) return <div>{error}</div>; // Display an error message if an error occurred

  return (
    <div>
      <Link to="/matching" className="top-right-link">Go to Matching Service</Link>
      {user ? (
        <>
          <h2>Profile: {user.username}</h2>
          <p>Email: {user.email}</p>
          <p>Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
          <p>Account Created: {new Date(user.createdAt).toLocaleString()}</p>
        </>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default Profile;