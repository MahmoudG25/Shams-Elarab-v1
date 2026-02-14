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
    hero: { title: '', subtitle: '', ctaText: '', ctaLink: '/paths', stats: [], bgImage: '', images: [] },
    partners: [], // { id, name, logo }
    mission: { title: '', description: '', features: [] },
    testimonials: [],
    faq: [],
    pricing: { title: 'Pricing', subtitle: 'Choose your plan', plans: [] }, // Dynamic pricing
    ctaFinal: { title: '', subtitle: '', buttonText: '', images: [] } // Added images array
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
            hero: { ...prev.hero, ...(data.hero || {}), stats: (data.hero?.stats && Array.isArray(data.hero.stats)) ? data.hero.stats : [], images: data.hero?.images || [] },
            partners: Array.isArray(data.partners) ? data.partners : [],
            mission: { ...prev.mission, ...(data.mission || {}), features: (data.mission?.features && Array.isArray(data.mission.features)) ? data.mission.features : [] },
            testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
            faq: Array.isArray(data.faq) ? data.faq : [],
            pricing: { ...prev.pricing, ...(data.pricing || {}), plans: Array.isArray(data.pricing?.plans) ? data.pricing.plans : [] },
            ctaFinal: { ...prev.ctaFinal, ...(data.ctaFinal || {}), images: (data.ctaFinal?.images && Array.isArray(data.ctaFinal.images)) ? data.ctaFinal.images : [] }
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

  // --- Helpers for Arrays (Testimonials, FAQ, Partners, Plans) ---
  const addItem = (section, template) => {
    // Handle nested arrays (like pricing.plans) vs top-level arrays
    if (section.includes('.')) {
      const [parent, child] = section.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: [...(prev[parent][child] || []), { id: uuidv4(), ...template }]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: [...(prev[section] || []), { id: uuidv4(), ...template }]
      }));
    }
  };

  const updateItem = (section, id, field, value) => {
    if (section.includes('.')) {
      const [parent, child] = section.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: prev[parent][child].map(item => item.id === id ? { ...item, [field]: value } : item)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
      }));
    }
  };

  const removeItem = (section, id) => {
    if (section.includes('.')) {
      const [parent, child] = section.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: prev[parent][child].filter(item => item.id !== id)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].filter(item => item.id !== id)
      }));
    }
  };

  if (loading) return <div>Loading...</div>;

  const tabs = [
    { id: 'hero', label: 'الرئيسية (Hero)' },
    { id: 'partners', label: 'الشركاء' },
    { id: 'tracks', label: 'المسارات (Tracks)' },
    { id: 'mission', label: 'عن المنصة' },
    { id: 'testimonials', label: 'آراء العملاء' },
    { id: 'faq', label: 'الأسئلة الشائعة' },
    { id: 'pricing', label: 'الأسعار' },
    { id: 'cta', label: 'الخاتمة (CTA)' }
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
              <div className="md:col-span-2">
                <MediaUploader
                  label="صورة الخلفية (Cover)"
                  currentUrl={formData.hero?.bgImage}
                  onUploadComplete={(data) => handleChange('hero', 'bgImage', data ? data.secure_url : '')}
                />
              </div>

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

              {/* Hero Slider Images Management */}
              <div className="md:col-span-2 space-y-4 mt-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold">صور المعرض (Slider Images)</label>
                  <button
                    type="button"
                    onClick={() => {
                      // Add empty string to images array
                      const newImages = [...(formData.hero?.images || []), ''];
                      handleChange('hero', 'images', newImages);
                    }}
                    className="text-primary flex items-center gap-1 font-bold text-sm"
                  >
                    <MdAdd size={20} /> إضافة صورة
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(formData.hero?.images || []).map((imgUrl, index) => (
                    <div key={index} className="relative group border rounded-xl p-2 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.hero.images.filter((_, i) => i !== index);
                          handleChange('hero', 'images', newImages);
                        }}
                        className="absolute top-1 left-1 text-red-500 bg-white rounded-full p-1 shadow-sm z-10"
                      >
                        <MdDelete size={16} />
                      </button>
                      <MediaUploader
                        label={`صورة ${index + 1}`}
                        currentUrl={imgUrl}
                        onUploadComplete={(data) => {
                          if (data) {
                            const newImages = [...formData.hero.images];
                            newImages[index] = data.secure_url;
                            handleChange('hero', 'images', newImages);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PARTNERS SECTION */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">شركاء النجاح</h3>
              <button
                type="button"
                onClick={() => addItem('partners', { name: '', logo: '' })}
                className="text-primary flex items-center gap-1 font-bold text-sm"
              >
                <MdAdd size={20} /> إضافة شريك
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.partners?.map((item) => (
                <div key={item.id} className="border border-border-light rounded-xl p-4 bg-gray-50 relative group shadow-sm">
                  <button
                    type="button"
                    onClick={() => removeItem('partners', item.id)}
                    className="absolute top-2 left-2 text-red-400 hover:text-red-500 bg-white rounded-full p-1 shadow-md z-10"
                  >
                    <MdDelete size={18} />
                  </button>

                  <div className="space-y-4">
                    <MediaUploader
                      label="شعار الشريك"
                      currentUrl={item.logo}
                      onUploadComplete={(data) => updateItem('partners', item.id, 'logo', data ? data.secure_url : '')}
                    />
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">اسم الشريك</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateItem('partners', item.id, 'name', e.target.value)}
                        className="w-full p-2 rounded border border-gray-200 text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
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

        {/* TRACKS SECTION */}
        {activeTab === 'tracks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">المسارات التعليمية</h3>
              <button
                type="button"
                onClick={() => addItem('tracks', { title: '', category: 'All', tag: '', from: '', to: '', image: '' })}
                className="text-primary flex items-center gap-1 font-bold text-sm"
              >
                <MdAdd size={20} /> إضافة مسار
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">عنوان القسم</label>
                <input
                  type="text"
                  value={formData.tracks?.title || ''}
                  onChange={e => handleChange('tracks', 'title', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>

              {/* Track Items */}
              {formData.tracks?.items?.map((item) => (
                <div key={item.id} className="border border-border-light rounded-xl p-4 bg-gray-50 relative group">
                  <button
                    type="button"
                    onClick={() => removeItem('tracks.items', item.id)}
                    className="absolute top-2 left-2 text-red-400 hover:text-red-500 bg-white rounded-full p-1 shadow-md z-10"
                  >
                    <MdDelete size={18} />
                  </button>

                  <div className="space-y-4">
                    <MediaUploader
                      label="صورة المسار"
                      currentUrl={item.image}
                      onUploadComplete={(data) => updateItem('tracks.items', item.id, 'image', data ? data.secure_url : '')}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">العنوان</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateItem('tracks.items', item.id, 'title', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">التصنيف (Category)</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={e => updateItem('tracks.items', item.id, 'category', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">من (From)</label>
                        <input
                          type="text"
                          value={item.from}
                          onChange={e => updateItem('tracks.items', item.id, 'from', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">إلى (To)</label>
                        <input
                          type="text"
                          value={item.to}
                          onChange={e => updateItem('tracks.items', item.id, 'to', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">العلامة (Tag)</label>
                        <input
                          type="text"
                          value={item.tag}
                          onChange={e => updateItem('tracks.items', item.id, 'tag', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                className="
text-primary 
flex items-center gap-2 
font-semibold text-sm 
px-3 py-1.5 
rounded-full 
transition-all duration-300 
hover:text-primary/80 
hover:scale-105 
hover:bg-gray-100 cursor-pointer
"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان القسم</label>
                <input
                  type="text"
                  value={formData.pricing?.title || ''}
                  onChange={e => handleChange('pricing', 'title', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف الفرعي</label>
                <input
                  type="text"
                  value={formData.pricing?.subtitle || ''}
                  onChange={e => handleChange('pricing', 'subtitle', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نص الزر (CTA)</label>
                <input
                  type="text"
                  value={formData.pricing?.cta || ''}
                  onChange={e => handleChange('pricing', 'cta', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نص تحت الزر</label>
                <input
                  type="text"
                  value={formData.pricing?.cta_sub || ''}
                  onChange={e => handleChange('pricing', 'cta_sub', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 mb-4">
              <h3 className="font-bold text-lg">الخطط (Plans)</h3>
              <button
                type="button"
                onClick={() => addItem('pricing.plans', { title: '', price: '', period: '/monthly', features: [], highlight: false })}
                className="text-primary flex items-center gap-1 font-bold text-sm"
              >
                <MdAdd size={20} /> إضافة خطة
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {formData.pricing?.plans?.map((plan) => (
                <div key={plan.id} className={`border rounded-xl p-4 relative group ${plan.highlight ? 'border-primary bg-primary/5' : 'border-border-light bg-gray-50'}`}>
                  <button
                    type="button"
                    onClick={() => removeItem('pricing.plans', plan.id)}
                    className="absolute top-2 left-2 text-red-400 hover:text-red-500 bg-white rounded-full p-1 shadow-md z-10"
                  >
                    <MdDelete size={18} />
                  </button>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={plan.highlight || false}
                        onChange={e => updateItem('pricing.plans', plan.id, 'highlight', e.target.checked)}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <label className="text-sm font-bold text-primary">تميز هذه الخطة (Highlight)</label>
                    </div>

                    <MediaUploader
                      label="صورة الخطة"
                      currentUrl={plan.image}
                      onUploadComplete={(data) => updateItem('pricing.plans', plan.id, 'image', data ? data.secure_url : '')}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">اسم الخطة</label>
                        <input
                          type="text"
                          value={plan.title}
                          onChange={e => updateItem('pricing.plans', plan.id, 'title', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">السعر</label>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={e => updateItem('pricing.plans', plan.id, 'price', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">الفترة (Period)</label>
                        <input
                          type="text"
                          value={plan.period}
                          onChange={e => updateItem('pricing.plans', plan.id, 'period', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">الشارة (Badge)</label>
                        <input
                          type="text"
                          value={plan.badge}
                          onChange={e => updateItem('pricing.plans', plan.id, 'badge', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">الوصف المختصر</label>
                        <input
                          type="text"
                          value={plan.subtitle}
                          onChange={e => updateItem('pricing.plans', plan.id, 'subtitle', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">الوصف الكامل</label>
                        <textarea
                          value={plan.description}
                          onChange={e => updateItem('pricing.plans', plan.id, 'description', e.target.value)}
                          className="w-full p-2 rounded border border-gray-200"
                          rows={2}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">الميزات (كل ميزة في سطر)</label>
                        <textarea
                          value={Array.isArray(plan.features) ? plan.features.join('\n') : plan.features}
                          onChange={e => updateItem('pricing.plans', plan.id, 'features', e.target.value.split('\n'))}
                          className="w-full p-2 rounded border border-gray-200"
                          rows={4}
                          placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINAL CTA SECTION */}
        {activeTab === 'cta' && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg mb-4">الخاتمة (Call To Action)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">العنوان</label>
                <input
                  type="text"
                  value={formData.ctaFinal?.title || ''}
                  onChange={e => handleChange('ctaFinal', 'title', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <input
                  type="text"
                  value={formData.ctaFinal?.subtitle || ''}
                  onChange={e => handleChange('ctaFinal', 'subtitle', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نص الزر</label>
                <input
                  type="text"
                  value={formData.ctaFinal?.buttonText || ''}
                  onChange={e => handleChange('ctaFinal', 'buttonText', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200"
                />
              </div>

              {/* CTA Background Images Management */}
              <div className="md:col-span-2 space-y-4 mt-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold">صور الخلفية (Background Slider)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...(formData.ctaFinal?.images || []), ''];
                      handleChange('ctaFinal', 'images', newImages);
                    }}
                    className="
                      text-primary 
                      flex items-center gap-2 
                      font-semibold text-sm 
                      px-3 py-1.5 
                      rounded-full 
                      transition-all duration-300 
                      hover:text-primary/80 
                      hover:scale-105 
                      hover:bg-gray-100 cursor-pointer
                    "
                  >
                    <MdAdd size={20} /> إضافة صورة
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(formData.ctaFinal?.images || []).map((imgUrl, index) => (
                    <div key={index} className="relative group border rounded-xl p-2 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.ctaFinal.images.filter((_, i) => i !== index);
                          handleChange('ctaFinal', 'images', newImages);
                        }}
                        className="absolute top-1 left-1 text-red-500 bg-white rounded-full p-1 shadow-sm z-10"
                      >
                        <MdDelete size={16} />
                      </button>
                      <MediaUploader
                        label={`صورة ${index + 1}`}
                        currentUrl={imgUrl}
                        onUploadComplete={(data) => {
                          if (data) {
                            const newImages = [...formData.ctaFinal.images];
                            newImages[index] = data.secure_url;
                            handleChange('ctaFinal', 'images', newImages);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </form>
  );
};

export default HomeEditPage;
