import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-950 pb-8 pt-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-400">EduMind</h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering learners with MERN-stack driven education. Built with modern technology for the next generation.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/courses" className="transition hover:text-blue-400">Courses</Link></li>
              <li><Link to="/about" className="transition hover:text-blue-400">About Us</Link></li>
              <li><Link to="/contact" className="transition hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#!" className="transition hover:text-blue-400">FAQ</a></li>
              <li><a href="#!" className="transition hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#!" className="transition hover:text-blue-400">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Office</h3>
            <p className="mb-2 text-sm text-slate-400 flex items-center gap-1.5">
              <span>🇮🇳</span> India
            </p>
            <p className="break-words text-sm text-slate-400">kumarashish915563@gmail.com</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
