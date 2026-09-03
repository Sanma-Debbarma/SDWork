import React from 'react';
import { Bookmark, LayoutGrid, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from '../ProjectCard';

interface SavedProjectsViewProps {
  savedProjects: Project[];
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSelectProject: (project: Project) => void;
  onBrowseProjects: () => void;
}

export const SavedProjectsView: React.FC<SavedProjectsViewProps> = ({
  savedProjects,
  onToggleLike,
  onToggleBookmark,
  onSelectProject,
  onBrowseProjects,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-purple-600 fill-purple-600" />
            <span>Saved Projects & Services</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {savedProjects.length} {savedProjects.length === 1 ? 'project' : 'projects'} bookmarked for later review
          </p>
        </div>

        {savedProjects.length > 0 && (
          <button
            onClick={onBrowseProjects}
            className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
          >
            <span>Browse More Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      {savedProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3.5 shadow-xs">
            <Bookmark className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            No saved projects yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
            Click the bookmark icon on any project card in the dashboard or search results to save interesting opportunities here.
          </p>
          <button
            onClick={onBrowseProjects}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-950 hover:bg-black text-white text-xs font-semibold rounded-xl transition shadow-xs active:scale-95"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Explore Dashboard Projects</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {savedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};
