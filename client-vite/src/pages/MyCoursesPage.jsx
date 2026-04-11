import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/users/enrolled-courses");
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) return <p className="text-center">Loading your courses...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">🎓 My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-500">
          You haven't enrolled in any courses yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course._id} to={`/course/${course._id}`}>
              <div className="bg-white border rounded-xl p-5 shadow hover:shadow-lg transition">
                <h2 className="text-lg font-bold text-gray-800">
                  {course.title}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  {course.duration}
                </p>

                <p className="text-indigo-600 font-semibold mt-3">
                  ₹{course.price}
                </p>

                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                  Continue Learning →
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;