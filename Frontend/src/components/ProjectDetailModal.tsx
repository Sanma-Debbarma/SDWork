import { X, Bookmark, Heart, Check, ExternalLink, Calendar, Award, Share2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onToggleLike,
  onToggleBookmark,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">
            {project.category}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(project.id)}
              className={`p-2 rounded-xl transition-colors ${
                project.isBookmarked
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleLike(project.id)}
              className={`p-2 rounded-xl transition-colors ${
                project.isLiked
                  ? 'bg-red-50 text-red-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${project.isLiked ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Visual Hero Preview */}
          <div className="w-full h-52 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/80 flex items-center justify-center overflow-hidden relative">
            <img
              src={project.image}
              alt={project.title}
              className="max-h-[170px] max-w-[85%] object-contain drop-shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Posted {project.timeAgo}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> {project.experienceLevel || 'Intermediate'} Level
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-red-500" /> {project.likes} likes
              </span>
            </div>
          </div>

          {/* Creator Profile */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/60">
            <div className="flex items-center gap-3">
              <img
                src={project.creator.avatar}
                alt={project.creator.name}
                className="w-10 h-10 rounded-full object-cover border border-white shadow-xs"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900">
                    {project.creator.name}
                  </span>
                  {project.creator.verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">Verified Channel Creator</span>
              </div>
            </div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View Profile
            </button>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
              Project Overview
            </h4>
            <p className="text-xs leading-relaxed text-gray-600">
              {project.description ||
                'This project includes high-fidelity assets, production-ready deliverables, and responsive interactive elements designed according to modern web development standards.'}
            </p>
          </div>

          {/* Budget & Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
              <span className="text-[11px] text-purple-700 font-medium block">
                Estimated Budget
              </span>
              <span className="text-base font-bold text-gray-900 mt-0.5 block">
                {project.budget}
              </span>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <span className="text-[11px] text-emerald-700 font-medium block">
                Deliverables Status
              </span>
              <span className="text-base font-bold text-emerald-800 mt-0.5 block">
                Open for Bids
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Project link copied to clipboard!');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black px-3 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Collaboration request submitted for "${project.title}"!`);
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-gray-900 hover:bg-black text-white rounded-xl shadow-xs transition active:scale-95"
            >
              <span>Submit Proposal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
