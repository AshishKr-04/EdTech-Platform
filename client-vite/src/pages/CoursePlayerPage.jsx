import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

// --- CUSTOM LIGHTWEIGHT MARKDOWN RENDER COMPONENT ---
const RenderMarkdown = ({ text }) => {
  if (!text) return null;

  // Split by paragraph double line breaks
  const paragraphs = text.split("\n\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed text-gray-800">
      {paragraphs.map((para, i) => {
        let cleanText = para.trim();

        // 1. Handle h3 headers e.g. "### Heading"
        if (cleanText.startsWith("### ")) {
          return (
            <h4 key={i} className="font-bold text-gray-900 border-b pb-1 mt-4 mb-2 text-sm">
              {cleanText.replace("### ", "").replace(/\*\*/g, "")}
            </h4>
          );
        }

        // 2. Handle inline/block lists e.g. starting with "* " or "- "
        if (cleanText.includes("\n* ") || cleanText.startsWith("* ") || cleanText.includes("\n- ") || cleanText.startsWith("- ")) {
          // split lines
          const lines = cleanText.split(/\n\s*[\*\-]\s*/);
          let firstLine = "";
          // Check if first line starts with a list bullet
          if (cleanText.startsWith("* ") || cleanText.startsWith("- ")) {
            firstLine = "";
          } else {
            firstLine = lines.shift() || "";
          }

          return (
            <div key={i} className="my-2">
              {firstLine && <p className="mb-1 font-medium" dangerouslySetInnerHTML={{ __html: parseBold(firstLine) }} />}
              <ul className="list-disc list-inside pl-1 space-y-1">
                {lines.map((line, j) => {
                  let cleanLine = line.replace(/^[\*\-]\s*/, "").trim();
                  return (
                    <li
                      key={j}
                      className="text-xs text-gray-700 leading-normal"
                      dangerouslySetInnerHTML={{ __html: parseBold(cleanLine) }}
                    />
                  );
                })}
              </ul>
            </div>
          );
        }

        // 3. Default Paragraph
        return (
          <p key={i} className="text-xs" dangerouslySetInnerHTML={{ __html: parseBold(cleanText) }} />
        );
      })}
    </div>
  );
};

// Simple bold helper
const parseBold = (str) => {
  return str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
};

