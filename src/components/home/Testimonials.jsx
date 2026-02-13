import React from 'react';
import testimonialsData from '../../data/testimonials.json';

const Testimonials = () => {
  const data = testimonialsData;

  return (
    <section className="py-20 bg-gradient-to-br from-surface-white to-background-alt relative overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* RIGHT COLUMN: Differentiation */}
          <div className="order-1 lg:order-none">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-heading-brown mb-6 leading-tight">
                {data.title}
              </h2>
              <p className="text-xl text-body-text/80 font-medium leading-relaxed">
                {data.subtitle}
              </p>
            </div>

            <div className="space-y-8">
              {data.differentiators.map((point, index) => (
                <div key={index} className="flex gap-6 group hover:translate-x-[-8px] transition-transform duration-300">
                  {/* Gold Visual Indicator */}
                  <div className="mt-1 w-1.5 h-12 bg-gradient-to-b from-gold-cta to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>

                  <div>
                    <h3 className="text-xl font-bold text-heading-brown mb-2 group-hover:text-primary transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-body-text/80 font-medium">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* LEFT COLUMN: Social Proof */}
          <div className="order-2 lg:order-none bg-white rounded-[32px] p-6 md:p-10 shadow-xl border border-border-light relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-cta/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

            <div className="relative z-10 text-center mb-10">
              <h3 className="text-2xl font-bold text-heading-brown mb-2">{data.social_proof.title}</h3>
              <div className="flex items-center justify-center gap-4 text-gray-400 text-2xl filter grayscale opacity-60">
                <span>🇪🇬</span><span>🇸🇦</span><span>🇲🇦</span>
              </div>
            </div>

            <div className="space-y-6">
              {data.social_proof.stories.map((story, index) => (
                <div key={index} className="bg-surface-white rounded-2xl p-6 shadow-sm border border-border-light hover:shadow-md transition-shadow flex gap-4 md:gap-6 items-start">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-heading-brown">{story.name}</h4>
                      <span className="text-xs font-bold text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">{story.location}</span>
                    </div>
                    <p className="text-body-text/90 italic font-medium leading-relaxed text-sm md:text-base">
                      "{story.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button className="px-10 py-4 bg-gold-cta hover:bg-heading-brown text-white font-bold text-lg rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 w-full md:w-auto">
                {data.social_proof.cta}
              </button>
              <div className="mt-4 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className="material-symbols-outlined text-gold-cta text-xl">star</span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
