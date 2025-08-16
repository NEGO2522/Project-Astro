import React, { useState, forwardRef } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

const ContactUs = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <FaTimes className="w-5 h-5" />
      </button>
      
      <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Contact Form */}
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Bharat Sharma"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="How can we help you?"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>

            <div className="sm:col-span-2 text-center mt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center justify-center group"
              >
                <span>Send Message</span>
                <FaPaperPlane className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;