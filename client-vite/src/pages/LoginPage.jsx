import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios'; // Use standard axios

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Logic: Path is just '/auth/login' because baseURL already ends in '/api'
      const res = await axios.post('/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials or server timeout!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#f8fafc] px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
             <Lock size={30} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input type="email" name="email" value={email} onChange={onChange} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium" placeholder="Email Address" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input type="password" name="password" value={password} onChange={onChange} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium" placeholder="Password" />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
          <motion.button disabled={isLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group shadow-xl">
            {isLoading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
          </motion.button>
        </form>
        <p className="mt-8 text-center text-slate-600">Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register here</Link></p>
      </motion.div>
    </div>
  );
};

export default LoginPage;