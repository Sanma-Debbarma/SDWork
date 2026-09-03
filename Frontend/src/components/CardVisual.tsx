import React from 'react';

interface CardVisualProps {
  id: string;
  theme: 'purple' | 'peach' | 'mint' | 'blue' | 'yellow';
  title: string;
  image?: string;
}

export const CardVisual: React.FC<CardVisualProps> = ({ id, theme: _theme, title, image }) => {
  // If a local image exists (e.g., avatar or generated featured 1 & 2), try showing it first
  const [hasImageError, setHasImageError] = React.useState(false);

  if (image && !hasImageError) {
    return (
      <img
        src={image}
        alt={title}
        className="max-h-[140px] max-w-[92%] object-contain drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
        onError={() => setHasImageError(true)}
      />
    );
  }

  // High-Fidelity Custom 3D SVG Renderers matching the reference image perfectly:
  switch (id) {
    case 'feat-1': // Modern Website Design & Development (Perspective 3D Browser Window on Lavender)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="98" rx="70" ry="22" fill="#E9D5FF" opacity="0.6" />
          {/* Angled Perspective Browser Screen */}
          <g transform="translate(36, 16) skewY(-6) rotate(-2)">
            <rect x="0" y="0" width="112" height="74" rx="6" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="1.5" />
            {/* Window bar */}
            <rect x="0" y="0" width="112" height="13" rx="6" fill="#EDE9FE" />
            <circle cx="8" cy="6.5" r="2.5" fill="#C4B5FD" />
            <circle cx="15" cy="6.5" r="2.5" fill="#DDD6FE" />
            <circle cx="22" cy="6.5" r="2.5" fill="#DDD6FE" />
            {/* Header pill */}
            <rect x="36" y="20" width="40" height="7" rx="3.5" fill="#7C3AED" />
            <rect x="30" y="32" width="52" height="4" rx="2" fill="#DDD6FE" />
            {/* 3 App Cards */}
            <rect x="8" y="42" width="28" height="24" rx="4" fill="#FAF5FF" stroke="#DDD6FE" strokeWidth="1" />
            <rect x="42" y="42" width="28" height="24" rx="4" fill="#FAF5FF" stroke="#DDD6FE" strokeWidth="1" />
            <rect x="76" y="42" width="28" height="24" rx="4" fill="#FAF5FF" stroke="#DDD6FE" strokeWidth="1" />
            <rect x="12" y="48" width="14" height="3" rx="1.5" fill="#8B5CF6" />
            <rect x="46" y="48" width="14" height="3" rx="1.5" fill="#8B5CF6" />
            <rect x="80" y="48" width="14" height="3" rx="1.5" fill="#8B5CF6" />
          </g>
          {/* Floating purple sphere and sparkle */}
          <circle cx="160" cy="50" r="9" fill="#8B5CF6" opacity="0.8" />
          <circle cx="34" cy="78" r="5" fill="#C4B5FD" />
        </svg>
      );

    case 'feat-2': // Mobile App UI/UX Design (Perspective 3D Mobile Screens on Peach)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="98" rx="65" ry="22" fill="#FED7AA" opacity="0.6" />
          {/* Phone 1 (Left / Back) */}
          <g transform="translate(48, 15) rotate(-12)">
            <rect x="0" y="0" width="48" height="82" rx="8" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="1.5" />
            <rect x="15" y="4" width="18" height="3" rx="1.5" fill="#FDBA74" />
            <rect x="6" y="14" width="36" height="14" rx="4" fill="#FFEDD5" />
            <circle cx="24" cy="46" r="10" fill="#FB923C" />
            <rect x="8" y="64" width="32" height="6" rx="3" fill="#FED7AA" />
          </g>
          {/* Phone 2 (Right / Front) */}
          <g transform="translate(94, 25) rotate(8)">
            <rect x="0" y="0" width="52" height="86" rx="8" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="1.5" />
            <rect x="17" y="4" width="18" height="3" rx="1.5" fill="#F97316" />
            <rect x="8" y="14" width="22" height="4" rx="2" fill="#EA580C" />
            <rect x="8" y="24" width="36" height="24" rx="4" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1" />
            <line x1="12" y1="36" x2="38" y2="36" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />
            <rect x="8" y="56" width="36" height="18" rx="4" fill="#FFEDD5" />
          </g>
          {/* Floating peach spheres */}
          <circle cx="36" cy="72" r="8" fill="#F97316" opacity="0.9" />
          <circle cx="160" cy="85" r="6" fill="#FDBA74" />
        </svg>
      );
    case 'feat-3': // E-commerce Store Development (Dark tablet & teal packaging on mint)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          {/* Mint background glow */}
          <ellipse cx="100" cy="95" rx="70" ry="25" fill="#C6F6D5" opacity="0.6" />
          {/* Dark 3D Tablet screen */}
          <g transform="translate(45, 15) skewY(-8) rotate(-4)">
            <rect x="0" y="0" width="85" height="60" rx="6" fill="#1A202C" />
            <rect x="4" y="4" width="77" height="52" rx="4" fill="#2D3748" />
            {/* Tablet Store Mockup Content */}
            <rect x="8" y="8" width="28" height="4" rx="2" fill="#4FD1C5" />
            <rect x="8" y="15" width="20" height="2" rx="1" fill="#718096" />
            <rect x="8" y="21" width="18" height="14" rx="2" fill="#4A5568" />
            <rect x="29" y="21" width="18" height="14" rx="2" fill="#4A5568" />
            <rect x="50" y="21" width="18" height="14" rx="2" fill="#4A5568" />
            <rect x="8" y="38" width="45" height="12" rx="2" fill="#319795" />
          </g>
          {/* 3D Modern Teal Cosmetic / Product Packaging */}
          <g transform="translate(105, 52)">
            {/* Top surface */}
            <polygon points="25,0 50,12 25,24 0,12" fill="#4FD1C5" />
            {/* Left face */}
            <polygon points="0,12 25,24 25,58 0,46" fill="#319795" />
            {/* Right face */}
            <polygon points="25,24 50,12 50,46 25,58" fill="#285E61" />
            {/* Minimal brand stripe */}
            <line x1="8" y1="20" x2="20" y2="26" stroke="#E6FFFA" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Small floating mint sphere */}
          <circle cx="42" cy="78" r="7" fill="#68D391" opacity="0.85" />
        </svg>
      );

    case 'feat-4': // Brand Identity Design Package (Isometric blue identity blocks & letterhead)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="98" rx="65" ry="20" fill="#BFDBFE" opacity="0.6" />
          {/* Isometric Blue 3D Box Pillar */}
          <g transform="translate(110, 25)">
            <polygon points="22,0 44,11 22,22 0,11" fill="#60A5FA" />
            <polygon points="0,11 22,22 22,65 0,54" fill="#3B82F6" />
            <polygon points="22,22 44,11 44,54 22,65" fill="#1D4ED8" />
          </g>
          {/* Floating Stationery Letterhead & Business cards */}
          <g transform="translate(42, 38) rotate(-14) skewX(10)">
            <rect x="0" y="0" width="55" height="40" rx="3" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="4" fill="#3B82F6" />
            <rect x="18" y="8" width="22" height="3" rx="1.5" fill="#93C5FD" />
            <rect x="8" y="18" width="38" height="2" rx="1" fill="#E2E8F0" />
            <rect x="8" y="23" width="30" height="2" rx="1" fill="#E2E8F0" />
            <rect x="8" y="28" width="35" height="2" rx="1" fill="#E2E8F0" />
          </g>
          {/* Smaller blue block */}
          <g transform="translate(75, 68)">
            <polygon points="15,0 30,7.5 15,15 0,7.5" fill="#93C5FD" />
            <polygon points="0,7.5 15,15 15,35 0,27.5" fill="#60A5FA" />
            <polygon points="15,15 30,7.5 30,27.5 15,35" fill="#3B82F6" />
          </g>
        </svg>
      );

    case 'feat-5': // SEO Content Writing (Golden shield & document with pencil)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="98" rx="65" ry="22" fill="#FDE68A" opacity="0.6" />
          {/* 3D Paper document */}
          <g transform="translate(68, 22) rotate(6)">
            <rect x="0" y="0" width="62" height="74" rx="4" fill="#FFFDF8" stroke="#FDE68A" strokeWidth="1.5" />
            <rect x="8" y="12" width="35" height="4" rx="2" fill="#F59E0B" />
            <rect x="8" y="22" width="46" height="2.5" rx="1" fill="#E5E7EB" />
            <rect x="8" y="28" width="42" height="2.5" rx="1" fill="#E5E7EB" />
            <rect x="8" y="34" width="46" height="2.5" rx="1" fill="#E5E7EB" />
            <rect x="8" y="40" width="30" height="2.5" rx="1" fill="#E5E7EB" />
            <rect x="8" y="48" width="20" height="6" rx="3" fill="#FEF3C7" />
          </g>
          {/* 3D Golden Security/SEO Shield */}
          <g transform="translate(38, 38)">
            <path
              d="M18 0 C28 5 36 0 36 0 C36 22 25 36 18 40 C11 36 0 22 0 0 C0 0 8 5 18 0 Z"
              fill="url(#goldGrad)"
              stroke="#D97706"
              strokeWidth="1"
            />
            <path
              d="M18 6 C24 9 29 6 29 6 C29 20 22 28 18 31 C14 28 7 20 7 6 C7 6 12 9 18 6 Z"
              fill="#F59E0B"
            />
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </g>
          {/* Golden pencil */}
          <g transform="translate(130, 48) rotate(35)">
            <rect x="0" y="0" width="8" height="42" rx="2" fill="#F59E0B" />
            <polygon points="0,42 8,42 4,50" fill="#FEF3C7" />
            <polygon points="2,48 6,48 4,50" fill="#1F2937" />
          </g>
        </svg>
      );

    case 'all-1': // SaaS Dashboard UI Design (3D isometric purple dashboard)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="95" rx="65" ry="22" fill="#E9D5FF" opacity="0.6" />
          {/* 3D Isometric Screen */}
          <g transform="translate(40, 22) skewX(-16) rotate(-4)">
            <rect x="0" y="0" width="88" height="62" rx="5" fill="#FFFFFF" stroke="#D8B4FE" strokeWidth="1.5" />
            <rect x="5" y="5" width="22" height="5" rx="2" fill="#9333EA" />
            <rect x="5" y="14" width="78" height="18" rx="3" fill="#FAF5FF" />
            {/* Chart wave */}
            <path d="M10 26 Q 25 18, 40 24 T 70 20" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
            {/* Grid rows */}
            <rect x="5" y="36" width="36" height="18" rx="3" fill="#F3E8FF" />
            <rect x="46" y="36" width="37" height="18" rx="3" fill="#F3E8FF" />
          </g>
          {/* Floating purple sphere */}
          <circle cx="145" cy="50" r="10" fill="#C084FC" opacity="0.9" />
          <circle cx="35" cy="75" r="6" fill="#DDD6FE" />
        </svg>
      );

    case 'all-2': // React Developer Needed (3D React atom / orbitals)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="98" rx="60" ry="20" fill="#BAE6FD" opacity="0.6" />
          <g transform="translate(100, 60)">
            {/* React nucleus */}
            <circle cx="0" cy="0" r="11" fill="#0284C7" />
            <circle cx="0" cy="0" r="14" fill="#38BDF8" opacity="0.4" />
            {/* Orbit 1 */}
            <ellipse cx="0" cy="0" rx="42" ry="16" fill="none" stroke="#0284C7" strokeWidth="2.5" transform="rotate(30)" />
            {/* Orbit 2 */}
            <ellipse cx="0" cy="0" rx="42" ry="16" fill="none" stroke="#0284C7" strokeWidth="2.5" transform="rotate(90)" />
            {/* Orbit 3 */}
            <ellipse cx="0" cy="0" rx="42" ry="16" fill="none" stroke="#0284C7" strokeWidth="2.5" transform="rotate(150)" />
            {/* Orbital electrons */}
            <circle cx="36" cy="18" r="4" fill="#38BDF8" />
            <circle cx="-38" cy="14" r="4" fill="#38BDF8" />
            <circle cx="0" cy="-40" r="4" fill="#38BDF8" />
          </g>
        </svg>
      );

    case 'all-3': // Logo & Brand Identity Design (3D Peach Faceted Crystal Gemstone)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="100" rx="55" ry="18" fill="#FED7AA" opacity="0.6" />
          {/* Faceted Crystal */}
          <g transform="translate(100, 62)">
            {/* Top facets */}
            <polygon points="0,-40 25,-15 0,0 -25,-15" fill="#FFEDD5" />
            {/* Upper left facet */}
            <polygon points="-25,-15 0,0 -22,25 -38,5" fill="#FDBA74" />
            {/* Upper right facet */}
            <polygon points="0,0 25,-15 38,5 22,25" fill="#FB923C" />
            {/* Center front diamond */}
            <polygon points="0,0 22,25 0,42 -22,25" fill="#EA580C" opacity="0.9" />
            {/* Sparkle lines */}
            <line x1="28" y1="-28" x2="38" y2="-38" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <line x1="-28" y1="-28" x2="-38" y2="-38" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'all-4': // Social Media Marketing (3D phone & social badges)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="98" rx="65" ry="20" fill="#BBF7D0" opacity="0.6" />
          {/* Center 3D Smartphone */}
          <g transform="translate(78, 20) rotate(5)">
            <rect x="0" y="0" width="46" height="78" rx="7" fill="#1F2937" />
            <rect x="3" y="3" width="40" height="72" rx="5" fill="#F9FAFB" />
            <rect x="18" y="5" width="10" height="2" rx="1" fill="#9CA3AF" />
            <circle cx="23" cy="22" r="7" fill="#10B981" />
            <rect x="8" y="34" width="30" height="3" rx="1.5" fill="#E5E7EB" />
            <rect x="8" y="40" width="22" height="3" rx="1.5" fill="#E5E7EB" />
          </g>
          {/* Floating Social Icons: Facebook, TikTok, Instagram, Twitter */}
          <g transform="translate(38, 35)">
            <circle cx="12" cy="12" r="11" fill="#1877F2" />
            <text x="12" y="16" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">f</text>
          </g>
          <g transform="translate(138, 30)">
            <rect x="0" y="0" width="22" height="22" rx="6" fill="#000000" />
            <text x="11" y="15" fill="#00F2FE" fontSize="11" fontWeight="bold" textAnchor="middle">♫</text>
          </g>
          <g transform="translate(142, 68)">
            <circle cx="10" cy="10" r="10" fill="#1DA1F2" />
            <text x="10" y="14" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">𝕏</text>
          </g>
          <g transform="translate(32, 68)">
            <rect x="0" y="0" width="22" height="22" rx="6" fill="url(#igGrad)" />
            <circle cx="11" cy="11" r="5" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="15" cy="7" r="1" fill="white" />
            <defs>
              <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#FD5949" />
                <stop offset="100%" stopColor="#D6249F" />
              </linearGradient>
            </defs>
          </g>
        </svg>
      );

    case 'all-5': // Video Editing for YouTube Channel (Glossy purple 3D play buttons & reel)
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="98" rx="60" ry="20" fill="#DDD6FE" opacity="0.6" />
          {/* Main 3D Glossy Play Button */}
          <g transform="translate(85, 40)">
            <rect x="0" y="0" width="50" height="42" rx="10" fill="#7C3AED" />
            <rect x="2" y="2" width="46" height="38" rx="8" fill="#8B5CF6" />
            <polygon points="18,12 34,21 18,30" fill="white" />
          </g>
          {/* Smaller floating play button */}
          <g transform="translate(48, 52) rotate(-15)">
            <rect x="0" y="0" width="34" height="28" rx="7" fill="#A78BFA" />
            <polygon points="13,8 24,14 13,20" fill="white" />
          </g>
          {/* Film reel timeline strip */}
          <g transform="translate(40, 24) rotate(8)">
            <rect x="0" y="0" width="70" height="12" rx="2" fill="#374151" />
            <rect x="4" y="3" width="6" height="6" fill="white" />
            <rect x="16" y="3" width="6" height="6" fill="white" />
            <rect x="28" y="3" width="6" height="6" fill="white" />
            <rect x="40" y="3" width="6" height="6" fill="white" />
            <rect x="52" y="3" width="6" height="6" fill="white" />
          </g>
        </svg>
      );

    default: // Generic sleek pastel 3D UI render
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-[135px] max-w-[90%] drop-shadow-sm">
          <ellipse cx="100" cy="98" rx="60" ry="20" fill="#E0E7FF" opacity="0.6" />
          <g transform="translate(55, 30)">
            <rect x="0" y="0" width="90" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="8" y="8" width="30" height="6" rx="3" fill="#6366F1" />
            <rect x="8" y="20" width="74" height="14" rx="3" fill="#EEF2FF" />
            <rect x="8" y="40" width="34" height="12" rx="3" fill="#E0E7FF" />
            <rect x="48" y="40" width="34" height="12" rx="3" fill="#E0E7FF" />
          </g>
        </svg>
      );
  }
};
