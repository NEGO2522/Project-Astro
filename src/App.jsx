import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './pages/Navbar';
import Login from './auth/Login';
// import Chat from './components/Chat';

function App() {
  const [language, setLanguage] = useState('en');

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar language={language} setLanguage={setLanguage} />
        <main className="pt-2">
          <Routes>
            <Route path="/" element={<Home language={language} setLanguage={setLanguage} />} />
            <Route path="/login" element={<Login language={language} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;