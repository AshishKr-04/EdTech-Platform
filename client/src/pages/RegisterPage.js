import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect the user

const RegisterPage = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Destructure for easier access
  const { name, email, password } = formData;

  // Handles input changes and updates the state
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    try {
      // The data to be sent to the backend
      const newUser = {
        name,
        email,
        password,
      };

      // Make the POST request to our registration endpoint
      await axios.post('http://localhost:5000/api/auth/register', newUser);

      // If registration is successful, redirect to the login page
      navigate('/login');
    } catch (err) {
      // If there's an error (e.g., user already exists), display it
      setError(err.response.data.msg || 'Registration failed. Please try again.');
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <p>Create your account</p>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        {/* Display any error messages */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default RegisterPage;