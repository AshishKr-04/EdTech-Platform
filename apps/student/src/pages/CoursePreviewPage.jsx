import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { 
  CheckCircle2, 
  Lock, 
  Clock, 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from "lucide-react";

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
      const isInstructor = course.instructor?._id?.toString() === auth.user.id || 
                           course.instructor === auth.user.id ||
                           course.instructor?._id?.toString() === auth.user._id ||
                           course.instructor === auth.user._id;

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
        navigate(url);
      } else {
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

  if (!course) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-48 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8 space-y-4">
            <div className="h-8 bg-zinc-800 rounded w-2/3" />
            <div className="h-4 bg-zinc-800 rounded w-1/4" />
            <div className="h-4 bg-zinc-800 rounded w-1/2" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 h-72 bg-zinc-900/40 border border-zinc-800/80 rounded-xl" />
            <div className="h-72 bg-zinc-900/40 border border-zinc-800/80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#09090b] text-zinc-100 min-h-screen pb-16">
      {/* ================= HEADER ================= */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
              {course.category || "General"}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/60">
              {course.level || "All Levels"}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-100">{course.title}</h1>
          <p className="mt-2 text-sm text-zinc-400 font-medium">By {course.instructor?.name || "Verified Faculty"}</p>
          <p className="mt-3 max-w-3xl text-sm text-zinc-400 leading-relaxed">{course.description}</p>

          {/* METADATA */}
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3 py-1 rounded-lg">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              {course.lessons?.length || 0} lessons
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {course.duration || "Self-paced"}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3 py-1 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Published {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-8">
        {/* LEFT SYLLABUS */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
            <h2 className="text-sm font-semibold mb-4 text-zinc-100 uppercase tracking-wider">
              Course Syllabus & Curriculum
            </h2>
            <div className="divide-y divide-zinc-800/60">
              {course.lessons?.map((lesson, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 text-xs text-zinc-300 hover:bg-zinc-800/30 px-2 rounded-lg transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-zinc-500 font-mono text-[11px]">{index + 1}.</span>
                    <span className="font-medium text-zinc-200">{lesson.title}</span>
                  </span>
                  
                  {isEnrolled ? (
                    <span className="text-emerald-400 font-medium text-[10px] uppercase bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-[10px] inline-flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-5 sticky top-24">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block">Course Tuition</span>
              <h2 className="text-3xl font-semibold tracking-tight text-white mt-1">₹{course.price || 0}</h2>
            </div>

            {error && (
              <p className="text-rose-400 text-xs bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            {isEnrolled ? (
              <button
                onClick={() => navigate(`/learn/${course._id}`)}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg text-xs transition shadow-sm"
              >
                Go to Learning Player <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-xs transition shadow-sm disabled:opacity-50"
              >
                {isCheckingOut ? "Connecting Gateway..." : "Enroll Now"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* VALUE PROPOSITIONS */}
            <div className="pt-4 border-t border-zinc-800/80 text-xs text-zinc-400 space-y-2.5">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <span>100% Secure Checkout (Stripe & Sandbox)</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <span>Full lifetime syllabus & video access</span>
              </p>
              <p className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <span>AI Tutor for real-time explanations</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <span>Verified Certificate of Completion</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewPage;
