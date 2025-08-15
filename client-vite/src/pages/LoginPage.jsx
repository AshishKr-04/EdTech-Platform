import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // 👈 Import Link
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response.data.msg || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-2">Login</h1>
      <p className="text-lg text-gray-600 italic mb-6">"Let's start a new way to learn things"</p>
      <form onSubmit={onSubmit} className="space-y-4 text-left">
        <div>
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required className="w-full px-4 py-2 border rounded-md" />
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required className="w-full px-4 py-2 border rounded-md" />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <input type="submit" value="Login" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 cursor-pointer" />
      </form>
      {/* 👇 THIS IS THE NEW PART */}
      <p className="mt-4 text-gray-600">
        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;