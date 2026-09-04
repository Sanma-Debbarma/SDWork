import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Calendar, MessageSquare } from 'lucide-react';
import { Project } from '../../types';
import { UploadWorkModal } from './UploadWorkModal';

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
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'review' | 'completed'>('all');
  const [uploadProject, setUploadProject] = useState<WorkingProject | null>(null);



  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:5000/api/projects/my/1'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch my projects');
        }

        const data = await response.json();

        setProjects(data);
      } catch (error) {
        console.error('Failed to load my projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  const myWorkingProjects: WorkingProject[] = projects.map((item) => ({
    id: item.id,
    title: item.title,
    client: item.client || 'Client',
    clientAvatar:
      item.clientAvatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',

    status:
      item.status === 'review'
        ? 'review'
        : item.status === 'completed'
          ? 'completed'
          : 'in_progress',

    progress: item.progress ?? 0,

    deadline: item.deadline || 'Deadline not set',

    budget:
      item.budget ||
      `$${Number(item.budgetMin || 0).toLocaleString()} - $${Number(
        item.budgetMax || 0
      ).toLocaleString()}`,

    category: item.category || 'Other',
  }));

  const filtered = myWorkingProjects.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">
          Loading your projects...
        </p>
      </div>
    );
  }

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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === 'all'
              ? 'bg-white text-gray-950 shadow-xs'
              : 'text-gray-600 hover:text-black'
              }`}
          >
            All ({myWorkingProjects.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === 'in_progress'
              ? 'bg-white text-gray-950 shadow-xs'
              : 'text-gray-600 hover:text-black'
              }`}
          >
            In Progress (
            {myWorkingProjects.filter((p) => p.status === 'in_progress').length}
            )
          </button>
          <button
            onClick={() => setFilter('review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === 'review'
              ? 'bg-white text-gray-950 shadow-xs'
              : 'text-gray-600 hover:text-black'
              }`}
          >
            Under Review (
            {myWorkingProjects.filter((p) => p.status === 'review').length}
            )
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === 'completed'
              ? 'bg-white text-gray-950 shadow-xs'
              : 'text-gray-600 hover:text-black'
              }`}
          >
            Completed (
            {myWorkingProjects.filter((p) => p.status === 'completed').length}
            )
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <h3 className="text-base font-semibold text-gray-900">
              No working projects
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Projects assigned to you will appear here.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${item.status === 'in_progress'
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
                        className={`h-full rounded-full transition-all duration-500 ${item.status === 'completed'
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

                    {item.status === 'review' ? (
                      <button
                        type="button"
                        disabled
                        className="cursor-default rounded-xl bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600"
                      >
                        Under Review
                      </button>
                    ) : (
                      <button
                        onClick={() => setUploadProject(item)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
                      >
                        <span>Upload Work</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {uploadProject && (
          <UploadWorkModal
            projectId={uploadProject.id}
            projectTitle={uploadProject.title}
            onClose={() => setUploadProject(null)}
            onUploaded={() => {
              setProjects((prev) =>
                prev.map((project) =>
                  project.id === uploadProject.id
                    ? {
                      ...project,
                      progress: 100,
                      status: 'review',
                      workStatus: 'review',
                    }
                    : project
                )
              );
            }}
          />
        )}
      </div>
    </div >
  );
};
