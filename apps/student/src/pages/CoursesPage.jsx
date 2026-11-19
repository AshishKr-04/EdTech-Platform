import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Sparkles,
  RefreshCw,
  AlertCircle,
  FolderOpen
} from 'lucide-react';

const StarRating = ({ rating = 0 }) => {
  const safeRating = Number(rating) || 0;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`text-base ${i <= safeRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}>
        ★
      </span>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="ml-1.5 font-bold text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">{safeRating.toFixed(1)}</span>
    </div>
  );
};

const CoursesPage = () => {
  const { auth } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // "popular" | "rating" | "priceAsc" | "priceDesc"

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/courses');
      const fetchedCourses = response.data.courses || response.data || [];

      setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
    } catch (err) {
      setError('Failed to load courses. Please check your internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Extract unique categories dynamically from seeded courses
  const categories = ['All', ...new Set(courses.map(c => c.category || 'General'))];

  // Filtering & Sorting Logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      (course.category || 'General') === selectedCategory;

    const matchesLevel = 
      selectedLevel === 'All' || 
      course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'priceAsc') {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortBy === 'priceDesc') {
      return (b.price || 0) - (a.price || 0);
    }
    // Default: popular (studentsCount)
    return (b.studentsCount || 0) - (a.studentsCount || 0);
  });



  // 1. Loading Skeleton Grid
  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
        <div key={idx} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden p-4 animate-pulse space-y-3">
          <div className="w-full aspect-video bg-zinc-800 rounded-lg" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
          <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center">
            <div className="h-4 bg-zinc-800 rounded w-1/4" />
            <div className="h-3 bg-zinc-800 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  // 2. Error Card State
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="inline-flex items-center justify-center p-3.5 bg-rose-950/40 border border-rose-900/60 rounded-full text-rose-400 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Failed to load courses</h2>
        <p className="text-zinc-400 text-sm mb-6">{error}</p>
        <button 
          onClick={fetchAllCourses}
          className="bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8 bg-[#09090b] text-zinc-100 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        {auth.isAuthenticated && auth.user?.role === "Student" ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Welcome Back, {auth.user?.name || "Student"}!
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Explore new courses to level up your career
            </h1>
            <p className="text-zinc-400 text-sm">
              Hands-on lessons, interactive code challenges, and industry-recognized graduation credentials.
            </p>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Course Catalog
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Unlock Your Engineering Potential
            </h1>
            <p className="text-zinc-400 text-sm">
              Explore production-grade courses authored by verified industry leaders.
            </p>
          </>
        )}
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-5">
        
        {/* Search & Sort Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title, curriculum topic, skills..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition"
            />
          </div>

          {/* Sort selection */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-8 text-sm font-medium text-zinc-200 transition focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            >
              <option value="popular">Popularity (Most Enrolled)</option>
              <option value="rating">Highest Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Filter Badges & Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800/60 pt-4">
          
          {/* Category Filters */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Category</span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "bg-zinc-900/40 text-zinc-400 border border-zinc-800/80 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filters */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Expertise Level</span>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    selectedLevel === lvl
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "bg-zinc-900/40 text-zinc-400 border border-zinc-800/80 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* COURSES CATALOG LIST */}
      {loading ? (
        renderLoadingSkeletons()
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800 p-8 max-w-md mx-auto">
          <FolderOpen className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-zinc-200 mb-1">No courses found</h3>
          <p className="text-xs text-zinc-500 mb-5">
            We couldn't find any courses matching your search criteria. Try modifying your search or filter tags.
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 px-4 py-2 text-xs font-medium transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Link
              to={`/course/${course._id}`} 
              key={course._id} 
              className="group rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 text-left flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video w-full rounded-lg bg-zinc-800 overflow-hidden mb-3 relative">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full bg-zinc-850 text-zinc-500 flex items-center justify-center">
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
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="font-semibold text-zinc-100 text-sm">
                  {Number(course.price) === 0 ? "Free" : `₹${course.price}`}
                </span>
                <span className="text-xs text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default CoursesPage;
