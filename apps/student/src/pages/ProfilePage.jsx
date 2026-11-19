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
  Camera,
  ExternalLink,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { auth } = useContext(AuthContext);
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

  const copyToClipboard = (text, message = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    showToast(message, "success");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = () => {
    if (!profile?.name) return "U";
    return profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-44 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6" />
          <div className="h-10 bg-zinc-900/40 border border-zinc-800 rounded-xl w-72" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="h-48 bg-zinc-900/40 border border-zinc-800 rounded-xl" />
            <div className="h-48 bg-zinc-900/40 border border-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 md:p-8 overflow-hidden text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-3xl font-semibold text-zinc-200 overflow-hidden">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="h-full w-full object-cover" 
                  />
                ) : getInitials()}
              </div>
            </div>

            {/* User Details */}
            <div className="flex-grow text-center md:text-left space-y-3">
              {!isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">{profile?.name}</h1>
                    <span className="px-2.5 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700/60 rounded-full text-[11px] font-medium uppercase tracking-wider">
                      {profile?.role}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 text-zinc-400 text-xs">
                    <span className="flex items-center gap-1.5 justify-center">
                      <Mail className="h-3.5 w-3.5 text-zinc-400" />
                      {profile?.email}
                    </span>
                    <span className="flex items-center gap-1.5 justify-center">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      Joined {formatDate(profile?.createdAt)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 rounded-lg text-xs font-medium text-zinc-200 transition"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-3 max-w-lg">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                      disabled={updating}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                      disabled={updating}
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={updating}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
                    >
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={updating}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition border border-zinc-700/50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Metrics */}
            <div className="flex md:flex-col gap-4 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 text-center md:text-left">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-medium">Courses Enrolled</span>
                <span className="text-xl font-semibold text-zinc-100">{profile?.enrolledCourses?.length || 0}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-medium">Certificates Earned</span>
                <span className="text-xl font-semibold text-emerald-400">{profile?.certificates?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 flex items-center gap-1.5 transition ${
              activeTab === "courses"
                ? "border-b-2 border-indigo-500 text-indigo-400 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <BookOpen className="h-4 w-4" /> Enrolled Courses ({profile?.enrolledCourses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`pb-3 flex items-center gap-1.5 transition ${
              activeTab === "certificates"
                ? "border-b-2 border-indigo-500 text-indigo-400 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Award className="h-4 w-4" /> Verified Credentials ({profile?.certificates?.length || 0})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            {profile?.enrolledCourses?.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 max-w-md mx-auto">
                <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">No active course enrollments found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {profile?.enrolledCourses?.map((course) => (
                  <div
                    key={course._id}
                    className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-left flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-sm text-zinc-100 line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{course.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800/60 flex justify-between items-center">
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {course.lessons?.length || 0} lessons
                      </span>
                      <Link
                        to={`/learn/${course._id}`}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                      >
                        Enter Classroom &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="space-y-4">
            {profile?.certificates?.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 max-w-md mx-auto">
                <Award className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Complete all lessons in a course to earn cryptographic credentials.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {profile?.certificates?.map((cert) => (
                  <div
                    key={cert.certificateId || cert._id}
                    className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 text-left space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 uppercase tracking-wider inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified Certificate
                        </span>
                        <h4 className="font-medium text-zinc-100 mt-2 line-clamp-1">
                          {cert.courseTitle || cert.courseId?.title || "Course Completed"}
                        </h4>
                      </div>
                      <GraduationCap className="w-7 h-7 text-zinc-600 flex-shrink-0" />
                    </div>

                    <div className="text-[11px] text-zinc-400 space-y-1 font-mono pt-1">
                      <p>Credential ID: <span className="text-zinc-300">{cert.certificateId}</span></p>
                      <p>Issued: <span className="text-zinc-300">{formatDate(cert.issuedAt)}</span></p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                      <button
                        onClick={() => copyToClipboard(cert.certificateId, "Credential ID copied!")}
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200"
                      >
                        <Copy className="w-3 h-3" /> Copy ID
                      </button>
                      <button
                        onClick={() => setSelectedFullCert(cert)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                      >
                        View Certificate <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedFullCert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 rounded-2xl max-w-lg w-full p-6 text-center shadow-2xl border border-zinc-800 relative space-y-4">
            <button
              onClick={() => setSelectedFullCert(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400">Certificate of Completion</p>
              <h3 className="text-lg font-semibold text-zinc-100 mt-1">
                {selectedFullCert.courseTitle || selectedFullCert.courseId?.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-300">
              Conferred upon <span className="font-semibold text-white">{profile?.name}</span> for successfully mastering all curriculum competencies.
            </p>
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 text-left text-[11px] font-mono text-zinc-400 space-y-1">
              <p>Credential: {selectedFullCert.certificateId}</p>
              <p>Issue Date: {formatDate(selectedFullCert.issuedAt)}</p>
              <p>Status: Cryptographically Verified</p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setSelectedFullCert(null)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2 rounded-lg text-xs font-medium border border-zinc-700/60 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
