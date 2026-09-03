import React from 'react';
import { Bookmark, Heart, Check, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectListViewProps {
  projects: Project[];
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSelectProject?: (project: Project) => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  onToggleLike,
  onToggleBookmark,
  onSelectProject,
}) => {
  return (
    <div className="space-y-2.5">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onSelectProject && onSelectProject(project)}
          className="group bg-white rounded-xl border border-[#EDEDED] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
        >
          {/* Left section: thumbnail + title + creator */}
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-[13.5px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {project.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                  {project.category}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-gray-600">
                  <span>{project.creator.name}</span>
                  {project.creator.verified && (
                    <span className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">• {project.timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Right section: budget, likes, bookmark, details */}
          <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
            <div className="text-right">
              <span className="text-[13px] font-semibold text-gray-900 block">
                {project.budget}
              </span>
              <span className="text-[10.5px] text-gray-400">Estimated budget</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(project.id);
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors flex items-center gap-1 text-xs"
              >
                <Heart
                  className={`w-4 h-4 ${
                    project.isLiked ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                <span>{project.likes}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(project.id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  project.isBookmarked
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button className="p-1.5 rounded-lg text-gray-400 group-hover:text-black hover:bg-gray-100 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
