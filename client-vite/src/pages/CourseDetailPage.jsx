import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(response.data);

        // Check enrollment status using the full user object from context
        if (auth.isAuthenticated && auth.user?.enrolledCourses?.includes(id)) {
          setIsEnrolled(true);
        }
      } catch (err) {
        setError("Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) {
      fetchCourse();
    }
  }, [id, auth.loading, auth.isAuthenticated, auth.user]);

  const handleEnroll = async () => {
    try {
      await axios.post(`http://localhost:5000/api/courses/${id}/enroll`);
      setIsEnrolled(true);
      alert('You have successfully enrolled in this course!');
    } catch (err) {
      setError('Enrollment failed. Please try again.');
    }
  };

  if (loading) return <p className="text-center">Loading course details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!course) return <p className="text-center">Course not found.</p>;

  // --- 👇 THIS IS THE FIX ---
  // We now check for auth.user._id instead of auth.user.id
  const isCourseCreator = auth.isAuthenticated && auth.user?._id === course.instructor._id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 text-white p-8 rounded-lg mb-8">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-extrabold">{course.title}</h1>
                <p className="text-lg text-gray-300 mt-2">{course.description}</p>
                <p className="mt-4">Created by: <span className="font-semibold">{course.instructor.name}</span></p>
            </div>
            {isCourseCreator && (
              <Link 
                to={`/edit-course/${course._id}`}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors whitespace-nowrap"
              >
                Edit Course
              </Link>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content: Lessons */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Course Content</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Lesson {index + 1}: {lesson.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{lesson.content}</p>
                </div>
              </div>
            ))}
             {course.lessons.length === 0 && (
                <p className="text-gray-500">No lessons have been added to this course yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar: Price and Details */}
        <div className="md:col-span-1">
            <div className="border rounded-lg shadow-lg p-6 sticky top-8">
                <p className="text-4xl font-extrabold text-gray-900 mb-4">₹{course.price}</p>
                
                {auth.isAuthenticated && auth.user?.role === 'Student' && (
                    isEnrolled ? (
                        <button className="w-full bg-gray-500 text-white font-bold py-3 rounded-lg cursor-not-allowed">
                            Already Enrolled
                        </button>
                    ) : (
                        <button onClick={handleEnroll} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                            Enroll Now
                        </button>
                    )
                )}
                
                <div className="mt-6 text-gray-600 space-y-3">
                    <h4 className="font-bold text-lg">This course includes:</h4>
                    <p>✓ {course.duration}</p>
                    <p>✓ {course.lessons.length} modules</p>
                    <p>✓ Full lifetime access</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;