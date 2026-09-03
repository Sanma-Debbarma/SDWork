import { Bookmark, Heart, Check } from 'lucide-react';
import { Project } from '../types';
import { CardVisual } from './CardVisual';

interface ProjectCardProps {
  project: Project;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSelectProject?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onToggleLike,
  onToggleBookmark,
  onSelectProject,
}) => {
  // Pastel gradient themes
  const themeGradients = {
    purple: 'from-[#F5F0FF] via-[#EFE8FE] to-[#E6DBFC]',
    peach: 'from-[#FFF4ED] via-[#FEEADF] to-[#FDDBCB]',
    mint: 'from-[#EFFBF4] via-[#E2F7EB] to-[#D0F2DF]',
    blue: 'from-[#F0F6FF] via-[#E4EFFF] to-[#D5E6FE]',
    yellow: 'from-[#FFFBF0] via-[#FEF5DC] to-[#FDEBBF]',
  };

  // Badge styles based on category/theme
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'Web Development':
        return project.theme === 'purple'
          ? 'bg-[#EFEAFF] text-[#6941C6]'
          : 'bg-[#E3F8EC] text-[#0E9F6E]';
      case 'UI/UX Design':
        return 'bg-[#FEEAE1] text-[#E04F16]';
      case 'Graphic Design':
        return 'bg-[#E4EFFF] text-[#1D4ED8]';
      case 'Content Writing':
        return 'bg-[#FEF2DC] text-[#B54708]';
      case 'Digital Marketing':
        return 'bg-[#E3F8EC] text-[#0E9F6E]';
      case 'Video & Animation':
        return 'bg-[#EFEAFF] text-[#6941C6]';
      case '3D & Modeling':
        return 'bg-[#E4EFFF] text-[#1D4ED8]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      onClick={() => onSelectProject && onSelectProject(project)}
      className="group bg-white rounded-2xl border border-[#EDEDED] overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover hover:border-gray-300/80"
    >
      <div>
        {/* Visual Top Preview */}
        <div
          className={`relative h-[155px] bg-gradient-to-br ${
            themeGradients[project.theme]
          } p-3 flex items-center justify-center overflow-hidden`}
        >
          {/* Top-left Floating Badge/Icon */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {project.topIconType === 'star' && (
              <div className="w-6 h-6 rounded-md bg-purple-500/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
                <span className="text-purple-700 text-xs">✦</span>
              </div>
            )}
            {project.topIconType === 'sphere' && (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-xs ring-2 ring-white/50" />
            )}
            {project.topIconType === 'cube' && (
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-emerald-600 rounded-xs" />
              </div>
            )}
            {project.topIconType === 'ribbon' && (
              <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-600 text-xs">◈</span>
              </div>
            )}
            {project.topIconType === 'shield' && (
              <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-600 text-xs font-bold">🛡</span>
              </div>
            )}
            {project.topIconType === 'nodes' && (
              <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-600 text-xs">☊</span>
              </div>
            )}
            {project.topIconType === 'react' && (
              <div className="w-5 h-5 rounded-md bg-sky-500/20 flex items-center justify-center">
                <span className="text-sky-600 text-xs font-bold">⚛</span>
              </div>
            )}
            {project.topIconType === 'crystal' && (
              <div className="w-5 h-5 rounded-full bg-red-400/30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              </div>
            )}
            {project.topIconType === 'social' && (
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-700 text-[10px] font-bold">▦</span>
              </div>
            )}
            {project.topIconType === 'video' && (
              <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-600 text-xs">▶</span>
              </div>
            )}
          </div>

          {/* Top-right Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(project.id);
            }}
            aria-label="Bookmark project"
            className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-xs transition-all ${
              project.isBookmarked
                ? 'bg-[#0F0F0F] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-gray-600 hover:text-black shadow-xs'
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                project.isBookmarked ? 'fill-white stroke-white' : 'stroke-[2]'
              }`}
            />
          </button>

          {/* Center 3D Artwork / Mockup */}
          <div className="w-full h-full flex items-center justify-center relative">
            <CardVisual
              id={project.id}
              theme={project.theme}
              title={project.title}
              image={project.image}
            />
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3.5 pb-2">
          {/* Title */}
          <h3 className="text-[13px] font-semibold text-[#0F0F0F] leading-[1.3] line-clamp-2 min-h-[34px] group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          {/* Category Badge */}
          <div className="mt-1.5">
            <span
              className={`inline-block px-2 py-0.5 rounded-[5px] text-[10.5px] font-semibold tracking-tight ${getBadgeStyle(
                project.category
              )}`}
            >
              {project.category}
            </span>
          </div>

          {/* Creator Information Row */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 overflow-hidden pr-1">
              <img
                src={project.creator.avatar}
                alt={project.creator.name}
                className="w-4 h-4 rounded-full object-cover flex-shrink-0"
              />
              <span className="text-[11.5px] font-medium text-[#212121] truncate">
                {project.creator.name}
              </span>
              {project.creator.verified && (
                <span className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-2 h-2 stroke-[3]" />
                </span>
              )}
            </div>
            <span className="text-[10.5px] text-gray-400 whitespace-nowrap flex-shrink-0">
              {project.timeAgo}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Budget & Likes */}
      <div className="px-3.5 py-2.5 border-t border-[#F2F2F2] flex items-center justify-between text-xs bg-white">
        <span className="text-[12px] font-semibold text-[#0F0F0F]">
          {project.budget}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(project.id);
          }}
          aria-label="Like project"
          className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors group/like"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform group-active/like:scale-125 ${
              project.isLiked
                ? 'fill-red-500 stroke-red-500 text-red-500'
                : 'stroke-[1.8] group-hover/like:stroke-red-500'
            }`}
          />
          <span
            className={`text-[11px] font-medium ${
              project.isLiked ? 'text-red-500 font-semibold' : 'text-gray-500'
            }`}
          >
            {project.likes}
          </span>
        </button>
      </div>
    </div>
  );
};
