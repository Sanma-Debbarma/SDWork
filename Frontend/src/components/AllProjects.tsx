import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Project, CategoryType, BudgetFilter, ExperienceFilter, SortOption } from '../types';
import { ProjectCard } from './ProjectCard';
import { ProjectListView } from './ProjectListView';
import { Dropdown } from './ui/Dropdown';

interface AllProjectsProps {
  projects: Project[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  budgetFilter: BudgetFilter;
  onBudgetFilterChange: (filter: BudgetFilter) => void;
  experienceFilter: ExperienceFilter;
  onExperienceFilterChange: (filter: ExperienceFilter) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onSelectProject?: (project: Project) => void;
  onResetFilters: () => void;
}

export const AllProjects: React.FC<AllProjectsProps> = ({
  projects,
  viewMode,
  onViewModeChange,
  selectedCategory,
  onCategoryChange,
  budgetFilter,
  onBudgetFilterChange,
  experienceFilter,
  onExperienceFilterChange,
  sortOption,
  onSortOptionChange,
  onToggleLike,
  onToggleBookmark,
  onSelectProject,
  onResetFilters,
}) => {
  const categoryOptions = [
    { label: 'All Categories', value: 'All Categories' },
    { label: 'Web Development', value: 'Web Development' },
    { label: 'Mobile Development', value: 'Mobile Development' },
    { label: 'UI/UX Design', value: 'UI/UX Design' },
    { label: 'Graphic Design', value: 'Graphic Design' },
    { label: 'Content Writing', value: 'Content Writing' },
    { label: 'Digital Marketing', value: 'Digital Marketing' },
    { label: 'Video & Animation', value: 'Video & Animation' },
    { label: '3D & Modeling', value: '3D & Modeling' },
  ];

  const budgetOptions = [
    { label: 'Budget', value: 'all' },
    { label: 'Under $1,000', value: 'under1k' },
    { label: '$1,000 - $3,000', value: '1k_3k' },
    { label: '$3,000 - $5,000', value: '3k_5k' },
    { label: '$5,000+', value: '5k_plus' },
  ];

  const experienceOptions = [
    { label: 'Experience Level', value: 'all' },
    { label: 'Entry Level', value: 'entry' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Expert', value: 'expert' },
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Most Liked', value: 'likes' },
    { label: 'Budget: High to Low', value: 'budget_high' },
    { label: 'Budget: Low to High', value: 'budget_low' },
  ];

  return (
    <section className="mb-14">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h2 className="text-[19px] font-bold text-[#0F0F0F] tracking-tight">
          All Projects
        </h2>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Dropdown 1: Category */}
          <Dropdown
            label="All Categories"
            value={selectedCategory}
            options={categoryOptions}
            onChange={(val) => onCategoryChange(val as CategoryType)}
          />

          {/* Dropdown 2: Budget */}
          <Dropdown
            label="Budget"
            value={budgetFilter}
            options={budgetOptions}
            onChange={(val) => onBudgetFilterChange(val as BudgetFilter)}
          />

          {/* Dropdown 3: Experience */}
          <Dropdown
            label="Experience Level"
            value={experienceFilter}
            options={experienceOptions}
            onChange={(val) => onExperienceFilterChange(val as ExperienceFilter)}
          />

          {/* Dropdown 4: Sort */}
          <Dropdown
            label="Newest"
            value={sortOption}
            options={sortOptions}
            onChange={(val) => onSortOptionChange(val as SortOption)}
          />

          {/* View Toggles: Grid & List */}
          <div className="flex items-center gap-1 ml-1 pl-1 border-l border-gray-200">
            {/* Grid view button - highlighted in green/teal like reference */}
            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#0E9F6E] text-white shadow-xs'
                  : 'bg-white hover:bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* List view button */}
            <button
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#0E9F6E] text-white shadow-xs'
                  : 'bg-white hover:bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            No projects found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search query, clearing filters, or choosing a different category.
          </p>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Reset all filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      ) : (
        <ProjectListView
          projects={projects}
          onToggleLike={onToggleLike}
          onToggleBookmark={onToggleBookmark}
          onSelectProject={onSelectProject}
        />
      )}
    </section>
  );
};
