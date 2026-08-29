import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, GraduationCap, BookOpen } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // API call to authenticate user
      const res = await api.post('/auth/login', { email, password });

      // Dynamic Redirect based on database user role
      const actualRole = res.data.user?.role;
      if (actualRole !== "Student") {
        setError("Access denied. This portal is for Students only.");
        showToast("Access denied. This portal is for Students only.", "error");
        setIsLoading(false);
        return;
      }

      // Cache credential tokens locally
      localStorage.setItem('token', res.data.token);

      // Update global context authentication state
      await login(res.data.token);

      showToast("Logged in successfully! Welcome back.", "success");
      navigate('/');
    } catch (err) {
      console.error(err);

      // Display parsed error details
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials or try again.';
      setError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
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
              <span className="text-xl">🎓</span>
              <span className="font-extrabold tracking-tight text-base text-slate-900">EduMind</span>
            </div>
            
            <div className="space-y-4 pt-12 text-left">
              <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900">
                Master Core Technology Skills
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Access expert-led video lectures, complete interactive challenges, and earn cryptographic verifiable graduation credentials.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-slate-200 pt-6 text-left">
            <p className="text-[10px] text-slate-500 font-mono">
              EduMind Student Auth Node
            </p>
          </div>
        </div>

        {/* Right Side: Form Column */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-white">
          {/* Header */}
          <div className="mb-6 text-left">
            <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-slate-800">
              <GraduationCap size={22} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Student Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to your learning dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">

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
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none transition-all font-medium text-sm text-slate-900"
                placeholder="Email Address"
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
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none transition-all font-medium text-sm text-slate-900"
                placeholder="Password"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-xs text-center font-bold bg-red-50 py-2.5 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            {/* Button */}
            <motion.button
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 group shadow-sm transition duration-150 text-sm"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-xs text-center text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-slate-900 font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;