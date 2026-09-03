import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';
import { Project, CategoryType } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Web Development');
  const [budgetMin, setBudgetMin] = useState(1500);
  const [budgetMax, setBudgetMax] = useState(3500);
  const [theme, setTheme] = useState<'purple' | 'peach' | 'mint' | 'blue' | 'yellow'>('purple');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: Project = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      creator: {
        name: 'Ani Vex',
        avatar: '/assets/anivex-avatar.png',
        verified: true,
      },
      budget: `$${budgetMin.toLocaleString()} - $${budgetMax.toLocaleString()}`,
      budgetMin,
      budgetMax,
      timeAgo: 'Just now',
      likes: 1,
      isLiked: false,
      isBookmarked: false,
      image:
        theme === 'purple'
          ? '/assets/featured-1-web.png'
          : theme === 'peach'
          ? '/assets/featured-2-mobile.png'
          : theme === 'mint'
          ? '/assets/featured-3-ecommerce.png'
          : theme === 'blue'
          ? '/assets/featured-4-brand.png'
          : '/assets/featured-5-seo.png',
      theme,
      topIconType: theme === 'purple' ? 'star' : theme === 'peach' ? 'sphere' : theme === 'mint' ? 'cube' : theme === 'blue' ? 'ribbon' : 'shield',
      experienceLevel: 'Intermediate',
      description: description || 'Exciting new project created directly via Editor Studio dashboard.',
    };

    onAddProject(newProject);
    setTitle('');
    setDescription('');
    onClose();
  };

  const categories: CategoryType[] = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Content Writing',
    'Digital Marketing',
    'Video & Animation',
    '3D & Modeling',
  ];

  const themes: { id: 'purple' | 'peach' | 'mint' | 'blue' | 'yellow'; label: string; color: string }[] = [
    { id: 'purple', label: 'Purple', color: 'bg-purple-200' },
    { id: 'peach', label: 'Peach', color: 'bg-orange-200' },
    { id: 'mint', label: 'Mint', color: 'bg-emerald-200' },
    { id: 'blue', label: 'Blue', color: 'bg-blue-200' },
    { id: 'yellow', label: 'Yellow', color: 'bg-amber-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Create New Project</h3>
              <p className="text-xs text-gray-500">Post a new project brief to your Editor dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js SaaS Platform Redesign"
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Card Theme
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`w-7 h-7 rounded-full ${t.color} flex items-center justify-center border-2 transition-all ${
                      theme === t.id ? 'border-gray-900 scale-110' : 'border-transparent'
                    }`}
                  >
                    {theme === t.id && <Check className="w-3.5 h-3.5 text-gray-900" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Minimum Budget ($)
              </label>
              <input
                type="number"
                min={100}
                step={100}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Maximum Budget ($)
              </label>
              <input
                type="number"
                min={budgetMin}
                step={100}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline project deliverables, requirements, or tech stack..."
              className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm transition active:scale-95"
            >
              Publish Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
