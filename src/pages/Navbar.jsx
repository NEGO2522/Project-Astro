import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaGlobe, FaChevronRight, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { fetchTranslations } from '../firebase/firebase';

const Navbar = ({ language, setLanguage }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [t, setT] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        const data = await fetchTranslations(language);
        if (data && data.nav) {
          setT(data.nav);
        }
      } catch (err) {
        console.error('Error loading navigation translations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  if (loading) {
    return (
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-lg py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="hidden md:flex space-x-8">
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-10 bg-indigo-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-transparent/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent md:bg-transparent py-3 md:py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Left side - Mobile menu button */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-label={t.menu}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
              <span className="sr-only">{t.menu}</span>
            </button>
          </div>
          
          {/* Center - Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link to="/" className="flex items-center group" onClick={() => setIsMenuOpen(false)}>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                God's Plan
              </span>
            </Link>
          </div>
          
          {/* Right side - Desktop Navigation and Profile */}
          <div className="flex items-center justify-end space-x-2 md:space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium group relative">
                {t.features}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
            
            {/* Language Selector */}
            <div className="hidden md:block">
              <button 
                onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-1.5 text-gray-700 hover:text-indigo-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50"
                aria-label={language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
              >
                <FaGlobe className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {language === 'en' ? 'हिंदी' : 'English'}
                </span>
              </button>
            </div>
            
            {/* Profile Section */}
            {isAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                      <span className="text-indigo-700 font-semibold text-lg">
                        {currentUser?.displayName 
                          ? currentUser.displayName.charAt(0).toUpperCase() 
                          : currentUser?.email 
                            ? currentUser.email.charAt(0).toUpperCase() 
                            : 'U'}
                      </span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-700 font-medium">{currentUser?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 text-left"
                      >
                        <FaSignOutAlt className="w-4 h-4 text-red-500" />
                        <span>{t.signOut || 'Sign out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="hidden md:block">
                    <Link 
                      to="/login" 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span>{t.getStarted || 'Get Started'}</span>
                      <FaChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                  <Link 
                    to="/login" 
                    className="md:hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center w-10 h-10"
                    aria-label="Login"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            
            {/* Mobile Language Selector */}
              <div className="md:hidden">
                <button 
                  onClick={() => {
                    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
                    setIsMenuOpen(true); // Open menu when changing language on mobile
                  }}
                  className="flex items-center justify-center w-10 h-10 text-gray-700 hover:text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50"
                  aria-label={language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
                >
                  <FaGlobe className="w-5 h-5" />
                </button>
              </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          ref={menuRef}
          className={`md:hidden fixed inset-x-0 top-20 bottom-0 bg-white shadow-lg transition-all duration-300 ease-in-out transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            height: 'calc(100vh - 5rem)', // Full height minus navbar
            zIndex: 40,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pt-4 pb-8 space-y-1">
            <a 
              href="#features" 
              className="block px-4 py-3 text-lg text-gray-800 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.features}
            </a>
            
            {/* Mobile Language Selector - Hidden since we show it in the main navbar */}
            <div className="md:hidden">
              <h3 className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Language
              </h3>
              <div className="mt-1">
                <button 
                  onClick={() => {
                    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <FaGlobe className="w-5 h-5 mr-3 text-gray-500" />
                  {language === 'en' ? 'हिंदी में देखें' : 'View in English'}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              {isAuthenticated && (
                <div className="flex items-center px-4 py-3 text-gray-700 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    {currentUser?.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="Profile" 
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-9 h-9 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{currentUser?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                </div>
              )}
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-4 py-3 text-gray-700 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 overflow-hidden">
                      <span className="text-indigo-700 font-semibold text-xl">
                        {currentUser?.displayName 
                          ? currentUser.displayName.charAt(0).toUpperCase() 
                          : currentUser?.email 
                            ? currentUser.email.charAt(0).toUpperCase() 
                            : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{currentUser?.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500">{currentUser?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg font-medium transition-colors duration-300 text-left"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>{t.signOut || 'Sign Out'}</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.getStarted || 'Get Started'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;