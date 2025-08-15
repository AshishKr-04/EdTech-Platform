import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch course details", error);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading course details...</p>;
  if (!course) return <p>Course not found.</p>;

  // Check if the logged-in user is the instructor of this course
  const isInstructor = auth.isAuthenticated && auth.user.id === course.instructor._id;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">{course.title}</h1>
        {/* 👇 The Edit button only shows for the course instructor */}
        {isInstructor && (
          <Link 
            to={`/edit-course/${course._id}`}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
          >
            Edit Course
          </Link>
        )}
      </div>
      <p className="text-lg text-gray-700">{course.description}</p>
      <p className="mt-2"><strong>Instructor:</strong> {course.instructor.name}</p>
      <p><strong>Price:</strong> ₹{course.price}</p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Lessons</h2>
        {course.lessons.map((lesson, index) => (
          <div key={index} className="mt-4 p-4 border-b">
            <h3 className="text-xl font-bold">{lesson.title}</h3>
            <p className="mt-2">{lesson.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetailPage;