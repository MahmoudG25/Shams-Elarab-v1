import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice';
import { MdSave, MdAdd, MdDelete, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { pageService } from '../../services/pageService';
import MediaUploader from '../components/MediaUploader';
import { v4 as uuidv4 } from 'uuid';

const HomeEditPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [formData, setFormData] = useState({
    hero: { title: '', subtitle: '', ctaText: '', ctaLink: '/paths', stats: [] },
    mission: { title: '', description: '', features: [] },
    testimonials: [],
    faq: [],
    pricing: { pro: { price: 49, features: [] }, enterprise: { price: 99, features: [] } }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await pageService.getPageData('home');
        if (data) {
          setFormData(prev => ({
            ...prev,
            ...data,
            // Ensure arrays are initialized correctly to prevent map errors
            hero: { ...prev.hero, ...(data.hero || {}), stats: (data.hero?.stats && Array.isArray(data.hero.stats)) ? data.hero.stats : [] },
            mission: { ...prev.mission, ...(data.mission || {}), features: (data.mission?.features && Array.isArray(data.mission.features)) ? data.mission.features : [] },
            testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
            faq: Array.isArray(data.faq) ? data.faq : []
          }));
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        dispatch(addToast({ type: 'error', message: 'فشل تحميل البيانات' }));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pageService.updatePageData('home', formData);
      dispatch(addToast({ type: 'success', message: 'تم تحديث الصفحة الرئيسية بنجاح' }));
    } catch (error) {
      console.error("Error updating home page:", error);
      dispatch(addToast({ type: 'error', message: 'فشل حفظ التغييرات' }));
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers for Arrays (Testimonials, FAQ) ---
  const addItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), { id: uuidv4(), ...template }]
    }));
  };

  const updateItem = (section, id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (section, id) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  if (loading) return <div>Loading...</div>;

  const tabs = [
    { id: 'hero', label: 'الرئيسية (Hero)' },
    { id: 'mission', label: 'عن المنصة' },
    { id: 'testimonials', label: 'آراء العملاء' },
    { id: 'faq', label: 'الأسئلة الشائعة' },
    { id: 'pricing', label: 'الأسعار' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading-brown">إدارة الصفحة الرئيسية</h1>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-heading-brown font-bold px-6 py-3 rounded-xl hover:bg-gold-cta shadow-lg shadow-primary/20 transition-all"
        >
          <MdSave size={20} />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light min-h-[400px]">

        {/* HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg mb-4">القسم الرئيسي (Hero)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">العنوان الرئيسي</label>
                <input
                  type="text"
                  value={formData.hero?.title || ''}
                  onChange={e => handleChange('hero', 'title', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">العنوان الفرعي</label>
                <textarea
                  value={formData.hero?.subtitle || ''}
                  onChange={e => handleChange('hero', 'subtitle', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نص الزر (CTA)</label>
                <input
                  type="text"
                  value={formData.hero?.ctaText || ''}
                  onChange={e => handleChange('hero', 'ctaText', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رابط الزر</label>
                <input
                  type="text"
                  value={formData.hero?.ctaLink || ''}
                  onChange={e => handleChange('hero', 'ctaLink', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* MISSION SECTION */}
        {activeTab === 'mission' && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg mb-4">رسالة المنصة</h3>
            <div>
              <label className="block text-sm font-medium mb-1">العنوان</label>
              <input
                type="text"
                value={formData.mission?.title || ''}
                onChange={e => handleChange('mission', 'title', e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea
                value={formData.mission?.description || ''}
                onChange={e => handleChange('mission', 'description', e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* TESTIMONIALS SECTION */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">آراء العملاء</h3>
              <button
                type="button"
                onClick={() => addItem('testimonials', { name: '', role: '', content: '', image: '' })}
                className="text-primary flex items-center gap-1 font-bold text-sm"
              >
                <MdAdd size={20} /> إضافة رأي
              </button>
            </div>

            <div className="space-y-4">
              {formData.testimonials?.map((item, idx) => (
                <div key={item.id} className="border border-border-light rounded-xl p-4 bg-gray-50 relative group">
                  <button
                    type="button"
                    onClick={() => removeItem('testimonials', item.id)}
                    className="absolute top-4 left-4 text-red-400 hover:text-red-500"
                  >
                    <MdDelete size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">الاسم</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateItem('testimonials', item.id, 'name', e.target.value)}
                        className="w-full p-2 rounded border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">الوظيفة</label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={e => updateItem('testimonials', item.id, 'role', e.target.value)}
                        className="w-full p-2 rounded border border-gray-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1">الرأي</label>
                      <textarea
                        value={item.content}
                        onChange={e => updateItem('testimonials', item.id, 'content', e.target.value)}
                        className="w-full p-2 rounded border border-gray-200"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <MediaUploader
                        label="صورة العميل (اختياري)"
                        currentUrl={item.image}
                        onUploadComplete={(data) => updateItem('testimonials', item.id, 'image', data ? data.secure_url : '')}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">الأسئلة الشائعة</h3>
              <button
                type="button"
                onClick={() => addItem('faq', { question: '', answer: '' })}
                className="text-primary flex items-center gap-1 font-bold text-sm"
              >
                <MdAdd size={20} /> إضافة سؤال
              </button>
            </div>

            <div className="space-y-4">
              {formData.faq?.map((item, idx) => (
                <div key={item.id} className="border border-border-light rounded-xl p-4 bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => removeItem('faq', item.id)}
                    className="absolute top-4 left-4 text-red-400 hover:text-red-500"
                  >
                    <MdDelete size={20} />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">السؤال</label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={e => updateItem('faq', item.id, 'question', e.target.value)}
                        className="w-full p-2 rounded border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">الإجابة</label>
                      <textarea
                        value={item.answer}
                        onChange={e => updateItem('faq', item.id, 'answer', e.target.value)}
                        className="w-full p-2 rounded border border-gray-200"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRICING SECTION */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg mb-4">خطط الأسعار</h3>
            {/* Just basic inputs for now, assuming standard structure */}
            <p className="text-gray-500 text-sm">تعديل ميزات الخطط يمكن أن يكون معقداً، يرجى التواصل مع المطور للميزات المتقدمة.</p>
          </div>
        )}

      </div>
    </form>
  );
};

export default HomeEditPage;
