import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ChevronDown, Loader2 } from 'lucide-react';
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const { showToast } = useToast();
  const { login } = useContext(AuthContext);
  
  const initialRole = 'Teacher';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Register account on backend
      const res = await api.post('/auth/register', formData);

      // Auto-login upon successful registration
      if (res.data.token) {
        await login(res.data.token);
      }

      showToast("Account created successfully! Welcome to EduMind.", "success");
      navigate('/instructor-dashboard');

    } catch (err) {
      console.error(err);

      // Extract and display errors
      const errMsg = err.response?.data?.message || 'Registration failed! Please try again.';
      setError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 grid md:grid-cols-12 overflow-hidden"
      >
        {/* Left Side: Features Column (hidden on mobile) */}
        <div className="md:col-span-5 bg-slate-50 border-r border-slate-200 text-slate-800 p-10 flex flex-col justify-between hidden md:flex relative overflow-hidden">
          {/* Subtle background visual grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none text-slate-400">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">{role === 'Student' ? '🎓' : '👨‍🏫'}</span>
              <span className="font-extrabold tracking-tight text-base text-slate-900">EduMind</span>
            </div>
            
            <div className="space-y-4 pt-12 text-left">
              <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900">
                {role === 'Student' ? 'Embark on Your Tech Journey' : 'Empower the Next Generation'}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {role === 'Student'
                  ? 'Connect with industry leaders, build a verifiable developer profile, and take control of your educational path.'
                  : 'Publish premium course curricula, track student success metrics, and award cryptographically verifiable graduation certificates.'}
              </p>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-slate-200 pt-6 text-left">
            <p className="text-[10px] text-slate-500 font-mono">
              {role === 'Student' ? 'EduMind Student Enrollment Portal' : 'EduMind Instructor Onboarding Portal'}
            </p>
          </div>
        </div>

        {/* Right Side: Form Column */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-white">
          {/* Header */}
          <div className="mb-6 text-left">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">Get started with a free learning account</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4 text-left">

            {/* Name */}
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
                size={18}
              />
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none transition-all font-medium text-sm text-slate-900"
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
                size={18}
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none transition-all font-medium text-sm text-slate-900"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
                size={18}
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                minLength="6"
                required
                placeholder="Password (min. 6 chars)"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none transition-all font-medium text-sm text-slate-900"
              />
            </div>

            {/* Role is automatically set to Teacher, no selector needed */}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 text-red-600 p-2.5 rounded-xl text-xs text-center font-bold border border-red-100"
              >
                {error}
              </motion.div>
            )}

            {/* Button */}
            <motion.button
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition duration-150 text-sm"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-xs text-center text-slate-500 font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-slate-900 font-bold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;