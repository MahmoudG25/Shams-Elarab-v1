import React from 'react';

const Footer = ({ data }) => {
  return (
    <footer className="bg-[#262118] border-t border-white/5 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md">
                <span className="material-symbols-outlined text-sm">wb_sunny</span>
              </div>
              <span className="text-xl font-bold text-white">شمس العرب</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Tracks Column */}
          <div>
            <h4 className="font-bold text-gray-100 mb-4">المسارات</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {data.links.tracks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-gray-100 mb-4">الشركة</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {data.links.company.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-gray-100 mb-4">{data.newsletter.title}</h4>
            <div className="flex gap-2">
              <input
                type="email"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-gray-200 placeholder-gray-500"
                placeholder={data.newsletter.placeholder}
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-gold-cta transition-colors shadow-md">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>{data.copyright}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {data.legal.map((item, index) => (
              <a key={index} href="#" className="hover:text-primary transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
