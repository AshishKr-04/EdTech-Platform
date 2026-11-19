import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Send, 
  X, 
  GraduationCap, 
  VideoOff,
  BookOpen
} from "lucide-react";

// --- CUSTOM LIGHTWEIGHT MARKDOWN RENDER COMPONENT ---
const RenderMarkdown = ({ text }) => {
  if (!text) return null;

  const paragraphs = text.split("\n\n");

  return (
    <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
      {paragraphs.map((para, i) => {
        let cleanText = para.trim();

        if (cleanText.startsWith("### ")) {
          return (
            <h4 key={i} className="font-semibold text-zinc-100 border-b border-zinc-800 pb-1 mt-3 mb-1.5 text-xs">
              {cleanText.replace("### ", "").replace(/\*\*/g, "")}
            </h4>
          );
        }

        if (cleanText.includes("\n* ") || cleanText.startsWith("* ") || cleanText.includes("\n- ") || cleanText.startsWith("- ")) {
          const lines = cleanText.split(/\n\s*[*-]\s*/);
          let firstLine = "";
          if (cleanText.startsWith("* ") || cleanText.startsWith("- ")) {
            firstLine = "";
          } else {
            firstLine = lines.shift() || "";
          }

          return (
            <div key={i} className="my-1.5">
              {firstLine && <p className="mb-1 font-medium text-zinc-200" dangerouslySetInnerHTML={{ __html: parseBold(firstLine) }} />}
              <ul className="list-disc list-inside pl-1 space-y-1">
                {lines.map((line, j) => {
                  let cleanLine = line.replace(/^[*-]\s*/, "").trim();
                  return (
                    <li
                      key={j}
                      className="text-[11px] text-zinc-400 leading-normal"
                      dangerouslySetInnerHTML={{ __html: parseBold(cleanLine) }}
                    />
                  );
                })}
              </ul>
            </div>
          );
        }

        return (
          <p key={i} className="text-xs" dangerouslySetInnerHTML={{ __html: parseBold(cleanText) }} />
        );
      })}
    </div>
  );
};

const parseBold = (str) => {
  return str.replace(/\*\*(.*?)\*\*/g, "<strong class='text-zinc-100'>$1</strong>");
};

const CoursePlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef();
  const chatEndRef = useRef();

  const [course, setCourse] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showGraduationModal, setShowGraduationModal] = useState(false);

  // AI Tutor States
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("player");

  // ================= FETCH COURSE & PROGRESS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/courses/${id}/learn`);
        setCourse(res.data.course);

        const progress = await api.get(`/courses/${id}/progress`);
        setLessonIndex(progress.data.lessonIndex || 0);

        try {
          const profile = await api.get("/users/profile");
          if (profile.data && profile.data.completedLessons) {
            setCompletedLessons(profile.data.completedLessons.map((l) => l.toString()));
          }
        } catch (err) {
          console.error("Failed to fetch user profile completed lessons", err);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 animate-pulse flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-zinc-500" />
        </div>
        <p className="text-sm font-medium animate-pulse text-zinc-500">Preparing learning theater...</p>
      </div>
    );
  }

  const lesson = course.lessons?.[lessonIndex] || {};

  // ================= NAVIGATION =================
  const nextLesson = () => {
    if (lessonIndex < course.lessons.length - 1) {
      const newIndex = lessonIndex + 1;
      setLessonIndex(newIndex);
      api.post(`/courses/${id}/progress`, { lessonIndex: newIndex });
    }
  };

  const prevLesson = () => {
    if (lessonIndex > 0) {
      const newIndex = lessonIndex - 1;
      setLessonIndex(newIndex);
      api.post(`/courses/${id}/progress`, { lessonIndex: newIndex });
    }
  };

  // ================= COMPLETE LESSON =================
  const completeLesson = async (lessonId) => {
    try {
      const res = await api.post(`/courses/${id}/lessons/${lessonId}/complete`);

      if (!completedLessons.includes(lessonId)) {
        setCompletedLessons((prev) => [...prev, lessonId]);
      }

      if (res.data.courseCompleted) {
        setShowGraduationModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SEND AI MESSAGE =================
  const handleSendMessage = async (msgText) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = { sender: "user", text: textToSend };
    setChatHistory((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsThinking(true);

    try {
      const res = await api.post(`/courses/${id}/lessons/${lessonIndex}/ai-tutor`, {
        message: textToSend,
      });

      const aiResponse = {
        sender: "ai",
        text: res.data.response || "I couldn't generate a response. Please try again.",
      };
      setChatHistory((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        sender: "ai",
        text: "❌ **Connection Error:** I failed to contact the AI Tutor server. Please make sure the backend is active.",
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen bg-[#09090b] text-zinc-100 lg:overflow-hidden lg:-m-8 h-auto min-h-[90vh]">
      
      {/* MOBILE TABS BAR (visible on mobile only) */}
      <div className="lg:hidden flex bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <button
          onClick={() => setActiveMobileTab("syllabus")}
          className={`flex-1 py-3 text-xs font-medium transition-all border-b-2 text-center ${
            activeMobileTab === "syllabus"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Syllabus
        </button>
        <button
          onClick={() => setActiveMobileTab("player")}
          className={`flex-1 py-3 text-xs font-medium transition-all border-b-2 text-center ${
            activeMobileTab === "player"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Player & Notes
        </button>
        <button
          onClick={() => setActiveMobileTab("ai")}
          className={`flex-1 py-3 text-xs font-medium transition-all border-b-2 text-center flex items-center justify-center gap-1.5 ${
            activeMobileTab === "ai"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Tutor
        </button>
      </div>

      {/* 1. LEFT SIDEBAR: LESSONS (Syllabus List) */}
      <div className={`${activeMobileTab === "syllabus" ? "flex" : "hidden"} lg:flex ${showAiTutor ? "lg:w-1/5" : "lg:w-1/4"} bg-zinc-950/70 border-r border-zinc-800/80 flex-col h-[65vh] lg:h-full transition-all duration-300 w-full`}>
        <div className="p-4 border-b border-zinc-800/80">
          <h2 className="font-semibold text-zinc-100 text-sm truncate">{course.title}</h2>
          <div className="flex items-center justify-between text-xs text-zinc-400 mt-1.5">
            <span>{course.lessons?.length || 0} lessons</span>
            <span className="text-zinc-500 font-mono text-[11px]">
              {completedLessons.length}/{course.lessons?.length || 0} done
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
          {course.lessons.map((l, i) => {
            const isCompleted = completedLessons.includes(l._id);
            const isActive = i === lessonIndex;
            return (
              <div
                key={i}
                onClick={() => {
                  setLessonIndex(i);
                  if (window.innerWidth < 1024) {
                    setActiveMobileTab("player");
                  }
                }}
                className={`p-3.5 cursor-pointer text-xs transition flex justify-between items-center ${
                  isActive
                    ? "bg-zinc-900/90 text-indigo-400 font-medium border-l-2 border-indigo-500"
                    : "hover:bg-zinc-900/40 text-zinc-300"
                }`}
              >
                <span className="truncate pr-2 flex items-center gap-2.5">
                  {/* Subtle completed indicator dot */}
                  {isCompleted ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" title="Completed" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 flex-shrink-0" />
                  )}
                  <span className="truncate">{i + 1}. {l.title}</span>
                </span>
                {isActive && (
                  <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded text-[10px] flex-shrink-0">
                    Playing
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CENTER SECTION: THEATER VIDEO PLAYER & NOTES */}
      <div className={`${activeMobileTab === "player" ? "flex" : "hidden"} lg:flex flex-1 flex-col h-full bg-[#09090b] overflow-y-auto p-4 lg:p-6 transition-all duration-300 w-full pb-16 lg:pb-6 text-left`}>
        {/* HEADER & TOGGLE */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 uppercase tracking-wider">
              Lesson {lessonIndex + 1} of {course.lessons.length}
            </span>
            <h1 className="text-lg font-semibold text-zinc-100 mt-1">{lesson.title}</h1>
          </div>

          {/* AI TOGGLE BUTTON */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setActiveMobileTab("ai");
              } else {
                setShowAiTutor(!showAiTutor);
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs border transition ${
              showAiTutor || activeMobileTab === "ai"
                ? "bg-zinc-800 text-zinc-100 border-zinc-700"
                : "bg-zinc-900/60 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {showAiTutor || activeMobileTab === "ai" ? "Hide AI Tutor" : "Ask AI Tutor"}
          </button>
        </div>

        {/* THEATER PLAYER WRAPPER (True 16:9 deep black container) */}
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl relative flex items-center justify-center border border-zinc-800/80">
          {lesson.videoUrl ? (
            <video
              ref={videoRef}
              src={lesson.videoUrl}
              controls
              autoPlay
              onEnded={async () => {
                await completeLesson(lesson._id);
                nextLesson();
              }}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-zinc-500 p-8 flex flex-col items-center">
              <VideoOff className="w-10 h-10 text-zinc-600 mb-2" />
              <p className="text-sm font-medium text-zinc-300">No video stream for this lesson</p>
              <p className="text-xs mt-1 text-zinc-500">Read the lesson notes below or interact with the AI Tutor.</p>
            </div>
          )}
        </div>

        {/* NOTES & CONTROLS */}
        <div className="mt-6 flex-grow space-y-4">
          {/* NAVIGATION CONTROLS */}
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
            <button
              onClick={prevLesson}
              disabled={lessonIndex === 0}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {/* COMPLETE LESSON BUTTON */}
            {completedLessons.includes(lesson._id) ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            ) : (
              <button
                onClick={() => completeLesson(lesson._id)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 rounded-lg shadow-sm transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
              </button>
            )}

            <button
              onClick={nextLesson}
              disabled={lessonIndex === course.lessons.length - 1}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* NOTES CONTAINER */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
              <FileText className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Lesson Material & Notes</h3>
            </div>
            {lesson.content ? (
              <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {lesson.content}
              </div>
            ) : (
              <p className="text-zinc-500 text-xs italic">No lecture notes uploaded for this session.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR: AI TUTOR PANEL */}
      {(showAiTutor || activeMobileTab === "ai") && (
        <div className={`${showAiTutor ? "lg:flex" : "lg:hidden"} ${activeMobileTab === "ai" ? "flex" : "hidden"} lg:w-1/4 bg-zinc-950/90 border-l border-zinc-800/80 flex-col h-[75vh] lg:h-full shadow-2xl transition-all duration-300 w-full`}>
          {/* AI PANEL HEADER */}
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <div className="text-left">
                <h3 className="font-semibold text-xs text-zinc-100">EduMind AI Tutor</h3>
                <p className="text-[10px] text-zinc-400 truncate max-w-[150px]">Context: {lesson.title}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowAiTutor(false);
                if (window.innerWidth < 1024) {
                  setActiveMobileTab("player");
                }
              }}
              className="text-zinc-400 hover:text-zinc-100 text-xs p-1 rounded-md hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CHAT BUBBLES AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#09090b]/50 flex flex-col min-h-[200px]">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-xl p-3 text-xs flex flex-col ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none self-end ml-auto"
                    : "bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-bl-none self-start"
                }`}
              >
                <RenderMarkdown text={msg.text} />
              </div>
            ))}

            {/* AI THINKING LOADING INDICATOR */}
            {isThinking && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl rounded-bl-none p-3 text-xs self-start max-w-[80%] flex items-center gap-2">
                <span className="text-[11px] text-zinc-400">Tutor thinking</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce delay-100" />
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce delay-200" />
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce delay-300" />
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* CHAT INPUT AREA */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/40 space-y-2">
            {/* QUICK PRESET prompt chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => handleSendMessage("Summarize this lesson")}
                disabled={isThinking}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-[10px] whitespace-nowrap font-medium border border-zinc-700/60 transition disabled:opacity-40"
              >
                Summarize
              </button>
              <button
                onClick={() => handleSendMessage("Explain this concept simply")}
                disabled={isThinking}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-[10px] whitespace-nowrap font-medium border border-zinc-700/60 transition disabled:opacity-40"
              >
                Explain simply
              </button>
              <button
                onClick={() => handleSendMessage("Give me a quick quiz question")}
                disabled={isThinking}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-[10px] whitespace-nowrap font-medium border border-zinc-700/60 transition disabled:opacity-40"
              >
                Quiz me
              </button>
            </div>

            {/* MESSAGE ENTRY FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI tutor..."
                disabled={isThinking}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 disabled:opacity-40 transition"
              />
              <button
                type="submit"
                disabled={isThinking || !inputMessage.trim()}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-500 disabled:opacity-40 transition flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GRADUATION MODAL */}
      {showGraduationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-zinc-800">
            <div className="w-14 h-14 bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Congratulations, Graduate!
            </h3>
            <p className="text-xs text-zinc-400 mt-2">
              You completed all lessons in <span className="text-zinc-200 font-medium">"{course.title}"</span>.
            </p>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Your cryptographic certificate of completion has been issued and saved to your profile.
            </p>
            
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowGraduationModal(false);
                  navigate("/profile?tab=certificates");
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-xs transition shadow-sm"
              >
                View Certificate in Profile
              </button>
              <button
                onClick={() => setShowGraduationModal(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-2 rounded-lg text-xs transition border border-zinc-700/60"
              >
                Keep Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayerPage;
