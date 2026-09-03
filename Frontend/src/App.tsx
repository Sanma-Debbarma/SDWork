import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CategoryNav } from './components/CategoryNav';
import { FeaturedSection } from './components/FeaturedSection';
import { AllProjects } from './components/AllProjects';
import { CreateProjectModal } from './components/CreateProjectModal';
import { AskEditorModal } from './components/AskEditorModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ContentView } from './components/views/ContentView';
import { MyProjectsView } from './components/views/MyProjectsView';
import { SavedProjectsView } from './components/views/SavedProjectsView';
import { EarningsView } from './components/views/EarningsView';
import { SettingsView } from './components/views/SettingsView';
import { LogoutModal } from './components/views/LogoutModal';
import { FEATURED_PROJECTS, ALL_PROJECTS } from './data/projects';
import {
  CategoryType,
  BudgetFilter,
  ExperienceFilter,
  SortOption,
  Project,
} from './types';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All Categories');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [featuredList, setFeaturedList] = useState<Project[]>(FEATURED_PROJECTS);
  const [allProjectList, setAllProjectList] = useState<Project[]>(ALL_PROJECTS);

  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAskEditorOpen, setIsAskEditorOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Toggle Like Handler
  const handleToggleLike = (id: string) => {
    const updater = (prevList: Project[]) =>
      prevList.map((p) => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      });

    setFeaturedList(updater);
    setAllProjectList(updater);

    if (selectedProjectModal && selectedProjectModal.id === id) {
      const isLiked = !selectedProjectModal.isLiked;
      setSelectedProjectModal({
        ...selectedProjectModal,
        isLiked,
        likes: isLiked ? selectedProjectModal.likes + 1 : Math.max(0, selectedProjectModal.likes - 1),
      });
    }
  };

  // Toggle Bookmark Handler
  const handleToggleBookmark = (id: string) => {
    const updater = (prevList: Project[]) =>
      prevList.map((p) => {
        if (p.id === id) {
          return { ...p, isBookmarked: !p.isBookmarked };
        }
        return p;
      });

    setFeaturedList(updater);
    setAllProjectList(updater);

    if (selectedProjectModal && selectedProjectModal.id === id) {
      setSelectedProjectModal({
        ...selectedProjectModal,
        isBookmarked: !selectedProjectModal.isBookmarked,
      });
    }
  };

  // Add newly created project (by client)
  const handleAddProject = (newProject: Project) => {
    setAllProjectList((prev) => [newProject, ...prev]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setBudgetFilter('all');
    setExperienceFilter('all');
    setSortOption('newest');
  };

  // Saved / Bookmarked Projects list
  const savedProjects = useMemo(() => {
    const combined = [...featuredList, ...allProjectList];
    const uniqueMap = new Map<string, Project>();
    combined.forEach((p) => {
      if (p.isBookmarked && !uniqueMap.has(p.id)) {
        uniqueMap.set(p.id, p);
      }
    });
    return Array.from(uniqueMap.values());
  }, [featuredList, allProjectList]);

  // Filtered Featured Projects
  const filteredFeatured = useMemo(() => {
    return featuredList.filter((p) => {
      const matchCat =
        selectedCategory === 'All Categories' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [featuredList, selectedCategory, searchQuery]);

  // Filtered All Projects
  const filteredAllProjects = useMemo(() => {
    let result = allProjectList.filter((p) => {
      // Category filter
      const matchCat =
        selectedCategory === 'All Categories' || p.category === selectedCategory;

      // Search filter
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Budget filter
      let matchBudget = true;
      if (budgetFilter === 'under1k') {
        matchBudget = p.budgetMax <= 1000;
      } else if (budgetFilter === '1k_3k') {
        matchBudget = (p.budgetMin >= 1000 && p.budgetMin <= 3000) || (p.budgetMax >= 1000 && p.budgetMax <= 3000);
      } else if (budgetFilter === '3k_5k') {
        matchBudget = (p.budgetMin >= 3000 && p.budgetMin <= 5000) || (p.budgetMax >= 3000 && p.budgetMax <= 5000);
      } else if (budgetFilter === '5k_plus') {
        matchBudget = p.budgetMax >= 5000;
      }

      // Experience filter
      let matchExp = true;
      if (experienceFilter !== 'all') {
        matchExp = p.experienceLevel?.toLowerCase() === experienceFilter.toLowerCase();
      }

      return matchCat && matchSearch && matchBudget && matchExp;
    });

    // Sorting
    if (sortOption === 'likes') {
      result = [...result].sort((a, b) => b.likes - a.likes);
    } else if (sortOption === 'budget_high') {
      result = [...result].sort((a, b) => b.budgetMax - a.budgetMax);
    } else if (sortOption === 'budget_low') {
      result = [...result].sort((a, b) => a.budgetMin - b.budgetMin);
    }

    return result;
  }, [allProjectList, selectedCategory, searchQuery, budgetFilter, experienceFilter, sortOption]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      {/* Top Fixed Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && activeSidebarItem !== 'dashboard') {
            setActiveSidebarItem('dashboard');
          }
        }}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAskEditor={() => setIsAskEditorOpen(true)}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItem={activeSidebarItem}
          onSelectItem={setActiveSidebarItem}
          savedCount={savedProjects.length}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />

        {/* Content Body Container */}
        <main className="flex-1 lg:pl-[196px] transition-all duration-200 w-full min-w-0">
          <div className="p-4 sm:p-6 lg:p-7 max-w-[1720px] mx-auto">
            {/* View 1: Main Dashboard Feed */}
            {activeSidebarItem === 'dashboard' && (
              <>
                {/* Horizontal Category Navigation Bar */}
                <CategoryNav
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />

                {/* Featured Projects Section */}
                {filteredFeatured.length > 0 && (
                  <FeaturedSection
                    projects={filteredFeatured}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onSelectProject={setSelectedProjectModal}
                    onViewAll={() => setSelectedCategory('All Categories')}
                  />
                )}

                {/* All Projects Section */}
                <AllProjects
                  projects={filteredAllProjects}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  budgetFilter={budgetFilter}
                  onBudgetFilterChange={setBudgetFilter}
                  experienceFilter={experienceFilter}
                  onExperienceFilterChange={setExperienceFilter}
                  sortOption={sortOption}
                  onSortOptionChange={setSortOption}
                  onToggleLike={handleToggleLike}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectProject={setSelectedProjectModal}
                  onResetFilters={handleResetFilters}
                />
              </>
            )}

            {/* View 2: Content (Client can create/post a service/project) */}
            {activeSidebarItem === 'content' && (
              <ContentView
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                projects={allProjectList}
                onSelectProject={setSelectedProjectModal}
              />
            )}

            {/* View 3: My Projects (Freelancer/Editor can see working projects) */}
            {activeSidebarItem === 'my-projects' && (
              <MyProjectsView onSelectProject={setSelectedProjectModal} />
            )}

            {/* View 4: Saved (Save interesting projects/services) */}
            {activeSidebarItem === 'saved' && (
              <SavedProjectsView
                savedProjects={savedProjects}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
                onSelectProject={setSelectedProjectModal}
                onBrowseProjects={() => setActiveSidebarItem('dashboard')}
              />
            )}

            {/* View 5: Earn (Freelancer earnings) */}
            {activeSidebarItem === 'earn' && <EarningsView />}

            {/* View 6: Settings */}
            {activeSidebarItem === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddProject={handleAddProject}
      />

      <AskEditorModal
        isOpen={isAskEditorOpen}
        onClose={() => setIsAskEditorOpen(false)}
      />

      <ProjectDetailModal
        project={selectedProjectModal}
        onClose={() => setSelectedProjectModal(null)}
        onToggleLike={handleToggleLike}
        onToggleBookmark={handleToggleBookmark}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={() => {
          setIsLogoutModalOpen(false);
          alert('You have logged out of Ani Vex channel.');
          setActiveSidebarItem('dashboard');
        }}
      />
    </div>
  );
}

export default App;
