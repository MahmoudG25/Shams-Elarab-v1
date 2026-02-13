import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addRoadmap, updateRoadmap } from '../../store/slices/dbSlice';
import { addToast } from '../../store/slices/uiSlice';
import DragDropList from '../components/DragDropList';
import { MdSave, MdArrowBack, MdAdd } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

const RoadmapEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;

  const { roadmaps, courses } = useSelector(state => state.db);
  const roadmapToEdit = isEditMode ? roadmaps.byId[id] : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    modules: [], // { id, title, courseId, locked, ... }
    pricing: { price: 0, discount: 0 }
  });

  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    if (isEditMode && roadmapToEdit) {
      setFormData(roadmapToEdit);
    }
  }, [isEditMode, roadmapToEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Module Management ---
  const addModule = () => {
    if (!selectedCourseId) return;

    const course = courses.byId[selectedCourseId];
    if (!course) return;

    const newModule = {
      id: uuidv4(),
      title: course.title,
      courseId: course.id, // Link to course
      locked: true,
      description: course.description,
      outcomes: course.learning_points?.slice(0, 3) || [] // Default outcomes
    };

    setFormData(prev => ({
      ...prev,
      modules: [...(prev.modules || []), newModule]
    }));
    setSelectedCourseId('');
  };

  const handleReorder = (newModules) => {
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const removeModule = (modId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== modId)
    }));
  };

  const toggleLock = (modId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === modId ? { ...m, locked: !m.locked } : m)
    }));
  };

  // --- Save ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return alert('العنوان مطلوب');

    if (isEditMode) {
      dispatch(updateRoadmap({ id, updates: formData }));
      dispatch(addToast({ type: 'success', message: 'تم تحديث المسار بنجاح' }));
    } else {
      dispatch(addRoadmap(formData));
      dispatch(addToast({ type: 'success', message: 'تم إنشاء المسار بنجاح' }));
    }
    navigate('/admin/roadmaps');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold text-heading-brown">
            {isEditMode ? 'تعديل المسار' : 'إضافة مسار جديد'}
          </h1>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-primary text-heading-brown font-bold px-6 py-3 rounded-xl hover:bg-gold-cta shadow-lg shadow-primary/20 transition-all"
        >
          <MdSave size={20} />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light space-y-4">
            <h3 className="font-bold text-lg mb-4">معلومات المسار</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المسار *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Modules */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light space-y-6">
            <h3 className="font-bold text-lg">الوحدات التعليمية (السحب للإفلات)</h3>

            {/* Add Module */}
            <div className="flex gap-4 items-end">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">إضافة دورة للمسار</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none"
                >
                  <option value="">اختر دورة...</option>
                  {courses.allIds.map(cId => (
                    <option key={cId} value={cId}>{courses.byId[cId].title}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={addModule}
                className="bg-gray-100 text-gray-700 font-bold px-4 py-3 rounded-lg hover:bg-gray-200"
              >
                <MdAdd size={20} />
              </button>
            </div>

            <DragDropList
              items={formData.modules || []}
              onReorder={handleReorder}
              onRemove={removeModule}
              onToggleLock={toggleLock}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light space-y-4">
            <h3 className="font-bold text-lg mb-2">الإعدادات</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المستوى</label>
              <select
                value={formData.level}
                onChange={e => handleChange('level', e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All Levels</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RoadmapEditPage;
