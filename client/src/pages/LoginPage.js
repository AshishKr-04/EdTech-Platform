import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 👈 Import AuthContext

const LoginPage = () => {
  const { login } = useContext(AuthContext); // 👈 Get the login function from context
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token); // 👈 Use the context login function
      navigate('/'); // Redirect to homepage
    } catch (err) {
      setError(err.response.data.msg || 'Login failed.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <p>Sign into your account</p>
      <form onSubmit={onSubmit}>
        <div>
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginPage;