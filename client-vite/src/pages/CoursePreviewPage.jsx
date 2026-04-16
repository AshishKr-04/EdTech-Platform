import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const CoursePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);

        // ✅ CHECK ENROLLMENT
        try {
          await api.get(`/courses/${id}/progress`);
          setIsEnrolled(true);
        } catch {
          setIsEnrolled(false);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  // ================= ENROLL =================
  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!course) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">

          <h1 className="text-3xl font-semibold">
            {course.title}
          </h1>

          <p className="mt-2 text-indigo-100">
            By {course.instructor?.name || "Unknown"}
          </p>

          <p className="mt-4 max-w-3xl text-indigo-100">
            {course.description}
          </p>

          {/* METADATA */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm">

            <span className="bg-white/20 px-3 py-1 rounded-full">
              {course.lessons?.length || 0} lessons
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              {course.duration || "N/A"} hour on demand video
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              Created on{" "}
              {course.createdAt
                ? new Date(course.createdAt).toLocaleDateString()
                : "-"}
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              Updated{" "}
              {course.updatedAt
                ? new Date(course.updatedAt).toLocaleDateString()
                : "-"}
            </span>

          </div>

        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2">

          {/* INTRO VIDEO */}
          {course.introVideo && (
            <div className="mb-6 rounded-lg overflow-hidden shadow">
              <video
                src={course.introVideo}
                controls
                className="w-full"
              />
            </div>
          )}

          {/* COURSE CONTENT */}
          <div className="bg-white shadow-sm border rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Course Content
            </h2>

            <div className="divide-y">

              {course.lessons?.map((lesson, index) => (
                <div
                  key={index}
                  className="flex justify-between py-3 text-sm text-gray-700 hover:bg-gray-50 px-2 rounded transition"
                >
                  <span>
                    {index + 1}. {lesson.title}
                  </span>

                  <span className="text-indigo-500 font-medium">
                    {lesson.videoUrl ? "Video" : "Text"}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-white shadow-lg border rounded-lg p-6 h-fit">

          {/* PRICE */}
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            ₹{course.price || 0}
          </h2>

          {/* ✅ FIXED BUTTON */}
          {isEnrolled ? (
            <button
              onClick={() => navigate(`/learn/${course._id}`)}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Go to Course
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Enroll Now
            </button>
          )}

          {/* INFO */}
          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <p>Full lifetime access</p>
            <p>Accessible on all devices</p>
            <p>Self-paced learning</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CoursePreviewPage;