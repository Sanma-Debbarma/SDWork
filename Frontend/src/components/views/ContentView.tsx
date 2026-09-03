import React from 'react';
import { PlusCircle, FileText, Users, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Project } from '../../types';

interface ContentViewProps {
  onOpenCreateModal: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({
  onOpenCreateModal,
  projects,
  onSelectProject,
}) => {
  const postedProjects = projects.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-purple-200 inline-block mb-3">
            Client Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Post & Manage Your Services
          </h1>
          <p className="text-sm text-purple-200 mb-6 leading-relaxed">
            Create new project briefs, attract verified editors and developers from across the community, and manage incoming proposals.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-950 rounded-xl font-semibold text-xs hover:bg-gray-100 transition shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-purple-600" />
            <span>Post a New Project / Service</span>
          </button>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-500/20 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Active Postings</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">4</span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">+1 this week</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Proposals Received</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">28</span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">12 awaiting review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">In Production</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">3</span>
          <span className="text-[11px] text-gray-500 font-medium block mt-1">On schedule</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">19</span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">100% satisfaction</span>
        </div>
      </div>

      {/* Your Posted Projects Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Your Posted Projects</h3>
            <p className="text-xs text-gray-500">Live projects published under Ani Vex channel</p>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg transition"
          >
            <span>+ Create New</span>
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {postedProjects.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 transition cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  0{idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 hover:text-purple-700 transition">
                      {p.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{p.category}</span>
                    <span>•</span>
                    <span>Budget: {p.budget}</span>
                    <span>•</span>
                    <span>Posted {p.timeAgo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-md">
                  {8 + idx * 4} Proposals
                </span>
                <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
