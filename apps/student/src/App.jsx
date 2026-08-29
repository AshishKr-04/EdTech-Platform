import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CoursePreviewPage from './pages/CoursePreviewPage';   
import CoursePlayerPage from './pages/CoursePlayerPage';     
import DemoCheckoutPage from './pages/DemoCheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MyCoursesPage from './pages/MyCoursesPage';           
import ProfilePage from './pages/ProfilePage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Reset scroll position on page/route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <Navbar />

        <main className="flex-grow min-w-0">
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CoursePreviewPage />} /> 
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/verify-certificate/:certId" element={<VerifyCertificatePage />} />

            {/* ================= USER PROFILE ================= */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* ================= MAIN PAGE ================= */}
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />

            {/* ================= MOCK STRIPE CHECKOUT ================= */}
            <Route
              path="/demo-checkout/:orderId"
              element={
                <ProtectedRoute>
                  <DemoCheckoutPage />
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

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
