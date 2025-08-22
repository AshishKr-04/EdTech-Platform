import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EditCoursePage = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchCourse = async () => {
      if (!auth.user) {
        setLoading(false);
        setError("You must be logged in to edit a course.");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        
        // --- 👇 THIS IS THE FIX ---
        // Check auth.user._id against the instructor's _id
        if (auth.user._id !== response.data.instructor._id) {
          setError('You are not authorized to edit this course.');
          setLoading(false);
          return;
        }
        setCourseData(response.data);
      } catch (err) {
        setError('Failed to fetch course data.');
      } finally {
        setLoading(false);
      }
    };
    
    if (!auth.loading) { // Make sure auth state is loaded first
        fetchCourse();
    }
  }, [id, auth.loading, auth.user]);

  const handleInputChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/courses/${id}`, courseData);
      navigate(`/course/${id}`);
    } catch (err) {
      setError('Failed to update course.');
    }
  };

  if (loading) return <p className="text-center">Loading course for editing...</p>;
  if (error) return <p className="text-center text-red-500 font-bold">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        {/* We can add lesson editing functionality here in the future */}
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCoursePage;