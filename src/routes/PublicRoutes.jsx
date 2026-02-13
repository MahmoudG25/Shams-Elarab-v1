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
import { pageService } from '../services/pageService';

const PublicRoutes = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await pageService.getPageData('home');
        setPageData(data);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      }
    };
    fetchPageData();
  }, []);

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

  if (!pageData) {
    // Optional: Return a loading spinner here
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div dir="rtl" className="bg-surface-white dark:bg-background-dark font-display text-body-text dark:text-gray-100 antialiased selection:bg-primary/30 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar
        data={pageData.navbar}
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

      <Footer data={pageData.footer} />
    </div>
  );
};

export default PublicRoutes;
