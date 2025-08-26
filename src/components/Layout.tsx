import React, { useState, Fragment, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight,
  Star, 
  Type, 
  Image, 
  Palette, 
  Code, 
  Share2, 
  MoreHorizontal,
  Zap,
  Sun,
  Moon,
  FileText,
  Hash,
  PenTool,
  Eye,
  Scissors,
  Crop,
  Filter,
  Maximize,
  Droplets,
  Loader,
  CheckSquare,
  ToggleLeft,
  Grid,
  Camera,
  Link as LinkIcon,
  Smartphone,
  Binary,
  Globe,
  Lock,
  List,
  QrCode,
  Barcode,
  CreditCard,
  Layers,
  BarChart2,
  Menu,
  Search,
  X,
  Clock,
  Heart,
  BookmarkPlus,
  BookmarkMinus,
  Bookmark,
  ChevronUp,
  Info,
  Keyboard,
  TrendingUp,
  History
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Tool {
  id: string;
  name: string;
  href: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  tools: string[];
}

// Central tool registry
const TOOLS_REGISTRY: Record<string, Tool> = {
  'case-converter': { id: 'case-converter', name: 'Case Converter', href: '/tools/case-converter' },
  'lorem-ipsum-generator': { id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum-generator' },
  'letter-counter': { id: 'letter-counter', name: 'Letter Counter', href: '/tools/letter-counter' },
  'text-to-handwriting-converter': { id: 'text-to-handwriting-converter', name: 'Text to Handwriting Converter', href: '/tools/text-to-handwriting-converter' },
  'bionic-reading-converter': { id: 'bionic-reading-converter', name: 'Bionic Reading Converter', href: '/tools/bionic-reading-converter' },
  'multiple-whitespace-remover': { id: 'multiple-whitespace-remover', name: 'Multiple Whitespace Remover', href: '/tools/multiple-whitespace-remover' },
  'google-fonts-pair-finder': { id: 'google-fonts-pair-finder', name: 'Google Fonts Pair Finder', href: '/tools/google-fonts-pair-finder' },
  'image-cropper': { id: 'image-cropper', name: 'Image Cropper', href: '/tools/image-cropper' },
  'image-filters': { id: 'image-filters', name: 'Image Filters', href: '/tools/image-filters' },
  'image-resizer': { id: 'image-resizer', name: 'Image Resizer', href: '/tools/image-resizer' },
  'image-average-color-finder': { id: 'image-average-color-finder', name: 'Image Average Color Finder', href: '/tools/image-average-color-finder' },
  'image-color-extractor': { id: 'image-color-extractor', name: 'Image Color Extractor', href: '/tools/image-color-extractor' },
  'image-color-picker': { id: 'image-color-picker', name: 'Image Color Picker', href: '/tools/image-color-picker' },
  'css-loader-generator': { id: 'css-loader-generator', name: 'CSS Loader Generator', href: '/tools/css-loader-generator' },
  'css-checkbox-generator': { id: 'css-checkbox-generator', name: 'CSS Checkbox Generator', href: '/tools/css-checkbox-generator' },
  'css-switch-generator': { id: 'css-switch-generator', name: 'CSS Switch Generator', href: '/tools/css-switch-generator' },
  'css-clip-path-generator': { id: 'css-clip-path-generator', name: 'CSS Clip Path Generator', href: '/tools/css-clip-path-generator' },
  'css-background-pattern-generator': { id: 'css-background-pattern-generator', name: 'CSS Background Pattern Generator', href: '/tools/css-background-pattern-generator' },
  'css-cubic-bezier-generator': { id: 'css-cubic-bezier-generator', name: 'CSS Cubic Bezier Generator', href: '/tools/css-cubic-bezier-generator' },
  'css-glassmorphism-generator': { id: 'css-glassmorphism-generator', name: 'CSS Glassmorphism Generator', href: '/tools/css-glassmorphism-generator' },
  'code-to-image-converter': { id: 'code-to-image-converter', name: 'Code Screenshot Generator', href: '/tools/code-to-image-converter' },
  'url-slug-generator': { id: 'url-slug-generator', name: 'SEO URL Creator', href: '/tools/url-slug-generator' },
  'react-native-shadow-generator': { id: 'react-native-shadow-generator', name: 'React Native Shadow Creator', href: '/tools/react-native-shadow-generator' },
  'base64-encoder-decoder': { id: 'base64-encoder-decoder', name: 'Base64 Converter', href: '/tools/base64-encoder-decoder' },
  'html-encoder-decoder': { id: 'html-encoder-decoder', name: 'HTML Encoder/Decoder', href: '/tools/html-encoder-decoder' },
  'url-encoder-decoder': { id: 'url-encoder-decoder', name: 'URL Encoder/Decoder', href: '/tools/url-encoder-decoder' },
  'html-minifier': { id: 'html-minifier', name: 'HTML Minifier', href: '/tools/html-minifier' },
  'css-minifier': { id: 'css-minifier', name: 'CSS Minifier', href: '/tools/css-minifier' },
  'javascript-minifier': { id: 'javascript-minifier', name: 'JavaScript Minifier', href: '/tools/javascript-minifier' },
  'html-formatter': { id: 'html-formatter', name: 'HTML Formatter', href: '/tools/html-formatter' },
  'css-formatter': { id: 'css-formatter', name: 'CSS Formatter', href: '/tools/css-formatter' },
  'javascript-formatter': { id: 'javascript-formatter', name: 'JavaScript Formatter', href: '/tools/javascript-formatter' },
  'md5-encrypt-decrypt': { id: 'md5-encrypt-decrypt', name: 'MD5 Hash Generator', href: '/tools/md5-encrypt-decrypt' },
  'sha1-encrypt-decrypt': { id: 'sha1-encrypt-decrypt', name: 'SHA1 Hash Generator', href: '/tools/sha1-encrypt-decrypt' },
  'sha224-encrypt-decrypt': { id: 'sha224-encrypt-decrypt', name: 'SHA224 Hash Generator', href: '/tools/sha224-encrypt-decrypt' },
  'sha256-encrypt-decrypt': { id: 'sha256-encrypt-decrypt', name: 'SHA256 Hash Generator', href: '/tools/sha256-encrypt-decrypt' },
  'sha384-encrypt-decrypt': { id: 'sha384-encrypt-decrypt', name: 'SHA384 Hash Generator', href: '/tools/sha384-encrypt-decrypt' },
  'sha512-encrypt-decrypt': { id: 'sha512-encrypt-decrypt', name: 'SHA512 Hash Generator', href: '/tools/sha512-encrypt-decrypt' },
  'jwt-encoder-decoder': { id: 'jwt-encoder-decoder', name: 'JWT Encoder/Decoder', href: '/tools/jwt-encoder-decoder' },
  'json-tree-viewer': { id: 'json-tree-viewer', name: 'JSON Tree Viewer', href: '/tools/json-tree-viewer' },
  'instagram-filters': { id: 'instagram-filters', name: 'Instagram Filter Effects', href: '/tools/instagram-filters' },
  'instagram-post-generator': { id: 'instagram-post-generator', name: 'Instagram Post Creator', href: '/tools/instagram-post-generator' },
  'instagram-photo-downloader': { id: 'instagram-photo-downloader', name: 'Instagram Image/Video Downloader', href: '/tools/instagram-photo-downloader' },
  'tweet-generator': { id: 'tweet-generator', name: 'Twitter Post Creator', href: '/tools/tweet-generator' },
  'tweet-to-image-converter': { id: 'tweet-to-image-converter', name: 'Tweet Image Generator', href: '/tools/tweet-to-image-converter' },
  'twitter-ad-revenue-generator': { id: 'twitter-ad-revenue-generator', name: 'Twitter Ad Earnings Calculator', href: '/tools/twitter-ad-revenue-generator' },
  'strong-random-password-generator': { id: 'strong-random-password-generator', name: 'Secure Password Creator', href: '/tools/strong-random-password-generator' },
  'list-randomizer': { id: 'list-randomizer', name: 'Item Shuffler', href: '/tools/list-randomizer' },
  'qr-code-generator': { id: 'qr-code-generator', name: 'QR Code Creator', href: '/tools/qr-code-generator' },
  'barcode-generator': { id: 'barcode-generator', name: 'Barcode Maker', href: '/tools/barcode-generator' },
  'bulk-barcode-qr-generator': { id: 'bulk-barcode-qr-generator', name: 'Bulk Barcode and QR Code Generator', href: '/tools/bulk-barcode-qr-generator' },
  'echarts-integration': { id: 'echarts-integration', name: 'ECharts Chart Builder', href: '/tools/echarts-integration' },
  'graphics-editor': { id: 'graphics-editor', name: 'Graphics Editor', href: '/tools/graphics-editor' },
  'data-visualization-builder': { id: 'data-visualization-builder', name: 'Data Visualization Builder', href: '/tools/data-visualization-builder' },
  'chart-exporter': { id: 'chart-exporter', name: 'Chart Exporter', href: '/tools/chart-exporter' }
};

// Static categories configuration
const CATEGORIES_CONFIG: Category[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <Grid className="w-5 h-5 text-indigo-400 drop-shadow-sm" />,
    tools: []
  },
  {
    id: 'image-editor',
    name: 'Image Editor',
    icon: <PenTool className="w-5 h-5 text-pink-400 drop-shadow-sm" />,
    tools: [
      'graphics-editor'
    ]
  },
  {
    id: 'favorite-tools',
    name: 'Bookmarked Tools',
    icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />,
    tools: [] // Will be populated dynamically
  },
  {
    id: 'barcode-qr-tools',
    name: 'Barcode and QR Code Tools',
    icon: <QrCode className="w-5 h-5 text-green-400 drop-shadow-sm" />,
    tools: [
      'qr-code-generator', 'barcode-generator', 'bulk-barcode-qr-generator'
    ]
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    icon: <Type className="w-5 h-5 text-blue-400 drop-shadow-sm" />,
    tools: [
      'case-converter', 'lorem-ipsum-generator', 'letter-counter',
      'text-to-handwriting-converter', 'bionic-reading-converter',
      'multiple-whitespace-remover', 'google-fonts-pair-finder'
    ]
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    icon: <Image className="w-5 h-5 text-emerald-400 drop-shadow-sm" />,
    tools: [
      'image-cropper', 'image-filters', 'image-resizer',
      'image-average-color-finder', 'image-color-extractor', 'image-color-picker'
    ]
  },
  {
    id: 'css-tools',
    name: 'CSS Tools',
    icon: <Palette className="w-5 h-5 text-violet-400 drop-shadow-sm" />,
    tools: [
      'css-loader-generator', 'css-checkbox-generator', 'css-switch-generator',
      'css-clip-path-generator', 'css-background-pattern-generator',
      'css-cubic-bezier-generator', 'css-glassmorphism-generator'
    ]
  },
  {
    id: 'coding-tools',
    name: 'Developer Tools',
    icon: <Code className="w-5 h-5 text-rose-400 drop-shadow-sm" />,
    tools: [
      'code-to-image-converter', 'url-slug-generator', 'react-native-shadow-generator',
      'base64-encoder-decoder'
    ]
  },
  {
    id: 'echarts-integration',
    name: 'Chart and Graph Tools',
    icon: <BarChart2 className="w-5 h-5 text-green-400 drop-shadow-sm" />,
    tools: [
      'data-visualization-builder', 'chart-exporter'
    ]
  }
];

// Utility function to get a tool by its ID
export const getToolById = (id: string) => {
  return TOOLS_REGISTRY[id];
};

// Function to get appropriate icon for each tool
const getToolIcon = (toolId: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    // Text Tools
    'case-converter': <Type className="w-3.5 h-3.5 text-blue-500" />,
    'lorem-ipsum-generator': <FileText className="w-3.5 h-3.5 text-blue-500" />,
    'letter-counter': <Hash className="w-3.5 h-3.5 text-blue-500" />,
    'text-to-handwriting-converter': <PenTool className="w-3.5 h-3.5 text-blue-500" />,
    'bionic-reading-converter': <Eye className="w-3.5 h-3.5 text-blue-500" />,
    'multiple-whitespace-remover': <Scissors className="w-3.5 h-3.5 text-blue-500" />,
    'google-fonts-pair-finder': <Type className="w-3.5 h-3.5 text-blue-500" />,
    
    // Image Tools
    'image-cropper': <Crop className="w-3.5 h-3.5 text-emerald-500" />,
    'image-filters': <Filter className="w-3.5 h-3.5 text-emerald-500" />,
    'image-resizer': <Maximize className="w-3.5 h-3.5 text-emerald-500" />,
    'image-average-color-finder': <Droplets className="w-3.5 h-3.5 text-emerald-500" />,
    'image-color-extractor': <Droplets className="w-3.5 h-3.5 text-emerald-500" />,
    'image-color-picker': <Droplets className="w-3.5 h-3.5 text-emerald-500" />,
    
    // CSS Tools
    'css-loader-generator': <Loader className="w-3.5 h-3.5 text-violet-500" />,
    'css-checkbox-generator': <CheckSquare className="w-3.5 h-3.5 text-violet-500" />,
    'css-switch-generator': <ToggleLeft className="w-3.5 h-3.5 text-violet-500" />,
    'css-clip-path-generator': <Scissors className="w-3.5 h-3.5 text-violet-500" />,
    'css-background-pattern-generator': <Grid className="w-3.5 h-3.5 text-violet-500" />,
    'css-cubic-bezier-generator': <TrendingUp className="w-3.5 h-3.5 text-violet-500" />,
    'css-glassmorphism-generator': <Layers className="w-3.5 h-3.5 text-violet-500" />,
    
    // Developer Tools
    'code-to-image-converter': <Camera className="w-3.5 h-3.5 text-rose-500" />,
    'url-slug-generator': <LinkIcon className="w-3.5 h-3.5 text-rose-500" />,
    'react-native-shadow-generator': <Smartphone className="w-3.5 h-3.5 text-rose-500" />,
    'base64-encoder-decoder': <Binary className="w-3.5 h-3.5 text-rose-500" />,
    'html-encoder-decoder': <Code className="w-3.5 h-3.5 text-rose-500" />,
    'url-encoder-decoder': <Globe className="w-3.5 h-3.5 text-rose-500" />,
    'html-minifier': <FileText className="w-3.5 h-3.5 text-rose-500" />,
    'css-minifier': <Palette className="w-3.5 h-3.5 text-rose-500" />,
    'javascript-minifier': <Code className="w-3.5 h-3.5 text-rose-500" />,
    'html-formatter': <FileText className="w-3.5 h-3.5 text-rose-500" />,
    'css-formatter': <Palette className="w-3.5 h-3.5 text-rose-500" />,
    'javascript-formatter': <Code className="w-3.5 h-3.5 text-rose-500" />,
    'md5-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha1-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha224-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha256-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha384-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'sha512-encrypt-decrypt': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'jwt-encoder-decoder': <Lock className="w-3.5 h-3.5 text-rose-500" />,
    'json-tree-viewer': <List className="w-3.5 h-3.5 text-rose-500" />,
    
    // QR/Barcode Tools
    'qr-code-generator': <QrCode className="w-3.5 h-3.5 text-green-500" />,
    'barcode-generator': <Barcode className="w-3.5 h-3.5 text-green-500" />,
    'bulk-barcode-qr-generator': <QrCode className="w-3.5 h-3.5 text-green-500" />,
    
    // Social Media Tools
    'instagram-filters': <Filter className="w-3.5 h-3.5 text-sky-500" />,
    'instagram-post-generator': <Image className="w-3.5 h-3.5 text-sky-500" />,
    'instagram-photo-downloader': <Image className="w-3.5 h-3.5 text-sky-500" />,
    'tweet-generator': <Share2 className="w-3.5 h-3.5 text-sky-500" />,
    'tweet-to-image-converter': <Camera className="w-3.5 h-3.5 text-sky-500" />,
    'twitter-ad-revenue-generator': <CreditCard className="w-3.5 h-3.5 text-sky-500" />,
    
    // Miscellaneous Tools
    'strong-random-password-generator': <Lock className="w-3.5 h-3.5 text-purple-500" />,
    'list-randomizer': <List className="w-3.5 h-3.5 text-purple-500" />,
    
    // Chart Tools
    'echarts-integration': <BarChart2 className="w-3.5 h-3.5 text-green-500" />,
    'graphics-editor': <PenTool className="w-3.5 h-3.5 text-pink-500" />,
    'data-visualization-builder': <BarChart2 className="w-3.5 h-3.5 text-green-500" />,
    'chart-exporter': <BarChart2 className="w-3.5 h-3.5 text-green-500" />
  };
  
  return iconMap[toolId] || <div className="w-3.5 h-3.5 rounded-full bg-gray-400"></div>;
};

