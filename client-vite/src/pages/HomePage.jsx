import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 

// Helper component for rendering star ratings
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
    );
  }
  return (
    <div className="flex items-center">
      <span className="mr-1 font-bold text-sm text-yellow-600">{rating || 0}</span>
      {stars}
    </div>
  );
};

const HomePage = () => {
  const { auth } = useContext(AuthContext); 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch courses if logged in
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

  // --- VIEW FOR LOGGED-IN USERS (Dashboard Style) ---
  if (auth.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-indigo-50 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back, {auth.user?.name}! 👋</h1>
                <p className="text-indigo-600 font-medium">Ready to pick up where you left off?</p>
            </div>
            <Link to="/courses" className="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                Browse All Courses
            </Link>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b-2 border-indigo-100 pb-2 inline-block">
            Recommended for You
        </h2>

        {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>
        ) : error ? (
            <p className="text-center text-red-500">{error}</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {courses.slice(0, 8).map((course) => (
                    <Link to={`/course/${course._id}`} key={course._id} className="group block">
                        <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-full h-40 bg-indigo-100 flex items-center justify-center text-indigo-300 text-4xl">
                                📚
                            </div> 
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">by {course.instructor.name}</p>
                                <div className="mt-3">
                                    <StarRating rating={course.rating} />
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm font-medium">
                                    <span className="text-gray-400">⏱ {course.duration}</span>
                                    <span className="text-indigo-700 bg-indigo-50 px-2 py-1 rounded">₹{course.price}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>
    );
  }

  // --- VIEW FOR LOGGED-OUT USERS (Landing Page Style) ---
  return (
    <div className="space-y-24 pb-20">
      {/* 1. NEW INTERACTIVE HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 mt-10 gap-12">
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1]">
            Transforming <span className="text-indigo-600">Education</span> Through Technology
          </h1>
          
          <blockquote className="border-l-4 border-indigo-600 pl-6 py-2 italic text-gray-600 text-xl">
            <p>"The beautiful thing about learning is that no one can take it away from you."</p>
            <cite className="block text-right mt-3 not-italic font-bold text-gray-800 text-base">— B.B. King</cite>
          </blockquote>

          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-xl">
              Get Started Free
            </Link>
            <Link to="/about" className="border-2 border-gray-200 text-gray-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition">
              Explore Mission
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 relative">
          <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <img 
            src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg" 
            alt="Hero Illustration" 
            className="relative w-full max-w-lg mx-auto rounded-3xl drop-shadow-2xl"
          />
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-gray-900 text-white py-16 rounded-[3rem] mx-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><p className="text-4xl font-bold text-indigo-400">200+</p><p className="text-gray-400">Students</p></div>
            <div><p className="text-4xl font-bold text-indigo-400">10+</p><p className="text-gray-400">Courses</p></div>
            <div><p className="text-4xl font-bold text-indigo-400">50+</p><p className="text-gray-400">Instructors</p></div>
            <div><p className="text-4xl font-bold text-indigo-400">99%</p><p className="text-gray-400">Satisfaction</p></div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="px-4 text-center">
        <h2 className="text-4xl font-bold mb-16">Start Learning in <span className="text-indigo-600">3 Steps</span></h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="space-y-4 p-6 hover:scale-105 transition-transform">
            <div className="bg-indigo-600 w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-xl mx-auto shadow-lg shadow-indigo-200">1</div>
            <h3 className="text-xl font-bold">Create Profile</h3>
            <p className="text-gray-500">Sign up and tell us your interests so we can personalize your dashboard.</p>
          </div>
          <div className="space-y-4 p-6 hover:scale-105 transition-transform">
            <div className="bg-indigo-600 w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-xl mx-auto shadow-lg shadow-indigo-200">2</div>
            <h3 className="text-xl font-bold">Join Course</h3>
            <p className="text-gray-500">Browse hundreds of professional courses and enroll with one click.</p>
          </div>
          <div className="space-y-4 p-6 hover:scale-105 transition-transform">
            <div className="bg-indigo-600 w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-xl mx-auto shadow-lg shadow-indigo-200">3</div>
            <h3 className="text-xl font-bold">Level Up</h3>
            <p className="text-gray-500">Watch videos, complete lessons, and gain certificates to boost your career.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;