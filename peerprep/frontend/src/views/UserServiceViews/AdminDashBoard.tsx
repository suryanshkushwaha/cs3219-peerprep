// src/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import { getAllUsers } from '../../api/usersApi'; // API function to fetch users
import { User } from '../../models/User'; // Import the User model

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]); // State to store user data
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (token) {
          const userData = await getAllUsers(token); // Fetch users from the API
          setUsers(userData); // Set the user data in state
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Display an error message if there's an error
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {/* Link to the profile page of the individual user */}
                <Link to={`/profile/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;