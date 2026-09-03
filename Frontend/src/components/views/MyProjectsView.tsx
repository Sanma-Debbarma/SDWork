import { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, FileUp, Calendar, MessageSquare } from 'lucide-react';
import { Project } from '../../types';

interface MyProjectsViewProps {
  onSelectProject: (project: Project) => void;
}

interface WorkingProject {
  id: string;
  title: string;
  client: string;
  clientAvatar: string;
  status: 'in_progress' | 'review' | 'completed';
  progress: number;
  deadline: string;
  budget: string;
  category: string;
}

export const MyProjectsView: React.FC<MyProjectsViewProps> = () => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'review' | 'completed'>('all');

  const myWorkingProjects: WorkingProject[] = [
    {
      id: 'work-1',
      title: 'YouTube Tech Review Dynamic Motion Edit',
      client: 'Marques Media Labs',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      status: 'in_progress',
      progress: 65,
      deadline: 'Due in 2 days',
      budget: '$1,200',
      category: 'Video & Animation',
    },
    {
      id: 'work-2',
      title: 'Next.js 15 Dark Mode SaaS Dashboard',
      client: 'Vercel Ecosystem Partner',
      clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      status: 'in_progress',
      progress: 40,
      deadline: 'Due in 5 days',
      budget: '$3,800',
      category: 'Web Development',
    },
    {
      id: 'work-3',
      title: 'Minimalist Fintech Brand Identity Kit',
      client: 'AuraPay Capital',
      clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      status: 'review',
      progress: 90,
      deadline: 'In Client Review',
      budget: '$1,650',
      category: 'Graphic Design',
    },
    {
      id: 'work-4',
      title: 'iOS Habit Tracker UI/UX Prototype',
      client: 'Zenith Health Labs',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      status: 'completed',
      progress: 100,
      deadline: 'Completed Yesterday',
      budget: '$2,400',
      category: 'UI/UX Design',
    },
    {
      id: 'work-5',
      title: 'Short-Form TikTok & Reels Viral Hooks (20 Videos)',
      client: 'HyperGrowth Agency',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      status: 'completed',
      progress: 100,
      deadline: 'Completed 4d ago',
      budget: '$1,500',
      category: 'Video & Animation',
    },
  ];

  const filtered = myWorkingProjects.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            My Working Projects
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Track active production jobs, client deliverables, and milestones as an Editor
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            All ({myWorkingProjects.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'in_progress'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            In Progress (2)
          </button>
          <button
            onClick={() => setFilter('review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'review'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Under Review (1)
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'completed'
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Completed (2)
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                      item.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : item.status === 'review'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.status === 'in_progress' && <Clock className="w-3 h-3" />}
                    {item.status === 'review' && <AlertCircle className="w-3 h-3" />}
                    {item.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                    {item.status === 'in_progress'
                      ? 'In Progress'
                      : item.status === 'review'
                      ? 'Client Review'
                      : 'Completed'}
                  </span>

                  <span className="text-xs font-medium text-gray-400">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={item.clientAvatar}
                      alt={item.client}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-medium">{item.client}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{item.deadline}</span>
                  </div>
                  <span>•</span>
                  <span className="font-semibold text-gray-900">
                    Fee: {item.budget}
                  </span>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 min-w-[200px]">
                <div className="w-full sm:w-48 lg:w-48 text-right">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-500">Milestone Progress</span>
                    <span className="text-purple-700">{item.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === 'completed'
                          ? 'bg-emerald-500'
                          : item.status === 'review'
                          ? 'bg-amber-500'
                          : 'bg-purple-600'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end">
                  <button
                    onClick={() => alert(`Opening chat with ${item.client}...`)}
                    className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                    title="Message Client"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {item.status !== 'completed' ? (
                    <button
                      onClick={() => alert(`Upload deliverable modal for "${item.title}"`)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      <span>Upload Work</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 px-3 py-1.5 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Delivered & Paid</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
