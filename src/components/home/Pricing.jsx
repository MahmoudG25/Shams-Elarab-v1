import React from 'react';
const Pricing = ({ data }) => {
  const plans = data?.plans || [];

  if (!plans.length) return null;

  return (
    <section className="py-24 bg-surface-white relative overflow-hidden" id="pricing">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* 1. Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-heading-brown mb-6 leading-tight">
            {data?.title || 'خطط الأسعار'}
            <span className="block w-24 h-1.5 bg-gold-cta mx-auto mt-4 rounded-full shadow-sm"></span>
          </h2>
          <p className="text-xl text-body-text/80 font-medium max-w-2xl mx-auto">
            {data?.subtitle}
          </p>
        </div>

        {/* 2. Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-20">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative rounded-[24px] overflow-hidden group transition-all duration-500
                ${plan.highlight
                  ? 'lg:-mt-6 lg:mb-6 shadow-2xl scale-105 border-2 border-gold-cta z-10 h-[580px]'
                  : 'shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-transparent h-[520px]'
                }
              `}
            >
              {/* Background Image & Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${plan.highlight ? 'from-heading-brown/95 via-heading-brown/80' : 'from-black/90 via-black/70'} to-transparent opacity-90`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-8 text-white">

                {/* Top Badge */}
                <div className="flex justify-between items-start mb-8">
                  <span className={`
                    text-sm font-bold px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md
                    ${plan.highlight ? 'bg-gold-cta text-white' : 'bg-white/10 text-gray-200'}
                  `}>
                    {plan.badge}
                  </span>
                  {plan.highlight && (
                    <span className="material-symbols-outlined text-gold-cta text-3xl animate-pulse">verified</span>
                  )}
                </div>

                {/* Title & Price */}
                <div className="mb-8">
                  <h3 className="text-4xl font-black mb-2">{plan.title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-gold-cta">{plan.price}</span>
                    <span className="text-lg text-gray-300 font-medium">{plan.period}</span>
                  </div>
                </div>

                {/* Subtitle & Desc */}
                <div className="mb-8 border-b border-white/10 pb2">
                  <p className="text-xl font-bold mb-2">{plan.subtitle}</p>
                  <p className="text-sm text-gray-300/90">{plan.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4">
                  {(plan.features || []).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-xl ${plan.highlight ? 'text-gold-cta' : 'text-gray-400'}`}>check_circle</span>
                      <span className="font-medium text-gray-100">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Card CTA */}
                <button className={`
                  w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 mt-auto
                  ${plan.highlight
                    ? 'bg-gold-cta text-white hover:bg-white hover:text-heading-brown hover:shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white hover:text-heading-brown border border-white/20'
                  }
                `}>
                  اختر الخطة
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Bottom CTA & Trust */}
        <div className="text-center">
          <button className="px-12 py-5 bg-gold-cta hover:bg-heading-brown text-white font-bold text-xl rounded-full shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 mb-4 flex items-center gap-3 mx-auto group">
            <span>{data?.cta || 'اشترك الآن'}</span>
            <span className="material-symbols-outlined text-white group-hover:translate-x-[-4px] transition-transform rtl:rotate-180">arrow_right_alt</span>
          </button>
          <p className="text-gray-500 font-medium text-sm">
            {data?.cta_sub}
          </p>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
