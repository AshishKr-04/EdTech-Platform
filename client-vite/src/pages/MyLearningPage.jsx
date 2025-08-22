import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Reusable StarRating component
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>);
  }
  return <div className="flex items-center"><span className="mr-1 font-bold text-sm text-yellow-600">{rating}</span>{stars}</div>;
};

const MyLearningPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/my-learning');
        setEnrolledCourses(response.data);
      } catch (err) {
        setError('Failed to fetch your enrolled courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  if (loading) return <p className="text-center">Loading your courses...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 my-8">My Learning</h1>
      
      {enrolledCourses.length === 0 ? (
        <p className="text-center text-gray-600">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {enrolledCourses.map((course) => (
            <Link to={`/course/${course._id}`} key={course._id} className="group block">
              <div className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full">
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearningPage;