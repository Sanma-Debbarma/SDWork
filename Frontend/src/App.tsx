import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { MessagesView } from './components/views/MessagesView';
import { LogoutModal } from './components/views/LogoutModal';
import { FEATURED_PROJECTS } from './data/projects';
import {
  CategoryType,
  BudgetFilter,
  ExperienceFilter,
  SortOption,
  Project,
} from './types';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All Categories');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const activeSidebarItem = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/content')) return 'content';
    if (path.startsWith('/projects')) return 'my-projects';
    if (path.startsWith('/saved')) return 'saved';
    if (path.startsWith('/earn')) return 'earn';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/messages')) return 'messages';
    return '';
  }, [location.pathname]);

  const [featuredList, setFeaturedList] = useState<Project[]>(FEATURED_PROJECTS);
  const [allProjectList, setAllProjectList] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/content');

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();

        const projects: Project[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          creator: {
            name: 'Ani Vex',
            avatar: '/assets/anivex-avatar.png',
            verified: true,
          },
          budget: `$${item.budgetMin.toLocaleString()} - $${item.budgetMax.toLocaleString()}`,
          budgetMin: item.budgetMin,
          budgetMax: item.budgetMax,
          timeAgo: 'Recently',
          likes: 0,
          isLiked: false,
          isBookmarked: false,
          image: '/assets/featured-1-web.png',
          theme: 'purple',
          topIconType: 'star',
          experienceLevel: 'Intermediate',
          description: item.description || '',
        }));

        setAllProjectList(projects);
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };

    fetchProjects();
  }, []);

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
          if (q && location.pathname !== '/') {
            navigate('/');
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
          onSelectItem={(item) => {
            const routes: Record<string, string> = {
              dashboard: '/',
              content: '/content',
              'my-projects': '/projects',
              saved: '/saved',
              earn: '/earn',
              settings: '/settings',
            };
            if (routes[item]) navigate(routes[item]);
          }}
          savedCount={savedProjects.length}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />

        {/* Content Body Container */}
        <main className="flex-1 lg:pl-[196px] transition-all duration-200 w-full min-w-0">
          <div className="p-4 sm:p-6 lg:p-7 max-w-[1720px] mx-auto">
            <Routes>
              {/* Route 1: Main Dashboard Feed */}
              <Route
                path="/"
                element={
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
                }
              />

              {/* Route 2: Content (Client can create/post a service/project) */}
              <Route
                path="/content"
                element={
                  <ContentView
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                    projects={allProjectList}
                    onSelectProject={setSelectedProjectModal}
                  />
                }
              />

              {/* Route 3: My Projects (Freelancer/Editor can see working projects) */}
              <Route
                path="/projects"
                element={
                  <MyProjectsView onSelectProject={setSelectedProjectModal} />
                }
              />

              {/* Route 4: Saved (Save interesting projects/services) */}
              <Route
                path="/saved"
                element={
                  <SavedProjectsView
                    savedProjects={savedProjects}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onSelectProject={setSelectedProjectModal}
                    onBrowseProjects={() => navigate('/')}
                  />
                }
              />

              {/* Route 5: Earn (Freelancer earnings) */}
              <Route path="/earn" element={<EarningsView />} />

              {/* Route 6: Settings */}
              <Route path="/settings" element={<SettingsView />} />

              {/* Route 7: Messages */}
              <Route path="/messages" element={<MessagesView />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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
          navigate('/');
        }}
      />
    </div>
  );
}

export default App;
