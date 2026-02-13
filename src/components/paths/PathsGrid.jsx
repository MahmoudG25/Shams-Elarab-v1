import React from 'react';
import { Link } from 'react-router-dom';
import roadmaps from '../../data/roadmaps.json';

const PathsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {roadmaps.map((roadmap) => {
        // Safe accessors for new/old schema compatibility
        const price = roadmap.pricing?.price || roadmap.price;
        const discount = roadmap.pricing?.discount_percentage || roadmap.discount;
        const duration = roadmap.meta?.duration || roadmap.duration;
        const level = roadmap.meta?.level || roadmap.level;
        const unitsCount = roadmap.meta?.courses_count || (roadmap.courses ? roadmap.courses.length : roadmap.units_count) || 0;
        const image = roadmap.media?.thumbnail || roadmap.image;

        return (
          <div key={roadmap.id} className="bg-white rounded-card border border-border-light shadow-soft hover:shadow-hover hover:border-primary/30 transition-all duration-300 group flex flex-col h-full">
            <div className="relative h-48 overflow-hidden rounded-t-card">
              <img
                alt={roadmap.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={image}
              />
              {roadmap.tag && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm text-heading-brown border border-border-light">
                  {roadmap.tag}
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-heading-brown/90 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-sm">
                {level}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-heading-brown mb-2 group-hover:text-primary transition-colors">
                {roadmap.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {roadmap.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 font-medium">
                <span className="flex items-center gap-1 bg-background-alt px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-base">schedule</span> {duration}
                </span>
                <span className="flex items-center gap-1 bg-background-alt px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-base">layers</span> {unitsCount} دورات
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-heading-brown">
                    {price}$
                  </span>
                  {discount > 0 && (
                    <span className="text-xs text-gray-400 line-through mr-1">
                      {Math.round(price / (1 - discount / 100))}$
                    </span>
                  )}
                </div>
                <Link
                  to={`/roadmaps/${roadmap.id}`}
                  className="bg-gold-cta text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary transition-colors"
                >
                  عرض المسار
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PathsGrid;
