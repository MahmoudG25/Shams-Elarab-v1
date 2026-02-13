import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Home from '../pages/Home';
import PathsPage from '../pages/PathsPage';
import RoadmapDetails from '../pages/RoadmapDetails';
import CourseDetails from '../pages/CourseDetails';
import PaymentSubmission from '../pages/Checkout/PaymentSubmission';
import OrderUnderReview from '../pages/Checkout/OrderUnderReview';
import OrderSuccess from '../pages/Checkout/OrderSuccess';
import data from '../data/homepage.json';

const PublicRoutes = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div dir="rtl" className="bg-surface-white dark:bg-background-dark font-display text-body-text dark:text-gray-100 antialiased selection:bg-primary/30 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar
        data={data.navbar}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning-paths" element={<PathsPage />} />
          <Route path="/roadmaps/:id" element={<RoadmapDetails />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/checkout/payment" element={<PaymentSubmission />} />
          <Route path="/checkout/review" element={<OrderUnderReview />} />
          <Route path="/checkout/success" element={<OrderSuccess />} />
        </Routes>
      </div>

      <Footer data={data.footer} />
    </div>
  );
};

export default PublicRoutes;
