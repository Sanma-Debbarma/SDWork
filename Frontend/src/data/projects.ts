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
  {
    id: 'feat-2',
    title: 'Mobile App UI/UX Design',
    category: 'UI/UX Design',
    creator: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$1,500 - $3,000',
    budgetMin: 1500,
    budgetMax: 3000,
    timeAgo: '5h ago',
    likes: 18,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/featured-2-mobile.png',
    theme: 'peach',
    topIconType: 'sphere',
    experienceLevel: 'Intermediate',
    featured: true,
    description: 'Native iOS & Android mobile design with interactive prototypes, user journey mapping, and comprehensive design tokens.'
  },
  {
    id: 'feat-3',
    title: 'E-commerce Store Development',
    category: 'Web Development',
    creator: {
      name: 'David Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$3,000 - $6,000',
    budgetMin: 3000,
    budgetMax: 6000,
    timeAgo: '1d ago',
    likes: 32,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/featured-3-ecommerce.png',
    theme: 'mint',
    topIconType: 'cube',
    experienceLevel: 'Expert',
    featured: true,
    description: 'High-conversion headless Shopify storefront featuring instant search, dynamic cart drawer, and 3D product previews.'
  },
  {
    id: 'feat-4',
    title: 'Brand Identity Design Package',
    category: 'Graphic Design',
    creator: {
      name: 'Lisa Anderson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$800 - $1,500',
    budgetMin: 800,
    budgetMax: 1500,
    timeAgo: '1d ago',
    likes: 15,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/featured-4-brand.png',
    theme: 'blue',
    topIconType: 'ribbon',
    experienceLevel: 'Intermediate',
    featured: true,
    description: 'Comprehensive brand guide including logo marks, typography scales, color palettes, and social media starter templates.'
  },
  {
    id: 'feat-5',
    title: 'SEO Content Writing (10 Articles)',
    category: 'Content Writing',
    creator: {
      name: 'James Brown',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$300 - $600',
    budgetMin: 300,
    budgetMax: 600,
    timeAgo: '2d ago',
    likes: 12,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/featured-5-seo.png',
    theme: 'yellow',
    topIconType: 'shield',
    experienceLevel: 'Entry',
    featured: true,
    description: 'Ten thoroughly researched, keyword-optimized articles tailored for fintech and SaaS companies to boost organic Google ranking.'
  }
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
  {
    id: 'all-2',
    title: 'React Developer Needed',
    category: 'Web Development',
    creator: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$4,000 - $6,000',
    budgetMin: 4000,
    budgetMax: 6000,
    timeAgo: '3h ago',
    likes: 38,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/all-2-react.png',
    theme: 'blue',
    topIconType: 'react',
    experienceLevel: 'Expert',
    description: 'Seeking Senior React / TypeScript engineer to architect state management, optimize rendering bottlenecks, and build reusable UI components.'
  },
  {
    id: 'all-3',
    title: 'Logo & Brand Identity Design',
    category: 'Graphic Design',
    creator: {
      name: 'Mia Tanaka',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$500 - $900',
    budgetMin: 500,
    budgetMax: 900,
    timeAgo: '5h ago',
    likes: 29,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/all-3-logo.png',
    theme: 'peach',
    topIconType: 'crystal',
    experienceLevel: 'Intermediate',
    description: 'Geometric faceted logo design, stationery mockups, and social media brand guidelines for a futuristic tech venture.'
  },
  {
    id: 'all-4',
    title: 'Social Media Marketing Manager',
    category: 'Digital Marketing',
    creator: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$800 - $1,200',
    budgetMin: 800,
    budgetMax: 1200,
    timeAgo: '7h ago',
    likes: 22,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/all-4-social.png',
    theme: 'mint',
    topIconType: 'social',
    experienceLevel: 'Intermediate',
    description: 'Strategic social content calendar creation, organic engagement acceleration, and short-form video optimization across Instagram & TikTok.'
  },
  {
    id: 'all-5',
    title: 'Video Editing for YouTube Channel',
    category: 'Video & Animation',
    creator: {
      name: 'Chloe Bennett',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$600 - $1,000',
    budgetMin: 600,
    budgetMax: 1000,
    timeAgo: '9h ago',
    likes: 31,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/all-5-video.png',
    theme: 'purple',
    topIconType: 'video',
    experienceLevel: 'Intermediate',
    description: 'Fast-paced YouTube video editing with sound effects, dynamic zooms, color grading, motion subtitles, and click-worthy hooks.'
  },
  {
    id: 'all-6',
    title: '3D Product Modeling for Blender',
    category: '3D & Modeling',
    creator: {
      name: 'Julian Hayes',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$1,200 - $2,400',
    budgetMin: 1200,
    budgetMax: 2400,
    timeAgo: '11h ago',
    likes: 19,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/all-6-3d.png',
    theme: 'blue',
    topIconType: 'cube',
    experienceLevel: 'Expert',
    description: 'Photorealistic 3D product CAD modeling, texturing, lighting, and 4K studio renders for high-end consumer hardware.'
  },
  {
    id: 'all-7',
    title: 'iOS Fitness & Health Tracking App',
    category: 'Mobile Development',
    creator: {
      name: 'Sophia Patel',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$3,500 - $5,500',
    budgetMin: 3500,
    budgetMax: 5500,
    timeAgo: '14h ago',
    likes: 41,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/featured-2-mobile.png',
    theme: 'peach',
    topIconType: 'sphere',
    experienceLevel: 'Expert',
    description: 'SwiftUI iOS application featuring Apple Watch sync, HealthKit background workouts, and motivational habit loops.'
  },
  {
    id: 'all-8',
    title: 'AI Chatbot & Workflow Automation',
    category: 'Web Development',
    creator: {
      name: 'Nathan Brooks',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$2,800 - $4,800',
    budgetMin: 2800,
    budgetMax: 4800,
    timeAgo: '1d ago',
    likes: 53,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/all-1-dashboard.png',
    theme: 'mint',
    topIconType: 'nodes',
    experienceLevel: 'Expert',
    description: 'Autonomous customer support agent built with LangChain, Pinecone vector embeddings, and real-time CRM webhooks.'
  },
  {
    id: 'all-9',
    title: 'Technical Whitepaper & Case Studies',
    category: 'Content Writing',
    creator: {
      name: 'Rachel Green',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$750 - $1,400',
    budgetMin: 750,
    budgetMax: 1400,
    timeAgo: '1d ago',
    likes: 16,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/featured-5-seo.png',
    theme: 'yellow',
    topIconType: 'shield',
    experienceLevel: 'Intermediate',
    description: 'In-depth enterprise whitepaper explaining zero-trust cloud infrastructure and security compliance standards.'
  },
  {
    id: 'all-10',
    title: 'Animated 3D Explainer Video',
    category: 'Video & Animation',
    creator: {
      name: 'Leo Martinez',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      verified: true
    },
    budget: '$1,400 - $2,600',
    budgetMin: 1400,
    budgetMax: 2600,
    timeAgo: '2d ago',
    likes: 27,
    isLiked: false,
    isBookmarked: false,
    image: '/assets/all-5-video.png',
    theme: 'purple',
    topIconType: 'video',
    experienceLevel: 'Intermediate',
    description: '60-second high-energy product launch video featuring smooth 3D camera transitions, spatial sound effects, and kinetic typography.'
  }
];