const CoursePlayerPage = () => {
  const { id } = useParams();
  const videoRef = useRef();
  const chatEndRef = useRef();

  const [course, setCourse] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(0);

  // AI Tutor States
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // ================= FETCH COURSE & PROGRESS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/courses/${id}/learn`);
        setCourse(res.data.course);

        const progress = await api.get(`/courses/${id}/progress`);
        setLessonIndex(progress.data.lessonIndex || 0);
      } catch (err) {
        console.error(err);
        alert("Access Denied: You must purchase or enroll in this course to learn!");
        window.location.href = `/course/${id}`;
      }
    };

    fetchData();
  }, [id]);

  // ================= PROGRESS TRACKING =================
  useEffect(() => {
    const saveProgress = async () => {
      try {
        await api.post(`/courses/${id}/progress`, {
          lessonIndex,
          time: videoRef.current?.currentTime || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (course) saveProgress();
  }, [lessonIndex, id, course]);

  // ================= AI TUTOR WELCOME RESET =================
  useEffect(() => {
    if (course && course.lessons?.[lessonIndex]) {
      setChatHistory([
        {
          sender: "ai",
          text: `### Hello! I am your AI Study Partner 🤖
I'm ready to help you learn **"${course.lessons[lessonIndex].title}"**! 

Ask me anything, or click one of the quick prompts below:`,
        },
      ]);
    }
  }, [lessonIndex, course]);

  // ================= AUTO SCROLL CHAT =================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isThinking]);

  if (!course) return <p className="text-center mt-10 animate-pulse">Loading course player...</p>;

  const lesson = course.lessons?.[lessonIndex];
  if (!lesson) return <p className="text-center mt-10">No active lesson found</p>;

  // ================= NAV CONTROLS =================
  const nextLesson = async () => {
    if (lessonIndex < course.lessons.length - 1) {
      const newIndex = lessonIndex + 1;
      setLessonIndex(newIndex);

      await api.post(`/courses/${id}/progress`, {
        lessonIndex: newIndex,
        time: 0,
      });
    }
  };

  const prevLesson = () => {
    if (lessonIndex > 0) {
      setLessonIndex(lessonIndex - 1);
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
    <div className="flex h-screen bg-gray-50 overflow-hidden -m-8">
      {/* 1. LEFT SIDEBAR: LESSONS (20% or 25% width) */}
      <div className={`${showAiTutor ? "w-1/5" : "w-1/4"} bg-white border-r flex flex-col h-full transition-all duration-300`}>
        <div className="p-4 border-b">
          <h2 className="font-bold text-gray-800 text-base truncate">{course.title}</h2>
          <p className="text-xs text-gray-500 mt-1">{course.lessons?.length || 0} lessons</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.lessons.map((l, i) => (
            <div
              key={i}
              onClick={() => setLessonIndex(i)}
              className={`p-4 cursor-pointer border-b text-xs transition flex justify-between items-center ${
                i === lessonIndex
                  ? "bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="truncate pr-2">
                {i + 1}. {l.title}
              </span>
              {i === lessonIndex && (
                <span className="bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded text-[10px]">Active</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. CENTER SECTION: VIDEO PLAYER & NOTES (55% or 75% width) */}
      <div className="flex-1 flex flex-col h-full bg-gray-100 overflow-y-auto p-6 transition-all duration-300">
        {/* HEADER & TOGGLE */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Lesson {lessonIndex + 1}
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-1">{lesson.title}</h1>
          </div>

          {/* AI TOGGLE BUTTON */}
          <button
            onClick={() => setShowAiTutor(!showAiTutor)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs shadow-md transition transform hover:scale-105 duration-200 ${
              showAiTutor
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
            }`}
          >
            <span className="animate-pulse">✨</span>
            {showAiTutor ? "Close AI Tutor" : "Ask AI Tutor"}
          </button>
        </div>

        {/* PLAYER WRAPPER */}
        <div className="bg-black rounded-xl overflow-hidden shadow-xl aspect-video relative flex items-center justify-center">
          {lesson.videoUrl ? (
            <video
              ref={videoRef}
              src={lesson.videoUrl}
              controls
              autoPlay
              onEnded={nextLesson}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-400 p-8">
              <span className="text-4xl block mb-2">🎥</span>
              <p className="text-sm font-semibold">No video streaming provided for this lesson.</p>
              <p className="text-xs mt-1 text-gray-500">Read the lesson notes or consult the AI Study Buddy!</p>
            </div>
          )}
        </div>

        {/* NOTES & CONTROLS */}
        <div className="mt-6 flex-grow">
          {/* NAVIGATION CONTROLS */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <button
              onClick={prevLesson}
              disabled={lessonIndex === 0}
              className="flex items-center gap-1 bg-white text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold border shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ◀ Previous
            </button>

            <button
              onClick={nextLesson}
              disabled={lessonIndex === course.lessons.length - 1}
              className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next ▶
            </button>
          </div>

          {/* NOTES CONTAINER */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3">📝 Lesson Notes</h3>
            {lesson.content ? (
              <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{lesson.content}</p>
            ) : (
              <p className="text-gray-400 text-xs italic">No lecture notes uploaded for this session.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR: AI TUTOR PANEL (25% width, slides in) */}
      {showAiTutor && (
        <div className="w-1/4 bg-white border-l flex flex-col h-full shadow-2xl transition-all duration-300 animate-slide-in">
          {/* AI PANEL HEADER */}
          <div className="p-4 border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-bold text-xs">EduMind AI Tutor</h3>
                <p className="text-[10px] text-violet-100 animate-pulse">Context: {lesson.title}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAiTutor(false)}
              className="text-white hover:text-gray-200 text-sm font-bold p-1 bg-white/10 rounded-full h-6 w-6 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* CHAT BUBBLES AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 flex flex-col">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm flex flex-col ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none self-end ml-auto"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none self-start"
                }`}
              >
                <RenderMarkdown text={msg.text} />
              </div>
            ))}

            {/* AI THINKING LOADING INDICATOR */}
            {isThinking && (
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 text-xs self-start max-w-[80%] shadow-sm flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500 font-semibold">Tutor is thinking</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce delay-100" />
                  <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce delay-200" />
                  <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce delay-300" />
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* CHAT INPUT AREA */}
          <div className="p-3 border-t bg-white space-y-2">
            {/* QUICK PRESET prompt chips */}
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              <button
                onClick={() => handleSendMessage("Summarize this lesson")}
                disabled={isThinking}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-[10px] whitespace-nowrap font-medium border border-indigo-100 transition disabled:opacity-50"
              >
                📝 Summarize
              </button>
              <button
                onClick={() => handleSendMessage("Explain this concept simply")}
                disabled={isThinking}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-[10px] whitespace-nowrap font-medium border border-purple-100 transition disabled:opacity-50"
              >
                💡 Explain concept
              </button>
              <button
                onClick={() => handleSendMessage("Give me a quick quiz question")}
                disabled={isThinking}
                className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-[10px] whitespace-nowrap font-medium border border-pink-100 transition disabled:opacity-50"
              >
                🏆 Quiz me
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
                placeholder="Ask your AI tutor..."
                disabled={isThinking}
                className="flex-1 border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 transition"
              />
              <button
                type="submit"
                disabled={isThinking || !inputMessage.trim()}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayerPage;