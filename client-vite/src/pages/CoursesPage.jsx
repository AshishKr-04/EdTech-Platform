import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
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
      <span key={i} className={`text-base ${i <= safeRating ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-gray-800"}`}>
        ★
      </span>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="ml-1.5 font-bold text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded dark:bg-amber-950/30 dark:text-amber-400">{safeRating.toFixed(1)}</span>
    </div>
  );
};

const CoursesPage = () => {
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

  const getLevelBadgeStyles = (level) => {
    switch (level) {
      case 'Advanced':
        return 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
      default:
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30';
    }
  };

  // 1. Loading Skeleton Grid
  const renderLoadingSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(idx => (
        <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm animate-pulse space-y-4 p-4">
          <div className="w-full h-44 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
          </div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
          </div>
          <div className="pt-2 flex justify-between items-center border-t border-gray-50 dark:border-gray-800">
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  // 2. Error Card State
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="inline-flex items-center justify-center p-4 bg-rose-50 dark:bg-rose-950/20 rounded-full text-rose-500 mb-4">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Failed to load courses</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <button 
          onClick={fetchAllCourses}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-indigo-100 transition-colors"
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider dark:bg-indigo-950/40 dark:text-indigo-400">
          <Sparkles className="h-3 w-3" />
          World-Class Catalog
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Unlock Your True Potential
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base">
          Join thousands of learners worldwide mastering core technologies under the industry's highest certified experts.
        </p>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        
        {/* Search & Sort Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title, syllabus topic, skills..."
              className="w-full bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
            />
          </div>

          {/* Sort selection */}
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white appearance-none cursor-pointer font-medium"
            >
              <option value="popular">Popularity (Most Enrolled)</option>
              <option value="rating">Highest Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Filter Badges & Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50 dark:border-gray-800 pt-4">
          
          {/* Category Filters */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filters */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Expertise Level</span>
            <div className="flex flex-wrap gap-2">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedLevel === lvl
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
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
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 max-w-md mx-auto">
          <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No courses found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            We couldn't find any courses matching your search criteria. Try modifying your search or filter tags.
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Clear Filters
          </button>
        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course) => {
            const lessons = Array.isArray(course.lessons) ? course.lessons : [];
            
            return (
              <Link 
                to={`/course/${course._id}`} 
                key={course._id} 
                className="group block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 relative"
              >
                
                {/* Course Thumbnail */}
                <div className="w-full h-44 bg-gray-100 dark:bg-gray-800 relative overflow-hidden flex-shrink-0">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-tr from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <GraduationCap className="h-12 w-12" />
                    </div>
                  )}

                  {/* Level Tag Overlay */}
                  <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm ${getLevelBadgeStyles(course.level)}`}>
                    {course.level}
                  </span>
                </div>

                {/* Content Container */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                      {course.category || 'General'}
                    </span>
                    <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                      By {course.instructor?.name || 'Instructor'}
                    </p>

                    <div className="pt-1.5">
                      <StarRating rating={course.rating} />
                    </div>
                  </div>

                  {/* Bottom Bar Info */}
                  <div className="mt-5 border-t border-gray-50 dark:border-gray-800 pt-4 flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none">Enroll Price</p>
                      <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        {course.price === 0 ? 'Free' : `₹${course.price}`}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-[10px] font-semibold text-gray-400">
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