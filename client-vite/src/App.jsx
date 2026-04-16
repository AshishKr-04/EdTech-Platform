import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CoursePreviewPage from './pages/CoursePreviewPage';   // ✅ NEW
import CoursePlayerPage from './pages/CoursePlayerPage';     // ✅ NEW
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CreateCoursePage from './pages/CreateCoursePage';
import EditCoursePage from './pages/EditCoursePage';
import MyCoursesPage from './pages/MyCoursesPage';           // ✅ MAIN PAGE
import InstructorDashboard from "./pages/InstructorDashboard";

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CoursePreviewPage />} /> {/* ✅ PREVIEW */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* ================= MAIN PAGE ================= */}
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />

            {/* ================= COURSE PLAYER ================= */}
            <Route
              path="/learn/:id"
              element={
                <ProtectedRoute>
                  <CoursePlayerPage />
                </ProtectedRoute>
              }
            />

            {/* ================= INSTRUCTOR ================= */}
            <Route
              path="/instructor-dashboard"
              element={
                <ProtectedRoute>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-course"
              element={
                <ProtectedRoute>
                  <CreateCoursePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-course/:id"
              element={
                <ProtectedRoute>
                  <EditCoursePage />
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;