import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
const Tracks = ({ data }) => {
  const tabs = data?.tabs || [];
  const items = data?.items || [];
  const [activeTab, setActiveTab] = useState(tabs[0] || 'All');
  const swiperRef = useRef(null);

  // Filter items based on active tab
  const filteredItems = activeTab === (tabs[0] || 'All')
    ? items
    : items.filter(item => item.category === activeTab);

  // Ensure we have enough slides for loop if filtration results in too few
  // Swiper loop needs at least slidesPerView * 2 usually for best results.
  // We won't duplicate manual data, but we'll conditionally disable loop if items are few.
  const enableLoop = filteredItems.length >= 3;

  return (
    <section className="py-24 bg-surface-white relative border-b border-border-light w-full overflow-hidden" id="tracks">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">

        {/* 1. Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-heading-brown mb-6">
            {data.title}
          </h2>
          <p className="text-xl text-body-text/70 font-medium max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* 2. Goal Tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scroll px-4 md:px-0 w-full md:w-auto md:justify-center">
            {data.tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={`
                            shrink-0 px-8 py-3 rounded-full text-base font-bold transition-all duration-300
                            ${activeTab === tab
                    ? 'bg-primary text-white shadow-lg transform scale-105'
                    : 'bg-background-alt text-heading-brown/70 hover:bg-border-light hover:text-heading-brown border border-transparent'
                  }
                        `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Slider Container */}
        {/* Overflow handling: Swiper needs to be visible outside its container for the 'partial' effect if we want it,
            but user asked for "No horizontal clipping" and "Inner Container".
            We'll use a wrapper that allows visible overflow relative to the slides. */}
        <div className="relative mb-1">

          <Swiper
            modules={[Navigation, Autoplay]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            dir="rtl"
            centeredSlides={true}
            loop={enableLoop}
            watchSlidesProgress={true}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            speed={800}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            grabCursor={true}
            className="!py-12 !overflow-visible tracks-swiper" // Padding y allows shadow/scale without crop
            key={`${activeTab}-${filteredItems.length}`} // Force remount on tab change
          >
            {filteredItems.map((item, index) => (
              <SwiperSlide key={`${item.id}-${index}`} className="h-auto">
                <div className="
                            relative h-[380px] w-full rounded-[24px] overflow-hidden 
                            shadow-xl transition-all duration-700 ease-out 
                            cursor-pointer border border-transparent group bg-white
                            transform
                            /* Active State Styling via Swiper Class selectors in parent or generic CSS logic */
                            opacity-60 scale-95 grayscale-[30%]
                            [.swiper-slide-active_&]:opacity-100 [.swiper-slide-active_&]:scale-105 [.swiper-slide-active_&]:grayscale-0 [.swiper-slide-active_&]:shadow-2xl [.swiper-slide-active_&]:border-primary/20
                            hover:opacity-100 hover:grayscale-0
                        ">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={item.image || `https://source.unsplash.com/random/800x600?tech,${item.id}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 [.swiper-slide-active_&]:scale-100 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute top-0 bottom-0 left-0 right-0 p-8 flex flex-col justify-end">
                    {/* Tag */}
                    {item.tag && (
                      <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        {item.tag}
                      </div>
                    )}

                    <div className="transform translate-y-4 transition-transform duration-500 [.swiper-slide-active_&]:translate-y-0 group-hover:translate-y-0">
                      <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                        {item.title}
                      </h3>

                      {/* Transformation Result */}
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-200 text-sm font-bold opacity-90">{item.from}</span>
                        <div className="flex items-center gap-3 mt-1">
                          {/* <span className="material-symbols-outlined text-gold-cta text-2xl rtl:rotate-180 animate-pulse">arrow_right_alt</span> */}
                          <span className="text-gold-cta font-black text-xl bg-black/30 px-4 py-1.5 rounded-xl border border-gold-cta/30 backdrop-blur-md">
                            {item.to}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-20 w-full text-gray-500 text-xl font-medium col-span-full h-[300px] flex items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                لا توجد مسارات متاحة في هذا التصنيف حالياً.
              </div>
            )}
          </Swiper>
        </div>

        {/* 4. Navigation & CTA Row */}
        <div className="flex items-center justify-center gap-8 md:gap-12 relative z-20">

          {/* Visual LEFT Button -> Previous Slide (Movies items RIGHT) */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-heading-brown hover:text-primary hover:scale-110 transition-all duration-300 hover:shadow-xl border border-gray-100 group"
            aria-label="Previous"
          >
            <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform rtl:rotate-180">arrow_forward</span>
          </button>

          {/* Central CTA */}
          <button className="px-14 py-5 bg-gold-cta hover:bg-heading-brown text-white font-black text-xl rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 min-w-[240px] flex items-center justify-center gap-3">
            <span>{data.cta_text || "اختر مسارك الآن"}</span>
            {/* <span className="material-symbols-outlined text-2xl rtl:rotate-180">arrow_forward</span> */}
          </button>

          {/* Visual RIGHT Button -> Next Slide (Moves items LEFT) 
                Wait, if I am in center, and I want next slide (to the left) to come to center,
                the track moves RIGHT. 
                So Next = Move Right.
                Wait. RTL Logic:
                [2] [1] [0] 
                Active is [1].
                slideNext() makes [2] active.
                [2] moves to center. The whole track shifts RIGHT visually.
                So Right Button -> Next Slide -> Track visual shift Right.
            */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-heading-brown hover:text-primary hover:scale-110 transition-all duration-300 hover:shadow-xl border border-gray-100 group"
            aria-label="Next"
          >
            <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform rtl:rotate-180">arrow_back</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Tracks;
