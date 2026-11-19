import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { 
  FileText, 
  Layers, 
  CreditCard, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft 
} from "lucide-react";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "General",
    level: "All Levels",
    lessons: [],
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/${id}`);
        const course = res.data.course;

        setCourseData({
          title: course.title || "",
          description: course.description || "",
          price: course.price || "",
          duration: course.duration || "",
          category: course.category || "General",
          level: course.level || "All Levels",
          lessons: course.lessons || [],
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (index, e) => {
    const updated = [...courseData.lessons];
    updated[index][e.target.name] = e.target.value || "";
    setCourseData({ ...courseData, lessons: updated });
  };

  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [
        ...courseData.lessons,
        { title: "", content: "", videoUrl: "" },
      ],
    });
  };

  const removeLesson = (index) => {
    if (courseData.lessons.length <= 1) return;
    const updated = courseData.lessons.filter((_, i) => i !== index);
    setCourseData({ ...courseData, lessons: updated });
  };

  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await api.post("/upload/video", formData, {
        onUploadProgress: (e) => {
          setUploadProgress((prev) => ({
            ...prev,
            [index]: Math.round((e.loaded * 100) / e.total),
          }));
        },
      });

      const updated = [...courseData.lessons];
      updated[index].videoUrl = res.data.url;
      setCourseData({ ...courseData, lessons: updated });
    } catch (err) {
      console.error(err);
      alert("Video upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalid = courseData.lessons.some(
      (l) => !l.title || (!l.content && !l.videoUrl)
    );

    if (invalid) {
      return alert("Each lesson must have a title and either text notes or a video stream.");
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...courseData,
        price: Number(courseData.price) || 0,
      };
      await api.put(`/courses/${id}`, payload);
      alert("Curriculum updated successfully!");
      navigate("/instructor-dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Course Details", icon: FileText },
    { id: 2, title: "Curriculum & Lessons", icon: Layers },
    { id: 3, title: "Pricing & Publish", icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-zinc-900 rounded w-1/3" />
          <div className="h-44 bg-zinc-900/60 rounded-xl border border-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
          <div className="text-left">
            <button
              onClick={() => navigate("/instructor-dashboard")}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Edit Curriculum</h1>
          </div>
          <span className="text-xs font-mono text-zinc-400 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
            ID: {id?.substring(0, 8)}...
          </span>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="grid grid-cols-3 gap-2 border border-zinc-800 bg-zinc-900/40 p-2 rounded-xl">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStep(s.id)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-sm"
                    : isCompleted
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
                )}
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">Step {s.id}</span>
              </button>
            );
          })}
        </div>

        {/* STEPPER CONTENT */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          {/* STEP 1: DETAILS */}
          {currentStep === 1 && (
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                1. General Course Information
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Overview & Description</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Category</label>
                  <select
                    name="category"
                    value={courseData.category}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  >
                    <option value="General">General</option>
                    <option value="Development">Software Development</option>
                    <option value="Design">UI/UX Design</option>
                    <option value="Business">Business & Management</option>
                    <option value="Data Science">Data & Machine Learning</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Skill Level</label>
                  <select
                    name="level"
                    value={courseData.level}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LESSONS */}
          {currentStep === 2 && (
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    2. Syllabus & Lessons
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Manage existing lectures or attach new video modules.</p>
                </div>
                <button
                  type="button"
                  onClick={addLesson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Lesson
                </button>
              </div>

              <div className="space-y-4">
                {courseData.lessons.map((lesson, index) => (
                  <div key={index} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-medium text-zinc-400">Lesson {index + 1}</span>
                      {courseData.lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLesson(index)}
                          className="text-zinc-500 hover:text-rose-400 transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      name="title"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(index, e)}
                      placeholder="Lesson Title"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                      required
                    />

                    <textarea
                      name="content"
                      value={lesson.content}
                      onChange={(e) => handleLessonChange(index, e)}
                      rows={3}
                      placeholder="Lecture notes..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                    />

                    {/* VIDEO DROPZONE */}
                    <div className="relative border border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl p-4 text-center bg-zinc-900/30 transition">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(index, e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <UploadCloud className="w-5 h-5 text-zinc-500 mb-1" />
                        <span className="text-xs font-medium text-zinc-300">
                          {lesson.videoUrl ? "Replace MP4 / WebM video" : "Upload MP4 / WebM video"}
                        </span>
                        <span className="text-[10px] text-zinc-500 mt-0.5">Click or drag file</span>
                      </div>
                    </div>

                    {uploadProgress[index] !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                          <span>Upload progress</span>
                          <span>{uploadProgress[index]}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all"
                            style={{ width: `${uploadProgress[index]}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PRICING */}
          {currentStep === 3 && (
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                3. Tuition & Launch Settings
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Tuition Price (INR ₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={courseData.price || ""}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Estimated Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={courseData.duration || ""}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEPPER BUTTONS */}
          <div className="flex justify-between items-center pt-2">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-700/60 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition shadow-sm ml-auto"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition shadow-sm disabled:opacity-50 ml-auto"
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;
