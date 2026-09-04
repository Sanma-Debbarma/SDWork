export type CategoryType =
  | 'All Categories'
  | 'Web Development'
  | 'Mobile Development'
  | 'UI/UX Design'
  | 'Graphic Design'
  | 'Content Writing'
  | 'Digital Marketing'
  | 'Video & Animation'
  | '3D & Modeling';

export interface Category {
  id: string;
  name: CategoryType;
  iconName: string;
  color: string;
  bgColor: string;
}

export interface Creator {
  name: string;
  avatar: string;
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: CategoryType;
  creator: Creator;
  budget: string;
  budgetMin: number;
  budgetMax: number;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  image: string;
  theme: 'purple' | 'peach' | 'mint' | 'blue' | 'yellow';
  topIconType?: 'star' | 'sphere' | 'cube' | 'ribbon' | 'shield' | 'react' | 'crystal' | 'social' | 'video' | 'nodes';
  experienceLevel?: 'Entry' | 'Intermediate' | 'Expert';
  description?: string;
  featured?: boolean;
  status?: 'open' | 'in_production' | 'completed';  // NEW
  proposals?: number;                                 // NEW
}

export type SortOption = 'newest' | 'likes' | 'budget_high' | 'budget_low';
export type BudgetFilter = 'all' | 'under1k' | '1k_3k' | '3k_5k' | '5k_plus';
export type ExperienceFilter = 'all' | 'entry' | 'intermediate' | 'expert';