// Local storage utilities for favorites and usage tracking
const FAVORITES_KEY = 'super-tools-favorites';
const USAGE_STATS_KEY = 'super-tools-usage-stats';
const RECENT_TOOLS_KEY = 'super-tools-recent';

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

const addToRecentTools = (toolId: string) => {
  const recent = getRecentTools();
  const filtered = recent.filter(item => item.toolId !== toolId);
  const updated = [{ toolId, timestamp: Date.now() }, ...filtered].slice(0, 5);
  saveRecentTools(updated);
};

const updateUsageStats = (toolId: string) => {
  const stats = getUsageStats();
  stats[toolId] = {
    count: (stats[toolId]?.count || 0) + 1,
    lastUsed: Date.now()
  };
  saveUsageStats(stats);
};

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isRecentExpanded, setIsRecentExpanded] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(getFavorites());
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [recentTools, setRecentTools] = useState<RecentTool[]>(getRecentTools());
  const [usageStats, setUsageStats] = useState<UsageStats>(getUsageStats());
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ name: string; path: string }>>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [dashboardManuallyCollapsed, setDashboardManuallyCollapsed] = useState(false);
  
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  
  // Get current path from useLocation hook
  const location = useLocation();
  
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
    
    // Update breadcrumbs
    updateBreadcrumbs(currentPath);
  }, [location.pathname]);
  
  // Function to update breadcrumbs based on current path
  const updateBreadcrumbs = (path: string) => {
    const newBreadcrumbs: Array<{ name: string; path: string }> = [
      { name: 'Dashboard', path: '/tools/dashboard' }
    ];
    
    // Find current tool
    const toolEntry = Object.entries(TOOLS_REGISTRY).find(([_, tool]) => tool.href === path);
    if (toolEntry) {
      const [toolId, tool] = toolEntry;
      
      // Find category for this tool
      const category = CATEGORIES_CONFIG.find(cat => cat.tools.includes(toolId));
      if (category && category.id !== 'dashboard') {
        newBreadcrumbs.push({
          name: category.name,
          path: `/tools/${category.id}`
        });
      }
      
      // Add current tool
      newBreadcrumbs.push({
        name: tool.name,
        path: tool.href
      });
    } else if (path.startsWith('/tools/')) {
      // Handle category pages
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
  };
  
  // Enhanced sidebar shrinking logic
  useEffect(() => {
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    if (isDashboardPage) {
      // On dashboard, expand by default unless manually collapsed
      if (!dashboardManuallyCollapsed) {
        setIsSidebarCollapsed(false);
      }
    } else {
      // On other pages, auto-shrink unless hovered
      if (!sidebarHovered) {
        setIsSidebarCollapsed(true);
      }
      // Reset dashboard manual collapse when leaving dashboard
      setDashboardManuallyCollapsed(false);
    }
  }, [location.pathname, sidebarHovered, dashboardManuallyCollapsed]);
  
  // Sidebar hover handlers with improved dashboard functionality
  const handleSidebarMouseEnter = () => {
    setSidebarHovered(true);
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    // Always expand on hover
    setIsSidebarCollapsed(false);
  };
  
  const handleSidebarMouseLeave = () => {
    setSidebarHovered(false);
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    if (isDashboardPage) {
      // On dashboard, only collapse if manually collapsed by user
      if (dashboardManuallyCollapsed) {
        setIsSidebarCollapsed(true);
      }
    } else {
      // Auto-shrink after leaving if not on dashboard
      setIsSidebarCollapsed(true);
    }
  };
  
  // Sidebar click handler to expand temporarily with improved dashboard behavior
  const handleSidebarClick = () => {
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      setSidebarHovered(true);
      
      // Auto-shrink after 3 seconds if not on dashboard
      if (!isDashboardPage) {
        setTimeout(() => {
          setSidebarHovered(false);
          setIsSidebarCollapsed(true);
        }, 3000);
      }
    }
  };
  
  // Initialize expanded categories based on active category
  React.useEffect(() => {
    const activeCategory = CATEGORIES_CONFIG.find(category => 
      location.pathname.startsWith(`/tools/${category.id}`)
    );
    
    if (activeCategory) {
      setExpandedCategories(prev => ({
        ...prev,
        [activeCategory.id]: true
      }));
    }
  }, [location.pathname]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (isSidebarCollapsed) {
          setIsSidebarCollapsed(false);
          setSidebarHovered(true);
        }
      }
      
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
      
      // Escape to clear search or close sidebar
      if (e.key === 'Escape') {
        if (searchTerm) {
          setSearchTerm('');
        } else if (!isSidebarCollapsed) {
          setIsSidebarCollapsed(true);
        }
      }
      
      // F1 to show keyboard shortcuts
      if (e.key === 'F1') {
        e.preventDefault();
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, isSidebarCollapsed, showKeyboardShortcuts]);
  
  // Touch/Swipe gesture handlers for mobile
  useEffect(() => {
    const minSwipeDistance = 50;
    
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
      const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);
      
      // Only handle horizontal swipes
      if (!isVerticalSwipe) {
        if (isLeftSwipe && isSidebarOpen) {
          // Swipe left to close sidebar on mobile
          setIsSidebarOpen(false);
        } else if (isRightSwipe && !isSidebarOpen && touchStart.x < 50) {
          // Swipe right from left edge to open sidebar on mobile
          setIsSidebarOpen(true);
        }
      }
    };
    
    // Only add touch listeners on mobile devices
    if (window.innerWidth <= 768) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [touchStart, touchEnd, isSidebarOpen]);

  const handleCategoryClick = (categoryPath: string) => {
    navigate(categoryPath);
    // Close mobile sidebar after navigation
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };
  
  const toggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };
  
  const handleToolHover = (toolId: string | null) => {
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
  };
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, toolId: string) => {
    setDraggedItem(toolId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', toolId);
  };
  
  const handleDragOver = (e: React.DragEvent, toolId: string) => {
    e.preventDefault();
    setDragOverItem(toolId);
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragLeave = () => {
    setDragOverItem(null);
  };
  
  const handleDrop = (e: React.DragEvent, targetToolId: string, categoryId: string) => {
    e.preventDefault();
    const draggedToolId = draggedItem;
    
    if (!draggedToolId || draggedToolId === targetToolId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    
    // Only allow reordering within favorites category
    if (categoryId === 'favorite-tools') {
      const newFavorites = [...favorites];
      const draggedIndex = newFavorites.indexOf(draggedToolId);
      const targetIndex = newFavorites.indexOf(targetToolId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Remove dragged item and insert at target position
        newFavorites.splice(draggedIndex, 1);
        const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        newFavorites.splice(newTargetIndex, 0, draggedToolId);
        
        setFavorites(newFavorites);
        saveFavorites(newFavorites);
      }
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Filter tools based on search term
  const filteredCategories = useMemo(() => {
    // Create dynamic categories with current favorites
    const dynamicCategories = CATEGORIES_CONFIG.map(category => {
      if (category.id === 'favorite-tools') {
        return {
          ...category,
          tools: favorites
        };
      }
      return category;
    }).filter(category => category.id !== 'dashboard'); // Exclude dashboard from sidebar
    
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
      .filter((tool): tool is Tool => tool !== undefined)
      .slice(0, 3);
  }, [recentTools]);
  
  // Get most used tools
  const popularTools = useMemo(() => {
    const sorted = Object.entries(usageStats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([toolId]) => getToolById(toolId))
      .filter((tool): tool is Tool => tool !== undefined);
    return sorted;
  }, [usageStats]);

  const renderSidebarTools = (tools: string[], categoryId?: string) => {
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
              if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
              }
            }}
            draggable={isDraggable}
            onDragStart={(e) => isDraggable && handleDragStart(e, toolId)}
            onDragOver={(e) => isDraggable && handleDragOver(e, toolId)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => isDraggable && handleDrop(e, toolId, categoryId!)}
          >
            {/* Drag handle for favorites */}
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
            <div className="tool-content-wrapper flex-1">
              <span className="tool-name-override">{tool.name}</span>
            </div>
            
            {/* Usage count badge */}
            {usageCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {usageCount}
              </span>
            )}
            
            {/* Favorite button */}
            {categoryId !== 'favorite-tools' && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(toolId);
                }}
                className={`ml-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                  isFavorite ? 'text-amber-400' : 'text-gray-400 hover:text-amber-400'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <Bookmark className="w-3 h-3 fill-current" /> : <BookmarkPlus className="w-3 h-3" />}
              </button>
            )}
          </Link>
          
          {/* Tooltip */}
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
  };

  // Function to determine if a category is active
  const isCategoryActive = (categoryId: string) => {
    if (categoryId === 'favorite-tools') {
      return false; // Favorite tools don't have a dedicated page
    }
    return location.pathname.startsWith(`/tools/${categoryId}`);
  };

  // Function to toggle sidebar collapse state with dashboard awareness
  const toggleSidebarCollapse = () => {
    const isDashboardPage = location.pathname === '/' || location.pathname === '/tools/dashboard' || location.pathname.includes('/dashboard');
    
    if (isDashboardPage) {
      // On dashboard, track manual collapse
      const newCollapsedState = !isSidebarCollapsed;
      setIsSidebarCollapsed(newCollapsedState);
      setDashboardManuallyCollapsed(newCollapsedState);
      setSidebarHovered(!newCollapsedState);
    } else {
      // On other pages, normal toggle behavior
      setIsSidebarCollapsed(!isSidebarCollapsed);
      setSidebarHovered(!isSidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden" style={{ minWidth: '100vw' }}>
      {/* Mobile Swipe Indicator */}
      {!isSidebarOpen && window.innerWidth <= 768 && (
        <div className="mobile-swipe-indicator">
          ← Swipe
        </div>
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
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`sidebar-override ${isSidebarCollapsed ? 'collapsed' : ''} ${isSidebarCollapsed && sidebarHovered ? 'hover-expanded' : ''} ${isSidebarOpen ? 'mobile-open' : ''} flex flex-col flex-shrink-0`}
        style={{
          position: 'relative',
          flexShrink: 0,
          minWidth: isSidebarCollapsed ? '70px' : '280px',
          maxWidth: isSidebarCollapsed ? '70px' : '280px',
          width: isSidebarCollapsed ? '70px' : '280px'
        }}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        onClick={handleSidebarClick}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="sidebar-header-override">
            <div className="flex items-center justify-between">
              {isSidebarCollapsed ? (
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
                    <h1>Super Tools</h1>
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
            {!isSidebarCollapsed && (
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
            {!isSidebarCollapsed && breadcrumbs.length > 1 && (
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
            {!isSidebarCollapsed && recentToolsList.length > 0 && !searchTerm && (
              <div className="px-4 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`collapse-item-override ${isRecentExpanded ? 'expanded' : ''}`}
                >
                  {/* Recent Category Header */}
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
                  
                  {/* Recent Tools Content */}
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
                            {recentToolsList.map(tool => (
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
                                    if (window.innerWidth < 768) {
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
                                  <span className="tool-name-override">{tool.name}</span>
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
                    {/* Category header with icon and name */}
                    <div 
                      className={`collapse-header-override ${isCategoryActive(category.id) ? 'active' : ''}`}
                      onClick={() => {
                        if (category.id === 'dashboard') {
                          handleCategoryClick('/tools/dashboard');
                        } else {
                          handleCategoryClick(`/tools/${category.id}`);
                          toggleCategory(category.id);
                        }
                      }}
                    >
                      <span className="category-icon-override">
                        {React.cloneElement(category.icon as React.ReactElement, {
                          className: `${isCategoryActive(category.id) ? 'text-white' : ''}`
                        })}
                      </span>
                      {!isSidebarCollapsed && (
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
                    
                    {/* Submenu - only show for certain categories */}
                    {!isSidebarCollapsed && category.tools.length > 0 && !['image-editor', 'favorite-tools', 'dashboard'].includes(category.id) && (
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
        {/* Header */}
        <header className="header-container bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                className="mr-4 md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu />
              </button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {CATEGORIES_CONFIG.find(cat => location.pathname.startsWith(`/tools/${cat.id}`))?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;