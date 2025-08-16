import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './components/Home';
import Navbar from './pages/Navbar';
import Login from './auth/Login';
import ContactUs from './pages/ContactUs';
// import Chat from './components/Chat';

// Wrapper component to provide auth context to Home
const HomeWithAuth = ({ language, setLanguage }) => {
  const { isAuthenticated } = useAuth();
  return <Home language={language} setLanguage={setLanguage} isAuthenticated={isAuthenticated} />;
};

const NavbarWithAuth = ({ language, setLanguage }) => {
  const { isAuthenticated } = useAuth();
  return <Navbar language={language} setLanguage={setLanguage} isAuthenticated={isAuthenticated} />;
};

function App() {
  const [language, setLanguage] = useState('en');

  return (
    <AuthProvider>
      <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <div className="App min-h-screen bg-gray-50">
          <NavbarWithAuth language={language} setLanguage={setLanguage} />
          <main className="pt-2">
            <Routes>
              <Route path="/" element={<HomeWithAuth language={language} setLanguage={setLanguage} />} />
              <Route path="/login" element={<Login language={language} />} />
              <Route path="/contact" element={<ContactUs language={language} setLanguage={setLanguage} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;