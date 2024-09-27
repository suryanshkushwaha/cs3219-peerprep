import React from 'react';
import QuestionManagement from './views/QuestionManagement';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PeerPrep</h1>
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