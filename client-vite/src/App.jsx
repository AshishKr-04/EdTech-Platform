import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CreateCoursePage from './pages/CreateCoursePage';
import EditCoursePage from './pages/EditCoursePage';
import MyCoursesPage from './pages/MyCoursesPage';
import MyLearningPage from './pages/MyLearningPage'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // 👈 1. Import the Footer
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* 2. Added a flex container to keep footer at the bottom */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        {/* 3. Added flex-grow to main so it pushes the footer down */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/course/:id" element={<CourseDetailPage />} />
              <Route path="/create-course" element={<CreateCoursePage />} />
              <Route path="/edit-course/:id" element={<EditCoursePage />} />
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/my-learning" element={<MyLearningPage />} />
            </Route>
          </Routes>
        </main>

        <Footer /> {/* 4. Render Footer at the very bottom */}
      </div>
    </Router>
  );
}

export default App;