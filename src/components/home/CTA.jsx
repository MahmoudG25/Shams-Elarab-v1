import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

const CTA = ({ data }) => {

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-black" id="cta">

      {/* 1. Background Slider */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop={true}
          speed={2500}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          className="w-full h-full"
        >
          {data.images.map((img, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <img
                src={img}
                alt={`Background ${index}`}
                className="w-full h-full object-cover opacity-60 animate-kenburns" // Added custom subtle zoom animation class if exists, or standard styling
                style={{ animation: `kenburns 20s infinite alternate` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 2. Dark Overlay Layer with Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/40 z-10"></div>
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10 pointer-events-none"></div>

      {/* 3. Centered Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
          {data.heading}
        </h2>

        <p className="text-xl md:text-3xl text-gray-200 font-medium mb-12 max-w-2xl leading-relaxed drop-shadow-md border-b-2 border-gold-cta/60 pb-8 inline-block">
          {data.subheading}
        </p>

        <button className="px-12 md:px-16 py-5 md:py-6 bg-gold-cta hover:bg-white hover:text-heading-brown text-white font-black text-xl md:text-2xl rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(236,182,19,0.6)] transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center gap-4 group">
          <span>{data.cta}</span>
          <span className="material-symbols-outlined text-3xl rtl:rotate-180 group-hover:translate-x-[-4px] transition-transform">arrow_forward</span>
        </button>

        {/* Trust / Guarantee Badge */}
        <div className="mt-12 flex items-center gap-2 text-white/50 text-sm font-bold tracking-wider uppercase">
          <span className="material-symbols-outlined text-gold-cta">verified_user</span>
          <span>ضمان استرداد الأموال لمدة 14 يومًا</span>
        </div>

      </div>

      {/* CSS for Ken Burns Effect (Inline for simplicity or could be in global CSS) */}
      <style>{`
        @keyframes kenburns {
            0% { transform: scale(1); }
            100% { transform: scale(1.15); }
        }
        .bg-radial-vignette {
            background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
        }
      `}</style>
    </section>
  );
};

export default CTA;
