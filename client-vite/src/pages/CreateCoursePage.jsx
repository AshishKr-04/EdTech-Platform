import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // 👈 1. Add price to state
  const [duration, setDuration] = useState(''); // 👈 Add duration to state
  const [lessons, setLessons] = useState([{ title: '', content: '' }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- Lesson Field Handlers ---
  const handleLessonChange = (index, event) => {
    const values = [...lessons];
    values[index][event.target.name] = event.target.value;
    setLessons(values);
  };

  const handleAddLesson = () => {
    setLessons([...lessons, { title: '', content: '' }]);
  };

  const handleRemoveLesson = (index) => {
    const values = [...lessons];
    values.splice(index, 1);
    setLessons(values);
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 👇 2. Include price and duration in the data sent to the backend
      const courseData = { title, description, price, duration, lessons };
      
      await axios.post('http://localhost:5000/api/courses', courseData);
      
      navigate('/courses'); 
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create course. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Course Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        {/* --- 👇 3. NEW PRICE AND DURATION FIELDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (in ₹)</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="e.g., 499"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Total Duration</label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              placeholder="e.g., 8.5 total hours"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        {/* --- END OF NEW FIELDS --- */}

        {/* Dynamic Lesson Fields */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Lessons</h2>
          {lessons.map((lesson, index) => (
            <div key={index} className="p-4 border rounded-md mb-4 space-y-2 relative">
              <h3 className="font-medium">Lesson {index + 1}</h3>
              <input
                type="text"
                name="title"
                placeholder="Lesson Title"
                value={lesson.title}
                onChange={(e) => handleLessonChange(index, e)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                name="content"
                placeholder="Lesson Content"
                value={lesson.content}
                onChange={(e) => handleLessonChange(index, e)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveLesson(index)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLesson}
            className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Add Lesson
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCoursePage;