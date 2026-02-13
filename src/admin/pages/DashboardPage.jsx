import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdClass, MdMap, MdPeople, MdPermMedia } from 'react-icons/md';
import { addToast, openModal } from '../../store/slices/uiSlice';

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
  const { courses, roadmaps, instructors } = useSelector(state => state.db);
  const dbState = useSelector(state => state.db);
  const dispatch = useDispatch();

  const stats = [
    {
      title: 'إجمالي الدورات',
      value: courses.allIds.length,
      icon: MdClass,
      color: 'bg-blue-500'
    },
    {
      title: 'المسارات التعليمية',
      value: roadmaps.allIds.length,
      icon: MdMap,
      color: 'bg-green-500'
    },
    {
      title: 'المدربين',
      value: instructors.allIds.length,
      icon: MdPeople,
      color: 'bg-purple-500'
    },
  ];

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dbState));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "shams-elarab-db.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    dispatch(addToast({ type: 'success', message: 'تم تصدير قاعدة البيانات بنجاح' }));
  };

  const handleReset = () => {
    dispatch(openModal({
      type: 'CONFIRM',
      props: {
        title: 'إعادة ضبط قاعدة البيانات',
        message: 'سيتم حذف جميع التعديلات والعودة إلى البيانات الأصلية. هل أنت متأكد؟',
        confirmText: 'نعم، إعادة الضبط',
        isDestructive: true,
        onConfirm: () => {
          // Clear persistence
          try {
            localStorage.removeItem('shams_admin_db_v1');
            window.location.reload();
          } catch (e) {
            console.error(e);
            dispatch(addToast({ type: 'error', message: 'حدث خطأ أثناء إعادة الضبط' }));
          }
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-heading-brown">لوحة المعلومات</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light">
          <h2 className="text-lg font-bold mb-4">إدارة قاعدة البيانات</h2>
          <p className="text-sm text-gray-500 mb-4">
            يمكنك تصدير البيانات الحالية كملف JSON لنسخها احتياطياً، أو إعادة ضبط النظام إلى وضعه الافتراضي.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleExport}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-heading-brown font-bold py-3 px-4 rounded-xl transition-colors border border-gray-200"
            >
              تصدير (Backup)
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl transition-colors border border-red-100"
            >
              إعادة ضبط (Reset)
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light">
          <h2 className="text-lg font-bold mb-4">حالة النظام</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border-light pb-2">
              <span className="text-gray-600">حالة التخزين</span>
              <span className="text-green-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                يعمل (LocalStorage)
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
              <span className="text-gray-900 font-bold">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
