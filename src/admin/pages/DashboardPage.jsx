import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MdClass, MdMap, MdPeople, MdPermMedia } from 'react-icons/md';
import { addToast, openModal } from '../../store/slices/uiSlice';
import { courseService } from '../../services/courseService';
import { roadmapService } from '../../services/roadmapService';
import { orderService } from '../../services/orderService';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-heading-brown">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({ courses: 0, roadmaps: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [courses, roadmaps, orders] = await Promise.all([
          courseService.getAllCourses(false), // Fetch all including hidden
          roadmapService.getAllRoadmaps(),
          orderService.getOrders()
        ]);
        setStats({
          courses: courses.length,
          roadmaps: roadmaps.length,
          orders: orders.length
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleReset = () => {
    dispatch(openModal({
      type: 'CONFIRM',
      props: {
        title: 'إعادة ضبط قاعدة البيانات المحلية',
        message: 'سيتم حذف البيانات المحلية (Local Storage). البيانات على Firestore لن تتأثر.',
        confirmText: 'نعم، إعادة الضبط',
        isDestructive: true,
        onConfirm: () => {
          try {
            localStorage.clear();
            window.location.reload();
          } catch (e) {
            console.error(e);
            dispatch(addToast({ type: 'error', message: 'حدث خطأ أثناء إعادة الضبط' }));
          }
        }
      }
    }));
  };

  const dashboardStats = [
    {
      title: 'إجمالي الدورات',
      value: loading ? '...' : stats.courses,
      icon: MdClass,
      color: 'bg-blue-500'
    },
    {
      title: 'المسارات التعليمية',
      value: loading ? '...' : stats.roadmaps,
      icon: MdMap,
      color: 'bg-green-500'
    },
    {
      title: 'الطلبات',
      value: loading ? '...' : stats.orders,
      icon: MdPeople,
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-heading-brown">لوحة المعلومات</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light">
          <h2 className="text-lg font-bold mb-4">أدوات النظام</h2>
          <p className="text-sm text-gray-500 mb-4">
            أدوات مفيدة لإدارة البيانات ونقلها.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl transition-colors border border-red-100"
            >
              تنظيف المحلي (Reset Storage)
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light">
          <h2 className="text-lg font-bold mb-4">حالة النظام</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border-light pb-2">
              <span className="text-gray-600">قاعدة البيانات</span>
              <span className="text-green-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Firestore Connected
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-border-light pb-2">
              <span className="text-gray-600">Cloudinary</span>
              <span className={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ? 'متصل' : 'غير متصل (اضبط .env)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">نسخة التطبيق</span>
              <span className="text-gray-900 font-bold">1.2.0 (Firestore)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
