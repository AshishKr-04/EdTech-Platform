import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Brain, 
  CreditCard, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Star,
  Users,
  Compass
} from "lucide-react";

const StarRating = ({ rating = 0 }) => {
  const safeRating = Number(rating) || 0;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`text-sm ${i <= safeRating ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-gray-800"}`}>
        ★
      </span>
    );
  }
  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="ml-1 text-xs font-bold text-gray-500">{safeRating.toFixed(1)}</span>
    </div>
  );
};

const HomePage = () => {
  const { auth } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.user?.role === "Instructor") {
          const res = await api.get("/courses/instructor/my-courses");
          setMyCourses(res.data.courses || []);
        } else {
          const res = await api.get("/courses");
          setCourses(res.data.courses || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) fetchData();
  }, [auth]);

  // Skeletons for Loading State
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse px-4 py-8">
        <div className="h-96 bg-gray-100 dark:bg-gray-900 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          <div className="h-44 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          <div className="h-44 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* ================= HERO (UNAUTHENTICATED GUESTS) ================= */}
      {!auth.isAuthenticated && (
        <div className="relative bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950 text-white py-20 lg:py-28 overflow-hidden rounded-[2.5rem] mx-4 my-4 shadow-xl">
          {/* Neon lights overlay */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.03),transparent)]" />

          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-3 text-center lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                Empowering Smart Learners
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-indigo-100 to-violet-200 bg-clip-text text-transparent">
                Upgrade Your Skills. <br className="hidden sm:inline" />
                Build Your Future.
              </h1>
              
              <p className="text-indigo-200/70 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Learn from industry-leading instructors. Gain verifiable cryptographic certificates, consult our built-in AI study companion, and excel in your tech career.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                <Link to="/courses" className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/register" className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 rounded-2xl font-bold backdrop-blur-md transition-all">
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Right Widget Area: Floating Stats Card */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-inner text-center space-y-1">
                <p className="text-3xl font-black text-indigo-300">10k+</p>
                <p className="text-xs font-semibold text-indigo-200/60 uppercase tracking-wider">Active Students</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-inner text-center space-y-1">
                <p className="text-3xl font-black text-indigo-300">98%</p>
                <p className="text-xs font-semibold text-indigo-200/60 uppercase tracking-wider">Satisfaction Rate</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-inner text-center space-y-1 col-span-2">
                <p className="text-3xl font-black text-indigo-300">100%</p>
                <p className="text-xs font-semibold text-indigo-200/60 uppercase tracking-wider">Verifiable Certified Graduates</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= STUDENT-CENTRIC METHODOLOGY SECTIONS ================= */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Why Students Succeed on EduMind</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Everything you need to master new skills, build projects, and secure your dream career.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl text-indigo-500 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Expert-Led Curriculum</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Learn from certified instructors and industry professionals who bring real-world experience directly to your screen.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-amber-500 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Verifiable Certificates</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Receive secure, shareable certificates upon 100% course completion to demonstrate your expertise to employers.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 bg-purple-50 dark:bg-purple-950/20 rounded-xl text-purple-500 flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Interactive AI Buddy</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Get 24/7 personalized tutoring with our built-in study assistant that helps you break down complex modules.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-500 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Lifetime Access</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Enroll once and enjoy unlimited, lifetime access to all learning materials, syllabus updates, and video lectures.</p>
          </div>
        </div>
      </div>

      {/* ================= DATA CATALOG ================= */}
      <div className="max-w-6xl mx-auto px-6 py-4">

        {/* ================= INSTRUCTOR HOMEPAGE PANEL ================= */}
        {auth.user?.role === "Instructor" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded-full">
                  Instructor Center
                </span>
                <h1 className="text-2xl font-bold">Welcome back, Professor {auth.user?.name}</h1>
                <p className="text-xs text-indigo-200">Inspect course performances, manage lesson syllabuses, and publish content.</p>
              </div>

              <Link to="/create-course" className="px-5 py-2.5 bg-white hover:bg-gray-50 text-indigo-600 font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1.5 flex-shrink-0">
                <Sparkles className="h-4 w-4" />
                Publish New Course
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Compass className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">My Instructed Courses ({myCourses.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                      {course.level || "Beginner"}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mt-2 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="flex gap-2 mt-6 border-t border-gray-50 dark:border-gray-800 pt-4">
                    <Link to={`/edit-course/${course._id}`} className="flex-grow">
                      <button className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-2 rounded-xl text-xs transition">
                        Edit Syllabus
                      </button>
                    </Link>

                    <Link to={`/course/${course._id}`} className="flex-grow">
                      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs transition">
                        View Public
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STUDENT HOMEPAGE PANEL ================= */}
        {auth.user?.role === "Student" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded-full">
                  Student Portal
                </span>
                <h1 className="text-2xl font-bold">Welcome back, {auth.user?.name}</h1>
                <p className="text-xs text-indigo-200">Resume your lectures, complete syllabus tasks, and copy digital certificate signatures.</p>
              </div>

              <Link to="/courses" className="px-5 py-2.5 bg-white hover:bg-gray-50 text-indigo-600 font-bold rounded-xl text-xs shadow transition-all flex-shrink-0">
                Explore Course Catalog
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Compass className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Popular Learning Tracks</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => {
                const lessons = Array.isArray(course.lessons) ? course.lessons : [];
                return (
                  <div
                    key={course._id}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                        {course.category || "General"}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mt-2 line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="mt-6 border-t border-gray-50 dark:border-gray-800 pt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {course.duration}
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {course.price === 0 ? "Free" : `₹${course.price}`}
                        </span>
                      </div>

                      <Link to={`/course/${course._id}`}>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= GUEST HOMEPAGE CATALOG ================= */}
        {!auth.isAuthenticated && (
          <div className="space-y-8">
            
            <div className="text-center max-w-xl mx-auto space-y-2 mt-8">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Popular Courses Catalog</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Explore premium modules and join thousands of learners expanding their career horizons.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => {
                const lessons = Array.isArray(course.lessons) ? course.lessons : [];
                return (
                  <Link 
                    to={`/course/${course._id}`} 
                    key={course._id}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all h-full group"
                  >
                    <div className="space-y-3.5">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full">
                        {course.category || "General"}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{course.description}</p>
                      
                      <div className="pt-1">
                        <StarRating rating={course.rating} />
                      </div>
                    </div>

                    <div className="mt-6 border-t border-gray-50 dark:border-gray-800 pt-4 flex items-center justify-between">
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                      </span>

                      <div className="flex flex-col items-end gap-0.5 text-[10px] text-gray-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.studentsCount || 0} students
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {lessons.length} lessons
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <Link 
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                Explore Full Catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;