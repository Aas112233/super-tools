import React, { useState, Fragment, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';

import { TOOLS_REGISTRY, CATEGORIES_CONFIG as CENTRALIZED_CATEGORIES, getToolById as centralGetToolById } from '../config/toolsConfig';
import { 
  ChevronRight, Star, Type, Image, Palette, Code, MoreHorizontal, Zap, Sun, Moon, FileText, Hash, PenTool, Eye, Scissors, Crop, Filter, Maximize, Droplets, Loader, CheckSquare, ToggleLeft, Grid, Camera, Link as LinkIcon, Smartphone, Binary, Globe, Lock, List, QrCode, Barcode, CreditCard, Layers, BarChart2, Menu, Search, X, Clock, Bookmark, BookmarkPlus, Info, Keyboard, TrendingUp, RotateCw, Archive, Shield
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useMobile } from '../hooks/useMobile';
import { MobileTouchHandler } from './MobileTouchHandler';
import '../styles/mobile-responsive.css';
import '../styles/animated-text.css';
import SEOHead from './SEOHead';

interface Tool {
  id: string;
  name: string;
  href: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  tools: string[];
}

interface UsageStats {
  [toolId: string]: {
    count: number;
    lastUsed: number;
  };
}

interface RecentTool {
  toolId: string;
  timestamp: number;
}

// Create local categories with icons for Layout component
const CATEGORIES_CONFIG: Category[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <Grid className="w-5 h-5 text-indigo-400 drop-shadow-sm" />,
    tools: []
  },
  {
    id: 'favorite-tools',
    name: 'Bookmarked Tools',
    icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />,
    tools: []
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    icon: <Type className="w-5 h-5 text-blue-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'text-tools')?.tools || []
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    icon: <Image className="w-5 h-5 text-emerald-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'image-tools')?.tools || []
  },
  {
    id: 'css-tools',
    name: 'CSS Tools',
    icon: <Palette className="w-5 h-5 text-violet-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'css-tools')?.tools || []
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    icon: <Code className="w-5 h-5 text-rose-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'developer-tools')?.tools || []
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    icon: <FileText className="w-5 h-5 text-red-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'pdf-tools')?.tools || []
  },
  {
    id: 'generator-tools',
    name: 'Generator Tools',
    icon: <QrCode className="w-5 h-5 text-green-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'generator-tools')?.tools || []
  },
  {
    id: 'chart-tools',
    name: 'Chart Tools',
    icon: <BarChart2 className="w-5 h-5 text-green-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'chart-tools')?.tools || []
  },
  {
    id: 'social-media-tools',
    name: 'Social Media Tools',
    icon: <Smartphone className="w-5 h-5 text-pink-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'social-media-tools')?.tools || []
  },
  {
    id: 'google-maps-tools',
    name: 'Google Maps Tools',
    icon: <Globe className="w-5 h-5 text-teal-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'google-maps-tools')?.tools || []
  },

  {
    id: 'business-tools',
    name: 'Business Tools',
    icon: <CreditCard className="w-5 h-5 text-indigo-400 drop-shadow-sm" />,
    tools: CENTRALIZED_CATEGORIES.find(c => c.id === 'business-tools')?.tools || []
  }
];

// Use centralized getToolById function
const getToolById = centralGetToolById;

// Function to get appropriate icon for each tool
const getToolIcon = (toolId: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    // Text Tools
    'case-converter': <Type className="w-3.5 h-3.5 text-blue-500" />,
    'lorem-ipsum-generator': <FileText className="w-3.5 h-3.5 text-blue-500" />,
    'letter-counter': <Hash className="w-3.5 h-3.5 text-blue-500" />,
    'text-to-handwriting-converter': <PenTool className="w-3.5 h-3.5 text-blue-500" />,
    'bionic-text-converter': <Eye className="w-3.5 h-3.5 text-blue-500" />,
    'bionic-reading-converter': <Eye className="w-3.5 h-3.5 text-blue-500" />,
    'whitespace-cleaner': <Scissors className="w-3.5 h-3.5 text-blue-500" />,
    'font-pairing-finder': <Type className="w-3.5 h-3.5 text-blue-500" />,
    'handwriting-generator': <PenTool className="w-3.5 h-3.5 text-blue-500" />,
    'rich-text-editor': <FileText className="w-3.5 h-3.5 text-blue-500" />,
    'color-prism-handwriting-converter': <PenTool className="w-3.5 h-3.5 text-blue-500" />,
    
    // Image Tools
    'image-trimmer': <Crop className="w-3.5 h-3.5 text-emerald-500" />,
    'photo-filters': <Filter className="w-3.5 h-3.5 text-emerald-500" />,
    'image-resizer': <Maximize className="w-3.5 h-3.5 text-emerald-500" />,
    'image-average-color-finder': <Droplets className="w-3.5 h-3.5 text-emerald-500" />,
    'image-color-extractor': <Droplets className="w-3.5 h-3.5 text-emerald-500" />,
    'image-color-picker': <Droplets className="w-3.5 h-3.5 text-emerald-500" />,
    'image-background-remover': <Scissors className="w-3.5 h-3.5 text-emerald-500" />,
    'image-to-pdf': <FileText className="w-3.5 h-3.5 text-emerald-500" />,
    'free-4k-wallpaper': <Image className="w-3.5 h-3.5 text-emerald-500" />,
    'gif-finder': <Image className="w-3.5 h-3.5 text-emerald-500" />,
    'graphics-editor': <PenTool className="w-3.5 h-3.5 text-emerald-500" />,
    
    // CSS Tools
    'css-loader-generator': <Loader className="w-3.5 h-3.5 text-violet-500" />,
    'css-checkbox-generator': <CheckSquare className="w-3.5 h-3.5 text-violet-500" />,
    'css-switch-generator': <ToggleLeft className="w-3.5 h-3.5 text-violet-500" />,
    'css-clip-path-generator': <Scissors className="w-3.5 h-3.5 text-violet-500" />,
    'css-background-pattern-generator': <Grid className="w-3.5 h-3.5 text-violet-500" />,
    'css-cubic-bezier-generator': <TrendingUp className="w-3.5 h-3.5 text-violet-500" />,
    'css-glassmorphism-generator': <Layers className="w-3.5 h-3.5 text-violet-500" />,
    'css-border-radius-generator': <Crop className="w-3.5 h-3.5 text-violet-500" />,
    'css-formatter': <Code className="w-3.5 h-3.5 text-violet-500" />,
    'css-minifier': <Archive className="w-3.5 h-3.5 text-violet-500" />,
    
    // Developer Tools
    'code-to-image-converter': <Camera className="w-3.5 h-3.5 text-rose-500" />,
    'url-slug-generator': <LinkIcon className="w-3.5 h-3.5 text-rose-500" />,
    'react-native-shadow-generator': <Smartphone className="w-3.5 h-3.5 text-rose-500" />,
    'base64-encoder-decoder': <Binary className="w-3.5 h-3.5 text-rose-500" />,
    'html-encoder-decoder': <Code className="w-3.5 h-3.5 text-rose-500" />,
    'url-encoder-decoder': <Globe className="w-3.5 h-3.5 text-rose-500" />,
    'html-minifier': <Archive className="w-3.5 h-3.5 text-rose-500" />,
    'javascript-minifier': <Archive className="w-3.5 h-3.5 text-rose-500" />,
    'html-formatter': <Code className="w-3.5 h-3.5 text-rose-500" />,
    'javascript-formatter': <Code className="w-3.5 h-3.5 text-rose-500" />,
    'md5-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha1-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha224-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha256-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha384-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha512-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'jwt-encoder-decoder': <Shield className="w-3.5 h-3.5 text-rose-500" />,
    'json-tree-viewer': <List className="w-3.5 h-3.5 text-rose-500" />,
    
    // Generator Tools
    'qrcode-generator': <QrCode className="w-3.5 h-3.5 text-green-500" />,
    'barcode-generator': <Barcode className="w-3.5 h-3.5 text-green-500" />,
    'bulk-barcode-qr-generator': <QrCode className="w-3.5 h-3.5 text-green-500" />,
    'list-randomizer': <List className="w-3.5 h-3.5 text-green-500" />,
    'strong-random-password-generator': <Lock className="w-3.5 h-3.5 text-green-500" />,
    
    // Social Media Tools
    'instagram-filters': <Filter className="w-3.5 h-3.5 text-sky-500" />,
    'instagram-post-generator': <Image className="w-3.5 h-3.5 text-sky-500" />,
    'instagram-photo-downloader': <Image className="w-3.5 h-3.5 text-sky-500" />,
    
    // Chart Tools
    'echarts-integration': <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />,
    'data-visualization-builder': <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />,
    'chart-exporter': <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />,
    
    // Google Maps Tools
    'maps-data-scraper': <Globe className="w-3.5 h-3.5 text-teal-500" />,
    
    // PDF Tools
    'pdf-merge': <FileText className="w-3.5 h-3.5 text-red-500" />,
    'pdf-split': <Scissors className="w-3.5 h-3.5 text-red-500" />,
    'pdf-extract-pages': <FileText className="w-3.5 h-3.5 text-red-500" />,
    'pdf-rotate': <RotateCw className="w-3.5 h-3.5 text-red-500" />,
    'pdf-crop': <Crop className="w-3.5 h-3.5 text-red-500" />,
    'pdf-to-image': <Image className="w-3.5 h-3.5 text-red-500" />,
    'pdf-to-word': <FileText className="w-3.5 h-3.5 text-red-500" />,
    'pdf-password': <Lock className="w-3.5 h-3.5 text-red-500" />,
    'pdf-add-watermark': <Droplets className="w-3.5 h-3.5 text-red-500" />,
    'pdf-add-page-numbers': <Hash className="w-3.5 h-3.5 text-red-500" />,
    'pdf-metadata': <Info className="w-3.5 h-3.5 text-red-500" />,
    'pdf-compress': <Archive className="w-3.5 h-3.5 text-red-500" />,
    
    // Color Tools
    'color-prism': <Palette className="w-3.5 h-3.5 text-pink-500" />
  };
  
  return iconMap[toolId] || <div className="w-3.5 h-3.5 rounded-full bg-gray-400"></div>;
};

