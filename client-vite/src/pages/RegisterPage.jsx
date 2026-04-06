import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ChevronDown, Loader2 } from 'lucide-react';
import api from "../utils/api"; // ✅ FIX: use axios instance

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
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
      // ✅ API CALL (Render backend)
      const res = await api.post('/auth/register', formData);

      // ✅ Optional: store token if backend returns it
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      // ✅ Redirect to login
      navigate('/login');

    } catch (err) {
      console.error(err);

      // ✅ FIX: use "message"
      setError(
        err.response?.data?.message ||
        'Registration failed! Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#f8fafc] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-10 border border-slate-100"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Join EduMind
          </h1>
          <p className="text-slate-500 font-medium italic">
            "A new way to master your future"
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">

          {/* Name */}
          <div className="relative group">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={20}
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
              required
              placeholder="Password (min. 6 chars)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium"
            />
          </div>

          {/* Role */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🎓</div>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none appearance-none font-semibold text-slate-700"
            >
              <option value="Student">I am a Student</option>
              <option value="Instructor">I am an Instructor</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-bold border border-red-100"
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
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-slate-600 font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 font-bold hover:underline"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;