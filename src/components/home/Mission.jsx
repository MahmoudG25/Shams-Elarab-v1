import React from 'react';

const Mission = ({ data }) => {
  return (
    <section className="py-20 bg-background-alt relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-white border border-primary/20 flex items-center justify-center text-primary mx-auto mb-6 shadow-soft">
          <span className="material-symbols-outlined text-3xl">wb_sunny</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-heading-brown leading-tight mb-6">
          {data.title_start} <br /> <span className="text-primary">{data.title_end}</span>
        </h2>
        <p className="text-lg text-body-text/70 max-w-2xl mx-auto leading-relaxed italic">
          {data.description}
        </p>
      </div>
    </section>
  );
};

export default Mission;
