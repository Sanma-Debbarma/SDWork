import { Project } from '../types';

export const FEATURED_PROJECTS: Project[] = [
  {
    id: 'feat-1',
    title: 'Modern Website Design & Development',
    category: 'Web Development',
    creator: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$2,500 - $4,000',
    budgetMin: 2500,
    budgetMax: 4000,
    timeAgo: '2h ago',
    likes: 24,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/featured-1-web.png',
    theme: 'purple',
    topIconType: 'star',
    experienceLevel: 'Expert',
    featured: true,
    description: 'Complete redesign and modern front-end build for a high-growth tech platform with responsive animations and custom design system.'
  },

];

export const ALL_PROJECTS: Project[] = [
  {
    id: 'all-1',
    title: 'SaaS Dashboard UI Design',
    category: 'UI/UX Design',
    creator: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$2,000 - $3,500',
    budgetMin: 2000,
    budgetMax: 3500,
    timeAgo: '2h ago',
    likes: 45,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/all-1-dashboard.png',
    theme: 'purple',
    topIconType: 'nodes',
    experienceLevel: 'Expert',
    description: 'Clean isometric layout and dashboard analytics interface with real-time metrics, data visualization, and light/dark theme support.'
  },
];
