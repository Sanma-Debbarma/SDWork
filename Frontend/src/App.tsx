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
import { LoginPage } from './components/views/LoginPage';
import { RoleSelectionView } from './components/views/RoleSelectionView';
import { useAuth } from './context/AuthContext';
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
  const { user, isLoading, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All Categories');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [featuredList, setFeaturedList] = useState<Project[]>([]);
  const [allProjectList, setAllProjectList] = useState<Project[]>([]);

  // Fetch real projects from MongoDB backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/projects');


        if (!response.ok) {
          throw new Error('Failed to fetch projects from MongoDB');
        }

        const data = await response.json();

        const projects: Project[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          creator: item.creator || {
            name: item.creator_name || 'Creator',
            avatar: item.creator_avatar || '/assets/anivex-avatar.png',
            verified: true,
          },
          creator_id: item.creator_id,
          budget: item.budget || `$${item.budgetMin?.toLocaleString()} - $${item.budgetMax?.toLocaleString()}`,
          budgetMin: item.budgetMin || 0,
          budgetMax: item.budgetMax || 0,
          deadline: item.deadline || 'Flexible',
          files: item.files || [],
          timeAgo: item.timeAgo || 'Recently',
          likes: item.likes || 0,
          isLiked: item.isLiked ?? false,
          isBookmarked: item.isBookmarked ?? false,
          image: item.image || (
            item.theme === 'peach'
              ? '/assets/featured-2-mobile.png'
              : item.theme === 'mint'
                ? '/assets/featured-3-ecommerce.png'
                : item.theme === 'blue'
                  ? '/assets/featured-4-brand.png'
                  : '/assets/featured-1-web.png'
          ),
          theme: item.theme || 'purple',
          topIconType: item.topIconType || 'star',
          experienceLevel: item.experienceLevel || 'Intermediate',
          description: item.description || '',
          status: item.status || 'open',
          proposals: item.proposals ?? item.proposals_count ?? 0,
          created_at: item.created_at,
        }));

        setAllProjectList(projects);
        // Featured list: top 3 items from real MongoDB projects
        setFeaturedList(projects.slice(0, 3));
      } catch (error) {
        console.error('Failed to load MongoDB projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAskEditorOpen, setIsAskEditorOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Active sidebar navigation item
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
  const handleToggleBookmark = async (id: string) => {
    const project = [...featuredList, ...allProjectList].find((p) => p.id === id);
    if (!project) return;

    const oldStatus = project.isBookmarked;
    const newStatus = !oldStatus;

    // Optimistic UI update
    setFeaturedList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBookmarked: newStatus } : p))
    );
    setAllProjectList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBookmarked: newStatus } : p))
    );

    if (selectedProjectModal?.id === id) {
      setSelectedProjectModal({
        ...selectedProjectModal,
        isBookmarked: newStatus,
      });
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/projects/${id}/bookmark`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Bookmark update failed');
    } catch (error) {
      console.error('Bookmark API error:', error);
      // Rollback on failure
      setFeaturedList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isBookmarked: oldStatus } : p))
      );
      setAllProjectList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isBookmarked: oldStatus } : p))
      );
    }
  };

  // Add newly created project (by Creator)
  const handleAddProject = (newProject: Project) => {
    setAllProjectList((prev) => [newProject, ...prev]);
    setFeaturedList((prev) => [newProject, ...prev.slice(0, 2)]);
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

  // Creator's own posted projects
  const creatorProjects = useMemo(() => {
    if (!user) return allProjectList;
    return allProjectList.filter(
      (p) => p.creator_id === user.id || p.creator?.name === user.name
    );
  }, [allProjectList, user]);

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
      const matchCat =
        selectedCategory === 'All Categories' || p.category === selectedCategory;

      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      let matchBudget = true;
      if (budgetFilter === 'under1k') {
        matchBudget = p.budgetMax <= 1000;
      } else if (budgetFilter === '1k_3k') {
        matchBudget =
          (p.budgetMin >= 1000 && p.budgetMin <= 3000) ||
          (p.budgetMax >= 1000 && p.budgetMax <= 3000);
      } else if (budgetFilter === '3k_5k') {
        matchBudget =
          (p.budgetMin >= 3000 && p.budgetMin <= 5000) ||
          (p.budgetMax >= 3000 && p.budgetMax <= 5000);
      } else if (budgetFilter === '5k_plus') {
        matchBudget = p.budgetMax >= 5000;
      }

      let matchExp = true;
      if (experienceFilter !== 'all') {
        matchExp = p.experienceLevel?.toLowerCase() === experienceFilter.toLowerCase();
      }

      return matchCat && matchSearch && matchBudget && matchExp;
    });

    if (sortOption === 'likes') {
      result = [...result].sort((a, b) => b.likes - a.likes);
    } else if (sortOption === 'budget_high') {
      result = [...result].sort((a, b) => b.budgetMax - a.budgetMax);
    } else if (sortOption === 'budget_low') {
      result = [...result].sort((a, b) => a.budgetMin - b.budgetMin);
    }

    return result;
  }, [allProjectList, selectedCategory, searchQuery, budgetFilter, experienceFilter, sortOption]);

  // ==========================================
  // AUTHENTICATION & ROLE GATING
  // ==========================================

  // Loading indicator while verifying stored token
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFC]">
        <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-semibold text-gray-700">Loading workspace...</span>
      </div>
    );
  }

  // 1. Start App: Unauthenticated user sees Login Page
  if (!user) {
    return <LoginPage />;
  }

  // 2. Role Selection: If user has not selected role yet
  if (!user.role) {
    return (
      <RoleSelectionView
        onRoleSelected={(role) => {
          if (role === 'creator') {
            navigate('/content');
          } else {
            navigate('/');
          }
        }}
      />
    );
  }

  const isCreator = user.role === 'creator';
  const isEditor = user.role === 'editor';

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
                  isCreator ? (
                    // CREATOR DASHBOARD
                    <ContentView
                      onOpenCreateModal={() => setIsCreateModalOpen(true)}
                      projects={creatorProjects.length > 0 ? creatorProjects : allProjectList}
                      onSelectProject={setSelectedProjectModal}
                    />
                  ) : (
                    // EDITOR DASHBOARD (Browse real projects from MongoDB)
                    <>
                      {/* Horizontal Category Navigation Bar */}
                      <CategoryNav
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                      />

                      {/* Featured Projects Section from MongoDB */}
                      {filteredFeatured.length > 0 && (
                        <FeaturedSection
                          projects={filteredFeatured}
                          onToggleLike={handleToggleLike}
                          onToggleBookmark={handleToggleBookmark}
                          onSelectProject={setSelectedProjectModal}
                          onViewAll={() => setSelectedCategory('All Categories')}
                        />
                      )}

                      {/* All Projects Section from MongoDB */}
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
                  )
                }
              />

              {/* Route 2: Content (Creator Portal: Post & Manage projects) */}
              <Route
                path="/content"
                element={
                  isEditor ? (
                    // Editors should not access Creator posting portal
                    <Navigate to="/" replace />
                  ) : (
                    <ContentView
                      onOpenCreateModal={() => setIsCreateModalOpen(true)}
                      projects={creatorProjects.length > 0 ? creatorProjects : allProjectList}
                      onSelectProject={setSelectedProjectModal}
                    />
                  )
                }
              />

              {/* Route 3: My Projects */}
              <Route
                path="/projects"
                element={
                  <MyProjectsView onSelectProject={setSelectedProjectModal} />
                }
              />

              {/* Route 4: Saved Projects */}
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

              {/* Route 5: Earn (Freelancer / Editor earnings) */}
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
      {/* CreateProjectModal: only accessible to Creators */}
      {!isEditor && (
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onAddProject={handleAddProject}
        />
      )}

      <AskEditorModal
        isOpen={isAskEditorOpen}
        onClose={() => setIsAskEditorOpen(false)}
      />

      {/* ProjectDetailModal: view requirements, budget, deadline, files, creator */}
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
          logout();
        }}
      />
    </div>
  );
}

export default App;
