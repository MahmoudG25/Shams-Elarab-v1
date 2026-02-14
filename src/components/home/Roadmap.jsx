import React from 'react';

const Roadmap = ({ data }) => {
  const steps = data.steps;
  const finalStep = steps[steps.length - 1];
  const timelineSteps = steps.slice(0, steps.length - 1); // All except last

  return (
    <section className="py-24 bg-[#FDFBF7] relative overflow-hidden" id="roadmap">
      {/* Background Texture - Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#8B7355 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">

        {/* 1. Header */}
        <div className="text-center mb-20">
          <span className="text-gold-cta font-bold tracking-widest uppercase text-sm mb-4 block">رحلة الوصول</span>
          <h2 className="text-4xl md:text-5xl font-black text-heading-brown mb-6 leading-tight">
            {data.title}
          </h2>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* 2. Vertical Timeline Container */}
        <div className="relative mb-24">

          {/* Central Vertical Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 h-[calc(100%-80px)] w-0.5 bg-gray-200"></div>

          {/* Mobile Vertical Line (Right Side) */}
          <div className="md:hidden absolute right-8 top-0 h-full w-0.5 bg-gray-200"></div>

          <div className="space-y-12 md:space-y-24">
            {timelineSteps.map((step, index) => {
              const isEven = index % 2 !== 0;

              return (
                <div key={step.id} className={`flex w-full relative md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>

                  {/* Date Badge (Mobile Only - sits on line) */}
                  <div className="md:hidden absolute right-[-4px] top-0 z-20">
                    <div className="w-4 h-4 rounded-full bg-gold-cta border-2 border-white shadow-sm"></div>
                  </div>

                  {/* Card Column (Desktop: 50% width) */}
                  <div className="w-full md:w-1/2 pr-16 md:pr-0 md:pl-16 relative">

                    {/* Connector Line (Desktop) */}
                    <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 items-center 
                                    ${isEven ? '-right-8 justify-end' : '-left-8 justify-start'} 
                                    w-8`}>
                      <div className="h-[1px] w-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>


                    <div className={`
                                    bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative
                                `}>

                      {/* Step Number Badge */}
                      <div className="absolute -top-5 right-8 bg-heading-brown text-gold-cta font-bold text-lg w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-white transform rotate-3 group-hover:rotate-0 transition-transform">
                        {step.id}
                      </div>

                      <div className="mt-4">
                        <span className="text-gold-cta text-sm font-bold tracking-wider uppercase mb-2 block">{step.month}</span>
                        <h3 className="text-2xl font-bold text-heading-brown mb-3 leading-snug group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center Node Column (Desktop Only - Logic replaced by simple connector above) */}
                  {/* We use a simple layout where the line is continuous and nodes are just decoration on the line if needed, 
                      or we can keep the central nodes. Let's keep central nodes for structure. */}

                  <div className={`
                                hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 
                                w-10 h-10 bg-white border-2 border-gold-cta rounded-full z-20
                                items-center justify-center shadow-md
                            `}>
                    <div className="w-3 h-3 bg-gold-cta rounded-full"></div>
                  </div>


                  {/* Empty Balancer Column */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Final Milestone (Destinaton) */}
        <div className="max-w-4xl mx-auto relative z-20 mt-12 text-center">

          {/* Connector */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-12 h-12 w-0.5 bg-gray-200 hidden md:block"></div>

          <div className="bg-gradient-to-br from-heading-brown to-[#2A2A2A] rounded-[40px] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-cta/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-gold-cta rounded-2xl flex items-center justify-center shadow-lg shadow-gold-cta/30 mb-8 transform rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <span className="material-symbols-outlined text-heading-brown text-4xl">flag</span>
              </div>

              <span className="bg-white/10 text-gold-cta px-4 py-1 rounded-full text-sm font-bold mb-6 border border-white/5">
                الهدف النهائي
              </span>

              <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                {finalStep.title}
              </h3>

              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                {finalStep.description}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {['حرية مالية', 'مهارة عالية', 'دخل مستقل'].map((tag, i) => (
                  <span key={i} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg text-sm border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-cta"></span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* 4. CTA */}
        <div className="text-center mt-20">
          <button className="px-12 py-5 bg-gold-cta hover:bg-primary text-white font-bold text-xl rounded-full shadow-xl shadow-gold-cta/20 hover:shadow-2xl transition-all transform hover:-translate-y-1 mb-6 flex items-center gap-3 mx-auto group">
            <span>{data.cta}</span>
            <span className="material-symbols-outlined group-hover:translate-x-[-4px] transition-transform rtl:rotate-180">arrow_right_alt</span>
          </button>
          <p className="text-gray-400 font-medium text-sm">
            {data.cta_sub}
          </p>
        </div>

      </div>
    </section>
  );
};

export default Roadmap;
