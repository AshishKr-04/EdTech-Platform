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
  AlertCircle,
  FileText,
  GraduationCap,
  Camera
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
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    return ["courses", "lessons", "certificates"].includes(tab) ? tab : "courses";
  });
  const [selectedFullCert, setSelectedFullCert] = useState(null);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedFullCert(null);
      }
    };
    if (selectedFullCert) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedFullCert]);

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
        <div className="h-64 bg-slate-100 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 bg-slate-100 rounded-2xl" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-slate-100 rounded-lg w-1/3" />
          <div className="h-48 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="inline-flex items-center justify-center p-4 bg-rose-50 rounded-full text-rose-500 mb-4">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-600 mb-6">{error}</p>
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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-slate-800 relative overflow-hidden shadow-sm">
        
        {/* Subtle professional overlays */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-slate-50 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          {/* Avatar Panel */}
          <div className="relative group">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-slate-100 bg-slate-50 flex items-center justify-center text-4xl font-extrabold shadow-sm relative overflow-hidden text-slate-800">
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
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{profile?.name}</h1>
                  <span className="px-3 py-1 bg-slate-100 text-slate-750 rounded-full text-xs font-bold uppercase tracking-wider">
                    {profile?.role}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 text-slate-500 text-sm">
                  <span className="flex items-center gap-1.5 justify-center">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {profile?.email}
                  </span>
                  <span className="flex items-center gap-1.5 justify-center">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Joined {formatDate(profile?.createdAt)}
                  </span>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-slate-105 hover:bg-slate-200 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-all"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div className="space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      disabled={updating}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      disabled={updating}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-center md:justify-start">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 disabled:opacity-55 transition-all"
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
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all border border-slate-200"
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
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="text-2xl font-extrabold text-slate-900">
              {profile?.enrolledCourses?.length || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Courses Enrolled</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="text-2xl font-extrabold text-slate-900">
              {profile?.completedLessons?.length || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Lessons Finished</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Award className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="text-2xl font-extrabold text-slate-900">
              {profile?.certificates?.length || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Certificates Earned</p>
          </div>
        </div>

      </div>

      {/* 3. TABS SELECTOR */}
      <div className="border-b border-slate-200 flex gap-2">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "courses" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Enrolled Courses ({profile?.enrolledCourses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "certificates" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          My Certificates ({profile?.certificates?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("lessons")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "lessons" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-800"
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
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-850 mb-1">No Active Courses</h3>
                <p className="text-sm text-slate-550 mb-6">Start your learning journey today by exploring our hand-crafted courses.</p>
                <Link 
                  to="/courses"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-100"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {profile.enrolledCourses.map((course) => (
                  <div 
                    key={course._id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow"
                  >
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="h-28 w-full md:w-32 object-cover rounded-xl flex-shrink-0"
                      />
                    ) : (
                      <div className="h-28 w-full md:w-32 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-8 w-8" />
                      </div>
                    )}

                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                          {course.level}
                        </span>
                        <h4 className="text-lg font-bold text-slate-800 mt-2 line-clamp-1">{course.title}</h4>
                        <p className="text-xs text-slate-550 mt-1 line-clamp-2">{course.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
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
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Award className="h-12 w-12 text-slate-350 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Certificates Earned Yet</h3>
                <p className="text-sm text-slate-500">Complete 100% of any course syllabus to unlock a cryptographically signed, shareable certificate.</p>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                {profile.certificates.map((cert) => (
                  <div 
                    key={cert._id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden"
                  >
                    {/* Professional side border */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-900" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <ShieldCheck className="h-5 w-5" />
                          </span>
                          <h4 className="text-xl font-bold text-indigo-900">
                            {cert.courseId?.title || "Enrolled Course Completion"}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-450" />
                          Issued on {formatDate(cert.issuedAt)}
                        </p>
                        
                        <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono text-slate-500">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-400">Certificate ID:</span>
                            <span>{cert.certificateId}</span>
                            <button 
                              onClick={() => copyToClipboard(cert.certificateId, "Certificate ID")} 
                              className="text-indigo-650 hover:text-indigo-850"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="flex items-start gap-2 break-all">
                            <span className="font-semibold text-slate-450 flex-shrink-0">SHA-256 HMAC Signature:</span>
                            <span className="text-[10px] text-slate-400 leading-tight">{cert.hash}</span>
                            <button 
                              onClick={() => copyToClipboard(cert.hash, "Verification Hash")} 
                              className="text-indigo-650 hover:text-indigo-850 flex-shrink-0 mt-0.5"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                       <div className="flex-shrink-0 w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 gap-3">
                        <div className="text-center md:text-right">
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-200">
                            Verified Graduate
                          </span>
                        </div>
                        <button 
                          onClick={() => setSelectedFullCert(cert)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
                        >
                          <Award className="h-3.5 w-3.5" />
                          View Certificate 📜
                        </button>
                        <button 
                          onClick={() => copyToClipboard(`https://edumind.platform/verify/${cert.certificateId}`, "Validation Link")}
                          className="flex items-center gap-1.5 px-4 py-2 border border-indigo-100 hover:border-indigo-200 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50 transition-all shadow-sm"
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
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Completed Lessons</h3>
                <p className="text-sm text-slate-500">Launch a course player and complete study modules to view progress points.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 text-left">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Registry of Finished Lectures</h4>
                <div className="divide-y divide-slate-100">
                  {profile.completedLessons.map((lessonId, idx) => (
                    <div key={lessonId} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[11px] font-bold">
                          ✓
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          Completed Lesson
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">({lessonId})</span>
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

      {/* FULL CERTIFICATE VISUALIZER MODAL */}
      {selectedFullCert && (
        <div 
          onClick={() => setSelectedFullCert(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in print:bg-white print:p-0"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none"
          >
            
            {/* Modal Actions Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center print:hidden">
              <h3 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                Syllabus Graduation Certificate
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedFullCert(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Visual Certificate Card Body */}
            <div className="p-10 md:p-14 bg-[#fbf9f5] text-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[500px] border-[12px] border-amber-800/10 print:border-amber-800 print:bg-white print:min-h-0 print:h-screen">
              {/* Classical Border Design */}
              <div className="absolute inset-4 border-2 border-amber-600/20 pointer-events-none" />
              <div className="absolute inset-5 border border-dashed border-amber-700/10 pointer-events-none" />
              
              {/* Watermark/Seal background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-600/[0.02] border border-amber-600/[0.04] rounded-full pointer-events-none flex items-center justify-center font-serif text-[180px] select-none text-amber-600/[0.03]">
                E
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-3 z-10">
                <span className="text-[10px] md:text-xs uppercase font-extrabold tracking-[0.3em] text-amber-800 font-sans block">
                  EduMind Digital Academy
                </span>
                
                <div className="w-16 h-1 border-b-2 border-amber-500/30 mx-auto mt-2" />
                
                <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-amber-950 uppercase tracking-wide mt-2">
                  Certificate of Completion
                </h1>
                
                <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mt-1 font-sans">
                  This credential is formally granted to
                </p>
              </div>

              {/* Graduate Name */}
              <div className="text-center my-6 z-10">
                <h2 className="font-serif text-3xl md:text-4xl font-black text-slate-900 italic border-b border-slate-200/50 pb-2 max-w-[500px] mx-auto leading-tight">
                  {profile?.name || auth.user?.name || "Verified Graduate"}
                </h2>
                <p className="text-xs md:text-sm text-slate-600 max-w-[480px] mx-auto mt-4 font-serif leading-relaxed">
                  for successfully finishing all lessons, labs, lectures, and exams required to complete the verified curriculum for the course
                </p>
              </div>

              {/* Course Title */}
              <div className="text-center z-10">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-indigo-800 tracking-wide uppercase px-6 py-2.5 bg-white/50 border border-slate-200/40 rounded-2xl max-w-[550px] mx-auto shadow-sm">
                  {selectedFullCert.courseId?.title}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 mt-3 font-sans">
                  Issued on {formatDate(selectedFullCert.issuedAt)} • Academic Platform Validation
                </p>
              </div>

              {/* Signatures & Verification Signatures */}
              <div className="w-full flex flex-col md:flex-row justify-between items-end gap-6 pt-8 border-t border-slate-200/50 mt-6 z-10 print:mt-10">
                
                {/* Security Validation Metadata */}
                <div className="space-y-1.5 text-left font-mono text-[8px] text-slate-400 max-w-sm">
                  <div>
                    <span className="font-bold text-slate-500">CREDENTIAL ID:</span> {selectedFullCert.certificateId}
                  </div>
                  <div className="break-all leading-normal">
                    <span className="font-bold text-slate-500">SHA-256 HMAC:</span> {selectedFullCert.hash}
                  </div>
                  <div className="text-[7.5px] text-emerald-600/80 font-sans font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Secure cryptographic validation verified via EduMind Ledger Node.
                  </div>
                </div>

                {/* Seal & Formal Signature Lines */}
                <div className="flex items-center gap-8 md:gap-12 flex-shrink-0 self-center md:self-end">
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full bg-amber-600 flex items-center justify-center text-white text-[9px] font-black uppercase tracking-wider shadow border-4 border-[#fbf9f5] transform rotate-12">
                      Seal
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-amber-800 mt-1.5 font-sans">
                      Verified
                    </span>
                  </div>

                  <div className="flex gap-8 text-center text-[9px] font-sans uppercase tracking-wider text-slate-500">
                    <div className="w-24">
                      <div className="font-serif italic text-slate-800 text-[10px] lowercase leading-none h-6 flex items-end justify-center">
                        edumind academic board
                      </div>
                      <div className="border-t border-slate-300 pt-1 font-bold">
                        Academy Director
                      </div>
                    </div>
                    <div className="w-24">
                      <div className="font-serif italic text-indigo-700 text-[11px] lowercase leading-none h-6 flex items-end justify-center">
                        cryptographic verification
                      </div>
                      <div className="border-t border-slate-300 pt-1 font-bold">
                        Systems Auditor
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
