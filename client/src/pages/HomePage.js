// src/pages/HomePage.js
// import '../pages/HomePage.css';


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Our backend API is running on port 5000
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); // The empty array ensures this effect runs only once

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Available Courses</h1>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course._id}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p><i>Instructor: {course.instructor.name}</i></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available at the moment.</p>
      )}
    {/* <div className="homepage">
      <button className="get-started-btn">
        Get Started <span className="arrow">»</span>
      </button>
    </div> */}
    </div>
  );
};

export default HomePage;