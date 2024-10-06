import React from 'react';
import QuestionManagement from './views/QuestionManagement';
import './App.css';
/*
const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PeerPrep QMS!</h1>
      </header>
      <main className="App-main">
        <QuestionManagement />
      </main>
      <footer className="App-footer">
        <p>© Group X</p>
      </footer>
    </div>
  );
};

export default App;
*/

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import AdminDashboard from './AdminDashBoard';
import PrivateRoute from './PrivateRoute'; // Assuming you have a PrivateRoute component
import SignUp from './SignUp'; // Import the new SignUp component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route for Login */}
        <Route path="/" element={<Login />} />

        {/* Public Route for Sign-Up */}
        <Route path="/signup" element={<SignUp />} /> {/* New Sign-Up Route */}

        {/* Protected Route for User Profile */}
        <Route path="/profile/:userId" element={<Profile />} />

        {/* Protected Route for Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredAdmin={true}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
