import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

const Partners = ({ data }) => {
  return (
    <section className="w-full bg-surface-white border-y border-border-light py-10 overflow-hidden relative" aria-label="Trusted By">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">{data.title}</h2>
      </div>

      {/* Fade Gradient Masks */}
      <div className="absolute top-0 left-0 h-full w-24 md:w-32 bg-gradient-to-r from-surface-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 h-full w-24 md:w-32 bg-gradient-to-l from-surface-white to-transparent z-10 pointer-events-none"></div>

      {/* Swiper Container */}
      <div className="w-full" dir="ltr">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView="auto"
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // Pauses on hover
          }}
          allowTouchMove={true} // Enable touch for mobile
          className="partners-swiper"
        >
          {/* We render the logos multiple times to ensure the loop has enough content 
              to fill the screen and transition smoothly. 
              3x duplication is usually safe for any screen size.
          */}
          {[...data.logos, ...data.logos, ...data.logos].map((logo, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <div
                className="flex items-center justify-center shrink-0 mx-8 md:mx-16 w-32 md:w-44 transition-all duration-300 transform hover:scale-105 hover:brightness-110 h-20"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="w-full h-full object-contain max-h-12 md:max-h-14 drop-shadow-sm"
                  draggable="false"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Partners;
