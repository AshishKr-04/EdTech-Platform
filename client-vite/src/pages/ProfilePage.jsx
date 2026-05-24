import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Edit3, 
  Save, 
  Camera, 
  AlertCircle,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { auth, login } = useContext(AuthContext);
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" | "lessons" | "certificates"

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/users/profile");
      setProfile(res.data);
      setEditName(res.data.name || "");
      setEditAvatar(res.data.avatar || "");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast("Name is required", "error");
      return;
    }

    try {
      setUpdating(true);
      const res = await api.put("/users/profile", {
        name: editName,
        avatar: editAvatar,
      });

      setProfile(res.data.user);
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text, type = "Certificate Hash") => {
    navigator.clipboard.writeText(text);
    showToast(`${type} copied to clipboard!`, "success");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return auth.user?.email?.[0]?.toUpperCase() || "?";
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse px-4 py-6">
        <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          <div className="h-24 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          <div className="h-24 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-lg w-1/3" />
          <div className="h-48 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="inline-flex items-center justify-center p-4 bg-rose-50 rounded-full text-rose-500 mb-4 dark:bg-rose-950/30">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <button 
          onClick={fetchProfile}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-md shadow-indigo-100 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 py-6">
      
      {/* 1. HERO PROFILE CARD */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-violet-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-950/20">
        
        {/* Subtle glowing backgrounds */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          {/* Avatar Panel */}
          <div className="relative group">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-white/20 bg-indigo-950/50 flex items-center justify-center text-4xl font-extrabold shadow-lg relative overflow-hidden">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="h-full w-full object-cover" 
                />
              ) : getInitials()}
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center pointer-events-none transition-opacity">
                <Camera className="h-6 w-6 text-white/80" />
              </div>
            )}
          </div>

          {/* User Details Form/Content */}
          <div className="flex-grow text-center md:text-left space-y-4">
            {!isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight">{profile?.name}</h1>
                  <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    {profile?.role}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 text-indigo-200 text-sm">
                  <span className="flex items-center gap-1.5 justify-center">
                    <Mail className="h-4 w-4 text-indigo-300" />
                    {profile?.email}
                  </span>
                  <span className="flex items-center gap-1.5 justify-center">
                    <Calendar className="h-4 w-4 text-indigo-300" />
                    Joined {formatDate(profile?.createdAt)}
                  </span>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/25 rounded-xl text-sm font-semibold transition-all backdrop-blur-md"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm"
                      disabled={updating}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm"
                      disabled={updating}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-center md:justify-start">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-900/40 disabled:opacity-55 transition-all"
                    disabled={updating}
                  >
                    <Save className="h-4 w-4" />
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(profile.name || "");
                      setEditAvatar(profile.avatar || "");
                    }}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-all"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              {profile?.enrolledCourses?.length || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Courses Enrolled</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              {profile?.completedLessons?.length || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Lessons Finished</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-500 dark:text-amber-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              {profile?.certificates?.length || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Certificates Earned</p>
          </div>
        </div>

      </div>

      {/* 3. TABS SELECTOR */}
      <div className="border-b border-gray-100 dark:border-gray-800 flex gap-2">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "courses" 
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400" 
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          Enrolled Courses ({profile?.enrolledCourses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "certificates" 
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400" 
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          My Certificates ({profile?.certificates?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("lessons")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "lessons" 
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400" 
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          Lessons Done ({profile?.completedLessons?.length || 0})
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="min-h-[250px]">
        
        {/* TAB 1: COURSES */}
        {activeTab === "courses" && (
          <div>
            {!profile?.enrolledCourses || profile.enrolledCourses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No Active Courses</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start your learning journey today by exploring our hand-crafted courses.</p>
                <Link 
                  to="/courses"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-100 dark:shadow-none"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.enrolledCourses.map((course) => (
                  <div 
                    key={course._id}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow"
                  >
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="h-28 w-full md:w-32 object-cover rounded-xl flex-shrink-0"
                      />
                    ) : (
                      <div className="h-28 w-full md:w-32 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-8 w-8" />
                      </div>
                    )}

                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full dark:bg-indigo-950/50 dark:text-indigo-400">
                          {course.level}
                        </span>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-2 line-clamp-1">{course.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 dark:text-gray-400">{course.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {course.duration}
                        </span>
                        <Link 
                          to={`/learn/${course._id}`}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                        >
                          Continue Learning
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CERTIFICATES */}
        {activeTab === "certificates" && (
          <div>
            {!profile?.certificates || profile.certificates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No Certificates Earned Yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete 100% of any course syllabus to unlock a cryptographically signed, shareable certificate.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {profile.certificates.map((cert) => (
                  <div 
                    key={cert._id}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden"
                  >
                    {/* Glowing side border */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 to-violet-500" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <ShieldCheck className="h-5 w-5" />
                          </span>
                          <h4 className="text-xl font-bold text-indigo-900 dark:text-indigo-400">
                            {cert.courseId?.title || "Enrolled Course Completion"}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          Issued on {formatDate(cert.issuedAt)}
                        </p>
                        
                        <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-400">Certificate ID:</span>
                            <span>{cert.certificateId}</span>
                            <button 
                              onClick={() => copyToClipboard(cert.certificateId, "Certificate ID")} 
                              className="text-indigo-500 hover:text-indigo-600"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="flex items-start gap-2 break-all">
                            <span className="font-semibold text-gray-400 flex-shrink-0">SHA-256 HMAC Signature:</span>
                            <span className="text-[10px] text-gray-400 leading-tight">{cert.hash}</span>
                            <button 
                              onClick={() => copyToClipboard(cert.hash, "Verification Hash")} 
                              className="text-indigo-500 hover:text-indigo-600 flex-shrink-0 mt-0.5"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-gray-50 dark:border-gray-800 pt-4 md:pt-0 gap-3">
                        <div className="text-center md:text-right">
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50">
                            Verified Graduate
                          </span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(`https://edumind.platform/verify/${cert.certificateId}`, "Validation Link")}
                          className="flex items-center gap-1.5 px-4 py-2 border border-indigo-100 hover:border-indigo-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Share Credentials
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LESSONS DONE */}
        {activeTab === "lessons" && (
          <div>
            {!profile?.completedLessons || profile.completedLessons.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No Completed Lessons</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Launch a course player and complete study modules to view progress points.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-2">Registry of Finished Lectures</h4>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {profile.completedLessons.map((lessonId, idx) => (
                    <div key={lessonId} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[11px] font-bold">
                          ✓
                        </span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Completed Lesson ObjectId
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">({lessonId})</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded">
                        Done
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
