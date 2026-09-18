import React, { useState } from 'react';
import { X, PlusCircle, Check, Upload, Loader2 } from 'lucide-react';
import { Project, CategoryType } from '../types';

import { useAuth } from '../context/AuthContext';

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
  const { user, token } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Web Development');
  const [budgetMin, setBudgetMin] = useState(1500);
  const [budgetMax, setBudgetMax] = useState(3500);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [theme, setTheme] = useState<'purple' | 'peach' | 'mint' | 'blue' | 'yellow'>('purple');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let uploadedFiles: { name: string; url: string }[] = [];

      // If file selected, upload first
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('http://127.0.0.1:5000/api/projects/upload-attachment', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedFiles.push({
            name: uploadData.filename || selectedFile.name,
            url: uploadData.url,
          });
        }
      }

      const activeToken = token || localStorage.getItem('edit_token');

      // Post to MongoDB /api/projects
      const response = await fetch('http://127.0.0.1:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          budget: `$${budgetMin.toLocaleString()} - $${budgetMax.toLocaleString()}`,
          budgetMin,
          budgetMax,
          deadline,
          description: description.trim(),
          files: uploadedFiles,
          theme,
          creator_id: user?.id,
          creator_name: user?.name,
          creator_avatar: user?.avatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish project to MongoDB');
      }

      const savedProject = data.project;

      // Update state in live feed
      onAddProject(savedProject);

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      onClose();
    } catch (err: any) {
      console.error('Failed to create project:', err);
      setError(err?.message || 'Error saving project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Create New Project</h3>
              <p className="text-xs text-gray-500">Post project brief to MongoDB for verified editors</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

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
                Deadline *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-blue-500 outline-none bg-white"
                />
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
              Description & Requirements
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline project deliverables, requirements, tech stack, or creative vision..."
              className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Project Files Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Project Files / Brief (Optional)
            </label>
            <div className="border border-dashed border-gray-300 rounded-xl p-3 text-center bg-gray-50/50 hover:bg-gray-50 transition">
              <input
                type="file"
                id="project-file-input"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="project-file-input"
                className="flex items-center justify-center gap-2 text-xs text-gray-600 font-medium cursor-pointer"
              >
                <Upload className="w-4 h-4 text-gray-400" />
                {selectedFile ? (
                  <span className="text-purple-700 font-semibold truncate max-w-[280px]">
                    {selectedFile.name}
                  </span>
                ) : (
                  <span>Click to attach brief or reference file</span>
                )}
              </label>
            </div>
          </div>

          {/* Card Theme Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Card Theme Color
            </label>
            <div className="flex items-center gap-2 pt-0.5">
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

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing to MongoDB...</span>
                </>
              ) : (
                <span>Publish Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
