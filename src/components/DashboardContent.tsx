import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Star, 
  Type, 
  Image, 
  Palette, 
  Code, 
  Share2, 
  MoreHorizontal,
  Search,
  Grid,
  List,
  TrendingUp,
  Clock,
  Filter,
  BarChart2,
  Activity,
  Users,
  Zap,
  Heart,
  BookmarkPlus,
  ArrowRight,
  Calendar,
  Eye,
  MousePointer,
  Bookmark,
  History,
  ChevronRight,
  Settings,
  Download,
  ExternalLink
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  href: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  tools: Tool[];
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

interface DashboardData {
  favorites: string[];
  recentTools: RecentTool[];
  usageStats: UsageStats;
  totalUsage: number;
  weeklyGrowth: number;
}

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

const categories: Category[] = [
  {
    id: 'favorite-tools',
    name: 'Bookmarked Tools',
    icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" />,
    tools: [] // Will be populated dynamically
  },
  {
    id: 'text-tools',
    name: 'Text Processing',
    icon: <Type className="w-5 h-5 text-blue-400" />,
    tools: [
      TOOLS_REGISTRY['case-converter'],
      TOOLS_REGISTRY['lorem-ipsum-generator'],
      TOOLS_REGISTRY['letter-counter'],
      TOOLS_REGISTRY['text-to-handwriting-converter'],
      TOOLS_REGISTRY['bionic-reading-converter'],
      TOOLS_REGISTRY['multiple-whitespace-remover'],
      TOOLS_REGISTRY['google-fonts-pair-finder']
    ]
  },
  {
    id: 'image-tools',
    name: 'Image Editing',
    icon: <Image className="w-5 h-5 text-emerald-400" />,
    tools: [
      TOOLS_REGISTRY['image-cropper'],
      TOOLS_REGISTRY['image-filters'],
      TOOLS_REGISTRY['image-resizer'],
      TOOLS_REGISTRY['image-average-color-finder'],
      TOOLS_REGISTRY['image-color-extractor'],
      TOOLS_REGISTRY['image-color-picker']
    ]
  },
  {
    id: 'css-tools',
    name: 'CSS Generators',
    icon: <Palette className="w-5 h-5 text-violet-400" />,
    tools: [
      TOOLS_REGISTRY['css-loader-generator'],
      TOOLS_REGISTRY['css-checkbox-generator'],
      TOOLS_REGISTRY['css-switch-generator'],
      TOOLS_REGISTRY['css-clip-path-generator'],
      TOOLS_REGISTRY['css-background-pattern-generator'],
      TOOLS_REGISTRY['css-cubic-bezier-generator'],
      TOOLS_REGISTRY['css-glassmorphism-generator']
    ]
  },
  {
    id: 'coding-tools',
    name: 'Developer Tools',
    icon: <Code className="w-5 h-5 text-rose-400" />,
    tools: [
      TOOLS_REGISTRY['code-to-image-converter'],
      TOOLS_REGISTRY['url-slug-generator'],
      TOOLS_REGISTRY['react-native-shadow-generator'],
      TOOLS_REGISTRY['base64-encoder-decoder'],
      TOOLS_REGISTRY['html-encoder-decoder'],
      TOOLS_REGISTRY['url-encoder-decoder'],
      TOOLS_REGISTRY['html-minifier'],
      TOOLS_REGISTRY['css-minifier'],
      TOOLS_REGISTRY['javascript-minifier'],
      TOOLS_REGISTRY['html-formatter'],
      TOOLS_REGISTRY['css-formatter'],
      TOOLS_REGISTRY['javascript-formatter'],
      TOOLS_REGISTRY['md5-encrypt-decrypt'],
      TOOLS_REGISTRY['sha1-encrypt-decrypt'],
      TOOLS_REGISTRY['sha224-encrypt-decrypt'],
      TOOLS_REGISTRY['sha256-encrypt-decrypt'],
      TOOLS_REGISTRY['sha384-encrypt-decrypt'],
      TOOLS_REGISTRY['sha512-encrypt-decrypt'],
      TOOLS_REGISTRY['jwt-encoder-decoder'],
      TOOLS_REGISTRY['json-tree-viewer']
    ]
  },
  {
    id: 'echarts-integration',
    name: 'Chart and Graph Tools',
    icon: <BarChart2 className="w-5 h-5 text-green-400" />,
    tools: [
      TOOLS_REGISTRY['data-visualization-builder'],
      TOOLS_REGISTRY['chart-exporter']
    ]
  },
  {
    id: 'social-media-tools',
    name: 'Social Media',
    icon: <Share2 className="w-5 h-5 text-sky-400" />,
    tools: [
      TOOLS_REGISTRY['instagram-filters'],
      TOOLS_REGISTRY['instagram-post-generator'],
      TOOLS_REGISTRY['instagram-photo-downloader']
    ]
  },
  {
    id: 'barcode-qr-tools',
    name: 'Barcode and QR Code Tools',
    icon: <TrendingUp className="w-5 h-5 text-indigo-400" />,
    tools: [
      TOOLS_REGISTRY['qr-code-generator'],
      TOOLS_REGISTRY['barcode-generator'],
      TOOLS_REGISTRY['bulk-barcode-qr-generator']
    ]
  },
  {
    id: 'image-editor',
    name: 'Image Editor',
    icon: <Palette className="w-5 h-5 text-pink-400" />,
    tools: [
      TOOLS_REGISTRY['graphics-editor']
    ]
  },
  {
    id: 'misc-tools',
    name: 'Miscellaneous Tools',
    icon: <MoreHorizontal className="w-5 h-5 text-gray-400" />,
    tools: [
      TOOLS_REGISTRY['strong-random-password-generator'],
      TOOLS_REGISTRY['list-randomizer']
    ]
  }
];

