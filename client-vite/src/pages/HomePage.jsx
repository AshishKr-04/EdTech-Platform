import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 

// Helper component for rendering star ratings
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
  }
  return <div className="flex items-center"><span className="mr-1 font-bold text-sm text-yellow-600">{rating}</span>{stars}</div>;
};

const HomePage = () => {
  const { auth } = useContext(AuthContext); 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated) {
      const fetchCourses = async () => {
        try {
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
    }
  }, [auth.isAuthenticated]);

  if (auth.isAuthenticated) {
    if (loading) return <p className="text-center">Loading courses...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-indigo-600 my-8">Welcome Back!</h1>
        <h2 className="text-2xl font-semibold mb-6">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              // --- 👇 THIS IS THE CHANGE ---
              // The entire card is now wrapped in a Link
              <Link to={`/course/${course._id}`} key={course._id} className="group block">
                <div className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="w-full h-32 bg-gray-200"></div> 
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-900 truncate">{course.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{course.instructor.name}</p>
                    <div className="mt-2">
                      <StarRating rating={course.rating} />
                    </div>
                    <div className="mt-2 text-sm text-gray-500 flex items-center space-x-4">
                      <span>{course.duration}</span>
                      <span>{course.lessons.length} modules</span>
                    </div>
                  </div>
                  {/* The hover effect still works, and clicking it will navigate */}
                  <div className="absolute inset-0 bg-white p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col">
                    <h3 className="text-lg font-bold text-indigo-700">{course.title}</h3>
                    <p className="text-sm mt-2 flex-grow">{course.description}</p>
                    <div className="mt-4">
                      <p className="text-2xl font-extrabold text-gray-900">₹{course.price}</p>
                      <button className="w-full mt-2 bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700">
                        Go to Course
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
      </div>
    );
  }

  // Logged-out view remains the same
  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Transforming Education Through Technology
          </h1>
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6">
            <p>"The beautiful thing about learning is that no one can take it away from you."</p>
            <cite className="block text-right mt-2 not-italic">- B.B. King</cite>
          </blockquote>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
        <div className="md:w-1/2">
          <img
            src="/images/hero-illustration.png" 
            alt="Illustration of a person learning online"
            className="w-full h-auto max-w-lg mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;