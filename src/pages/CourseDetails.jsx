import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaChevronLeft,
  FaStar,
  FaStarHalfAlt,
  FaPlay,
  FaLock,
  FaCheckCircle,
  FaChevronDown,
  FaShoppingBag,
  FaCartPlus,
  FaGraduationCap,
  FaClock,
  FaCertificate,
  FaPlayCircle,
  FaInfinity,
  FaMobileAlt,
  FaClipboardList,
  FaCloudDownloadAlt,
  FaLightbulb,
  FaBookOpen,
  FaArrowLeft // For RTL
} from 'react-icons/fa';
import courses from '../data/courses.json';
import roadmaps from '../data/roadmaps.json';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [expandedSectionId, setExpandedSectionId] = useState('intro'); // Default expanded, checking first section id
  const [visibleSectionsCount, setVisibleSectionsCount] = useState(5);

  const handleShowMoreSections = () => {
    setVisibleSectionsCount((prev) => prev + 5);
  };

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-heading-brown mb-4">الدورة غير موجودة</h2>
        <Link
          to="/learning-paths"
          className="bg-primary text-heading-brown px-6 py-2 rounded-lg font-bold hover:bg-gold-cta transition-colors"
        >
          تصفح الدورات الأخرى
        </Link>
      </div>
    );
  }

  // New Logic: Find all roadmaps that include this course
  const relatedRoadmaps = roadmaps.filter(r =>
    (r.modules || r.courses || []).some(c => c.courseId === course.id)
  );

  const toggleSection = (id) => {
    setExpandedSectionId(expandedSectionId === id ? null : id);
  };

  // Safe access to nested properties
  const price = course.pricing?.price ?? course.price ?? 0;
  const originalPrice = course.pricing?.original_price ?? course.original_price;
  const discount = course.pricing?.discount_percentage ?? course.discount ?? 0;
  const duration = course.meta?.duration || course.duration;
  const level = course.meta?.level || course.level;
  const certificate = course.meta?.certificate || course.certificate;
  const rating = course.meta?.rating ?? course.rating ?? 0;
  const reviewsCount = course.meta?.reviews_count ?? course.reviews_count ?? 0;
  const thumbnail = course.media?.thumbnail || course.preview_image || "https://placehold.co/600x400?text=No+Preview+Available";

  // Instructor Image Fallback
  const instructorImage = course.instructor.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(course.instructor.name) + "&background=random";

  return (
    <div className="bg-background-alt text-heading-brown transition-colors duration-300 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-yellow-600 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary transition">الرئيسية</Link>
          <FaChevronLeft className="text-xs mx-2" />
          <Link to="/learning-paths" className="hover:text-primary transition">المسارات التعليمية</Link>
          <FaChevronLeft className="text-xs mx-2" />
          <span className="font-semibold text-heading-brown">{course.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Main Content - Right Column */}
          <div className="lg:col-span-8 space-y-8">

            {/* Header Card */}
            <div className="bg-surface-white rounded-2xl p-6 md:p-8 shadow-sm border border-border-light">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <FaGraduationCap className="text-sm" />
                  مستوى {level}
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <FaClock className="text-sm" />
                  {duration} تدريبية
                </span>
                {certificate && (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <FaCertificate className="text-sm" />
                    شهادة معتمدة
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-heading-brown mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-yellow-700 text-lg mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex items-center gap-4 border-t border-border-light pt-6">
                <div className="flex items-center gap-3">
                  <img
                    alt={course.instructor.name}
                    className="h-12 w-12 rounded-full border-2 border-primary object-cover"
                    src={instructorImage}
                  />
                  <div>
                    <p className="text-xs text-yellow-600">المحاضر</p>
                    <p className="font-bold text-heading-brown">{course.instructor.name}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border-light mx-2"></div>
                <div className="flex items-center gap-1 text-primary">
                  <span className="font-bold text-lg text-heading-brown ml-1">{rating}</span>
                  <div className="flex text-sm text-yellow-500">
                    {[...Array(4)].map((_, i) => <FaStar key={i} />)}
                    <FaStarHalfAlt />
                  </div>
                  <span className="text-xs text-yellow-600 mr-2">({reviewsCount.toLocaleString()} تقييم)</span>
                </div>
              </div>
            </div>

            {/* Preview Image/Video */}
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg group cursor-pointer bg-black">
              <img
                alt={course.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition duration-300"
                src={thumbnail}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 text-white rounded-full p-4 shadow-xl transform group-hover:scale-110 transition duration-300 backdrop-blur-sm">
                  <span className="material-icons text-4xl"><FaPlay size={24} className="mr-1" /></span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-md">
                مشاهدة المقدمة
              </div>
            </div>

            {/* What you'll learn */}
            <div className="bg-surface-white rounded-2xl p-6 md:p-8 shadow-sm border border-border-light">
              <h2 className="text-2xl font-bold text-heading-brown mb-6 flex items-center gap-2">
                <FaLightbulb className="text-primary" />
                ماذا ستتعلم في هذه الدورة؟
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {(course.learning_points || []).map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 text-sm min-w-[16px]" />
                    <span className="text-yellow-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content Accordion */}
            <div className="bg-surface-white rounded-2xl p-6 md:p-8 shadow-sm border border-border-light">
              <div className="flex flex-wrap justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-heading-brown flex items-center gap-2">
                  <FaBookOpen className="text-primary" />
                  محتوى الدورة
                </h2>
                <div className="text-sm text-yellow-600">
                  <span>{(course.sections || []).length} أقسام</span> • <span>{(course.sections || []).reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0)} درس</span> • <span>{duration}</span>
                </div>
              </div>

              <div className="space-y-4">
                {(course.sections || []).slice(0, visibleSectionsCount).map((section) => (
                  <div key={section.id} className={`border ${expandedSectionId === section.id ? 'border-primary/30' : 'border-border-light'} rounded-xl overflow-hidden bg-background-alt`}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex justify-between items-center p-4 transition text-right ${expandedSectionId === section.id ? 'bg-primary/5 hover:bg-primary/10' : 'bg-surface-white hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <FaChevronDown className={`text-heading-brown transform transition-transform duration-300 ${expandedSectionId === section.id ? 'rotate-180' : ''}`} />
                        <span className="font-bold text-lg text-heading-brown">{section.title}</span>
                      </div>
                      <span className="text-sm text-yellow-600">{section.lessons ? section.lessons.length : 0} دروس • {section.duration}</span>
                    </button>

                    {expandedSectionId === section.id && (
                      <div className="p-4 space-y-3 bg-surface-white border-t border-primary/10 animate-fade-in">
                        {section.lessons && section.lessons.map((lesson, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-border-light last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 text-heading-brown">
                              {lesson.free_preview ? (
                                <FaPlayCircle className="text-primary text-sm" />
                              ) : (
                                <FaLock className="text-gray-400 text-sm" />
                              )}
                              <span className={`text-sm ${lesson.free_preview ? 'hover:underline cursor-pointer' : 'text-gray-500'}`}>
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.free_preview && (
                                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">معاينة مجانية</span>
                              )}
                              <span className="text-xs text-gray-400">{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}


              </div>

              {visibleSectionsCount < (course.sections || []).length && (
                <button
                  onClick={handleShowMoreSections}
                  className="w-full mt-6 py-3 border border-border-light text-heading-brown font-bold rounded-xl hover:bg-background-alt transition"
                >
                  عرض باقي الأقسام ({Math.max(0, (course.sections || []).length - visibleSectionsCount)} متبقي)
                </button>
              )}
            </div>

          </div>

          {/* Sidebar - Left Column */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">

              {/* Pricing Card */}
              <div className="bg-surface-white rounded-2xl shadow-lg border border-border-light p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-primary to-yellow-600"></div>
                <div className="flex items-end gap-2 mb-6">
                  {price === 0 ? (
                    <span className="text-4xl font-extrabold text-green-600">مجاناً</span>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold text-heading-brown">{price} ر.س</span>
                      <span className="text-lg text-gray-400 line-through mb-1">{originalPrice} ر.س</span>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded mb-2 mr-auto">خصم {discount}%</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-red-500 text-sm mb-6 font-medium animate-pulse">
                  <FaClock className="text-sm" />
                  <span>ينتهي العرض خلال 12 ساعة</span>
                </div>

                <div className="space-y-3 mb-6">
                  <Link to={`/checkout/payment?id=${course.id}&type=course`} className="w-full bg-primary hover:bg-gold-cta text-heading-brown font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transform transition active:scale-95 flex justify-center items-center gap-2">
                    <FaShoppingBag />
                    اشترِ الآن
                  </Link>
                  <button className="w-full bg-transparent border-2 border-heading-brown text-heading-brown hover:bg-background-alt font-bold py-3 rounded-xl transition flex justify-center items-center gap-2">
                    <FaCartPlus />
                    أضف للسلة
                  </button>
                </div>

                <div className="text-center text-xs text-gray-400 mb-6">
                  ضمان استرداد الأموال لمدة 30 يومًا
                </div>

                <div className="border-t border-border-light pt-4 space-y-3">
                  <h3 className="font-bold text-heading-brown mb-2">تشمل هذه الدورة:</h3>
                  {[
                    { icon: FaInfinity, text: "وصول مدى الحياة" },
                    { icon: FaMobileAlt, text: "دخول من الجوال والحاسوب" },
                    { icon: FaClipboardList, text: "واجبات وتطبيقات عملية" },
                    { icon: FaCloudDownloadAlt, text: "موارد قابلة للتحميل" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-yellow-700">
                      <item.icon className="text-primary text-base" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Roadmaps Sections */}
              {relatedRoadmaps.map((roadmap) => {
                const rPrice = roadmap.pricing?.price || roadmap.price;
                const rDuration = roadmap.meta?.duration || roadmap.duration;

                return (
                  <div key={roadmap.id} className="bg-gradient-to-br from-heading-brown to-gray-900 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden group">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-black/10 rounded-full blur-xl"></div>

                    <div className="relative z-10">
                      <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold mb-4 backdrop-blur-sm border border-white/10">
                        مسار تعليمي متكامل
                      </div>
                      <h3 className="text-xl font-bold mb-2">هذه الدورة جزء من مسار:</h3>
                      <p className="text-2xl font-extrabold text-primary mb-4">{roadmap.title}</p>

                      <div className="flex items-center justify-between mb-4 bg-black/20 p-3 rounded-lg">
                        <span className="text-sm text-gray-300">قيمة المسار ({rDuration}):</span>
                        <div>
                          <span className="text-lg font-bold">{rPrice} ر.س</span>
                        </div>
                      </div>

                      <Link
                        to={`/roadmaps/${roadmap.id}`}
                        className="w-full bg-white text-heading-brown font-bold py-3 rounded-xl hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>عرض تفاصيل المسار</span>
                        <FaArrowLeft className="text-sm" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Instructor Mini Profile */}
              <div className="bg-surface-white rounded-2xl p-6 border border-border-light text-center">
                <img
                  alt={course.instructor.name}
                  className="h-20 w-20 rounded-full border-4 border-background-alt shadow-md object-cover mx-auto mb-3 -mt-10 bg-white"
                  src={instructorImage}
                />
                <h4 className="font-bold text-lg text-heading-brown">{course.instructor.name}</h4>
                <p className="text-sm text-yellow-600 mb-4">{course.instructor.title}</p>
                <p className="text-sm text-yellow-700 mb-4 line-clamp-3">
                  {course.instructor.bio}
                </p>
                <button className="text-primary font-bold text-sm hover:underline">عرض الملف الشخصي</button>
              </div>

            </div>
          </div>

        </div>
      </main >
    </div >
  );
};

export default CourseDetails;
