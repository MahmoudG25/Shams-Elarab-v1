import React from 'react';
const Roadmap = ({ data }) => {
  const steps = data.steps;
  const finalStep = steps[steps.length - 1];
  const timelineSteps = steps.slice(0, steps.length - 1); // All except last

  return (
    <section className="py-24 bg-heading-brown relative overflow-hidden" id="roadmap">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">

        {/* 1. Header */}
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            {data.title}
          </h2>
          <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* 2. Vertical Timeline Container */}
        <div className="relative mb-24">

          {/* Central Vertical Line (Desktop - Centered) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-white/10 via-white/20 to-white/10"></div>

          {/* Mobile Vertical Line (Right Side - RTL) */}
          <div className="md:hidden absolute right-6 top-0 h-full w-0.5 bg-gradient-to-b from-white/10 via-white/20 to-white/10"></div>

          <div className="space-y-16">
            {timelineSteps.map((step, index) => {
              const isEven = index % 2 !== 0;

              return (
                <div key={step.id} className={`flex w-full relative md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>

                  {/* Card Column (Desktop: 50% width) */}
                  <div className="w-full md:w-1/2 pr-16 md:pr-0 md:pl-16 relative">
                    {/* Connector Line (Desktop) */}
                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-0.5 bg-white/20 w-16 
                                    ${isEven ? '-right-0' : '-left-0'} 
                                `}></div>

                    {/* Connector Line (Mobile) */}
                    <div className="md:hidden absolute top-8 right-6 w-10 h-0.5 bg-white/20"></div>

                    <div className={`
                                    bg-white/5 backdrop-blur-sm rounded-[24px] p-8 border border-white/10 
                                    hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group
                                    relative z-10 text-right
                                `}>
                      {/* Month Badge */}
                      <div className="inline-block bg-gold-cta/20 text-gold-cta text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-gold-cta/30">
                        {step.month}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                        {step.title}
                      </h3>

                      <p className="text-gray-300 font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Column */}
                  <div className={`
                                absolute flex items-center justify-center 
                                md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 
                                right-0 top-0 
                                w-12 md:w-auto z-20
                            `}>
                    <div className="
                                    w-12 h-12 md:w-16 md:h-16 
                                    bg-heading-brown rounded-full border-[3px] border-gold-cta 
                                    flex items-center justify-center 
                                    shadow-lg shadow-black/20 transform transition-transform duration-500 hover:scale-110
                                    relative
                                ">
                      <span className="text-white font-black text-lg md:text-xl">{step.id}</span>
                    </div>
                  </div>

                  {/* Empty Balancer Column */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Final Milestone (Centered) */}
        <div className="max-w-3xl mx-auto relative z-20 mt-24 text-center">
          {/* Connector Line to Top */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-24 h-24 w-0.5 bg-gradient-to-b from-white/10 to-gold-cta hidden md:block"></div>

          <div className="bg-gradient-to-b from-gold-cta/10 to-transparent rounded-[32px] p-10 shadow-2xl border border-gold-cta/30 hover:border-gold-cta transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden group">

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-gold-cta/20 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Gold Node Centered Top */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gold-cta rounded-full flex items-center justify-center shadow-lg border-4 border-heading-brown z-10">
              <span className="text-white font-black text-3xl">{finalStep.id}</span>
            </div>

            <div className="mt-8 mb-6">
              <div className="inline-block bg-gold-cta text-heading-brown text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                النتيجة النهائية
              </div>
            </div>

            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              {finalStep.title}
            </h3>

            <p className="text-xl text-gray-200 font-medium mb-8">
              {finalStep.description}
            </p>

            <div className="inline-flex flex-col items-center gap-4">
              <span className="text-sm text-gold-cta/80 font-bold tracking-wide uppercase">مبروك! وصلت للهدف</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className="material-symbols-outlined text-gold-cta text-3xl drop-shadow-lg animate-pulse">star</span>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* 4. CTA */}
        <div className="text-center mt-24">
          <button className="px-14 py-5 bg-gold-cta hover:bg-white hover:text-heading-brown text-white font-bold text-xl rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 mb-6 flex items-center gap-3 mx-auto group">
            <span>{data.cta}</span>
            <span className="material-symbols-outlined group-hover:translate-x-[-4px] transition-transform rtl:rotate-180">arrow_right_alt</span>
          </button>
          <p className="text-gray-400 font-medium text-sm opacity-80">
            {data.cta_sub}
          </p>
        </div>

      </div>
    </section>
  );
};

export default Roadmap;
