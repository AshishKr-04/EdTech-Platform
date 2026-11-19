import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

const fallbackCategories = [
  "Development",
  "Business",
  "Design",
  "Academics",
  "AI",
  "Web Development",
];

const popularSearches = ["React", "Node.js", "MongoDB", "Python", "AI", "UI Design"];

const learningPaths = [
  {
    title: "Become a Full-Stack Developer",
    description: "Learn frontend, backend APIs, databases, authentication, and deployment.",
    skills: ["React", "Express", "MongoDB"],
  },
  {
    title: "Master Backend APIs",
    description: "Build secure server-side applications with validation, auth, and payments.",
    skills: ["Node.js", "JWT", "Stripe"],
  },
  {
    title: "Launch Your First Course",
    description: "Use instructor tools to publish lessons, upload videos, and track learners.",
    skills: ["Teaching", "Video", "Analytics"],
  },
];

const featureHighlights = [
  {
    title: "Video Lessons",
    description: "Courses support structured lessons with uploaded video content.",
    icon: PlayCircle,
  },
  {
    title: "Secure Enrollment",
    description: "JWT auth, protected APIs, and role-aware course access.",
    icon: LockKeyhole,
  },
  {
    title: "Checkout Flow",
    description: "Stripe-ready payment flow with a demo checkout mode for testing.",
    icon: CreditCard,
  },
  {
    title: "Certificates",
    description: "Students can earn completion certificates after finishing lessons.",
    icon: Award,
  },
];


const CourseCard = ({ course, compact = false }) => {
  return (
    <Link
      to={`/course/${course._id}`}
      className={`group rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 text-left block ${
        compact ? "min-w-[260px] max-w-[260px]" : ""
      }`}
    >
      <div className="aspect-video w-full rounded-lg bg-zinc-800 overflow-hidden mb-3 relative">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-500">
            <GraduationCap className="h-8 w-8" />
          </div>
        )}
        <span className="absolute top-2 left-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-950/70 backdrop-blur-md text-zinc-300 border border-zinc-800">
          {course.level || "Beginner"}
        </span>
      </div>
      <h3 className="font-medium text-zinc-100 line-clamp-1 group-hover:text-indigo-400 transition-colors text-sm">
        {course.title}
      </h3>
      <p className="text-xs text-zinc-400 mt-1 truncate">
        By {course.instructor?.name || course.instructor || "Instructor"}
      </p>
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
        <span className="font-semibold text-zinc-100 text-sm">
          {Number(course.price) === 0 ? "Free" : `₹${course.price}`}
        </span>
        <span className="text-xs text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
          Explore &rarr;
        </span>
      </div>
    </Link>
  );
};

const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col justify-between gap-4 text-left md:flex-row md:items-end">
    <div>
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400 mb-1">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-zinc-100 md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-1.5 max-w-2xl text-xs text-zinc-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/courses");
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Failed to load catalog courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const categories = useMemo(() => {
    const fromCourses = courses
      .map((course) => course.category)
      .filter(Boolean);
    return ["All", ...new Set([...fallbackCategories, ...fromCourses])];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return courses
      .filter((course) => {
        const matchesSearch =
          !query ||
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.category?.toLowerCase().includes(query);

        const matchesCategory =
          activeCategory === "All" ||
          course.category?.toLowerCase() === activeCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => (b.studentsCount || 0) - (a.studentsCount || 0));
  }, [activeCategory, courses, searchQuery]);

  const popularCourses = useMemo(() => filteredCourses.slice(0, 4), [filteredCourses]);
  const beginnerCourses = useMemo(
    () =>
      courses
        .filter((course) => (course.level || "Beginner") === "Beginner")
        .slice(0, 4),
    [courses]
  );
  const recentCourses = useMemo(
    () =>
      [...courses]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 4),
    [courses]
  );


  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/courses?search=${encodeURIComponent(query)}` : "/courses");
  };

  const renderCourseGrid = (items) => {
    if (loading) {
      return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4"
            >
              <div className="aspect-video rounded-lg bg-zinc-800" />
              <div className="mt-4 h-4 w-3/4 rounded bg-zinc-800" />
              <div className="mt-2 h-3 w-1/2 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-10 text-center">
          <Cloud className="mx-auto h-10 w-10 text-zinc-600" />
          <h3 className="mt-4 text-base font-medium text-zinc-200">No courses found</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Try another category or search term to discover lessons.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased font-sans">
      <section className="border-b border-zinc-800/60 bg-gradient-to-b from-zinc-900/20 to-transparent py-16">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300 mx-auto">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Practical, Job-Ready Developer Skills
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Master core technology with structured online courses
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400">
              Interactive video lessons, code challenges, progress checkpoints, and verifiable graduation certificates.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="What do you want to learn? (React, Node.js, DSA...)"
                  className="w-full px-3.5 py-2 pl-10 rounded-lg bg-zinc-900/60 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors px-5 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="border-b border-zinc-800/60 bg-zinc-900/20 py-3.5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition border ${
                  activeCategory === category
                    ? "bg-zinc-800 text-white border-zinc-700"
                    : "bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {auth.isAuthenticated && (
        <section className="mx-auto max-w-7xl px-6 py-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-left">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
                  Student Dashboard
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Welcome back, {auth.user?.name || "Learner"}
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Pick up where you left off or access your issued graduation credentials.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/my-courses"
                  className="bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors px-4 py-2 rounded-lg text-sm inline-flex items-center justify-center gap-2"
                >
                  My Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Courses */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeader
          eyebrow="Popular catalog"
          title={activeCategory === "All" ? "Featured Courses" : `Courses in ${activeCategory}`}
          description="Curated courses with practical project-driven curriculum."
          action={
            <Link
              to="/courses"
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-1.5 border border-zinc-800/80 transition"
            >
              View All Courses
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        {renderCourseGrid(popularCourses)}
      </section>

      {/* Learning Paths */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/20 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Career Roadmaps"
            title="Step-by-Step Learning Paths"
            description="End-to-end curriculums structured for modern engineering roles."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {learningPaths.map((path) => (
              <Link
                key={path.title}
                to="/courses"
                className="group rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 text-left transition hover:border-zinc-700 hover:bg-zinc-900/80"
              >
                <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-indigo-400 border border-zinc-700/60">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                  {path.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  {path.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 text-[10px] font-medium text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeader
          eyebrow="Latest Releases"
          title="Recently Published Courses"
          description="Newly updated modules and courses by certified industry instructors."
        />
        {renderCourseGrid(recentCourses)}
      </section>
    </div>
  );
};

export default HomePage;
