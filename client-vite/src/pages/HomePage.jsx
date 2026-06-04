import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Brain, 
  CreditCard, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Star,
  Users,
  Compass,
  MessageSquare,
  Check,
  FileText,
  Terminal,
  Play,
  Search,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Send,
  AlertCircle
} from "lucide-react";

// Standard Star Rating component
const StarRating = ({ rating = 0 }) => {
  const safeRating = Number(rating) || 0;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`text-sm ${i <= safeRating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-800"}`}>
        ★
      </span>
    );
  }
  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="ml-1 text-xs font-bold text-gray-500">{safeRating.toFixed(1)}</span>
    </div>
  );
};

const HomePage = () => {
  const { auth } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Client-side search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Career Pathway Selector
  const [selectedPath, setSelectedPath] = useState("frontend");

  // Console Playground States
  const [consoleTab, setConsoleTab] = useState("ai"); // 'ai', 'cert', 'workspace'
  
  // AI Companion Mock Playground
  const [aiChat, setAiChat] = useState([
    { sender: "ai", text: "### Welcome to **EduMind AI Study Partner**! 🤖\n\nI am your real-time study companion. You can ask me questions about any topic in your syllabus.\n\nSelect one of the sample prompts below, or type your own question!" }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Certificate Preview Sandbox
  const [studentName, setStudentName] = useState("Alex Mercer");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("Fullstack Web Architecture");

  // Live Workspace Sandbox
  const [workspaceCode, setWorkspaceCode] = useState(`// Click 'Run Code' to execute this script in our sandbox console
const courseName = "EduMind Masterclass";
console.log("Welcome to " + courseName + "!");

const calculateSyllabusProgress = (completed, total) => {
  return Math.round((completed / total) * 100);
};

console.log("Your learning progress is: " + calculateSyllabusProgress(8, 10) + "%");
`);
  const [workspaceOutput, setWorkspaceOutput] = useState("Click 'Run Code' to see console log output...");
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.user?.role === "Instructor") {
          const res = await api.get("/courses/instructor/my-courses");
          setMyCourses(res.data.courses || []);
        } else {
          const res = await api.get("/courses");
          setCourses(res.data.courses || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) fetchData();
  }, [auth]);

  // AI Mock tutor simulation helper
  const handleAskAiMock = (messageText) => {
    if (!messageText || messageText.trim() === "" || isAiTyping) return;
    
    // Add user question
    const updatedChat = [...aiChat, { sender: "user", text: messageText }];
    setAiChat(updatedChat);
    setAiInput("");
    setIsAiTyping(true);

    const question = messageText.toLowerCase();
    let responseText = "";

    if (question.includes("closure") || question.includes("lexical")) {
      responseText = `### Understanding Javascript Closures 💡

A **closure** is created when an inner function retains references to variables in its outer lexical scope, even after the outer function has finished executing.

\`\`\`javascript
function createGreeter(greeting) {
  return function(name) {
    console.log(greeting + ", " + name);
  };
}
const sayHello = createGreeter("Welcome");
sayHello("Sarah"); // Output: "Welcome, Sarah"
\`\`\`
It allows powerful abstractions like private variables and function factories!`;
    } else if (question.includes("api") || question.includes("rest")) {
      responseText = `### What is a REST API? 🌐

An **API** (Application Programming Interface) allows two software modules to exchange data. A **REST API** uses standard HTTP methods:
*   \`GET\`: Retrieve database records.
*   \`POST\`: Create a new record (e.g. purchasing a course).
*   \`PUT\` / \`PATCH\`: Modify existing records.
*   \`DELETE\`: Remove a resource.

Clients and servers communicate by sending **JSON** payloads over secure HTTPS connections.`;
    } else if (question.includes("hash") || question.includes("cryptographic") || question.includes("certificate")) {
      responseText = `### Cryptographic Credentials & Verification 🔒

When completing a course, the server generates a tamper-proof SHA-256 HMAC digital validation hash.

1.  **Input Key**: Student ID + Course ID + UUID
2.  **Hashing Function**: HMAC SHA-256 using a secure backend salt.
3.  **Result**: A unique signature:
    \`hash = 7b6e927fa1c48...d2f9\`
4.  **Verification**: Employers can verify this signature against our ledger database to prove credentials immediately without trust intermediaries.`;
    } else if (question.includes("react") || question.includes("state")) {
      responseText = `### React State Management ⚛️

**State** represents the data model inside a component that changes over time. When state is updated, React automatically re-renders the component to show the new data.

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\``;
    } else {
      responseText = `### Study Buddy Response 🤖

That is a great question! On the **EduMind platform**, our built-in context-aware AI tutor reads current video script subtitles and syllabus lesson contents dynamically.

Try asking me about **"What is a Javascript Closure?"**, **"How do REST APIs work?"**, or **"Explain cryptographic hash verification."**`;
    }

    // Simulate typing delay
    setTimeout(() => {
      let currentWordIndex = 0;
      const words = responseText.split(" ");
      let currentText = "";
      
      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          currentText += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex];
          setAiChat([...updatedChat, { sender: "ai", text: currentText }]);
          currentWordIndex++;
        } else {
          clearInterval(interval);
          setIsAiTyping(false);
        }
      }, 35);
    }, 600);
  };

  // Run mock Javascript code console simulation
  const handleRunCodeMock = () => {
    if (isCodeRunning) return;
    setIsCodeRunning(true);
    setWorkspaceOutput("> Compiling script...\n> Spawning local isolation node sandbox...\n> Running main.js...");

    setTimeout(() => {
      let logs = [];
      const codeLines = workspaceCode.split("\n");
      
      // Simple mock execution results
      if (workspaceCode.includes("courseName") && workspaceCode.includes("calculateSyllabusProgress")) {
        logs.push("Welcome to EduMind Masterclass!");
        logs.push("Your learning progress is: 80%");
      } else if (workspaceCode.includes("console.log")) {
        // Try parsing any simple console logs
        codeLines.forEach(line => {
          if (line.includes("console.log")) {
            const match = line.match(/console\.log\((['"`]?)(.*?)\1\)/);
            if (match && match[2]) {
              logs.push(match[2]);
            }
          }
        });
        if (logs.length === 0) {
          logs.push("Script executed with exit code 0.");
        }
      } else {
        logs.push("Script executed with exit code 0. (No stdout logged)");
      }

      setWorkspaceOutput(`> node main.js\n${logs.map(l => `[LOG]: ${l}`).join("\n")}\n\nExecution finished successfully (0.02s)`);
      setIsCodeRunning(false);
    }, 1200);
  };

  // Filter and Sort Courses catalog (for Guest or Student view)
  const getFilteredCourses = () => {
    let list = [...courses];

    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) || 
        (c.category && c.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      list = list.filter(c => c.category === selectedCategory);
    }

    // Difficulty level filter
    if (selectedLevel !== "All") {
      list = list.filter(c => c.level === selectedLevel);
    }

    // Sort order
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // popular
      list.sort((a, b) => (b.studentsCount || 0) - (a.studentsCount || 0));
    }

    return list;
  };

  // List of unique categories for catalog filter tabs
  const getCategoriesList = () => {
    const list = new Set(courses.map(c => c.category).filter(Boolean));
    return ["All", ...Array.from(list)];
  };

  // Career timeline nodes
  const pathways = {
    frontend: {
      title: "Frontend Systems Architect",
      desc: "Master high-performance React UI architectures, state synchronization pipelines, CSS layouts, and atomic build modules.",
      steps: [
        { title: "Foundations & Semantic Layouts", detail: "Deep dive HTML5 DOM, fluid layouts, modern CSS variables, animations, and Tailwind design tokens." },
        { title: "React State & Component Architecture", detail: "Hooks, virtual DOM nodes, Context engines, custom performance reducers, and global stores." },
        { title: "Bundling, Performance & SSR", detail: "Webpack, Vite, Next.js hydration, server components, dynamic code-splitting, and asset preloads." },
        { title: "Enterprise Scaling & Verification Labs", detail: "Vitest unit coverage, end-to-end testing with Playwright, and cryptographic certificate minting." }
      ]
    },
    fullstack: {
      title: "Fullstack Solutions Engineer",
      desc: "Build highly reliable backend services, database schemas, payment gateways, and real-time synchronization webhooks.",
      steps: [
        { title: "Node.js & API Architecture", detail: "Asynchronous I/O pipelines, Express routes, Zod validation middleware, and auth rate-limit configurations." },
        { title: "Data Storage & Query Engines", detail: "Mongoose database schemas, indexing strategies, aggregate pipelines, and redis cache layers." },
        { title: "Payment Orchestration & Webhooks", detail: "Stripe secure checkout flows, atomic orders, webhook event validations, and failure fallbacks." },
        { title: "Cloud Devops & Live Deployments", detail: "Docker containers, environment configurations, CI/CD integrations, and server monitoring." }
      ]
    },
    ai: {
      title: "AI Integrations & Data Engineer",
      desc: "Integrate vector search indices, large language model API routing, semantic prompts, and predictive analytics tools.",
      steps: [
        { title: "Python & Data Science Foundations", detail: "Data cleaning, structured tables with Pandas, matrix computations with NumPy, and analytical plotting." },
        { title: "Prompt Engineering & LLM APIs", detail: "Context injection, system prompts, chat history stores, token limits, and secure API bridges." },
        { title: "Vector Databases & Semantic Search", detail: "Text embeddings, cosine similarity searches, Retrieval-Augmented Generation (RAG) frameworks." },
        { title: "Production AI Assistant Rollout", detail: "Custom prompt templates, streaming responses, error retry strategies, and performance telemetry." }
      ]
    }
  };

  // Render Skeletons for Loading State
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse px-4 py-8">
        <div className="h-96 bg-gray-100 dark:bg-gray-900 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          <div className="h-44 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
          <div className="h-44 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] transition-colors duration-300">
      
      {/* ================= GUEST HOMEPAGE ================= */}
      {!auth.isAuthenticated && (
        <div className="relative overflow-hidden pt-8 pb-16">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]" />
          
          {/* Neon blur gradients background */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-3xl pointer-events-none" />
          <div className="absolute top-40 right-10 w-[300px] h-[300px] rounded-full bg-violet-500/10 dark:bg-violet-600/5 blur-3xl pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 relative z-10 space-y-16">
            
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Copywriting Left */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/30">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  Premium Interactive Learning
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                  The Complete <br/>
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500 bg-clip-text text-transparent">
                    Tech Sandbox
                  </span> <br/>
                  Academy.
                </h1>
                
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  EduMind is more than slides and videos. Write code in our integrated sandbox, consult our AI companion right next to the player, and verify tamper-proof credentials directly on the ledger.
                </p>

                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                  <Link to="/courses" className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    Explore Our Courses
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/register" className="px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl font-bold transition-all text-center">
                    Create Account Free
                  </Link>
                </div>

                {/* Micro Stats Row */}
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-left max-w-md mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12k+</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Active Students</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">98.6%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Success Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Verifiable Credentials</p>
                  </div>
                </div>
              </div>
              
              {/* INTERACTIVE PLAYGROUND CONSOLE - RIGHT */}
              <div className="lg:col-span-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl overflow-hidden backdrop-blur-md transition-all">
                  
                  {/* Console Header Tabs */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 px-4 pt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setConsoleTab("ai")}
                        className={`px-4 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 ${consoleTab === "ai" ? "bg-white dark:bg-[#0c0f17] border-slate-200/80 dark:border-slate-800/80 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"}`}
                      >
                        <Brain className="h-3.5 w-3.5" />
                        AI Companion
                      </button>
                      <button 
                        onClick={() => setConsoleTab("workspace")}
                        className={`px-4 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 ${consoleTab === "workspace" ? "bg-white dark:bg-[#0c0f17] border-slate-200/80 dark:border-slate-800/80 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"}`}
                      >
                        <Terminal className="h-3.5 w-3.5" />
                        Live Workspace
                      </button>
                      <button 
                        onClick={() => setConsoleTab("cert")}
                        className={`px-4 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 ${consoleTab === "cert" ? "bg-white dark:bg-[#0c0f17] border-slate-200/80 dark:border-slate-800/80 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"}`}
                      >
                        <Award className="h-3.5 w-3.5" />
                        Certificate Preview
                      </button>
                    </div>

                    {/* Window Controls */}
                    <div className="flex gap-1.5 pb-2.5">
                      <div className="h-3 w-3 rounded-full bg-rose-400/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                    </div>
                  </div>

                  {/* Tab Body Contents */}
                  <div className="p-5 bg-white dark:bg-[#0c0f17] h-[340px] overflow-y-auto">
                    
                    {/* TAB 1: AI STUDY COMPANION */}
                    {consoleTab === "ai" && (
                      <div className="flex flex-col h-full justify-between gap-3 text-left">
                        <div className="space-y-3 overflow-y-auto pr-1 text-xs">
                          {aiChat.map((chat, idx) => (
                            <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`p-3 rounded-2xl max-w-[85%] border leading-relaxed ${chat.sender === "user" ? "bg-indigo-600 border-indigo-700 text-white rounded-br-none" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-bl-none"}`}>
                                {chat.sender === "ai" ? (
                                  <div className="space-y-2">
                                    {/* Mini markdown parser for preview */}
                                    {chat.text.split("\n\n").map((para, pIdx) => {
                                      if (para.startsWith("###")) {
                                        return <h4 key={pIdx} className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{para.replace("###", "")}</h4>;
                                      }
                                      if (para.startsWith("* ")) {
                                        return (
                                          <ul key={pIdx} className="list-disc pl-4 space-y-1">
                                            {para.split("\n").map((li, lIdx) => (
                                              <li key={lIdx}>{li.replace("* ", "")}</li>
                                            ))}
                                          </ul>
                                        );
                                      }
                                      if (para.startsWith("```")) {
                                        return (
                                          <pre key={pIdx} className="bg-[#07090e] text-indigo-300 p-2 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-800">
                                            {para.replace(/```javascript|```/g, "").trim()}
                                          </pre>
                                        );
                                      }
                                      return <p key={pIdx}>{para}</p>;
                                    })}
                                  </div>
                                ) : (
                                  chat.text
                                )}
                              </div>
                            </div>
                          ))}
                          {isAiTyping && (
                            <div className="flex justify-start">
                              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" />
                                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Presets and Input */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <button onClick={() => handleAskAiMock("Explain JS closure")} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-semibold border border-slate-200 dark:border-slate-700 transition">
                              JS Closures?
                            </button>
                            <button onClick={() => handleAskAiMock("What is a REST API?")} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-semibold border border-slate-200 dark:border-slate-700 transition">
                              REST APIs?
                            </button>
                            <button onClick={() => handleAskAiMock("Explain cryptographic certificates")} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-semibold border border-slate-200 dark:border-slate-700 transition">
                              Block Certs?
                            </button>
                          </div>
                          
                          <form onSubmit={(e) => { e.preventDefault(); handleAskAiMock(aiInput); }} className="relative flex items-center">
                            <input 
                              type="text" 
                              value={aiInput}
                              onChange={(e) => setAiInput(e.target.value)}
                              placeholder="Ask the study buddy..." 
                              className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white"
                            />
                            <button type="submit" className="absolute right-2 text-indigo-500 hover:text-indigo-600">
                              <Send className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: LIVE WORKSPACE SANDBOX */}
                    {consoleTab === "workspace" && (
                      <div className="flex flex-col h-full justify-between gap-3 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full overflow-hidden">
                          {/* Code Editor Mock */}
                          <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-[#07090e]">
                            <div className="bg-[#0b0f19] px-3 py-1.5 border-b border-slate-800 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-slate-500">main.js</span>
                              <button 
                                onClick={handleRunCodeMock}
                                disabled={isCodeRunning}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                              >
                                <Play className="h-2.5 w-2.5 fill-white" />
                                Run Code
                              </button>
                            </div>
                            <textarea 
                              value={workspaceCode}
                              onChange={(e) => setWorkspaceCode(e.target.value)}
                              className="w-full flex-grow p-3 bg-transparent text-indigo-300 font-mono text-[10px] leading-relaxed resize-none focus:outline-none h-[180px]"
                            />
                          </div>

                          {/* Console Output Mock */}
                          <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-[#07090e]">
                            <div className="bg-[#0b0f19] px-3 py-1.5 border-b border-slate-800 flex items-center gap-1">
                              <Terminal className="h-3 w-3 text-slate-400" />
                              <span className="text-[10px] font-mono text-slate-500">Output Console</span>
                            </div>
                            <pre className="p-3 font-mono text-[10px] leading-relaxed text-slate-300 overflow-y-auto whitespace-pre-wrap flex-grow h-[180px]">
                              {workspaceOutput}
                            </pre>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-indigo-500" />
                          Try typing your own console.log scripts in the code sandbox and execute!
                        </div>
                      </div>
                    )}

                    {/* TAB 3: CERTIFICATE PREVIEW */}
                    {consoleTab === "cert" && (
                      <div className="flex flex-col h-full justify-between gap-3 text-left">
                        
                        {/* Certificate Interactive Form */}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Student Name</label>
                            <input 
                              type="text" 
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Select Syllabus Track</label>
                            <select 
                              value={selectedCourseTitle}
                              onChange={(e) => setSelectedCourseTitle(e.target.value)}
                              className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white"
                            >
                              <option value="Fullstack Web Architecture">Fullstack Web Architecture</option>
                              <option value="AI Integration & LLM APIs">AI Integration & LLM APIs</option>
                              <option value="System Security & Cryptography">System Security & Cryptography</option>
                            </select>
                          </div>
                        </div>

                        {/* Certificate Sandbox Display */}
                        <div className="relative bg-amber-50/20 dark:bg-[#181510]/30 border border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-inner h-[210px] overflow-hidden">
                          
                          {/* Fancy border overlays */}
                          <div className="absolute inset-2 border border-dashed border-amber-500/20 dark:border-amber-500/10 pointer-events-none" />

                          <div className="space-y-1">
                            <span className="text-[7px] uppercase font-black tracking-widest text-amber-600 dark:text-amber-500">Certificate of Completion</span>
                            <h4 className="text-[13px] font-serif font-bold text-slate-900 dark:text-amber-100 leading-tight">{studentName}</h4>
                            <p className="text-[7px] max-w-[280px] text-slate-600 dark:text-slate-400 leading-normal">
                              has successfully finished all academic modules, verified code labs, and examinations required to graduate from
                            </p>
                            <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 font-serif italic">{selectedCourseTitle}</p>
                          </div>

                          <div className="w-full flex justify-between items-end text-left pt-2 border-t border-slate-200/50 dark:border-slate-800/30">
                            <div>
                              <p className="text-[6px] font-bold uppercase text-slate-400">Ledger Verification Hash</p>
                              <span className="font-mono text-[5px] text-slate-500 break-all select-all block max-w-[160px]">
                                sha256-8c4b92cf0e3d2a01d67a78e12b7f8e...
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-white text-[5px] font-bold shadow-md">
                                Seal
                              </div>
                              <span className="text-[5px] font-bold uppercase text-amber-600 mt-0.5">Verified</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>

            </div>

            {/* WHY EDUMIND PALLAR SECTION */}
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Learning Architecture of Tomorrow
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We engineered our course interface specifically to tackle the common pitfalls of online self-study.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Expert-Led Modules</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Syllabuses developed directly with industry directors. Skip outdated theory and write production code from lesson one.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="h-12 w-12 bg-amber-50 dark:bg-amber-950/40 rounded-2xl text-amber-600 dark:text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">HMAC Credentials</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Automated certificate minting verified via cryptographic SHA-256 signatures, allowing employers to validate your completion.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="h-12 w-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Study Companion</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    An embedded generative AI assistant loaded next to video lessons, providing context-aware debugging tips and conceptual summaries.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Lifetime Access</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Secure one-time payments (via Stripe or sandbox test mode) guarantee unlimited, perpetual access to lesson materials and future updates.
                  </p>
                </div>

              </div>
            </div>

            {/* CAREER PATHWAYS TIMELINE SELECTOR */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-3xl space-y-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 text-left">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Choose Your Specialization Roadmap</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Structured paths designed to take you from hello-world to certified architect.</p>
                </div>

                {/* Path Buttons */}
                <div className="flex flex-wrap gap-2 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                  <button 
                    onClick={() => setSelectedPath("frontend")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition ${selectedPath === "frontend" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    Frontend Systems
                  </button>
                  <button 
                    onClick={() => setSelectedPath("fullstack")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition ${selectedPath === "fullstack" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    Fullstack
                  </button>
                  <button 
                    onClick={() => setSelectedPath("ai")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition ${selectedPath === "ai" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    AI Integrations
                  </button>
                </div>
              </div>

              {/* Pathway Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                <div className="lg:col-span-4 space-y-4">
                  <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider">Career Track Profile</span>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{pathways[selectedPath].title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{pathways[selectedPath].desc}</p>
                  <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View matching modules
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Timeline Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pathways[selectedPath].steps.map((step, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/40 p-4 rounded-xl relative space-y-2 group hover:border-indigo-500/40 transition">
                      <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
                        0{idx + 1}
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-slate-200">{step.title}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* WORKSHOPS / LIVE LEARNING LABS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              <div className="lg:col-span-1 space-y-3.5 mt-4">
                <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider">Active Platform Live Feed</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Live Workshops & Labs</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Join our interactive livestream events. Code alongside class instructors in real time, review homework assignments, and complete team sprints.
                </p>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-white dark:bg-[#0c0f17] rounded-xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">Weekly Office Hours</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      Every Friday at 4:00 PM: Instructors log on to review submitted projects, provide critiques, and answer coding blockages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Workshops Cards list */}
              <div className="lg:col-span-2 space-y-4">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition">
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded text-[9px] font-bold uppercase tracking-wider">Live Sprints</span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">June 12, 10:00 AM IST</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">TypeScript Aggregation and Type Guarding</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Master type constraints, union narrowing, and custom assertions.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700/60 transition flex-shrink-0 flex items-center gap-1">
                    <Play className="h-3 w-3 fill-current" />
                    Reserve Seat
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition">
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded text-[9px] font-bold uppercase tracking-wider">Career Prep</span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">June 15, 6:00 PM IST</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Recruiter Portfolio Audit & Optimization</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">How to configure your GitHub repos and resume certificates to pass candidate screenings.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700/60 transition flex-shrink-0 flex items-center gap-1">
                    <Play className="h-3 w-3 fill-current" />
                    Reserve Seat
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition">
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-bold uppercase tracking-wider">System Design</span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">June 18, 11:00 AM IST</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Scaling Websockets to 100k Connections</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Architect cluster gateways, redis adapter brokers, and heartbeats.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700/60 transition flex-shrink-0 flex items-center gap-1">
                    <Play className="h-3 w-3 fill-current" />
                    Reserve Seat
                  </button>
                </div>

              </div>
            </div>

            {/* ================= GUEST HOMEPAGE CATALOG WITH SEARCH/FILTERS ================= */}
            <div className="space-y-8 pt-8">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider">Course Database</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore Learning Catalog</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Search and filter active modules. Enroll, write scripts, and earn signatures.</p>
                </div>
                
                {/* Search and Filters Trigger */}
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-grow md:flex-grow-0">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courses..." 
                      className="w-full md:w-60 pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-3 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${showFilters ? "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-850" : "bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300"}`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Advanced Filter Panel */}
              {showFilters && (
                <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-slide-up-subtle">
                  
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      {getCategoriesList().map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 text-[11px] rounded-lg border font-semibold transition ${selectedCategory === cat ? "bg-indigo-600 border-indigo-700 text-white" : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-100"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Level Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Difficulty Level</label>
                    <div className="flex gap-1.5">
                      {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSelectedLevel(lvl)}
                          className={`flex-grow px-2.5 py-1.5 text-[11px] rounded-lg border font-semibold transition ${selectedLevel === lvl ? "bg-indigo-600 border-indigo-700 text-white" : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-100"}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sorting Filter */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white"
                    >
                      <option value="popular">Popularity (Enrolled count)</option>
                      <option value="rating">Student Rating</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                </div>
              )}

              {/* Course Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getFilteredCourses().slice(0, 6).map((course) => {
                  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
                  return (
                    <Link 
                      to={`/course/${course._id}`} 
                      key={course._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all h-full group text-left relative overflow-hidden"
                    >
                      {/* Course Card Glow Overlay */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition" />

                      <div className="space-y-3.5 relative z-10">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-950">
                            {course.category || "General"}
                          </span>
                          
                          {/* Level badge */}
                          <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-md ${
                            course.level === "Advanced" ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400" :
                            course.level === "Intermediate" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" :
                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          }`}>
                            {course.level || "Beginner"}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                        
                        <div className="pt-1 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/40 pb-3">
                          <StarRating rating={course.rating} />
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Instructor: {course.instructor?.name || "Professor"}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-1 flex items-center justify-between relative z-10">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {course.price === 0 ? "Free" : `₹${course.price}`}
                        </span>

                        <div className="flex flex-col items-end gap-0.5 text-[10px] text-slate-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            {course.studentsCount || 0} students
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                            {lessons.length} modules
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {getFilteredCourses().length === 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-2xl text-center space-y-2">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">No courses matching your search constraints were found.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedLevel("All"); }}
                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold"
                  >
                    Clear Filter Search
                  </button>
                </div>
              )}

              {getFilteredCourses().length > 0 && (
                <div className="text-center pt-4">
                  <Link 
                    to="/courses"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-xs border border-slate-200 dark:border-slate-850 shadow-sm transition-all"
                  >
                    Explore Complete Catalog
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

            </div>

            {/* TESTIMONIALS */}
            <div className="space-y-8 pt-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 tracking-wider">Success Records</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Success Stories</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">How builders and career transitions scaled using our sandboxed learning environment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "The live sandbox was a game changer. I could execute Node scripts directly on-screen while watching the database lessons. The cryptographic credential verified on my LinkedIn landing page helped secure two interview callbacks."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200 font-bold flex items-center justify-center text-xs dark:bg-slate-800 dark:text-slate-200">
                      MK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">Manoj Kumar</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Systems Developer, Bangalore</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "I was skeptical about AI companion sidebars, but EduMind's tutor is actually context-aware. When my test scripts crashed on the Stripe integration lesson, I pasted my error. The tutor pinpointed my routing issue in 10 seconds."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200 font-bold flex items-center justify-center text-xs dark:bg-slate-800 dark:text-slate-200">
                      AS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">Ananya Sharma</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Frontend Engineer, Pune</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "The syllabus timelines are exceptionally structured. The instructor center and public course player flows are so seamless that I can study during my commute. The mock sandbox checking was incredibly helpful."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200 font-bold flex items-center justify-center text-xs dark:bg-slate-800 dark:text-slate-200">
                      RP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">Rahul Patel</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Graduate Student, Ahmedabad</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <div className="max-w-3xl mx-auto space-y-6 text-left pt-8">
              <div className="text-center space-y-1.5">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Questions & Answers</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Everything you need to know about the platform mechanics.</p>
              </div>

              <div className="space-y-3">
                {[
                  { q: "How do cryptographic certificates work?", a: "Every certificate issued on EduMind is cryptographically signed using a unique SHA-256 HMAC generated from your User ID and Course Completion ID, combined with a secure server salt. You can share your certificate ID or signature on your resume for immediate validation." },
                  { q: "How do I make payments on the platform?", a: "We support both real payments via Stripe, and a full sandbox Demo Checkout Simulator. If the instructor has not configured their Stripe Keys, you can select the 'Demo Checkout' simulator to preview the checkout process and order confirmation flows safely." },
                  { q: "Is the AI Tutor available for all courses?", a: "Yes, the AI Tutor is integrated directly into the course player sidebar. It uses structural contextual prompt models to read the active lesson subtitles and instructor content in order to help explain syntax or answer conceptual queries." },
                  { q: "Can I publish my own courses?", a: "Yes! During account registration, choose the 'Instructor' role. This will unlock the Instructor Center Dashboard where you can publish new syllabus outlines, upload lectures, and manage student enrollment statistics." }
                ].map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/85 rounded-2xl overflow-hidden transition"
                  >
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-5 py-4 flex justify-between items-center font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <ChevronUp className="h-4 w-4 text-indigo-500" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-4 pt-1 border-t border-slate-50 dark:border-slate-800/40 text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CALL TO ACTION ACCENT BANNER */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg shadow-indigo-950/20">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
              
              <div className="max-w-2xl mx-auto space-y-6 text-center relative z-10">
                <h3 className="text-3xl font-black tracking-tight leading-tight">Ready to Master Practical Tech Skills?</h3>
                <p className="text-indigo-200/70 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
                  Create a student account today. Try out the sandbox workspace, consult our AI assistant, and gain verifiable completion credentials.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link to="/register" className="px-6 py-3 bg-white hover:bg-slate-50 text-indigo-900 rounded-xl font-bold text-xs transition shadow-md">
                    Get Started Free
                  </Link>
                  <Link to="/courses" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl font-bold text-xs transition">
                    Explore Catalog
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= DATA CATALOG FOR LOGGED IN USERS ================= */}
      {auth.isAuthenticated && (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          
          {/* ================= INSTRUCTOR HOMEPAGE PANEL ================= */}
          {auth.user?.role === "Instructor" && (
            <div className="space-y-6 text-left">
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded-full">
                    Instructor Center
                  </span>
                  <h1 className="text-2xl font-bold">Welcome back, Professor {auth.user?.name}</h1>
                  <p className="text-xs text-indigo-200">Inspect course performances, manage lesson syllabuses, and publish content.</p>
                </div>

                <Link to="/create-course" className="px-5 py-2.5 bg-white hover:bg-gray-50 text-indigo-600 font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1.5 flex-shrink-0">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Publish New Course
                </Link>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Instructed Courses ({myCourses.length})</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded">
                        {course.level || "Beginner"}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="flex gap-2 mt-6 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                      <Link to={`/edit-course/${course._id}`} className="flex-grow">
                        <button className="w-full bg-amber-55 hover:bg-amber-100 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 font-bold py-2 rounded-xl text-xs transition border border-amber-250 dark:border-amber-900">
                          Edit Syllabus
                        </button>
                      </Link>

                      <Link to={`/course/${course._id}`} className="flex-grow">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs transition">
                          View Public
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STUDENT HOMEPAGE PANEL ================= */}
          {auth.user?.role === "Student" && (
            <div className="space-y-6 text-left">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded-full">
                    Student Portal
                  </span>
                  <h1 className="text-2xl font-bold">Welcome back, {auth.user?.name}</h1>
                  <p className="text-xs text-indigo-200">Resume your lectures, complete syllabus tasks, and copy digital certificate signatures.</p>
                </div>

                <Link to="/courses" className="px-5 py-2.5 bg-white hover:bg-gray-50 text-indigo-600 font-bold rounded-xl text-xs shadow transition-all flex-shrink-0">
                  Explore Course Catalog
                </Link>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular Learning Tracks</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.slice(0, 6).map((course) => {
                  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
                  return (
                    <div
                      key={course._id}
                      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded">
                          {course.category || "General"}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>
                      </div>

                      <div className="mt-6 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-bold">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {course.duration}
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400">
                            {course.price === 0 ? "Free" : `₹${course.price}`}
                          </span>
                        </div>

                        <Link to={`/course/${course._id}`}>
                          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Embedded CSS slide up animation */}
      <style>{`
        @keyframes slideUpSubtle {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up-subtle {
          animation: slideUpSubtle 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
};

export default HomePage;