/* Animation easing presets */
export const EASE = {
  smooth: 'power3.out',
  smoothIn: 'power3.in',
  smoothInOut: 'power3.inOut',
  luxury: 'power4.out',
  luxuryInOut: 'power4.inOut',
  expo: 'expo.out',
  expoInOut: 'expo.inOut',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'back.out(1.7)',
  sharp: 'circ.out',
};

/* Animation duration presets (in seconds) */
export const DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 1,
  slower: 1.4,
  slowest: 2,
  preloader: 2.5,
};

/* Stagger presets */
export const STAGGER = {
  fast: 0.02,
  normal: 0.04,
  slow: 0.06,
  letters: 0.03,
  cards: 0.1,
  sections: 0.15,
};

/* Breakpoints */
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
  wide: 1920,
};

/* Design Colors */
export const COLORS = {
  bg: '#080808',
  primary: '#7d1412',
  primaryLight: '#be2421',
  burgundy: '#4a0b0a',
  accent: '#a91f1c',
  white: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textMuted: 'rgba(255, 255, 255, 0.35)',
};

/* Image placeholders — all from Unsplash (free to use) */
export const IMAGES = {
  hero1: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  hero2: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
  hero3: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80',
  hero4: 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=800&q=80',
};

/* Check if on mobile */
export const isMobile = () => window.innerWidth <= BREAKPOINTS.tablet;
export const isTablet = () => window.innerWidth <= BREAKPOINTS.laptop && window.innerWidth > BREAKPOINTS.tablet;
