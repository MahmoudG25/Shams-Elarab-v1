import React from 'react';

const Testimonials = ({ testimonials = [] }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="who-we-are">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header: Minimal & Centered */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-heading-brown mb-6 tracking-tight">
            من نحن
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            نحن لسنا مجرد منصة تعليمية، نحن مجتمع من المتعلمين الطموحين.
            <br className="hidden md:block" />
            هويتُنا يصنعها نجاحُ طلابنا، وقصصهم هي البرهان الوحيد الذي نحتاجه.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 shrink-0 bg-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                      {item.name ? item.name[0] : '?'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-heading-brown text-lg leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {item.role || 'طالب متميز'}
                  </p>
                </div>
              </div>

              {/* Quote Icon */}
              <div className="text-primary/20 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.923 14.932 15.084C15.541 14.245 16.513 13.528 17.846 12.937C17.439 13.064 16.945 13.128 16.366 13.128C15.228 13.128 14.228 12.721 13.366 11.91C12.502 11.096 12.071 10.096 12.071 8.91003C12.071 7.72403 12.49 6.71203 13.326 5.87503C14.164 5.03503 15.19 4.61503 16.406 4.61503C17.709 4.61503 18.794 5.08903 19.663 6.03703C20.533 6.98303 20.967 8.16303 20.967 9.57503C20.967 11.996 20.176 14.131 18.594 15.978C17.012 17.826 14.981 19.5 12.5 21L14.017 21ZM5 21L5 18C5 16.896 5.305 15.923 5.914 15.084C6.525 14.245 7.497 13.528 8.829 12.937C8.422 13.064 7.928 13.128 7.349 13.128C6.211 13.128 5.211 12.721 4.349 11.91C3.486 11.096 3.055 10.096 3.055 8.91003C3.055 7.72403 3.474 6.71203 4.31 5.87503C5.148 5.03503 6.173 4.61503 7.389 4.61503C8.693 4.61503 9.778 5.08903 10.647 6.03703C11.516 6.98303 11.951 8.16303 11.951 9.57503C11.951 11.996 11.16 14.131 9.577 15.978C7.995 17.826 5.964 19.5 3.483 21L5 21Z" />
                </svg>
              </div>

              {/* Content */}
              <p className="text-lg text-body-text leading-relaxed font-medium flex-grow">
                {item.content}
              </p>

              {/* Optional: Results/Impact Tag (if data allows, or static for now) */}
              {/* <div className="mt-6 pt-6 border-t border-gray-50">
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                  حصل على وظيفة
                </span>
              </div> */}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
