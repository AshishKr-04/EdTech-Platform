import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student', // Default role is Student
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Now we send the entire formData, including the role
      await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // On success, redirect to the login page with a success message
      navigate('/login');
    } catch (err) {
      setError(err.response.data.msg || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-2">Register</h1>
      <p className="text-lg text-gray-600 italic mb-6">"Let's start a new way to learn things"</p>
      
      <form onSubmit={onSubmit} className="space-y-4 text-left">
        <div>
          <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required className="w-full px-4 py-2 border rounded-md" />
        </div>
        <div>
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required className="w-full px-4 py-2 border rounded-md" />
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} minLength="6" required className="w-full px-4 py-2 border rounded-md" />
        </div>

        {/* --- 👇 THIS IS THE NEW PART --- */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a:</label>
          <select
            name="role"
            id="role"
            value={role}
            onChange={onChange}
            className="w-full px-4 py-2 border rounded-md mt-1"
          >
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        {/* --- END OF NEW PART --- */}

        {error && <p className="text-red-500">{error}</p>}
        <input type="submit" value="Register" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 cursor-pointer" />
      </form>

      <p className="mt-4 text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;