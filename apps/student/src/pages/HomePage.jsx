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

const stackItems = [
  { label: "Frontend", value: "React, Vite, Tailwind CSS, Axios" },
  { label: "Backend", value: "Express, JWT, Zod, Helmet, Rate Limiting" },
  { label: "Database", value: "MongoDB with Mongoose models" },
  { label: "Integrations", value: "Cloudinary, Stripe, Gemini-ready AI tutor" },
];

const CourseCard = ({ course, compact = false }) => {
  const lessons = Array.isArray(course.lessons) ? course.lessons : [];

  return (
    <Link
      to={`/course/${course._id}`}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-slate-800/80 bg-[#0d1222]/80 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-indigo-500/10 ${compact ? "min-w-[250px] max-w-[250px]" : ""
        }`}
    >
      <div className="relative h-36 border-b border-slate-800/60 bg-slate-900">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-555 text-slate-500">
            <GraduationCap className="h-10 w-10" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-300">
          {course.level || "Beginner"}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 bg-[#0d1222]/40">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            {course.category || "General"}
          </p>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-indigo-300 transition-colors">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
            {course.description}
          </p>
          <p className="text-[11px] font-medium text-slate-500">
            By {course.instructor?.name || "Instructor"}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs text-slate-450 text-slate-400">
          <span>{lessons.length} lessons</span>
          <span className="font-extrabold text-indigo-400">
            {Number(course.price) === 0 ? "Free" : `₹ ${course.price}`}
          </span>
        </div>
      </div>
    </Link>
  );
};

const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col justify-between gap-4 text-left md:flex-row md:items-end">
    <div>
      {eyebrow && (
        <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
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

  const totalLessons = useMemo(
    () => courses.reduce((sum, course) => sum + (course.lessons?.length || 0), 0),
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
              className="h-72 animate-pulse rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="h-32 rounded-md bg-slate-100" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
              <div className="mt-2 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <Cloud className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-900">No courses found</h3>
          <p className="mt-2 text-sm text-slate-500">
            Try another category or publish a course from the instructor dashboard.
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
    <div className="min-h-screen bg-[#070a13] text-slate-100 antialiased font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      <section className="border-b border-slate-900 bg-slate-950/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-7 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Learn practical, job-ready skills
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Learn job-ready skills from practical online courses
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                Explore structured courses with video lessons, secure enrollment,
                progress tracking, and certificates of completion.
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="max-w-2xl">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-2 shadow-inner sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="What do you want to learn?"
                    className="h-12 w-full rounded-xl border-0 bg-slate-950/60 pl-12 pr-4 text-sm font-medium text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                >
                  Search
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="rounded-full border border-slate-850 bg-slate-900/50 px-3 py-1 text-xs font-semibold text-slate-450 text-slate-400 transition hover:border-indigo-500/30 hover:bg-indigo-950/20 hover:text-indigo-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d1222] p-6 text-left text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-400">
                  Marketplace Snapshot
                </p>
                <h2 className="mt-1 text-lg font-bold">EduMind Course Platform</h2>
              </div>
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-850 bg-slate-900/30 p-4">
                <BookOpen className="h-5 w-5 text-indigo-300" />
                <p className="mt-3 text-2xl font-black">{loading ? "-" : courses.length}</p>
                <p className="text-xs font-semibold text-slate-400">Courses listed</p>
              </div>
              <div className="rounded-xl border border-slate-850 bg-slate-900/30 p-4">
                <Code2 className="h-5 w-5 text-indigo-300" />
                <p className="mt-3 text-2xl font-black">{loading ? "-" : totalLessons}</p>
                <p className="text-xs font-semibold text-slate-400">Lessons tracked</p>
              </div>
              <div className="rounded-xl border border-slate-850 bg-slate-900/30 p-4">
                <Users className="h-5 w-5 text-indigo-300" />
                <p className="mt-3 text-2xl font-black">2</p>
                <p className="text-xs font-semibold text-slate-400">User roles</p>
              </div>
              <div className="rounded-xl border border-slate-850 bg-slate-900/30 p-4">
                <CreditCard className="h-5 w-5 text-indigo-300" />
                <p className="mt-3 text-2xl font-black">Live</p>
                <p className="text-xs font-semibold text-slate-400">Checkout flow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-900 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition border border-slate-800/60 ${activeCategory === category
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 border-transparent"
                    : "bg-slate-900/40 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {auth.isAuthenticated && (
        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-xl border border-slate-800 bg-[#0d1222]/80 p-6 text-left shadow-sm">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Student Workspace
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Welcome back, {auth.user?.name || "learner"}
                </h2>
                <p className="mt-1 text-sm text-slate-350">
                  Continue learning, track completion, and collect certificates from your profile.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/my-courses"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#070a13] hover:bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm font-bold text-white shadow shadow-slate-900/40"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeader
          eyebrow="Learning paths"
          title="Start with a career goal"
          description="Guide learners toward outcomes instead of leaving them with only a course grid."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {learningPaths.map((path) => (
            <Link
              key={path.title}
              to="/courses"
              className="group rounded-xl border border-slate-800/80 bg-[#0d1222]/80 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-indigo-500/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-indigo-400 border border-slate-850">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-white">{path.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{path.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {path.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-950/40 border border-indigo-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-indigo-400">
                Explore path
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeader
          eyebrow="Popular courses"
          title={activeCategory === "All" ? "Popular on EduMind" : `Popular in ${activeCategory}`}
          description="Marketplace-style course discovery powered by your backend course records."
          action={
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {renderCourseGrid(popularCourses)}
      </section>

      <section className="border-y border-slate-900 bg-[#0a0d17]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <SectionHeader
            eyebrow="Beginner friendly"
            title="Recommended for new learners"
            description="A focused row for first-time learners, similar to a marketplace recommendation module."
          />
          {renderCourseGrid(beginnerCourses.length ? beginnerCourses : courses.slice(0, 4))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeader
          eyebrow="Recently added"
          title="Fresh courses from instructors"
          description="Highlight new content so the homepage feels active and marketplace-driven."
        />
        {renderCourseGrid(recentCourses)}
      </section>

      <section className="border-y border-slate-900 bg-[#090c16]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <SectionHeader
            eyebrow="Why EduMind"
            title="A practical learning experience"
            description="Keep the value proposition clear: students learn, instructors publish, and the platform manages the workflow."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 text-left"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-indigo-400 border border-slate-850">
                  {React.createElement(feature.icon, { className: "h-5 w-5" })}
                </div>
                <h3 className="text-base font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="bg-[#070a13]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
              Technical credibility
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              Built with a production-style MERN architecture
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Implementation behind the marketplace UI.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {stackItems.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-850 bg-[#0d1222]/80 p-5 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-300">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
