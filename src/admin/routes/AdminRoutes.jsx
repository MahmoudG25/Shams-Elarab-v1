import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import DashboardPage from '../pages/DashboardPage';
import CoursesListPage from '../pages/CoursesListPage';
import CourseEditPage from '../pages/CourseEditPage';
import RoadmapsListPage from '../pages/RoadmapsListPage';
import RoadmapEditPage from '../pages/RoadmapEditPage';

import HomeEditPage from '../pages/HomeEditPage';
import OrdersListPage from '../pages/OrdersListPage';

import LoginPage from '../pages/LoginPage';
import RequireAuth from '../components/RequireAuth';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />

      <Route path="/" element={
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="home" element={<HomeEditPage />} />
        <Route path="orders" element={<OrdersListPage />} />

        <Route path="courses" element={<CoursesListPage />} />
        <Route path="courses/new" element={<CourseEditPage />} />
        <Route path="courses/:id" element={<CourseEditPage />} />

        <Route path="roadmaps" element={<RoadmapsListPage />} />
        <Route path="roadmaps/new" element={<RoadmapEditPage />} />
        <Route path="roadmaps/:id" element={<RoadmapEditPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
