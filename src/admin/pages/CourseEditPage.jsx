import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addCourse, updateCourse } from '../../store/slices/dbSlice';
import { addToast } from '../../store/slices/uiSlice';
import MediaUploader from '../components/MediaUploader';
import { MdSave, MdArrowBack, MdAdd, MdDelete, MdDragIndicator } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

const CourseEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;

  const { courses } = useSelector(state => state.db);
  const courseToEdit = isEditMode ? courses.byId[id] : null;

  const [formData, setFormData] = useState({
    title: '',
    short_title: '',
    description: '',
    pricing: { price: 0, original_price: 0, discount_percentage: 0 },
    media: { thumbnail: null, preview_video: null },
    instructor: { name: '', title: '', bio: '', image: null },
    sections: [],
    meta: { duration: '', level: 'Beginner', certificate: true }
  });

  useEffect(() => {
    if (isEditMode && courseToEdit) {
      setFormData(courseToEdit);
    }
  }, [isEditMode, courseToEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  // --- Curriculum Management ---
  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), { id: uuidv4(), title: 'New Section', lessons: [] }]
    }));
  };

  const updateSection = (secId, title) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(sec => sec.id === secId ? { ...sec, title } : sec)
    }));
  };

  const deleteSection = (secId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(sec => sec.id !== secId)
    }));
  };

  const addLesson = (secId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === secId) {
          return {
            ...sec,
            lessons: [...(sec.lessons || []), { id: uuidv4(), title: 'New Lesson', duration: '0:00', free_preview: false }]
          };
        }
        return sec;
      })
    }));
  };

  const updateLesson = (secId, lessonId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === secId) {
          return {
            ...sec,
            lessons: sec.lessons.map(lesson => lesson.id === lessonId ? { ...lesson, [field]: value } : lesson)
          };
        }
        return sec;
      })
    }));
  };

  const deleteLesson = (secId, lessonId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === secId) {
          return {
            ...sec,
            lessons: sec.lessons.filter(l => l.id !== lessonId)
          };
        }
        return sec;
      })
    }));
  };

  // --- Save ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return alert('العنوان مطلوب');

    if (isEditMode) {
      dispatch(updateCourse({ id, updates: formData }));
      dispatch(addToast({ type: 'success', message: 'تم تحديث الدورة بنجاح' }));
    } else {
      dispatch(addCourse(formData));
      dispatch(addToast({ type: 'success', message: 'تم إنشاء الدورة بنجاح' }));
    }
    navigate('/admin/courses');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold text-heading-brown">
            {isEditMode ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light space-y-4">
            <h3 className="font-bold text-lg mb-4">معلومات أساسية</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الدورة *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none"
                placeholder="مثال: دورة React الشاملة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان المختصر</label>
              <input
                type="text"
                value={formData.short_title}
                onChange={e => handleChange('short_title', e.target.value)}
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

          {/* Curriculum */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">المنهج الدراسي</h3>
              <button type="button" onClick={addSection} className="text-primary font-bold text-sm flex items-center gap-1">
                <MdAdd /> إضافة قسم
              </button>
            </div>

            <div className="space-y-4">
              {formData.sections?.map((section, idx) => (
                <div key={section.id} className="border border-border-light rounded-xl overflow-hidden">
                  <div className="bg-gray-50 p-4 flex items-center gap-3">
                    <MdDragIndicator className="text-gray-400 cursor-move" />
                    <span className="font-bold text-gray-500">#{idx + 1}</span>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      className="bg-transparent font-bold flex-grow focus:outline-none"
                      placeholder="Section Title"
                    />
                    <button type="button" onClick={() => deleteSection(section.id)} className="text-red-400 hover:text-red-500">
                      <MdDelete />
                    </button>
                  </div>

                  <div className="p-4 space-y-2 bg-white">
                    {section.lessons?.map((lesson, lIdx) => (
                      <div key={lesson.id} className="flex items-center gap-3 pl-8 pr-2 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-400">{lIdx + 1}</span>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(section.id, lesson.id, 'title', e.target.value)}
                          className="bg-transparent text-sm flex-grow focus:outline-none"
                          placeholder="Lesson Title"
                        />
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(section.id, lesson.id, 'duration', e.target.value)}
                          className="w-16 text-xs text-right bg-transparent focus:outline-none text-gray-500"
                          placeholder="00:00"
                        />
                        <button type="button" onClick={() => deleteLesson(section.id, lesson.id)} className="text-gray-300 hover:text-red-500">
                          <MdDelete size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addLesson(section.id)}
                      className="w-full py-2 text-xs text-center text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg dashed border border-gray-200 mt-2"
                    >
                      + إضافة درس
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar inputs) */}
        <div className="space-y-8">
          {/* Media */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light space-y-4">
            <h3 className="font-bold text-lg mb-2">الوسائط</h3>
            <MediaUploader
              label="صورة الدورة"
              currentUrl={formData.media?.thumbnail}
              onUploadComplete={(data) => data ? handleNestedChange('media', 'thumbnail', data.secure_url) : handleNestedChange('media', 'thumbnail', null)}
            />

            <div className="border-t border-gray-100 pt-4"></div>

            <MediaUploader
              label="فيديو مقدمة"
              accept={{ 'video/*': [] }}
              currentUrl={formData.media?.preview_video}
              onUploadComplete={(data) => data ? handleNestedChange('media', 'preview_video', data.secure_url) : handleNestedChange('media', 'preview_video', null)}
            />
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light space-y-4">
            <h3 className="font-bold text-lg mb-2">التسعيـــر</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">السعر الحالي ($)</label>
                <input
                  type="number"
                  value={formData.pricing.price}
                  onChange={e => handleNestedChange('pricing', 'price', parseFloat(e.target.value))}
                  className="w-full p-2 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">السعر الأصلي ($)</label>
                <input
                  type="number"
                  value={formData.pricing.original_price}
                  onChange={e => handleNestedChange('pricing', 'original_price', parseFloat(e.target.value))}
                  className="w-full p-2 rounded-lg border border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light space-y-4">
            <h3 className="font-bold text-lg mb-2">المدرب</h3>

            <input
              type="text"
              placeholder="اسم المدرب"
              value={formData.instructor?.name || ''}
              onChange={e => handleNestedChange('instructor', 'name', e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200 mb-2"
            />
            <input
              type="text"
              placeholder="المسمى الوظيفي"
              value={formData.instructor?.title || ''}
              onChange={e => handleNestedChange('instructor', 'title', e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CourseEditPage;
