import React, { useEffect, useState } from "react";
import api from "../utils/api";

const InstructorDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/courses/instructor/analytics");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalytics();
  }, []);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        📊 Instructor Dashboard
      </h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-500 text-white p-4 rounded">
          <h2>Total Courses</h2>
          <p className="text-2xl font-bold">{data.totalCourses}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded">
          <h2>Total Students</h2>
          <p className="text-2xl font-bold">{data.totalStudents}</p>
        </div>
      </div>

      {/* COURSE STATS */}
      <h2 className="text-2xl font-semibold mb-4">
        Course Performance
      </h2>

      <div className="space-y-4">
        {data.courseStats.map((course) => (
          <div key={course.courseId} className="border p-4 rounded">

            <h3 className="text-xl font-bold">{course.title}</h3>

            <div className="flex justify-between mt-2 text-gray-600">
              <p>Lessons: {course.lessons}</p>
              <p>Students: {course.students}</p>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 bg-gray-200 h-2 rounded">
              <div
                className="bg-indigo-600 h-2 rounded"
                style={{
                  width: `${Math.min(course.students * 20, 100)}%`,
                }}
              ></div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorDashboard;