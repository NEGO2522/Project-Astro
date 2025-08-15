import React, { useState, useEffect } from 'react';
import { FaStar, FaCalendarAlt, FaChartLine, FaUserFriends, FaMobileAlt, FaRegClock, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import { fetchTranslations } from '../firebase/firebase';

// Animated grid pattern
const BackgroundPattern = () => {
  // Animation styles
  const styles = `
    @keyframes gridPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
    
    /* Content animations */
    @keyframes fadeInUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
    }
    
    /* Card hover effect */
    .feature-card {
      transition: all 0.3s ease, transform 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    
    /* Button hover effect */
    .cta-button {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .cta-button::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      background: rgba(255, 255, 255, 0.5);
      opacity: 0;
      border-radius: 100%;
      transform: scale(1, 1) translate(-50%, -50%);
      transform-origin: 50% 50%;
    }
    
    .cta-button:active::after {
      animation: ripple 1s ease-out;
    }
    
    @keyframes ripple {
      0% {
        transform: scale(0, 0);
        opacity: 1;
      }
      100% {
        transform: scale(100, 100);
        opacity: 0;
      }
    }
    .grid-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      background-color: white;
      background-image: 
        linear-gradient(rgba(0, 0, 0, 0.15) 0.7px, transparent 0.7px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0.7px, transparent 0.7px);
      background-size: calc(100% / 32) calc(100% / 32);
      opacity: 0.4;
      animation: gridPulse 8s ease-in-out infinite;
    }
  `;

  // Add styles to document head
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    // Add scroll animations
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.fade-in-up');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 50) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };
    
    // Initial check
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    return () => {
      document.head.removeChild(styleElement);
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return <div className="grid-container" />;
};

const scrollToSection = (e, sectionId) => {
  e.preventDefault();
  const section = document.querySelector(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

const Home = ({ language }) => {
  const [t, setT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Add styles for cursor effect
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
      setCursorPos({ x: mouseX, y: mouseY });
      
      if (!mouseMoved) {
        mouseMoved = true;
        animateTrail();
      }
    };

    // Handle hover states
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], [tabindex]');
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
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        const data = await fetchTranslations(language);
        if (data) {
          setT(data);
        }
      } catch (err) {
        console.error('Error loading translations:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !t) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || 'Failed to load content.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden text-sm sm:text-base bg-white">
      <BackgroundPattern />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/30 via-white/30 to-purple-50/30 -z-10"></div>

      {/* Hero Section */}
      <div className="relative pt-16 pb-12 sm:pt-20 md:pt-28 lg:pt-36 md:pb-24 lg:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4 animate-fade-in">
                {t.hero.tagline}
              </div>
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight" 
                dangerouslySetInnerHTML={{ __html: t.hero.title }}
              />
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
                <Link 
                  to="/login" 
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cta-button text-center flex items-center justify-center space-x-2 group w-full sm:w-auto"
                >
                  <span>{t.hero.startTrial}</span>
                  <FaChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <a 
                  href="#features" 
                  onClick={(e) => scrollToSection(e, '#features')}
                  className="border-2 border-gray-200 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-gray-50 hover:border-indigo-100 hover:text-indigo-600 transition-all duration-300 text-center flex items-center justify-center space-x-2 group w-full sm:w-auto cursor-pointer"
                >
                  <span>{t.hero.exploreFeatures}</span>
                  <FaChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </a>
              </div>
              
              <div className="pt-6 flex items-center justify-center lg:justify-start space-x-3 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?w=200&auto=format&fit=facearea&facepad=2&q=60', // Indian man with turban
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=facearea&facepad=2&q=60',  // Indian woman in traditional attire
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=facearea&facepad=2&q=60'   // Young Indian man
                  ].map((src, i) => (
                    <img 
                      key={i}
                      src={src}
                      alt={language === 'en' ? "Indian user" : "भारतीय उपयोगकर्ता"}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-700">{t.hero.trustedBy}</span>
              </div>
            </div>
            
            <div className="relative w-full lg:w-1/2 mt-10 lg:mt-0">
              <div className="relative z-10 bg-white rounded-2xl p-1 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 hover:shadow-xl">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="bg-white p-1 rounded-xl relative feature-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gray-800 rounded-t-lg p-3 flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-inner">
                        <span className="text-lg">👴</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none max-w-xs">
                        <p className="text-sm text-gray-800">नमस्ते! मैं आपका AI पंडित हूँ। मैं आपकी कैसे मदद कर सकता हूँ?</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-2xl rounded-tr-none max-w-xs shadow-sm">
                        <p className="text-sm">आज मेरा राशिफल क्या है?</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center pt-2">
                      <div className="text-xs text-gray-400 flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        <span>AI Pandit is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-10 right-20 w-24 h-24 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="hidden lg:block absolute top-1/4 -left-20 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="hidden lg:block absolute top-1/3 -right-20 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/30 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              Features
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t.featuresTitle}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              {t.featuresSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {t.features.map((feature, index) => {
              const icons = [
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg sm:text-xl mb-4 sm:mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                  <FaStar className="w-6 h-6" />
                </div>,
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg sm:text-xl mb-4 sm:mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                  <FaCalendarAlt className="w-6 h-6" />
                </div>,
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg sm:text-xl mb-4 sm:mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                  <FaChartLine className="w-6 h-6" />
                </div>,
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg sm:text-xl mb-4 sm:mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                  <FaUserFriends className="w-6 h-6" />
                </div>,
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg sm:text-xl mb-4 sm:mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                  <FaMobileAlt className="w-6 h-6" />
                </div>,
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg sm:text-xl mb-4 sm:mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                  <FaRegClock className="w-6 h-6" />
                </div>
              ];
              
              return (
                <div key={index} className="group relative bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1">
                  <div className="absolute inset-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 -z-10 transition-opacity duration-300"></div>
                  <div className="flex flex-col items-center text-center">
                    {icons[index]}
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
      </div>
      {/* Add a subtle gradient to the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-white to-transparent -z-10"></div>
    </div>
  );
};

// Add custom animations
const style = document.createElement('style');
style.textContent = `
  @keyframes grid-pulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.2; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-grid-pulse {
    animation: grid-pulse 8s ease-in-out infinite;
  }
  .animate-shimmer {
    animation: shimmer 12s linear infinite;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;
document.head.appendChild(style);

export default Home;