import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useDispatch } from 'react-redux';
import { loadState } from '../../services/dbStorage';
import { loadDatabase } from '../../store/slices/dbSlice';
import { migrateToNormalizedDb } from '../../services/migrations';
import DashboardPage from '../pages/DashboardPage';
import ToastContainer from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

// Import seed data directly for fallback
import seedCourses from '../../data/courses.json';
import seedRoadmaps from '../../data/roadmaps.json';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initDb = async () => {
      // 1. Try loading from Persistence
      const persistedState = await loadState();

      if (persistedState) {
        dispatch(loadDatabase(persistedState));
      } else {
        // 2. Fallback to Seed Data -> Normalize
        console.log("No persisted data found. Seeding...");
        const normalizedData = migrateToNormalizedDb(seedCourses, seedRoadmaps);
        dispatch(loadDatabase(normalizedData));
      }
      setIsInitialized(true);
    };

    initDb();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-alt">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-alt font-display text-right" dir="rtl">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

      <main className="p-4 md:p-8 lg:mr-64 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>

      <ToastContainer />
      <ConfirmModal />
    </div>
  );
};

export default AdminLayout;
