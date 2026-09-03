import React, { useRef } from 'react';
import {
  LayoutGrid,
  Code2,
  Smartphone,
  PenTool,
  Palette,
  FileText,
  TrendingUp,
  Video,
  Box,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { CategoryType } from '../types';

interface CategoryNavProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'all':
        return LayoutGrid;
      case 'web':
        return Code2;
      case 'mobile':
        return Smartphone;
      case 'uiux':
        return PenTool;
      case 'graphic':
        return Palette;
      case 'content':
        return FileText;
      case 'marketing':
        return TrendingUp;
      case 'video':
        return Video;
      case '3d':
        return Box;
      default:
        return LayoutGrid;
    }
  };

  return (
    <div className="relative mb-8 select-none group">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll categories left"
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-black hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 focus:outline-none"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-[2.125rem]"
      >
        {CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[118px] py-3.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${isSelected
                ? 'bg-white border-2 border-purple-600/90 shadow-sm'
                : 'bg-white/80 hover:bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xs'
                }`}
            >
              {/* Icon container */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105"
                style={{ backgroundColor: cat.bgColor }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: cat.color }}
                  strokeWidth={2.2}
                />
              </div>

              {/* Name */}
              <span
                className={`text-[12px] whitespace-nowrap tracking-tight transition-colors ${isSelected
                  ? 'font-bold text-purple-700'
                  : 'font-medium text-gray-700 hover:text-gray-950'
                  }`}
              >
                {cat.name}
              </span>

              {/* Active Indicator Underline */}
              {isSelected && (
                <span className="w-6 h-[2.5px] bg-purple-600 rounded-full mt-1.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll categories right"
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-black hover:scale-105 active:scale-95 transition-all opacity-90 hover:opacity-100 focus:outline-none"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