// Local storage utilities
const FAVORITES_KEY = 'super-tools-favorites';
const USAGE_STATS_KEY = 'super-tools-usage-stats';
const RECENT_TOOLS_KEY = 'super-tools-recent';

const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : ['case-converter', 'lorem-ipsum-generator', 'letter-counter'];
  } catch {
    return ['case-converter', 'lorem-ipsum-generator', 'letter-counter'];
  }
};

const saveFavorites = (favorites: string[]) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Silently fail if localStorage is not available
  }
};

const getUsageStats = (): UsageStats => {
  try {
    const stored = localStorage.getItem(USAGE_STATS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveUsageStats = (stats: UsageStats) => {
  try {
    localStorage.setItem(USAGE_STATS_KEY, JSON.stringify(stats));
  } catch {
    // Silently fail if localStorage is not available
  }
};

const getRecentTools = (): RecentTool[] => {
  try {
    const stored = localStorage.getItem(RECENT_TOOLS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRecentTools = (recent: RecentTool[]) => {
  try {
    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(recent));
  } catch {
    // Silently fail if localStorage is not available
  }
};

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isRecentExpanded, setIsRecentExpanded] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(getFavorites());
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [recentTools, setRecentTools] = useState<RecentTool[]>(getRecentTools());
  const [usageStats, setUsageStats] = useState<UsageStats>(getUsageStats());
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ name: string; path: string }>>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [dashboardManuallyCollapsed, setDashboardManuallyCollapsed] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const { isMobile, isLandscape, touchSupported } = useMobile();
  
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  
  const location = useLocation();
  
  // Utility functions
  const addToRecentTools = useCallback((toolId: string) => {
    const recent = getRecentTools();
    const filtered = recent.filter(item => item.toolId !== toolId);
    const updated = [{ toolId, timestamp: Date.now() }, ...filtered].slice(0, 5);
    saveRecentTools(updated);
  }, []);

  const updateUsageStats = useCallback((toolId: string) => {
    const stats = getUsageStats();
    stats[toolId] = {
      count: (stats[toolId]?.count || 0) + 1,
      lastUsed: Date.now()
    };
    saveUsageStats(stats);
  }, []);

  const updateBreadcrumbs = useCallback((path: string) => {
    const newBreadcrumbs: Array<{ name: string; path: string }> = [
      { name: 'Dashboard', path: '/tools/dashboard' }
    ];
    
    const toolEntry = Object.entries(TOOLS_REGISTRY).find(([_, tool]) => tool.href === path);
    if (toolEntry) {
      const [toolId, tool] = toolEntry;
      const category = CATEGORIES_CONFIG.find(cat => cat.tools.includes(toolId));
      if (category && category.id !== 'dashboard') {
        newBreadcrumbs.push({
          name: category.name,
          path: `/tools/${category.id}`
        });
      }
      newBreadcrumbs.push({
        name: tool.name,
        path: tool.href
      });
    } else if (path.startsWith('/tools/')) {
      const categoryId = path.split('/')[2];
      const category = CATEGORIES_CONFIG.find(cat => cat.id === categoryId);
      if (category && category.id !== 'dashboard') {
        newBreadcrumbs.push({
          name: category.name,
          path: path
        });
      }
    }
    
    setBreadcrumbs(newBreadcrumbs);
  }, []);

  // Track tool usage when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    const toolEntry = Object.entries(TOOLS_REGISTRY).find(([_, tool]) => tool.href === currentPath);
    if (toolEntry) {
      const [toolId] = toolEntry;
      addToRecentTools(toolId);
      updateUsageStats(toolId);
      setRecentTools(getRecentTools());
      setUsageStats(getUsageStats());
    }
    updateBreadcrumbs(currentPath);
  }, [location.pathname, addToRecentTools, updateUsageStats, updateBreadcrumbs]);
  
  // Enhanced sidebar logic
  useEffect(() => {
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    if (isDashboardPage) {
      if (!dashboardManuallyCollapsed) {
        setIsSidebarCollapsed(false);
      }
    } else {
      if (!sidebarHovered) {
        setIsSidebarCollapsed(true);
      }
      setDashboardManuallyCollapsed(false);
    }
  }, [location.pathname, sidebarHovered, dashboardManuallyCollapsed]);
  
  // Sidebar hover handlers
  const handleSidebarMouseEnter = useCallback(() => {
    setSidebarHovered(true);
    setIsSidebarCollapsed(false);
    
    // Auto-scroll to active tool on hover (desktop only)
    if (!isMobile) {
      setTimeout(() => {
        const activeToolElement = document.querySelector('.category-tool-override.active');
        if (activeToolElement) {
          activeToolElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 300);
    }
  }, [isMobile]);
  
  const handleSidebarMouseLeave = useCallback(() => {
    setSidebarHovered(false);
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    if (isDashboardPage) {
      if (dashboardManuallyCollapsed) {
        setIsSidebarCollapsed(true);
      }
    } else {
      setIsSidebarCollapsed(true);
    }
  }, [location.pathname, dashboardManuallyCollapsed]);
  
  const handleSidebarClick = useCallback(() => {
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      setSidebarHovered(true);
      
      // Auto-scroll to active tool on click
      setTimeout(() => {
        const activeToolElement = document.querySelector('.category-tool-override.active');
        if (activeToolElement) {
          activeToolElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 300);
      
      if (!isDashboardPage) {
        setTimeout(() => {
          setSidebarHovered(false);
          setIsSidebarCollapsed(true);
        }, 3000);
      }
    }
  }, [isSidebarCollapsed, location.pathname]);
  
  // Initialize expanded categories and auto-scroll
  useEffect(() => {
    const currentPath = location.pathname;
    const toolEntry = Object.entries(TOOLS_REGISTRY).find(([_, tool]) => tool.href === currentPath);
    
    if (toolEntry) {
      const [toolId] = toolEntry;
      const activeCategory = CATEGORIES_CONFIG.find(category => 
        category.tools.includes(toolId)
      );
      
      if (activeCategory) {
        // Expand only the active category (accordion behavior)
        setExpandedCategories({ [activeCategory.id]: true });
        
        // Auto-scroll to active tool after a short delay
        setTimeout(() => {
          const toolElement = document.querySelector(`[href="${currentPath}"]`);
          if (toolElement) {
            toolElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }, 400);
      }
    }
  }, [location.pathname]);
  
  // Enhanced mobile state management
  useEffect(() => {
    // Close mobile sidebar when switching to desktop
    if (!isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    
    // Adjust sidebar behavior based on device type
    if (isMobile) {
      setIsSidebarCollapsed(true);
      setSidebarHovered(false);
    } else {
      // Reset to default desktop behavior
      const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
      setIsSidebarCollapsed(!isDashboardPage);
    }
  }, [isMobile, isSidebarOpen, location.pathname]);

  // Enhanced Touch/Swipe gesture handlers for mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const minSwipeDistance = 60;
    const maxVerticalDistance = 100;
    
    const handleTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      });
    };
    
    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      const isVerticalSwipe = Math.abs(distanceY) > maxVerticalDistance;
      
      // Only handle horizontal swipes that aren't too vertical
      if (!isVerticalSwipe) {
        if (isLeftSwipe && isSidebarOpen) {
          // Swipe left to close sidebar on mobile
          setIsSidebarOpen(false);
        } else if (isRightSwipe && !isSidebarOpen && touchStart.x < 80) {
          // Swipe right from left edge to open sidebar on mobile (increased edge area)
          setIsSidebarOpen(true);
        }
      }
    };
    
    // Prevent default touch behavior on sidebar overlay
    const handleTouchStartOverlay = (e: TouchEvent) => {
      if (isSidebarOpen && e.target && (e.target as Element).classList.contains('bg-black')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchstart', handleTouchStartOverlay, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchstart', handleTouchStartOverlay);
    };
  }, [touchStart, touchEnd, isSidebarOpen, isMobile]);

  // Keyboard shortcuts (disabled on mobile)
  useEffect(() => {
    if (isMobile) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (isSidebarCollapsed) {
          setIsSidebarCollapsed(false);
          setSidebarHovered(true);
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
      
      if (e.key === 'Escape') {
        if (searchTerm) {
          setSearchTerm('');
        } else if (!isSidebarCollapsed) {
          setIsSidebarCollapsed(true);
        }
      }
      
      if (e.key === 'F1') {
        e.preventDefault();
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, isSidebarCollapsed, showKeyboardShortcuts, isMobile]);

  const handleCategoryClick = useCallback((categoryPath: string) => {
    navigate(categoryPath);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [navigate, isMobile]);
  
  const toggleFavorite = useCallback((toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  }, [favorites]);
  
  const handleToolHover = useCallback((toolId: string | null) => {
    // Disable tooltips on touch devices
    if (touchSupported) return;
    
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    if (toolId) {
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(toolId);
      }, 500);
    } else {
      setShowTooltip(null);
    }
  }, [touchSupported]);
  
  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, toolId: string) => {
    setDraggedItem(toolId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', toolId);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent, toolId: string) => {
    e.preventDefault();
    setDragOverItem(toolId);
    e.dataTransfer.dropEffect = 'move';
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setDragOverItem(null);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent, targetToolId: string, categoryId: string) => {
    e.preventDefault();
    const draggedToolId = draggedItem;
    
    if (!draggedToolId || draggedToolId === targetToolId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    
    if (categoryId === 'favorite-tools') {
      const newFavorites = [...favorites];
      const draggedIndex = newFavorites.indexOf(draggedToolId);
      const targetIndex = newFavorites.indexOf(targetToolId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        newFavorites.splice(draggedIndex, 1);
        const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        newFavorites.splice(newTargetIndex, 0, draggedToolId);
        
        setFavorites(newFavorites);
        saveFavorites(newFavorites);
      }
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  }, [draggedItem, favorites]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newExpanded: Record<string, boolean> = {};
      // Close all categories first (accordion behavior)
      Object.keys(prev).forEach(key => {
        newExpanded[key] = false;
      });
      // Open the clicked category if it wasn't already open
      newExpanded[categoryId] = !prev[categoryId];
      return newExpanded;
    });
  }, []);
  
  // Filter tools based on search term
  const filteredCategories = useMemo(() => {
    const dynamicCategories = CATEGORIES_CONFIG.map(category => {
      if (category.id === 'favorite-tools') {
        return {
          ...category,
          tools: favorites
        };
      }
      return category;
    }).filter(category => category.id !== 'dashboard');
    
    if (!searchTerm.trim()) {
      return dynamicCategories;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return dynamicCategories.map(category => {
      const filteredTools = category.tools.filter(toolId => {
        const tool = getToolById(toolId);
        return tool?.name.toLowerCase().includes(searchLower);
      });
      
      const categoryMatches = category.name.toLowerCase().includes(searchLower);
      
      if (categoryMatches || filteredTools.length > 0) {
        return {
          ...category,
          tools: categoryMatches ? category.tools : filteredTools
        };
      }
      
      return null;
    }).filter((category): category is Category => category !== null);
  }, [searchTerm, favorites]);
  
  // Get recently used tools for display
  const recentToolsList = useMemo(() => {
    return recentTools
      .map(recent => getToolById(recent.toolId))
      .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)
      .slice(0, 3);
  }, [recentTools]);

  const renderSidebarTools = useCallback((tools: string[], categoryId?: string) => {
    return tools.map((toolId) => {
      const tool = getToolById(toolId);
      if (!tool) return null;
      
      const isActive = location.pathname === tool.href;
      const isFavorite = favorites.includes(toolId);
      const usageCount = usageStats[toolId]?.count || 0;
      const isDragging = draggedItem === toolId;
      const isDragOver = dragOverItem === toolId;
      const isDraggable = categoryId === 'favorite-tools';
      
      return (
        <motion.li 
          key={tool.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`my-1 relative ${
            isDragging ? 'opacity-50' : ''
          } ${
            isDragOver ? 'border-t-2 border-blue-500' : ''
          }`}
          onMouseEnter={() => handleToolHover(toolId)}
          onMouseLeave={() => handleToolHover(null)}
        >
          <Link 
            to={tool.href} 
            className={`category-tool-override ${isActive ? 'active' : ''} group ${
              isDraggable ? 'cursor-move' : ''
            }`}
            onClick={() => {
              if (isMobile) {
                setIsSidebarOpen(false);
              }
            }}
            draggable={isDraggable}
            onDragStart={(e) => isDraggable && handleDragStart(e, toolId)}
            onDragOver={(e) => isDraggable && handleDragOver(e, toolId)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => isDraggable && handleDrop(e, toolId, categoryId!)}
          >
            {isDraggable && (
              <div className="drag-handle mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-3 h-3 text-gray-400 rotate-90" />
              </div>
            )}
            
            <div className="tool-icon-override">
              <div className="tool-icon-tile">
                <div className="tool-icon-inner">
                  {getToolIcon(toolId)}
                </div>
              </div>
            </div>
            <div className="tool-content-wrapper flex-1 min-w-0">
              <span className="tool-name-override">{tool.name}</span>
            </div>
            
            {usageCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {usageCount}
              </span>
            )}
            
            {/* Removed bookmark button */}
          </Link>
          
          {showTooltip === toolId && !isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-full ml-2 top-0 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 pointer-events-none"
            >
              {tool.name}
              {usageCount > 0 && (
                <span className="ml-1 text-blue-300">• Used {usageCount} times</span>
              )}
              {isDraggable && (
                <span className="ml-1 text-gray-300">• Drag to reorder</span>
              )}
            </motion.div>
          )}
        </motion.li>
      );
    });
  }, [location.pathname, favorites, usageStats, draggedItem, dragOverItem, showTooltip, isSidebarCollapsed, handleToolHover, handleDragStart, handleDragOver, handleDragLeave, handleDrop, toggleFavorite]);

  // Function to determine if a category is active
  const isCategoryActive = useCallback((categoryId: string) => {
    if (categoryId === 'favorite-tools') {
      return false;
    }
    return location.pathname.startsWith(`/tools/${categoryId}`);
  }, [location.pathname]);

  // Function to toggle sidebar collapse state
  const toggleSidebarCollapse = useCallback(() => {
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    if (isDashboardPage) {
      const newCollapsedState = !isSidebarCollapsed;
      setIsSidebarCollapsed(newCollapsedState);
      setDashboardManuallyCollapsed(newCollapsedState);
      setSidebarHovered(!newCollapsedState);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
      setSidebarHovered(!isSidebarCollapsed);
    }
  }, [isSidebarCollapsed, location.pathname]);

  return (
    <>
      <SEOHead />
      <MobileTouchHandler
      onSwipeRight={isMobile && !isSidebarOpen ? () => setIsSidebarOpen(true) : undefined}
      onSwipeLeft={isMobile && isSidebarOpen ? () => setIsSidebarOpen(false) : undefined}
      disabled={!isMobile}
      swipeThreshold={80}
      className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden"
    >
      {/* Enhanced Mobile Swipe Indicator */}
      {isMobile && !isSidebarOpen && !isLandscape && (
        <motion.div 
          className="mobile-swipe-indicator"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="flex items-center gap-1">
            <span>→</span>
            <span className="text-xs font-medium">Swipe to open</span>
          </div>
        </motion.div>
      )}
      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowKeyboardShortcuts(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
              <Keyboard className="w-5 h-5 mr-2" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Search tools</span>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">Ctrl+K</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Toggle sidebar</span>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">Ctrl+B</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Clear search/Close</span>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">Escape</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Help</span>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">F1</code>
              </div>
            </div>
            <button
              onClick={() => setShowKeyboardShortcuts(false)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Enhanced Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          onTouchStart={(e) => {
            // Prevent scrolling when overlay is touched
            e.preventDefault();
          }}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`sidebar-override ${
          isMobile 
            ? (isSidebarOpen ? 'mobile-open' : '') 
            : (isSidebarCollapsed ? 'collapsed' : '') + (isSidebarCollapsed && sidebarHovered ? ' hover-expanded' : '')
        } flex flex-col flex-shrink-0`}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          flexShrink: 0,
          minWidth: isMobile ? 'min(85vw, 320px)' : (isSidebarCollapsed ? '70px' : '280px'),
          maxWidth: isMobile ? 'min(85vw, 320px)' : (isSidebarCollapsed ? '70px' : '280px'),
          width: isMobile ? 'min(85vw, 320px)' : (isSidebarCollapsed ? '70px' : '280px'),
          zIndex: isMobile ? 50 : 'auto',
          height: isMobile ? '100vh' : 'auto'
        }}
        onMouseEnter={!isMobile ? handleSidebarMouseEnter : undefined}
        onMouseLeave={!isMobile ? handleSidebarMouseLeave : undefined}
        onClick={!isMobile ? handleSidebarClick : undefined}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="sidebar-header-override">
            <div className="flex items-center justify-between">
              {(isSidebarCollapsed && !isMobile) ? (
                <div className="flex items-center justify-center w-full">
                  <button 
                    onClick={toggleTheme}
                    className="sidebar-header-theme-toggle"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <>
                  <div className="sidebar-header-logo">
                    <div className="sidebar-header-logo-icon">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <a href="http://localhost:5173/#categories" className="animated-text-link">
                      <h1>1001S Tools</h1>
                    </a>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={toggleTheme}
                      className="sidebar-header-theme-toggle"
                      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Sidebar content */}
          <div className="collapse-container-override">
            {/* Search Bar */}
            {(!isSidebarCollapsed || isMobile) && (
              <div className="px-4 pb-2">
                <div className="sidebar-search-container relative">
                  <Search className="sidebar-search-icon absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sidebar-search-input w-full pl-10 pr-16 py-2 text-sm"
                  />
                  {!searchTerm && (
                    <span className="search-shortcut-badge">⌘K</span>
                  )}
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="sidebar-search-clear absolute right-3 top-1/2 transform -translate-y-1/2"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Breadcrumbs */}
            {(!isSidebarCollapsed || isMobile) && breadcrumbs.length > 1 && (
              <div className="px-4 pb-2">
                <nav className="text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1 overflow-x-auto">
                    {breadcrumbs.map((breadcrumb, index) => (
                      <Fragment key={breadcrumb.path}>
                        {index > 0 && (
                          <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        )}
                        <button
                          onClick={() => navigate(breadcrumb.path)}
                          className={`whitespace-nowrap hover:text-blue-500 transition-colors ${
                            index === breadcrumbs.length - 1 
                              ? 'text-blue-600 dark:text-blue-400 font-medium' 
                              : 'hover:underline'
                          }`}
                        >
                          {breadcrumb.name}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </nav>
              </div>
            )}
            
            {/* Recent Tools Section */}
            {(!isSidebarCollapsed || isMobile) && recentToolsList.length > 0 && !searchTerm && (
              <div className="px-4 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`collapse-item-override ${isRecentExpanded ? 'expanded' : ''}`}
                >
                  <div 
                    className="collapse-header-override cursor-pointer"
                    onClick={() => setIsRecentExpanded(!isRecentExpanded)}
                  >
                    <span className="category-icon-override">
                      <Clock className="w-5 h-5 text-blue-400 drop-shadow-sm" />
                    </span>
                    <span className="header-text-override">Recent Tools</span>
                    <motion.span
                      className="expand-icon-override"
                      animate={{ rotate: isRecentExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  </div>
                  
                  <AnimatePresence>
                    {isRecentExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="collapse-content-override"
                      >
                        <div className="category-tools-override">
                          <ul>
                            {recentToolsList.map(tool => tool && (
                              <motion.li 
                                key={tool.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="my-1"
                              >
                                <Link 
                                  to={tool.href} 
                                  className={`category-tool-override ${location.pathname === tool.href ? 'active' : ''}`}
                                  onClick={() => {
                                    if (isMobile) {
                                      setIsSidebarOpen(false);
                                    }
                                  }}
                                >
                                  <div className="tool-icon-override">
                                    <div className="tool-icon-tile">
                                      <div className="tool-icon-inner">
                                        <Clock className="w-3 h-3 text-blue-400" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tool-content-wrapper flex-1 min-w-0">
                                    <span className="tool-name-override">{tool.name}</span>
                                  </div>
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
            
            <ul className="space-y-1">
              {filteredCategories.map((category, index) => (
                <Fragment key={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`collapse-item-override ${expandedCategories[category.id] ? 'expanded' : ''}`}
                  >
                    <div 
                      className={`collapse-header-override ${isCategoryActive(category.id) ? 'active' : ''}`}
                      onClick={() => {
                        if (category.id === 'dashboard') {
                          handleCategoryClick('/tools/dashboard');
                        } else {
                          toggleCategory(category.id);
                        }
                      }}
                    >
                      <span className="category-icon-override">
                        {React.cloneElement(category.icon as React.ReactElement, {
                          className: `${isCategoryActive(category.id) ? 'text-white' : ''}`
                        })}
                      </span>
                      {(!isSidebarCollapsed || isMobile) && (
                        <>
                          <span className="header-text-override">{category.name}</span>
                          {category.tools.length > 0 && !['image-editor', 'favorite-tools', 'dashboard'].includes(category.id) && (
                            <motion.span
                              className="expand-icon-override"
                              animate={{ rotate: expandedCategories[category.id] ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className={`w-4 h-4 ${isCategoryActive(category.id) ? 'text-white' : ''}`} />
                            </motion.span>
                          )}
                        </>
                      )}
                    </div>
                    
                    {category.tools.length > 0 && !['image-editor', 'favorite-tools', 'dashboard'].includes(category.id) && (
                      <AnimatePresence>
                        {expandedCategories[category.id] && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="collapse-content-override"
                          >
                            <div className="category-tools-override">
                              <ul>
                                {renderSidebarTools(category.tools, category.id)}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                </Fragment>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Enhanced Header */}
        <header className="header-container bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <motion.button
                  className="mr-3 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none rounded-lg transition-colors"
                  onClick={() => {
                    setIsSidebarOpen(true);
                    // Auto-scroll to active tool when opening mobile sidebar
                    setTimeout(() => {
                      const activeToolElement = document.querySelector('.category-tool-override.active');
                      if (activeToolElement) {
                        activeToolElement.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'center',
                          inline: 'nearest'
                        });
                      }
                    }, 400);
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Open sidebar menu"
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              )}
              <div className="flex items-center">
                <div className="relative">
                  <div 
                    className="absolute inset-0 w-[45px] h-[45px] rounded-2xl"
                    style={{
                      animation: 'borderRotate 8s linear infinite',
                      background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)'
                    }}
                  />
                  <div 
                    className="relative w-[45px] h-[45px] rounded-2xl bg-white p-2 shadow-lg m-[2px]"
                    style={{
                      animation: 'glow 2s ease-in-out infinite alternate',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)'
                    }}
                  >
                    <img 
                      src="/logo.png" 
                      alt="Super Tools Logo" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <style>{`
                    @keyframes glow {
                      from {
                        box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1);
                      }
                      to {
                        box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5), 0 0 90px rgba(59, 130, 246, 0.3);
                      }
                    }
                    @keyframes borderRotate {
                      from {
                        transform: rotate(0deg);
                      }
                      to {
                        transform: rotate(360deg);
                      }
                    }
                  `}</style>
                </div>
                {!isMobile && (
                  <a href="https://1001s.info/tools/dashboard" className="ml-15 text-12xl font-black animated-text-link premium-text lava-background">
                    1001S Tools
                  </a>
                )}
              </div>
            </div>
            
            {/* Mobile-specific header actions */}
            {isMobile && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none rounded-lg transition-colors"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        </header>
        
        {/* Enhanced Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
          <div className="max-w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </MobileTouchHandler>
    </>
  );
};

export default Layout;