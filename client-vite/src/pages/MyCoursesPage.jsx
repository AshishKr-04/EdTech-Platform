import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MyCoursesPage = () => {
  const { auth } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let res;

        // ✅ Instructor
        if (auth.user?.role === "Instructor") {
          res = await api.get("/courses/instructor/my-courses");
        } 
        // ✅ Student
        else {
          res = await api.get("/users/enrolled-courses");
        }

        setCourses(res.data.courses || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) {
      fetchCourses();
    }
  }, [auth]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {auth.user?.role === "Instructor"
          ? "My Created Courses"
          : "My Courses"}
      </h1>

      {/* ✅ CREATE BUTTON */}
      {auth.user?.role === "Instructor" && (
        <Link to="/create-course">
          <button className="mb-6 bg-green-600 text-white px-4 py-2 rounded">
            + Create Course
          </button>
        </Link>
      )}

      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="border p-4 rounded shadow">

              <h2 className="font-bold text-lg">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>

              {/* ✅ STUDENT */}
              {auth.user?.role === "Student" && (
                <Link to={`/my-learning/${course._id}`}>
                  <button className="mt-3 bg-indigo-600 text-white px-3 py-1 rounded">
                    Start Learning
                  </button>
                </Link>
              )}

              {/* ✅ INSTRUCTOR */}
              {auth.user?.role === "Instructor" && (
                <div className="flex gap-2 mt-4">

                  <Link to={`/edit-course/${course._id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;