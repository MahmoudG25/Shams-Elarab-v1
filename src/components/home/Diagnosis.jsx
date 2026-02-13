import React from 'react';

const Diagnosis = ({ data }) => {
  return (
    <section className="py-16 bg-surface-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Right Side (First in RTL): Headline, CTA, Social Proof */}
          <div className="flex flex-col items-start text-right space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-heading-brown leading-tight mb-4">
                {data.list_title}
              </h2>
              <p className="text-lg text-body-text/80 leading-relaxed font-medium max-w-lg">
                مسارات واضحة تقودك من البداية حتى أول نتيجة حقيقية
              </p>
            </div>

            <div className="flex flex-col items-start gap-6">
              <button className="px-8 py-3 bg-primary hover:bg-gold-cta text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                ابدأ رحلتك الآن
              </button>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative z-10">
                      <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-body-text/80 max-w-xs leading-snug">
                  +50,000 متعلم عربي بدأوا رحلتهم معنا خلال العام الماضي
                </p>
              </div>
            </div>
          </div>

          {/* Left Side (Second in RTL): Minimal List */}
          <div className="space-y-10">
            {data.items.map((item) => (
              <div key={item.id} className="flex items-start gap-5 group">
                <span className="text-4xl font-black text-primary transition-colors duration-300 leading-none mt-1">
                  {item.id < 10 ? `0${item.id}` : item.id}
                </span>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-heading-brown">
                    {item.problem}
                  </h3>
                  <p className="text-body-text/70 text-base leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Diagnosis;
