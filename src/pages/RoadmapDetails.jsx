import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RoadmapHero from '../components/paths/RoadmapHero';
import RoadmapModules from '../components/paths/RoadmapModules';
import { roadmapService } from '../services/roadmapService';
import { courseService } from '../services/courseService';

const RoadmapDetails = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data = await roadmapService.getRoadmapById(id);

        // Hydrate module images if missing
        if (data && data.modules) {
          console.log("Hydrating modules for roadmap:", data.title);
          const modulesWithImages = await Promise.all(data.modules.map(async (mod) => {
            // Valid image check: must be non-empty string
            if (mod.image && mod.image.trim() !== '') {
              return mod;
            }

            if (!mod.courseId) {
              console.warn("Module missing courseId:", mod.title);
              return mod;
            }

            // Fetch course to get image
            try {
              const courseIdStr = String(mod.courseId);
              const course = await courseService.getCourseById(courseIdStr);
              if (course) {
                // console.log("Fetched course:", course.title, "Image:", course.image);
                return {
                  ...mod,
                  image: (mod.image && mod.image.trim() !== '') ? mod.image : (course.image || course.media?.thumbnail || course.preview_image || ''),
                  level: mod.level || course.level || 'Beginner',
                  lessons_count: mod.lessons_count || course.lessons_count || 12
                };
              } else {
                console.warn("Course not found for ID:", mod.courseId);
              }
            } catch (e) {
              console.warn(`Failed to fetch image for course ${mod.courseId}`, e);
            }
            return mod;
          }));
          data.modules = modulesWithImages;
        }

        setRoadmap(data);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen pt-24 pb-20 flex justify-center items-center">Loading...</div>;
  }

  if (!roadmap) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-heading-brown mb-4">المسار غير موجود</h2>
        <Link to="/learning-paths" className="text-primary hover:underline font-bold">
          العودة للمسارات
        </Link>
      </div>
    );
  }

  const roadmapPrice = roadmap.pricing?.price || roadmap.price;
  const roadmapDiscount = roadmap.pricing?.discount_percentage || roadmap.discount;
  // New schema doesn't have instructor in roadmap root? Check if needed. Assuming instructor is per course now or still in roadmap but maybe removed from sample. Use safe access.
  const roadmapInstructor = roadmap.instructor || { name: "Multiple Instructors", role: "Team", image: "" };

  return (
    <div className="bg-[#f8f9fb] min-h-screen pt-24 pb-20">
      <main className="max-w-7xl mx-auto px-6">

        {/* Breadcrumbs (Moved out of Hero) */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 mt-4">
          <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <span className="material-symbols-outlined text-xs rtl:rotate-180">chevron_right</span>
          <Link to="/learning-paths" className="hover:text-primary transition-colors">مسارات التعلم</Link>
          <span className="material-symbols-outlined text-xs rtl:rotate-180">chevron_right</span>
          <span className="text-heading-brown font-medium">{roadmap.title}</span>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* RIGHT COLUMN (Main Content) - Span 8 */}
          <div className="lg:col-span-8 order-2 lg:order-1">

            {/* 1. HERO CARDS (Title & Outcomes) */}
            <RoadmapHero roadmap={roadmap} />

            {/* 2. TIMELINE CONTENT */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-heading-brown">خريطة المسار </h2>
                <span className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
                  {roadmap.modules?.length || 0} مراحل
                </span>
              </div>
              <RoadmapModules modules={roadmap.modules} />
            </div>
          </div>

          {/* LEFT COLUMN (Sidebar) - Span 4 */}
          <div className="lg:col-span-4 order-1 lg:order-2 sticky top-28">
            <div className="bg-white rounded-[01rem] p-6 lg:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
              {/* Discount Badge */}
              <div className="absolute top-6 left-6 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                خصم {roadmapDiscount || 45}%
              </div>

              {/* Price Header */}
              <div className="mt-4 mb-8 text-center">
                <p className="text-gray-400 text-sm line-through mb-1">
                  {Math.round(roadmapPrice * 1.45)}$
                </p>
                <div className="flex items-center justify-center gap-1 font-extrabold text-heading-brown">
                  <span className="text-5xl">{roadmapPrice}</span>
                  <span className="text-2xl">$</span>
                </div>
                <p className="text-red-500 text-xs mt-2 font-medium">عرض خاص ينتهي خلال 24 ساعة!</p>
              </div>

              {/* Actions */}
              <Link to={`/checkout/payment?id=${roadmap.id}&type=track`} className="w-full bg-gradient-to-r from-heading-brown to-[#7A5520] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-heading-brown/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-3 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span>شراء المسار الكامل</span>
              </Link>

              <button className="w-full bg-white text-heading-brown border-2 border-gray-100 py-3.5 rounded-xl font-bold hover:border-gray-300 transition-colors mb-6">
                شراء الدورة الحالية فقط ($29)
              </button>

              {/* Features List */}
              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-primary text-lg">all_inclusive</span>
                  <span>وصول مدى الحياة للمحتوى</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                  <span>ضمان استرجاع الأموال 30 يوم</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-primary text-lg">devices</span>
                  <span>مشاهدة من أي جهاز</span>
                </div>
              </div>
            </div>

            {/* Optional Instructor Card below sidebar */}
            {roadmap.instructor && (
              <div className="mt-6 bg-white rounded-[1rem] p-6 border border-gray-200 shadow-sm flex items-center gap-4">
                <img
                  src={roadmap.instructor.image || `https://ui-avatars.com/api/?name=${roadmap.instructor.name}&background=random`}
                  alt={roadmap.instructor.name}
                  className="w-14 h-14 rounded-full border-2 border-primary object-cover"
                />
                <div>
                  <p className="text-xs text-gray-500 font-bold mb-0.5">مدرب المسار</p>
                  <h4 className="font-bold text-heading-brown">{roadmap.instructor.name}</h4>
                  <p className="text-xs text-gray-400">{roadmap.instructor.role}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default RoadmapDetails;
