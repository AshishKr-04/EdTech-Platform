import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const CoursePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH COURSE =================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  // ================= VERIFY ENROLLMENT =================
  useEffect(() => {
    if (auth.user && course) {
      // 1. Check if user is the instructor of the course
      const isInstructor = course.instructor?._id?.toString() === auth.user.id || 
                           course.instructor === auth.user.id ||
                           course.instructor?._id?.toString() === auth.user._id ||
                           course.instructor === auth.user._id;

      // 2. Check if user has enrolled/purchased this course
      const enrolled = auth.user.enrolledCourses?.some(c => {
        const cId = typeof c === 'object' && c !== null ? (c._id || c.id) : c;
        return cId?.toString() === id;
      });

      setIsEnrolled(isInstructor || !!enrolled);
    } else {
      setIsEnrolled(false);
    }
  }, [auth.user, course, id]);

  // ================= CHECKOUT / ENROLL =================
  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      setError("");

      const res = await api.post("/payments/create-checkout-session", {
        courseId: id,
      });

      const { url, isDemo } = res.data;

      if (isDemo) {
        // Local Demo Checkout bypass
        navigate(url);
      } else {
        // Real Stripe Redirect
        window.location.href = url;
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to initiate checkout. Please ensure you are logged in."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!course) return <p className="text-center mt-10">Loading course syllabus...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="bg-slate-100 border-b border-slate-200 text-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{course.title}</h1>
          <p className="mt-2 text-slate-600 font-semibold">By {course.instructor?.name || "Unknown"}</p>
          <p className="mt-4 max-w-3xl text-slate-500 text-sm leading-relaxed">{course.description}</p>

          {/* METADATA */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {course.lessons?.length || 0} lessons
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {course.duration || "N/A"} hour on demand video
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Created {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* COURSE CONTENT */}
          <div className="bg-white shadow-sm border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Course Syllabus & Curriculum</h2>
            <div className="divide-y">
              {course.lessons?.map((lesson, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3.5 text-xs text-gray-700 hover:bg-gray-50 px-2 rounded transition"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium">{index + 1}.</span>
                    <span>{lesson.title}</span>
                  </span>
                  
                  {isEnrolled ? (
                    <span className="text-green-600 font-semibold text-[10px] uppercase bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-gray-500 text-[10px] flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded border">
                      🔒 Locked Preview
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-white shadow-lg border rounded-lg p-6 h-fit space-y-4">
          <div>
            <span className="text-xs text-gray-400 font-semibold block uppercase">Course Price</span>
            <h2 className="text-3xl font-extrabold text-indigo-600">₹{course.price || 0}</h2>
          </div>

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          {isEnrolled ? (
            <button
              onClick={() => navigate(`/learn/${course._id}`)}
              className="w-full bg-green-600 text-white font-bold py-2.5 rounded hover:bg-green-700 transition"
            >
              Go to Course
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isCheckingOut ? "Connecting Gateway..." : "Buy Course"}
            </button>
          )}

          {/* INFO */}
          <div className="pt-4 border-t text-[11px] text-gray-600 space-y-2 font-medium">
            <p>✓ 100% Secure Checkout</p>
            <p>✓ Full lifetime access</p>
            <p>✓ Accessible on all devices</p>
            <p>✓ Downloadable PDF Certificate of Completion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewPage;