import React from 'react';
import PathsHeader from '../components/paths/PathsHeader';
import PathCard from '../components/paths/PathCard';
import roadmaps from '../data/roadmaps.json';

const PathsPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    category: null,
    level: null,
    sort: null, // 'duration' or 'price'
    order: null // 'asc' or 'desc'
  });

  const filteredRoadmaps = React.useMemo(() => {
    let result = [...roadmaps];

    // 1. Search (Title & Description)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tag?.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Category (Tag)
    if (filters.category) {
      result = result.filter(r => r.tag === filters.category);
    }

    // 3. Filter by Level
    if (filters.level) {
      result = result.filter(r => r.level.includes(filters.level) || filters.level === r.level);
    }

    // 4. Sort
    if (filters.sort && filters.order) {
      result.sort((a, b) => {
        let valA, valB;

        if (filters.sort === 'duration') {
          // Extract number from "38 hours" or "Self-paced"
          const getHours = (str) => {
            if (str === 'Self-paced') return 999; // Treat as longest? or shortest? Assuming longest for now
            return parseInt(str) || 0;
          };
          valA = getHours(a.duration);
          valB = getHours(b.duration);
        } else if (filters.sort === 'price') {
          valA = a.price || 0;
          valB = b.price || 0;
        }

        return filters.order === 'asc' ? valA - valB : valB - valA;
      });
    }

    return result;
  }, [searchQuery, filters]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ category: null, level: null, sort: null, order: null });
  };

  return (
    <main className="pt-32 pb-20 min-h-screen bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <PathsHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          onClear={clearFilters}
        />

        <div className="roadmap-list space-y-12">
          {filteredRoadmaps.length > 0 ? (
            filteredRoadmaps.map((roadmap) => (
              <PathCard key={roadmap.id} roadmap={roadmap} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">search_off</span>
              <p className="text-xl">لا توجد مسارات تطابق بحثك</p>
              <button onClick={clearFilters} className="mt-4 text-primary font-bold hover:underline">
                مسح الفلاتر
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PathsPage;
