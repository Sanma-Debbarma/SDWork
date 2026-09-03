import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface FeaturedSectionProps {
  projects: Project[];
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSelectProject?: (project: Project) => void;
  onViewAll?: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  projects,
  onToggleLike,
  onToggleBookmark,
  onSelectProject,
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[19px] font-bold text-[#0F0F0F] tracking-tight">
          Featured Projects
        </h2>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-gray-700 hover:text-black px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              View all
            </button>
          )}

          {/* Navigation Prev/Next Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous featured projects"
              className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 hover:text-black transition-colors shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next featured projects"
              className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 hover:text-black transition-colors shadow-xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid / Carousel */}
      <div
        ref={scrollRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pb-1"
      >
        {projects.map((project) => (
          <div key={project.id} className="min-w-[210px] lg:min-w-0">
            <ProjectCard
              project={project}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              onSelectProject={onSelectProject}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
