import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EditCoursePage = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: 0,
    duration: '',
    lessons: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch the course data when the page loads
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        // Ensure the logged-in user is the instructor of this course
        if (auth.user.id !== response.data.instructor._id) {
          setError('You are not authorized to edit this course.');
          return;
        }
        setCourseData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch course data.');
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, auth.user.id]);

  const handleInputChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (index, event) => {
    const newLessons = [...courseData.lessons];
    newLessons[index][event.target.name] = event.target.value;
    setCourseData({ ...courseData, lessons: newLessons });
  };
  
  // 2. Handle the form submission to send a PUT request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/courses/${id}`, courseData);
      navigate(`/course/${id}`); // Go back to the course detail page on success
    } catch (err) {
      setError('Failed to update course.');
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* The form fields are pre-filled from the 'courseData' state */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" value={courseData.title} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={courseData.description} onChange={handleInputChange} required rows="4" className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (in ₹)</label>
            <input type="number" name="price" value={courseData.price} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Total Duration</label>
            <input type="text" name="duration" value={courseData.duration} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        {/* Lesson editing would go here, for now we just submit the existing ones */}
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCoursePage;