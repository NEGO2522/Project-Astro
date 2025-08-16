import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4 text-center">
        <div 
          className={`relative w-full max-h-[90vh] bg-white p-6 sm:p-8 text-left shadow-xl transition-all duration-300 ease-out transform-gpu sm:rounded-2xl sm:max-w-2xl overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            sm:static sm:transform-none sm:transition-none
            fixed bottom-0 left-0 right-0 w-full rounded-t-3xl rounded-b-none
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Modal Content */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