// LocalStorage utilities
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

const getUsageStats = (): UsageStats => {
  try {
    const stored = localStorage.getItem(USAGE_STATS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
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

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

const DashboardContent: React.FC<{ activeCategory?: string }> = ({ activeCategory }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(activeCategory || null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    favorites: getFavorites(),
    recentTools: getRecentTools(),
    usageStats: getUsageStats(),
    totalUsage: 0,
    weeklyGrowth: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'recent'>('overview');

  // Load dashboard data on component mount
  useEffect(() => {
    const favorites = getFavorites();
    const recentTools = getRecentTools();
    const usageStats = getUsageStats();
    
    // Calculate total usage and weekly growth
    const totalUsage = Object.values(usageStats).reduce((sum, stat) => sum + stat.count, 0);
    const weekStart = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weeklyUsage = Object.values(usageStats).filter(stat => stat.lastUsed > weekStart).length;
    const previousWeekUsage = Object.values(usageStats).filter(stat => 
      stat.lastUsed > weekStart - (7 * 24 * 60 * 60 * 1000) && stat.lastUsed <= weekStart
    ).length;
    const weeklyGrowth = previousWeekUsage > 0 ? ((weeklyUsage - previousWeekUsage) / previousWeekUsage) * 100 : 0;
    
    setDashboardData({
      favorites,
      recentTools,
      usageStats,
      totalUsage,
      weeklyGrowth
    });
  }, []);

  // Effect to update selected category when activeCategory changes
  useEffect(() => {
    if (activeCategory !== undefined) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory]);

  // Calculate enhanced statistics
  const stats = useMemo(() => {
    const totalTools = Object.keys(TOOLS_REGISTRY).length;
    const totalCategories = categories.length;
    const favoriteTools = dashboardData.favorites.length;
    const recentToolsCount = dashboardData.recentTools.length;
    const totalUsage = dashboardData.totalUsage;
    const weeklyGrowth = dashboardData.weeklyGrowth;
    
    // Get most popular tools
    const popularTools = Object.entries(dashboardData.usageStats)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5)
      .map(([toolId, stats]) => ({
        tool: TOOLS_REGISTRY[toolId],
        count: stats.count,
        lastUsed: stats.lastUsed
      }))
      .filter(item => item.tool);
    
    return {
      totalTools,
      totalCategories,
      favoriteTools,
      recentToolsCount,
      totalUsage,
      weeklyGrowth,
      popularTools
    };
  }, [dashboardData]);

  // Filter tools based on search term and selected category
  const filteredCategories = useMemo(() => {
    // Create dynamic categories with current favorites
    const dynamicCategories = categories.map(category => {
      if (category.id === 'favorite-tools') {
        return {
          ...category,
          tools: dashboardData.favorites
            .map(toolId => TOOLS_REGISTRY[toolId])
            .filter(Boolean)
        };
      }
      return category;
    });
    
    // If there's a selected category, only show that one
    if (selectedCategory) {
      const category = dynamicCategories.find(c => c.id === selectedCategory);
      if (!category) return [];
      
      // If searching, filter tools within the selected category
      if (!searchTerm) {
        return [category];
      }
      
      const searchLower = searchTerm.toLowerCase();
      const filteredTools = category.tools.filter(tool => 
        tool && tool.name.toLowerCase().includes(searchLower)
      );
      
      return [{
        ...category,
        tools: filteredTools
      }];
    }
    
    // If searching globally, find categories that match the search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return dynamicCategories.map(category => {
        const matchesCategory = category.name.toLowerCase().includes(searchLower);
        const filteredTools = category.tools.filter(tool => 
          tool && tool.name.toLowerCase().includes(searchLower)
        );
        
        // Show category if either the category name matches or has matching tools
        if (matchesCategory || filteredTools.length > 0) {
          return {
            ...category,
            tools: filteredTools
          };
        }
        
        return null;
      }).filter(Boolean) as Category[];
    }
    
    // Default case - show all categories
    return dynamicCategories;
  }, [searchTerm, selectedCategory, dashboardData.favorites]);

  return (
    <div className="p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Tools Dashboard
              </h1>
              <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                Browse through all available tools organized by category
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
                onClick={() => setSearchTerm('')}
              >
                <Filter className="w-4 h-4 mr-2 inline" />
                Clear Filters
              </motion.button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6">
            {[{ id: 'overview', label: 'Overview', icon: Grid }, 
              { id: 'analytics', label: 'Analytics', icon: Activity }, 
              { id: 'recent', label: 'Recent', icon: History }].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-gray-600 hover:bg-white/70 hover:shadow-sm'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
          
          {/* Enhanced Stats Cards */}
          <div className="dashboard-stats-grid">
            <motion.div 
              className="dashboard-stat-card group"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dashboard-stat-header">
                <div className="dashboard-stat-icon">
                  <Grid className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="dashboard-stat-title">Total Tools</p>
                  <p className="dashboard-stat-value">{stats.totalTools}</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Across {stats.totalCategories} categories
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="dashboard-stat-card group"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dashboard-stat-header">
                <div className="dashboard-stat-icon">
                  <Activity className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="dashboard-stat-title">Total Usage</p>
                  <p className="dashboard-stat-value">{stats.totalUsage}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`w-3 h-3 ${
                      stats.weeklyGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`} />
                    <p className={`text-sm ${
                      stats.weeklyGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {stats.weeklyGrowth >= 0 ? '+' : ''}{stats.weeklyGrowth.toFixed(1)}% this week
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="dashboard-stat-card group"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dashboard-stat-header">
                <div className="dashboard-stat-icon">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <p className="dashboard-stat-title">Bookmarked</p>
                  <p className="dashboard-stat-value">{stats.favoriteTools}</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Your favorite tools
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="dashboard-stat-card group"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dashboard-stat-header">
                <div className="dashboard-stat-icon">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="dashboard-stat-title">Recent Tools</p>
                  <p className="dashboard-stat-value">{stats.recentToolsCount}</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Recently accessed
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search and Filters */}
              <div className="dashboard-controls">
                <div className="dashboard-search-container">
                  <div className="dashboard-search-icon">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="dashboard-view-toggle">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`dashboard-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => setViewMode('list')}
                      className={`dashboard-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="dashboard-category-filter"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Categories */}
              {filteredCategories.length === 0 ? (
                <motion.div 
                  className="dashboard-no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No tools found</p>
                  <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
                </motion.div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? "dashboard-tools-grid" 
                  : "dashboard-tools-list"
                }>
                  {filteredCategories.map((category, index) => (
                    <motion.div 
                      key={category.id}
                      className={`dashboard-category-card ${viewMode === 'list' ? 'flex items-start' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: viewMode === 'grid' ? -8 : 0, scale: viewMode === 'grid' ? 1.02 : 1 }}
                    >
                      {viewMode === 'list' ? (
                        <>
                          <div className="dashboard-category-header mb-0 mr-6">
                            <span className="dashboard-category-icon">
                              {category.icon}
                            </span>
                            <h2 className="dashboard-category-title">{category.name}</h2>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {category.tools.length} tools
                            </span>
                          </div>
                          <div className="dashboard-tools-list-container flex-1">
                            {category.tools.map((tool) => tool && (
                              <Link 
                                key={tool.id}
                                to={tool.href} 
                                className="dashboard-tool-link group"
                              >
                                <span className="dashboard-tool-bullet"></span>
                                {tool.name}
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="dashboard-category-header">
                            <span className="dashboard-category-icon">
                              {category.icon}
                            </span>
                            <div className="flex-1">
                              <h2 className="dashboard-category-title">{category.name}</h2>
                              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {category.tools.length} tools available
                              </p>
                            </div>
                            <ChevronRight className={`w-5 h-5 transition-transform ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`} />
                          </div>
                          <ul className="space-y-3">
                            {category.tools.map((tool) => tool && (
                              <li key={tool.id}>
                                <Link 
                                  to={tool.href} 
                                  className="dashboard-tool-link group"
                                >
                                  <span className="dashboard-tool-bullet"></span>
                                  {tool.name}
                                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-all group-hover:translate-x-1" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Tools */}
                <motion.div
                  className={`p-6 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm' 
                      : 'bg-white/70 border-slate-200 backdrop-blur-sm'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Most Popular Tools
                  </h3>
                  <div className="space-y-3">
                    {stats.popularTools.length > 0 ? stats.popularTools.map((item, index) => (
                      <div key={item.tool.id} className={`flex items-center justify-between p-3 rounded-lg ${
                        isDark ? 'bg-slate-700/50' : 'bg-gray-50/80'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-slate-300 text-slate-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{item.tool.name}</p>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              Last used {formatTimeAgo(item.lastUsed)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{item.count}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>uses</p>
                        </div>
                      </div>
                    )) : (
                      <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        No usage data available yet
                      </p>
                    )}
                  </div>
                </motion.div>
                
                {/* Usage Insights */}
                <motion.div
                  className={`p-6 rounded-xl border shadow-lg ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm' 
                      : 'bg-white/80 border-gray-200 backdrop-blur-sm shadow-xl'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    Usage Insights
                  </h3>
                  <div className="space-y-4">
                    <div className={`flex justify-between items-center p-3 rounded-lg ${
                      isDark ? 'bg-slate-700/50' : 'bg-gray-50/80'
                    }`}>
                      <span className="text-sm font-medium">Tools Used This Week</span>
                      <span className={`font-bold ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {Object.values(dashboardData.usageStats).filter(stat => 
                          stat.lastUsed > Date.now() - (7 * 24 * 60 * 60 * 1000)
                        ).length}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center p-3 rounded-lg ${
                      isDark ? 'bg-slate-700/50' : 'bg-gray-50/80'
                    }`}>
                      <span className="text-sm font-medium">Average Usage Per Tool</span>
                      <span className={`font-bold ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {stats.totalUsage > 0 ? (stats.totalUsage / Object.keys(dashboardData.usageStats).length).toFixed(1) : '0'}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center p-3 rounded-lg ${
                      isDark ? 'bg-slate-700/50' : 'bg-gray-50/80'
                    }`}>
                      <span className="text-sm font-medium">Most Active Day</span>
                      <span className={`font-bold ${
                        isDark ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`p-6 rounded-xl border shadow-lg ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm' 
                    : 'bg-white/80 border-gray-200 backdrop-blur-sm shadow-xl'
                }`}
                whileHover={{ y: -2 }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  Recently Used Tools
                </h3>
                <div className="space-y-3">
                  {dashboardData.recentTools.length > 0 ? dashboardData.recentTools.map((recentTool) => {
                    const tool = TOOLS_REGISTRY[recentTool.toolId];
                    if (!tool) return null;
                    
                    return (
                      <motion.div
                        key={recentTool.toolId}
                        whileHover={{ x: 4 }}
                        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                          isDark 
                            ? 'bg-slate-700/50 hover:bg-slate-700' 
                            : 'bg-gray-50/80 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              {formatTimeAgo(recentTool.timestamp)}
                            </p>
                          </div>
                        </div>
                        <Link
                          to={tool.href}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          Open
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </motion.div>
                    );
                  }) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No recent tools</p>
                      <p className="text-slate-500 dark:text-slate-400">Start using tools to see them here</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardContent;