import React, { useState, useEffect } from 'react';

const CTA = ({ data }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use data images or fallback
  const images = (data?.images && data.images.length > 0)
    ? data.images
    : [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop'
    ];

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">

      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        {/* Overlay - restored but lighter if needed, or user can remove. 
             User commented out overlays in previous step, so I'll keep it minimal or remove if they want pure images, 
             but text needs contrast. I will add a subtle gradient. */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
        {/* Content */}
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
          {data?.title || "هل أنت مستعد لتغيير مستقبلك؟"}
        </h2>
        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
          {data?.subtitle || "ابدأ رحلتك التعليمية الآن وانضم إلى آلاف المتعلمين الناجحين."}
        </p>

        <button className="px-12 py-5 bg-primary hover:bg-gold-cta text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-primary/50 transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95 duration-300">
          {data?.buttonText || "اشترك الآن"}
        </button>
      </div>
    </section>
  );
};

export default CTA;
