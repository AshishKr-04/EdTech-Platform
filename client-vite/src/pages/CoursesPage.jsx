import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 👈 1. Import Link
import axios from 'axios';

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

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  if (loading) return <p className="text-center">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 my-8">All Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.map((course) => (
          // --- 👇 2. Wrap the card with a Link component ---
          <Link to={`/course/${course._id}`} key={course._id} className="group block">
            <div className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full">
              
              <div className="w-full h-32 bg-gray-200">
                {/* Future course image goes here */}
              </div> 

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

              {/* Hover Pop-out Effect */}
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
};

export default CoursesPage;