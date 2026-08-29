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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(idx => (
        <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-pulse space-y-4 p-4">
          <div className="w-full h-44 bg-slate-100 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-5 bg-slate-100 rounded w-2/3" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="flex gap-2">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-1/4" />
          </div>
          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <div className="h-6 bg-slate-100 rounded w-1/3" />
            <div className="h-8 bg-slate-100 rounded-lg w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  // 2. Error Card State
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="inline-flex items-center justify-center p-4 bg-rose-50 rounded-full text-rose-500 mb-4">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to load courses</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <button 
          onClick={fetchAllCourses}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-md shadow-blue-100 transition-colors hover:bg-blue-600"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        {auth.isAuthenticated && auth.user?.role === "Student" ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-3 w-3" />
              Welcome Back, {auth.user?.name || "Student"}!
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Explore new courses to uplift yourself
            </h1>
            <p className="text-slate-500 text-base">
              Dive into our premium, hand-crafted lessons, complete interactive challenges, and continue upgrading your skills today.
            </p>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              World-Class Catalog
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Unlock Your True Potential
            </h1>
            <p className="text-slate-500 text-base">
              Join thousands of learners worldwide mastering core technologies under the industry's highest certified experts.
            </p>
          </>
        )}
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        
        {/* Search & Sort Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title, syllabus topic, skills..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-100/60 py-3 pl-12 pr-4 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Sort selection */}
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-100/60 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="popular">Popularity (Most Enrolled)</option>
              <option value="rating">Highest Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Filter Badges & Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
          
          {/* Category Filters */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-md shadow-slate-100"
                      : "bg-slate-100/70 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filters */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Expertise Level</span>
            <div className="flex flex-wrap gap-2">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedLevel === lvl
                      ? "bg-slate-900 text-white shadow-md shadow-slate-100"
                      : "bg-slate-100/70 text-slate-700 hover:bg-slate-200"
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
        
        // 3. Empty State Card
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto">
          <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No courses found</h3>
          <p className="text-sm text-slate-500 mb-6">
            We couldn't find any courses matching your search criteria. Try modifying your search or filter tags.
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
          >
            Clear Filters
          </button>
        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course) => {
            const lessons = Array.isArray(course.lessons) ? course.lessons : [];
            const reviewsCount = Math.floor(((course.studentsCount || 0) * 3.7) + 8);
            const originalPrice = course.price > 0 ? course.price * 5 : 0;
            const isBestseller = course.rating >= 4.5 || (course.studentsCount && course.studentsCount > 5);

            return (
              <Link 
                to={`/course/${course._id}`} 
                key={course._id} 
                className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg text-left flex flex-col h-full"
              >
                
                {/* Course Thumbnail */}
                <div className="w-full h-44 bg-slate-100 relative overflow-hidden flex-shrink-0 border-b border-slate-100">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-200 text-slate-400 flex items-center justify-center">
                      <GraduationCap className="h-12 w-12" />
                    </div>
                  )}

                  {/* Level Tag Overlay */}
                  <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/95 text-slate-800 backdrop-blur-sm border border-slate-100 shadow-sm">
                    {course.level || "Beginner"}
                  </span>
                </div>

                {/* Content Container */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-1">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {course.category || 'General'}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-slate-700 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 truncate">
                      By {course.instructor?.name || 'Professor'}
                    </p>

                    {/* Rating Row */}
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-extrabold text-amber-700">{course.rating?.toFixed(1) || "4.5"}</span>
                      <div className="flex text-amber-500">
                        {"★".repeat(Math.round(course.rating || 4.5))}
                        {"☆".repeat(5 - Math.round(course.rating || 4.5))}
                      </div>
                      <span className="text-[11px] text-slate-500">({reviewsCount})</span>
                    </div>

                    {/* Pricing Row */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-extrabold text-slate-900">
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                      </span>
                      {course.price > 0 && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bestseller Badge & Stats */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {isBestseller ? (
                        <span className="bg-[#eceb98] text-[#3d3c0a] font-bold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                          Bestseller
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">
                          {lessons.length} lessons
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {course.studentsCount || 0} enrolled
                    </span>
                  </div>

                </div>

              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CoursesPage;
