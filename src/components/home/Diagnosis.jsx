import React from 'react';

const Diagnosis = ({ data }) => {
  if (!data || !data.items) return null;

  return (
    <section className="py-24 bg-surface-white relative overflow-hidden" id="diagnosis">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gold-cta/5 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Right Side (Sticky): Stable, Trustworthy (1/3 width -> col-span-4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 order-1">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-background-alt border border-border-light rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider">
                <span className="w-5 h-3 rounded-full bg-primary animate-pulse"></span>
                لماذا نحن؟
              </div>

              {/* Headings */}
              <div>
                <h2 className="text-3xl md:text-[50px] font-black text-heading-brown leading-[1.2] mb-6">
                  {data.list_title || 'من التشتت إلى الوضوح'}
                </h2>
                <p className="text-lg text-body-text/80 leading-relaxed font-medium">
                  نحن لا نعطيك مجرد دورات، بل نعطيك <span className="text-primary font-bold">خارطة طريق</span> واضحة تأخذ بيدك من نقطة الصفر وحتى الاحتراف والوظيفة.
                </p>
              </div>

              {/* CTA & Social Proof */}
              <div className="pt-4 space-y-6">


                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <div className="flex -space-x-3 rtl:space-x-reverse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative z-10">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-heading-brown">انضم لأكثر من 10,000 طالب</p>
                    <div className="flex text-gold-cta text-xs">
                      {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Side (List): Structured, Progressive (2/3 width -> col-span-8) */}
          <div className="lg:col-span-8 order-2 space-y-10 relative">

            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-8 bottom-8 right-[27px] w-px bg-gray-200 -z-10"></div>

            {data.items.map((item, index) => (
              <div
                key={item.id || index}
                className="relative flex gap-6 md:gap-8 p-6 rounded-xl bg-white"
              >
                {/* Number */}
                <div className="shrink-0 relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold bg-gray-50 border border-gray-200 text-primary">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">

                  {/* Question */}
                  <h3 className="text-xl md:text-2xl font-bold text-heading-brown">
                    {item.problem || item.title}
                  </h3>

                  {/* Short Solution */}
                  <p className="text-primary font-semibold text-base">
                    الحل: {item.solution_short || 'الوضوح الكامل'}
                  </p>

                  {/* Detailed Description */}
                  <p className="text-lg text-body-text/70 leading-relaxed">
                    {item.solution || item.description}
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
