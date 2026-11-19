import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Layers, 
  CreditCard, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Video, 
  Check, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "General",
    level: "All Levels",
    lessons: [{ title: "", content: "", videoUrl: "" }],
  });

  const [videoPreview, setVideoPreview] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= BASIC CHANGE =================
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LESSON CHANGE =================
  const handleLessonChange = (index, e) => {
    const updated = [...courseData.lessons];
    updated[index][e.target.name] = e.target.value;
    setCourseData({ ...courseData, lessons: updated });
  };

  // ================= ADD / REMOVE LESSON =================
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

  // ================= VIDEO UPLOAD =================
  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview((prev) => ({ ...prev, [index]: previewUrl }));

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
      alert("Video upload failed. Check server network.");
    }
  };

  // ================= STEP NAVIGATION =================
  const handleNext = () => {
    if (currentStep === 1) {
      if (!courseData.title.trim()) {
        return alert("Course Title is required.");
      }
      if (!courseData.description.trim()) {
        return alert("Course Description is required.");
      }
    } else if (currentStep === 2) {
      const invalidLesson = courseData.lessons.some(
        (lesson) => !lesson.title || (!lesson.content && !lesson.videoUrl)
      );
      if (invalidLesson) {
        return alert("Each lesson must include a title and either lecture notes or video.");
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidLesson = courseData.lessons.some(
      (lesson) => !lesson.title || (!lesson.content && !lesson.videoUrl)
    );

    if (invalidLesson) {
      return alert("Each lesson must have a title and either notes or a video streaming URL.");
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...courseData,
        price: Number(courseData.price) || 0,
      };
      await api.post("/courses", payload);
      alert("Course successfully published to student catalog! 🎉");
      navigate("/instructor-dashboard");
    } catch (err) {
      console.error(err);
      alert("Error publishing course. Ensure you are authorized.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Course Details", icon: FileText },
    { id: 2, title: "Curriculum & Lessons", icon: Layers },
    { id: 3, title: "Pricing & Publish", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* PAGE TITLE */}
        <div className="text-left border-b border-zinc-800/80 pb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Course Studio</h1>
          <p className="text-xs text-zinc-400 mt-1">Design and publish high-impact learning experiences.</p>
        </div>

        {/* PROGRESS STEPPER (1. Details -> 2. Curriculum -> 3. Pricing & Publish) */}
        <div className="grid grid-cols-3 gap-2 border border-zinc-800 bg-zinc-900/40 p-2 rounded-xl">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (isCompleted || s.id < currentStep) setCurrentStep(s.id);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-sm"
                    : isCompleted
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-zinc-500 cursor-not-allowed"
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
          
          {/* STEP 1: COURSE DETAILS */}
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
                  placeholder="e.g. Advanced Distributed Systems in Go"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Course Overview & Description</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Summarize key learning outcomes and competencies..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
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
                  <label className="text-xs font-medium text-zinc-300">Target Skill Level</label>
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

          {/* STEP 2: CURRICULUM & LESSONS */}
          {currentStep === 2 && (
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    2. Course Curriculum & Syllabus
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Add lessons, lecture notes, or MP4 video recordings.</p>
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
                      placeholder="Lesson Title (e.g. TCP Handshakes & Connection Pooling)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                      required
                    />

                    <textarea
                      name="content"
                      value={lesson.content}
                      onChange={(e) => handleLessonChange(index, e)}
                      rows={3}
                      placeholder="Lesson summary and text materials..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />

                    {/* MINIMALIST DASHED VIDEO DROPZONE */}
                    <div className="relative border border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl p-4 text-center bg-zinc-900/30 transition">
                      <input
                        type="file"
                        accept="video/*"
                        id={`video-upload-${index}`}
                        onChange={(e) => handleVideoUpload(index, e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <UploadCloud className="w-5 h-5 text-zinc-500 mb-1" />
                        <span className="text-xs font-medium text-zinc-300">
                          {lesson.videoUrl ? "Video Uploaded (Click to replace)" : "Upload MP4 / WebM video"}
                        </span>
                        <span className="text-[10px] text-zinc-500 mt-0.5">Drag and drop or browse files</span>
                      </div>
                    </div>

                    {/* PREVIEW */}
                    {videoPreview[index] && (
                      <video
                        src={videoPreview[index]}
                        controls
                        className="mt-2 w-full max-h-48 rounded-lg bg-black border border-zinc-800"
                      />
                    )}

                    {/* PROGRESS */}
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

          {/* STEP 3: PRICING & PUBLISH */}
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
                    placeholder="e.g. 4999 (0 for Free)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Estimated Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={courseData.duration || ""}
                    onChange={handleChange}
                    placeholder="e.g. 12 Hours on demand"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              {/* SUMMARY CARD */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2 text-xs">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block">Curriculum Summary</span>
                <p className="text-zinc-200"><strong className="text-zinc-400 font-normal">Title:</strong> {courseData.title || "(Untitled)"}</p>
                <p className="text-zinc-200"><strong className="text-zinc-400 font-normal">Lessons:</strong> {courseData.lessons.length} sessions</p>
                <p className="text-zinc-200"><strong className="text-zinc-400 font-normal">Tuition:</strong> ₹{courseData.price || 0}</p>
                <p className="text-zinc-200"><strong className="text-zinc-400 font-normal">Category:</strong> {courseData.category}</p>
              </div>
            </div>
          )}

          {/* STEPPER BUTTONS */}
          <div className="flex justify-between items-center pt-2">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-700/60 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition shadow-sm ml-auto"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow-sm disabled:opacity-50 ml-auto"
              >
                {isSubmitting ? "Publishing Course..." : "Publish Course 🎉"}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
