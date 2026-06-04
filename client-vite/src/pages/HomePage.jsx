import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
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

const StarRating = ({ rating = 0 }) => {
  const safeRating = Number(rating) || 0;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`text-sm ${i <= safeRating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}>
        ★
      </span>
    );
  }
  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="ml-1.5 text-xs font-bold text-slate-500">{safeRating.toFixed(1)}</span>
    </div>
  );
};

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Catalog Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Console Sandbox States
  const [consoleTab, setConsoleTab] = useState("workspace"); // 'ai', 'cert', 'workspace'
  const [workspaceLanguage, setWorkspaceLanguage] = useState("javascript"); // 'javascript', 'python', 'sql', 'cpp', 'java'

  // AI Study Companion Mock
  const [aiChat, setAiChat] = useState([
    { sender: "ai", text: "### Welcome to **EduMind AI Study Partner**! 🤖\n\nI am your real-time study companion. You can ask me questions about any topic in your syllabus.\n\nSelect one of the sample prompts below, or type your own question!" }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Certificate Preview Sandbox
  const [studentName, setStudentName] = useState("ASHISH KUMAR");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("Fullstack Web Architecture");

  // Multi-language sandbox code templates
  const codeTemplates = {
    javascript: `// Click 'Run Code' to execute this script in our sandbox console
const courseName = "EduMind Masterclass";
console.log("Welcome to " + courseName + "!");

const calculateSyllabusProgress = (completed, total) => {
  return Math.round((completed / total) * 100);
};

console.log("Your learning progress is: " + calculateSyllabusProgress(8, 10) + "%");
`,
    python: `# Write Python code in our virtual executor sandbox
course_name = "EduMind Masterclass"
print(f"Welcome to {course_name}!")

def calculate_syllabus_progress(completed, total):
    return int((completed / total) * 100)

print(f"Your learning progress is: {calculate_syllabus_progress(8, 10)}%")
`,
    sql: `-- Query enrolled student progress records in SQLite
SELECT users.id, users.name, courses.title, progress.lessonIndex
FROM users
JOIN progress ON users.id = progress.userId
JOIN courses ON progress.courseId = courses.id
WHERE users.role = 'Student' AND progress.completed = true;
`,
    cpp: `// Compile and run C++ console application sandbox
#include <iostream>
#include <string>

int main() {
    std::string course_name = "EduMind Masterclass";
    std::cout << "Welcome to " << course_name << "!" << std::endl;
    
    int completed = 8;
    int total = 10;
    std::cout << "Your learning progress is: " << (completed * 100 / total) << "%" << std::endl;
    return 0;
}
`,
    java: `// Compile and run Java application class sandbox
public class Main {
    public static void main(String[] args) {
        String courseName = "EduMind Masterclass";
        System.out.println("Welcome to " + courseName + "!");
        
        int completed = 8;
        int total = 10;
        System.out.println("Your learning progress is: " + (completed * 100 / total) + "%");
    }
}
`
  };

  const [workspaceCode, setWorkspaceCode] = useState(codeTemplates.javascript);
  const [workspaceOutput, setWorkspaceOutput] = useState("Click 'Run Code' to see console log output...");
  const [isCodeRunning, setIsCodeRunning] = useState(false);

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
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) fetchData();
  }, [auth]);

  // Handle Code Executor Language Switch
  const handleLanguageChange = (lang) => {
    setWorkspaceLanguage(lang);
    setWorkspaceCode(codeTemplates[lang]);
    setWorkspaceOutput(
      lang === "sql" 
        ? "Click 'Run Query' to execute SQL query..." 
        : `Click 'Run Code' to see simulated ${lang === "python" ? "Python" : lang.toUpperCase()} output...`
    );
  };

  // Mock AI Study Buddy chatbot
  const handleAskAiMock = (messageText) => {
    if (!messageText || messageText.trim() === "" || isAiTyping) return;
    
    const updatedChat = [...aiChat, { sender: "user", text: messageText }];
    setAiChat(updatedChat);
    setAiInput("");
    setIsAiTyping(true);

    const question = messageText.toLowerCase();
    let responseText = "";

    if (question.includes("closure") || question.includes("lexical")) {
      responseText = `### Javascript Closures 💡

A **closure** is created when an inner function retains access to variables in its outer lexical scope, even after the outer function has finished executing.

\`\`\`javascript
function createGreeter(greeting) {
  return function(name) {
    console.log(greeting + ", " + name);
  };
}
const sayHello = createGreeter("Welcome");
sayHello("Sarah"); // Output: "Welcome, Sarah"
\`\`\``;
    } else if (question.includes("api") || question.includes("rest")) {
      responseText = `### REST APIs 🌐

An **API** (Application Programming Interface) allows two software modules to exchange data. A **REST API** uses standard HTTP methods:
*   \`GET\`: Retrieve database records.
*   \`POST\`: Create a new record (e.g. purchasing a course).
*   \`PUT\` / \`PATCH\`: Modify existing records.
*   \`DELETE\`: Remove a resource.`;
    } else if (question.includes("hash") || question.includes("cryptographic") || question.includes("certificate")) {
      responseText = `### Cryptographic Credentials & Verification 🔒

When completing a course, the server generates a tamper-proof SHA-256 HMAC digital validation hash.

1.  **Input Key**: Student ID + Course ID + UUID
2.  **Hashing Function**: HMAC SHA-256 using a secure backend salt.
3.  **Verification**: Employers can verify this signature against our ledger database to prove credentials immediately.`;
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

  // Run mock code console compiler
  const handleRunCodeMock = () => {
    if (isCodeRunning) return;
    setIsCodeRunning(true);

    if (workspaceLanguage === "javascript") {
      setWorkspaceOutput("> Compiling script...\n> Spawning local isolation node sandbox...\n> Running main.js...");
      setTimeout(() => {
        let logs = [];
        const codeLines = workspaceCode.split("\n");
        if (workspaceCode.includes("courseName") && workspaceCode.includes("calculateSyllabusProgress")) {
          logs.push("Welcome to EduMind Masterclass!");
          logs.push("Your learning progress is: 80%");
        } else if (workspaceCode.includes("console.log")) {
          codeLines.forEach(line => {
            if (line.includes("console.log")) {
              const match = line.match(/console\.log\((['"`]?)(.*?)\1\)/);
              if (match && match[2]) logs.push(match[2]);
            }
          });
          if (logs.length === 0) logs.push("Script executed with exit code 0.");
        } else {
          logs.push("Script executed with exit code 0. (No stdout logged)");
        }
        setWorkspaceOutput(`> node main.js\n${logs.map(l => `[LOG]: ${l}`).join("\n")}\n\nExecution finished successfully (0.02s)`);
        setIsCodeRunning(false);
      }, 1200);
    } else if (workspaceLanguage === "python") {
      setWorkspaceOutput("> Validating syntax...\n> Allocating virtual environment...\n> Running main.py...");
      setTimeout(() => {
        let logs = [];
        const codeLines = workspaceCode.split("\n");
        if (workspaceCode.includes("course_name") && workspaceCode.includes("calculate_syllabus_progress")) {
          logs.push("Welcome to EduMind Masterclass!");
          logs.push("Your learning progress is: 80%");
        } else if (workspaceCode.includes("print")) {
          codeLines.forEach(line => {
            if (line.includes("print")) {
              const match = line.match(/print\((['"`]?f?)(.*?)\1\)/) || line.match(/print\((.*?)\)/);
              if (match && match[2]) logs.push(match[2].replace(/\{.*?\}/g, "80%"));
            }
          });
          if (logs.length === 0) logs.push("Process finished with exit code 0");
        } else {
          logs.push("Process finished with exit code 0 (No STDOUT stream)");
        }
        setWorkspaceOutput(`> python main.py\n${logs.map(l => `[STDOUT]: ${l}`).join("\n")}\n\nProcess finished with exit code 0 (0.03s)`);
        setIsCodeRunning(false);
      }, 1200);
    } else if (workspaceLanguage === "cpp") {
      setWorkspaceOutput("> Compiling C++ compiler template...\n> Linking object modules...\n> Running main.exe...");
      setTimeout(() => {
        let logs = [];
        if (workspaceCode.includes("course_name") && workspaceCode.includes("std::cout")) {
          logs.push("Welcome to EduMind Masterclass!");
          logs.push("Your learning progress is: 80%");
        } else {
          logs.push("Compilation successful. Process returned 0.");
        }
        setWorkspaceOutput(`> g++ main.cpp -o main && ./main\n${logs.map(l => `[STDOUT]: ${l}`).join("\n")}\n\nProcess finished with exit code 0 (0.04s)`);
        setIsCodeRunning(false);
      }, 1200);
    } else if (workspaceLanguage === "java") {
      setWorkspaceOutput("> Locating class Main...\n> Compiling bytecodes with javac...\n> Booting JVM runtime...");
      setTimeout(() => {
        let logs = [];
        if (workspaceCode.includes("courseName") && workspaceCode.includes("System.out.println")) {
          logs.push("Welcome to EduMind Masterclass!");
          logs.push("Your learning progress is: 80%");
        } else {
          logs.push("Java execution finished successfully.");
        }
        setWorkspaceOutput(`> javac Main.java && java Main\n${logs.map(l => `[JVM]: ${l}`).join("\n")}\n\nClass execution complete (0.05s)`);
        setIsCodeRunning(false);
      }, 1200);
    } else if (workspaceLanguage === "sql") {
      setWorkspaceOutput("> Parsing SQL transaction query...\n> Inspecting local database tables...\n> Running query.sql...");
      setTimeout(() => {
        let output = "";
        if (workspaceCode.includes("FROM users") && workspaceCode.includes("progress")) {
          output = `Query compiled successfully.
Returned 3 records:

| id | name         | title                    | lessonIndex |
|----+--------------+--------------------------+-------------|
| 1  | Alex Mercer  | Fullstack Architecture   | 4           |
| 2  | Sarah Connor | AI Integration & LLMs    | 9           |
| 3  | Manoj Kumar  | System Cryptography      | 2           |`;
        } else {
          output = `Query compiled successfully.
Returned 0 records (No matching criteria or tables specified).`;
        }
        setWorkspaceOutput(`> sqlite3 database.db\n${output}\n\nQuery execution completed successfully (0.01s)`);
        setIsCodeRunning(false);
      }, 1200);
    }
  };

  // Client-side catalog filters
  const getFilteredCourses = () => {
    let list = [...courses];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) || 
        (c.category && c.category.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      list = list.filter(c => {
        const cat = c.category ? c.category.toLowerCase() : "";
        const target = selectedCategory.toLowerCase();
        
        if (target === "development") {
          return cat.includes("dev") || cat.includes("tech") || cat.includes("code") || cat.includes("software");
        }
        if (target === "business") {
          return cat.includes("bus") || cat.includes("market") || cat.includes("fin") || cat.includes("manage");
        }
        if (target === "design") {
          return cat.includes("design") || cat.includes("art") || cat.includes("creative") || cat.includes("ui");
        }
        if (target === "academics") {
          return cat.includes("acad") || cat.includes("sci") || cat.includes("lang") || cat.includes("write");
        }
        
        return cat.includes(target);
      });
    }

    if (selectedLevel !== "All") {
      list = list.filter(c => c.level === selectedLevel);
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      list.sort((a, b) => (b.studentsCount || 0) - (a.studentsCount || 0));
    }

    return list;
  };

  const getCategoriesList = () => {
    const list = new Set(courses.map(c => c.category).filter(Boolean));
    return ["All", ...Array.from(list)];
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 transition-colors duration-300">
      
      {/* ================= GUEST LANDING PAGE (SIMPLE & PROFESSIONAL) ================= */}
      {!auth.isAuthenticated && (
        <div className="space-y-20 pb-20">
          
          {/* 1. MINIMALIST HERO SECTION */}
          <section className="bg-slate-50 border-b border-slate-200 py-16 px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Build Skills. Run Code. Earn Certificates.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                An interactive e-learning platform featuring live code execution sandboxes, context-aware AI study companions, and cryptographically verified graduation credentials.
              </p>

              {/* Minimal Search Bar */}
              <div className="max-w-md mx-auto pt-2">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for courses (e.g. JavaScript, AI, Systems)..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 shadow-sm"
                  />
                  <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </section>

          {/* 2. INTERACTIVE PRACTICE LABS (WORKSPACE SANDBOX) */}
          <section className="max-w-6xl mx-auto px-6 text-left space-y-6">
            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Interactive Practice Labs
              </h2>
              <p className="text-xs text-slate-500">
                Try out our virtual compiler workspace and verification tools directly from your browser.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              
              {/* Tab Selector Headers */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 pt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex overflow-x-auto gap-1">
                  <button 
                    onClick={() => setConsoleTab("workspace")}
                    className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-all flex items-center gap-1.5 ${consoleTab === "workspace" ? "bg-white border-slate-200 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    Live Editor Workspace
                  </button>
                  <button 
                    onClick={() => setConsoleTab("ai")}
                    className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-all flex items-center gap-1.5 ${consoleTab === "ai" ? "bg-white border-slate-200 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                  >
                    <Brain className="h-3.5 w-3.5" />
                    AI Study Companion
                  </button>
                  <button 
                    onClick={() => setConsoleTab("cert")}
                    className={`px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-all flex items-center gap-1.5 ${consoleTab === "cert" ? "bg-white border-slate-200 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                  >
                    <Award className="h-3.5 w-3.5" />
                    Certificate Validator
                  </button>
                </div>

                <div className="flex gap-1.5 pb-2 ml-auto hidden sm:flex">
                  <div className="h-3 w-3 rounded-full bg-slate-200" />
                  <div className="h-3 w-3 rounded-full bg-slate-200" />
                  <div className="h-3 w-3 rounded-full bg-slate-200" />
                </div>
              </div>

              {/* Tab Panel Body */}
              <div className="p-5 sm:p-6 min-h-[380px] flex flex-col justify-between">
                
                {/* LIVE WORKSPACE TAB */}
                {consoleTab === "workspace" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      
                      {/* Editor Section */}
                      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-[#0c0f18]">
                        <div className="bg-[#121826] px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex gap-1 flex-wrap">
                            {["javascript", "python", "sql", "cpp", "java"].map((lang) => {
                              const labelMap = { javascript: "main.js", python: "main.py", sql: "query.sql", cpp: "main.cpp", java: "Main.java" };
                              return (
                                <button
                                  key={lang}
                                  onClick={() => handleLanguageChange(lang)}
                                  className={`px-2 py-0.5 rounded font-mono text-[9.5px] transition ${workspaceLanguage === lang ? "bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30" : "text-slate-500 hover:text-slate-350"}`}
                                >
                                  {labelMap[lang]}
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={handleRunCodeMock}
                            disabled={isCodeRunning}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <Play className="h-3 w-3 fill-white" />
                            {workspaceLanguage === "sql" ? "Run Query" : "Run Code"}
                          </button>
                        </div>

                        <textarea
                          value={workspaceCode}
                          onChange={(e) => setWorkspaceCode(e.target.value)}
                          className="w-full p-4 bg-transparent text-indigo-200 font-mono text-xs leading-relaxed resize-none focus:outline-none h-[220px]"
                        />
                      </div>

                      {/* Output Terminal Section */}
                      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-[#0c0f18]">
                        <div className="bg-[#121826] px-4 py-2 border-b border-slate-800 flex items-center gap-1.5">
                          <Terminal className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-wider font-bold">Console Output</span>
                        </div>
                        <pre className="p-4 font-mono text-xs leading-relaxed text-slate-300 overflow-y-auto whitespace-pre-wrap flex-grow h-[220px] text-left">
                          {workspaceOutput}
                        </pre>
                      </div>

                    </div>

                    <div className="flex items-start gap-2 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                      <AlertCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-slate-650 leading-normal">
                        <strong>Virtual Compiler:</strong> Test standard scripts in JavaScript, Python, SQL, C++, or Java. Stacks vertically on mobile/tablet screens.
                      </p>
                    </div>
                  </div>
                )}

                {/* AI STUDY COMPANION TAB */}
                {consoleTab === "ai" && (
                  <div className="flex flex-col justify-between gap-4 h-full">
                    <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2 text-xs">
                      {aiChat.map((chat, idx) => (
                        <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`p-3 rounded-xl max-w-[85%] border leading-relaxed ${chat.sender === "user" ? "bg-indigo-600 border-indigo-700 text-white rounded-br-none" : "bg-slate-50 border-slate-200/80 text-slate-800 rounded-bl-none"}`}>
                            {chat.sender === "ai" ? (
                              <div className="space-y-2 text-left">
                                {chat.text.split("\n\n").map((para, pIdx) => {
                                  if (para.startsWith("###")) {
                                    return <h4 key={pIdx} className="font-bold text-xs text-indigo-600">{para.replace("###", "")}</h4>;
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
                                      <pre key={pIdx} className="bg-[#0c0f18] text-indigo-300 p-2 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-800">
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
                          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl rounded-bl-none flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" />
                            <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => handleAskAiMock("Explain closures")} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 rounded text-[10px] font-bold border border-slate-200 transition">
                          Closures?
                        </button>
                        <button onClick={() => handleAskAiMock("What is a REST API?")} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 rounded text-[10px] font-bold border border-slate-200 transition">
                          REST APIs?
                        </button>
                        <button onClick={() => handleAskAiMock("Explain cryptographic certificates")} className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 rounded text-[10px] font-bold border border-slate-200 transition">
                          Certificates?
                        </button>
                      </div>

                      <form onSubmit={(e) => { e.preventDefault(); handleAskAiMock(aiInput); }} className="relative flex items-center">
                        <input 
                          type="text" 
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder="Ask a question..." 
                          className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        />
                        <button type="submit" className="absolute right-3 text-indigo-600 hover:text-indigo-800">
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* CERTIFICATE PREVIEW TAB */}
                {consoleTab === "cert" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    
                    {/* Inputs */}
                    <div className="md:col-span-1 space-y-4 text-left">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Graduate Name</label>
                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Name</label>
                        <input 
                          type="text" 
                          value={selectedCourseTitle}
                          onChange={(e) => setSelectedCourseTitle(e.target.value)}
                          placeholder="Course Title"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Preview Seal Card */}
                    <div className="md:col-span-2 relative bg-[#fdfbf7] border border-amber-300/30 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-inner h-[240px] overflow-hidden">
                      <div className="absolute inset-2 border border-dashed border-amber-600/10 pointer-events-none" />

                      <div className="space-y-1.5">
                        <span className="text-[8px] uppercase font-black tracking-widest text-amber-700">Certificate of Completion</span>
                        <h4 className="text-lg font-serif font-bold text-slate-900 leading-tight">{studentName}</h4>
                        <p className="text-[8px] max-w-[340px] text-slate-550 leading-normal mx-auto">
                          has successfully finished all academic syllabus modules, verified hands-on labs, and final exams required to graduate from
                        </p>
                        <p className="text-xs font-bold text-indigo-700 font-serif italic leading-none">{selectedCourseTitle}</p>
                      </div>

                      <div className="w-full flex justify-between items-end text-left pt-3 border-t border-slate-200/50">
                        <div>
                          <p className="text-[6.5px] font-bold uppercase text-slate-400">Ledger Security Hash</p>
                          <span className="font-mono text-[6px] text-slate-500 break-all select-all block max-w-[280px]">
                            sha256-8c4b92cf0e3d2a01d67a78e12b7f8e3f94e1d6d8a39b23b1239c8fa32b0f4d
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-6 rounded-full bg-amber-600 flex items-center justify-center text-white text-[5px] font-bold shadow-sm">
                            Seal
                          </div>
                          <span className="text-[6px] font-bold uppercase text-amber-700 mt-1">Verified</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* 3. DYNAMIC COURSE CATALOG & CATEGORIES */}
          <section className="max-w-6xl mx-auto px-6 text-left space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Explore Learning Modules
                </h2>
                <p className="text-xs text-slate-500">
                  Select a category filter or search the catalog above to view active learning tracks.
                </p>
              </div>

              {/* Horizontal Category Selector */}
              <div className="flex border border-slate-200 p-1.5 rounded-xl bg-slate-50 overflow-x-auto w-full md:w-auto gap-1">
                {["All", "Development", "Business", "Design", "Academics"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${selectedCategory === cat ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getFilteredCourses().map((course) => {
                const lessons = Array.isArray(course.lessons) ? course.lessons : [];
                // Simulate reviews count using course student stats
                const reviewsCount = Math.floor(((course.studentsCount || 0) * 3.7) + 8);
                // Simulate original price (Udemy style discount)
                const originalPrice = course.price > 0 ? course.price * 5 : 0;
                // Check if it qualifies as a bestseller
                const isBestseller = course.rating >= 4.5 || (course.studentsCount && course.studentsCount > 5);

                return (
                  <Link 
                    to={`/course/${course._id}`} 
                    key={course._id}
                    className="group block bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl hover:z-10 hover:border-indigo-300 text-left flex flex-col h-full"
                  >
                    {/* Course Thumbnail */}
                    <div className="w-full h-36 bg-slate-100 relative overflow-hidden flex-shrink-0 border-b border-slate-100">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-200 text-slate-400 flex items-center justify-center">
                          <GraduationCap className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-3 flex-grow flex flex-col justify-between space-y-1">
                      <div className="space-y-1">
                        {/* Title */}
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-900 transition-colors">
                          {course.title}
                        </h3>
                        
                        {/* Instructor */}
                        <p className="text-[11px] text-slate-500 truncate">
                          {course.instructor?.name || "Professor"}
                        </p>

                        {/* Rating Row (Udemy Style) */}
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-extrabold text-amber-800">{course.rating?.toFixed(1) || "4.5"}</span>
                          <div className="flex text-amber-500">
                            {"★".repeat(Math.round(course.rating || 4.5))}
                            {"☆".repeat(5 - Math.round(course.rating || 4.5))}
                          </div>
                          <span className="text-[11px] text-slate-450">({reviewsCount})</span>
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

                      {/* Bestseller Badge */}
                      {isBestseller && (
                        <div className="pt-2">
                          <span className="bg-[#eceb98] text-[#3d3c0a] font-bold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            Bestseller
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {getFilteredCourses().length === 0 && (
              <div className="bg-slate-50 border border-slate-200/60 p-10 rounded-xl text-center space-y-2">
                <AlertCircle className="h-6 w-6 text-slate-400 mx-auto" />
                <p className="text-slate-650 font-bold text-xs">No courses matching selected category</p>
                <p className="text-slate-400 text-[10px]">Explore other filters or register as an instructor to publish courses in this track!</p>
              </div>
            )}
          </section>

        </div>
      )}

      {/* ================= DATA CATALOG FOR AUTHENTICATED USERS ================= */}
      {auth.isAuthenticated && (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          
          {/* ================= INSTRUCTOR PANEL ================= */}
          {auth.user?.role === "Instructor" && (
            <div className="space-y-6 text-left">
              <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-white/20 rounded">
                    Instructor Dashboard
                  </span>
                  <h1 className="text-2xl font-bold">Welcome, Professor {auth.user?.name}</h1>
                  <p className="text-xs text-slate-350">Inspect course performances, manage lesson syllabuses, and publish content.</p>
                </div>

                <Link to="/create-course" className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded text-xs shadow-sm transition flex items-center gap-1.5 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Publish New Course
                </Link>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">My Instructed Courses ({myCourses.length})</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myCourses.map((course) => {
                  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
                  const reviewsCount = Math.floor(((course.studentsCount || 0) * 3.7) + 8);
                  const originalPrice = course.price > 0 ? course.price * 5 : 0;
                  const isBestseller = course.rating >= 4.5 || (course.studentsCount && course.studentsCount > 5);

                  return (
                    <div
                      key={course._id}
                      className="group block bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl hover:z-10 hover:border-indigo-300 text-left flex flex-col h-full"
                    >
                      {/* Course Thumbnail */}
                      <div className="w-full h-36 bg-slate-100 relative overflow-hidden flex-shrink-0 border-b border-slate-100">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-200 text-slate-400 flex items-center justify-center">
                            <GraduationCap className="h-10 w-10" />
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-3 flex-grow flex flex-col justify-between space-y-1">
                        <div className="space-y-1">
                          {/* Title */}
                          <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-900 transition-colors">
                            {course.title}
                          </h3>
                          
                          {/* Instructor */}
                          <p className="text-[11px] text-slate-500 truncate">
                            Instructor: You
                          </p>

                          {/* Rating Row */}
                          <div className="flex items-center gap-1 text-xs">
                            <span className="font-extrabold text-amber-800">{course.rating?.toFixed(1) || "4.5"}</span>
                            <div className="flex text-amber-500">
                              {"★".repeat(Math.round(course.rating || 4.5))}
                              {"☆".repeat(5 - Math.round(course.rating || 4.5))}
                            </div>
                            <span className="text-[11px] text-slate-450">({reviewsCount})</span>
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

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 border-t border-slate-100 pt-3">
                          <Link to={`/edit-course/${course._id}`} className="flex-grow">
                            <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-1.5 rounded-sm text-xs transition border border-slate-200">
                              Edit Syllabus
                            </button>
                          </Link>

                          <Link to={`/course/${course._id}`} className="flex-grow">
                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 rounded-sm text-xs transition">
                              View Public
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STUDENT PANEL ================= */}
          {auth.user?.role === "Student" && (
            <div className="space-y-6 text-left">
              <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-white/20 rounded">
                    Student Portal
                  </span>
                  <h1 className="text-2xl font-bold">Welcome back, {auth.user?.name}</h1>
                  <p className="text-xs text-slate-350">Resume your lectures, complete syllabus tasks, and copy digital certificate signatures.</p>
                </div>

                <Link to="/courses" className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded text-xs shadow-sm transition flex-shrink-0">
                  Explore Catalog
                </Link>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Popular Learning Tracks</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.slice(0, 6).map((course) => {
                  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
                  const reviewsCount = Math.floor(((course.studentsCount || 0) * 3.7) + 8);
                  const originalPrice = course.price > 0 ? course.price * 5 : 0;
                  const isBestseller = course.rating >= 4.5 || (course.studentsCount && course.studentsCount > 5);

                  return (
                    <div
                      key={course._id}
                      className="group block bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl hover:z-10 hover:border-indigo-300 text-left flex flex-col h-full"
                    >
                      {/* Course Thumbnail */}
                      <div className="w-full h-36 bg-slate-105 relative overflow-hidden flex-shrink-0 border-b border-slate-100">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-200 text-slate-400 flex items-center justify-center">
                            <GraduationCap className="h-10 w-10" />
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-3 flex-grow flex flex-col justify-between space-y-1">
                        <div className="space-y-1">
                          {/* Title */}
                          <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-900 transition-colors">
                            {course.title}
                          </h3>
                          
                          {/* Instructor */}
                          <p className="text-[11px] text-slate-500 truncate">
                            {course.instructor?.name || "Professor"}
                          </p>

                          {/* Rating Row */}
                          <div className="flex items-center gap-1 text-xs">
                            <span className="font-extrabold text-amber-800">{course.rating?.toFixed(1) || "4.5"}</span>
                            <div className="flex text-amber-500">
                              {"★".repeat(Math.round(course.rating || 4.5))}
                              {"☆".repeat(5 - Math.round(course.rating || 4.5))}
                            </div>
                            <span className="text-[11px] text-slate-450">({reviewsCount})</span>
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

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <Link to={`/course/${course._id}`}>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-sm font-bold text-xs shadow-sm transition duration-150">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default HomePage;