import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaEnvelope, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { 
  auth, 
  database,
  signInWithGoogle, 
  sendSignInLink, 
  isEmailLink, 
  signInWithEmailLink
} from '../firebase/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ language }) => {
  const { login } = useAuth();
  const [t, setT] = useState({});
  const [translationsLoading, setTranslationsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Add cursor trail effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .cursor-trail {
        position: fixed;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(99, 102, 241, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) scale(0.8);
        transition: transform 0.1s ease-out, opacity 0.3s ease-out;
        box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
      }
      
      .cursor-trail.active {
        width: 24px;
        height: 24px;
        background: rgba(99, 102, 241, 0.2);
        border-color: rgba(79, 70, 229, 0.9);
        box-shadow: 0 0 12px rgba(79, 70, 229, 0.6);
      }
    `;
    document.head.appendChild(style);

    // Create trail elements
    const trailElements = [];
    const trailLength = 10;
    
    for (let i = 0; i < trailLength; i++) {
      const trailDot = document.createElement('div');
      trailDot.className = 'cursor-trail';
      trailDot.style.opacity = 0;
      document.body.appendChild(trailDot);
      trailElements.push(trailDot);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = [];
    let trailY = [];
    let mouseMoved = false;
    
    // Initialize trail positions
    for (let i = 0; i < trailLength; i++) {
      trailX[i] = 0;
      trailY[i] = 0;
    }
    
    const animateTrail = () => {
      // Update trail positions
      for (let i = 0; i < trailLength; i++) {
        // The first dot follows the mouse directly
        if (i === 0) {
          trailX[i] = mouseX;
          trailY[i] = mouseY;
        } else {
          // Each subsequent dot follows the previous one with a delay
          trailX[i] = trailX[i] + (trailX[i-1] - trailX[i]) / 4;
          trailY[i] = trailY[i] + (trailY[i-1] - trailY[i]) / 4;
        }
        
        // Update the position and opacity of each dot
        if (trailElements[i]) {
          trailElements[i].style.left = `${trailX[i]}px`;
          trailElements[i].style.top = `${trailY[i]}px`;
          
          // Fade out the trail dots based on their position in the trail
          const opacity = 1 - (i / (trailLength * 1.5));
          const scale = 0.6 + (0.4 * (i / trailLength));
          
          trailElements[i].style.opacity = opacity.toString();
          trailElements[i].style.transform = `translate(-50%, -50%) scale(${scale})`;
          
          if (isHovered) {
            trailElements[i].classList.add('active');
          } else {
            trailElements[i].classList.remove('active');
          }
        }
      }
      
      if (mouseMoved) {
        requestAnimationFrame(animateTrail);
      }
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!mouseMoved) {
        mouseMoved = true;
        animateTrail();
      }
    };

    // Handle hover states for interactive elements
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], [tabindex], input, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.head.removeChild(style);
      trailElements.forEach(element => {
        if (element && element.parentNode) {
          document.body.removeChild(element);
        }
      });
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isHovered]);

  // Load login data from Firebase when language changes
  useEffect(() => {
    let isMounted = true;
    
    const loadLoginData = async () => {
      try {
        setTranslationsLoading(true);
        // Fetch data from the 'login' node in Firebase
        const loginRef = ref(database, `login/${language}`);
        const snapshot = await get(loginRef);
        
        if (isMounted) {
          if (snapshot.exists()) {
            setT(snapshot.val());
          } else {
            console.warn('No login data found in Firebase for language:', language);
            // Fallback to empty object to prevent errors
            setT({});
          }
        }
      } catch (error) {
        console.error('Error loading login translations from Firebase:', error);
        if (isMounted) {
          // Fallback to empty object to prevent errors
          setT({});
        }
      } finally {
        if (isMounted) {
          setTranslationsLoading(false);
        }
      }
    };

    // Set loading to true when language changes
    setTranslationsLoading(true);
    loadLoginData();
    
    return () => {
      isMounted = false;
    };
  }, [language]);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're handling a sign-in link
  useEffect(() => {
    if (isEmailLink(window.location.href)) {
      const handleEmailLinkSignIn = async () => {
        try {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt(translations.emailPrompt || 'Please provide your email for confirmation');
          }
          
          if (email) {
            const userCredential = await signInWithEmailLink(email, window.location.href);
            const user = userCredential.user;
            
            // Store user data in context and localStorage
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              photoURL: user.photoURL
            };
            
            login(userData);
            navigate('/dashboard');
          }
        } catch (error) {
          setError(error.message);
          console.error('Error signing in with email link', error);
        }
      };
      
      handleEmailLinkSignIn();
    }
  }, [navigate, t.emailPrompt, login]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      
      // Store user data in context and localStorage
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL
      };
      
      login(userData);
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.error('Error signing in with Google', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSignInLink = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError(translations.emailRequired);
      return;
    }

    try {
      setLoading(true);
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };
      
      // Store the email in localStorage for after sign-in
      window.localStorage.setItem('emailForSignIn', formData.email);
      
      await sendSignInLink(formData.email, actionCodeSettings);
      setEmailSent(true);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Error sending sign in link', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Handle login logic here
    console.log('Login attempt with:', formData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    // navigate('/dashboard'); // Uncomment when ready
  };

  // Add interactive class to form elements for hover effect
  useEffect(() => {
    const formElements = document.querySelectorAll('input, button, a[href]');
    formElements.forEach(el => {
      el.classList.add('interactive');
    });
  }, []);

  // Background pattern component (matching Home.jsx)
  const BackgroundPattern = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
    </div>
  );

  // Show loading state only if we don't have any translations yet
  if (translationsLoading && Object.keys(t).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Use the translations from state (loaded from Firebase)
  const translations = t;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-x-hidden flex items-center justify-center px-4 sm:px-6">
      <BackgroundPattern />
      
      {/* Decorative elements */}
      <div className="hidden lg:block absolute top-1/4 -left-20 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden lg:block absolute top-1/3 -right-20 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">{translations.welcome}</h1>
          <p className="text-gray-600">{translations.signInPrompt}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Google Login Button */}
            <div className="mb-6">
              <button 
                className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-xl transition-colors duration-200"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <FaGoogle className="w-4 h-4" />
                <span>{translations.signInWithGoogle}</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{translations.orContinueWith}</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSendSignInLink} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {translations.emailAddress}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
                    placeholder={translations.emailPlaceholder}
                    disabled={loading || emailSent}
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {emailSent ? (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg flex items-center space-x-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>{translations.linkSentMessage}</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaEnvelope className="w-4 h-4 mr-2" />
                      {translations.sendSignInLink}
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default Login;