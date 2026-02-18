import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-indigo-400 italic">EduMind</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering learners with MERN-stack driven education. Built with modern technology for the next generation.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/courses" className="hover:text-indigo-400 transition">Courses</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#!" className="hover:text-indigo-400 transition">FAQ</a></li>
              <li><a href="#!" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
              <li><a href="#!" className="hover:text-indigo-400 transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Office</h3>
            <p className="text-gray-400 text-sm mb-2">Mohali </p>
            <p className="text-gray-400 text-sm">kumarashish915563@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} EduMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;