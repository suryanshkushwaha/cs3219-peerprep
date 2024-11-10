import React from 'react';
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
import Login from './views/UserServiceViews/Login';
import Profile from './views/UserServiceViews/Profile';
import AdminDashboard from './views/UserServiceViews/AdminDashBoard';
import PrivateRoute from './views/UserServiceViews/PrivateRoute'; // Assuming you have a PrivateRoute component
import SignUp from './views/UserServiceViews/SignUp'; // Import the new SignUp component
import QuestionService from './views/QuestionServiceViews/QuestionManagement';
import MatchingService from './views/MatchingServiceViews/MatchingServiceMainView';
import SessionStubView from './views/MatchingServiceViews/SessionStubView';
import CollaborationServiceView from './views/CollabServiceViews/CollabServiceMainView';
import CollaborationServiceIntegratedView from './views/CollabServiceViews/CollabServiceIntegratedView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route for Login */}
        <Route path="/" element={<Login />} />

        {/* Public Route for Question Management */}
        <Route path="/questions" element={<QuestionService />} />

        {/* Public Route for Matching Service */}
        <Route path="/matching" element={<MatchingService />} />
        
        {/* Public Route for Session View (Stub for now) */}
        <Route path="/sessionStub" element={<SessionStubView />} />

        {/* Public Route for Collaboration Service View without sockets*/}
        <Route path="/collab" element={<CollaborationServiceView topic={''} difficulty={''} sessionId={''} />} />

        {/* Public Route for Collaboration Service Integrated View */}
        <Route path="/collabFull/:sessionId" element={<CollaborationServiceIntegratedView />} />

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
