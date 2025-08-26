import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import DashboardContent from './DashboardContent';
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
  ExternalLink,
  Home,
  Menu,
  X
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  href: string;
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

interface QuickAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
  description: string;
  category: string;
}

// Enhanced dashboard with sidebar functionality and proper state integration
const EnhancedDashboard: React.FC<{ activeCategory?: string }> = ({ activeCategory }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for dashboard functionality
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  
  // Load data from localStorage (same as Layout component)
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats>({});
  
  useEffect(() => {
    // Load data from localStorage
    const loadedFavorites = getFavorites();
    const loadedRecent = getRecentTools();
    const loadedStats = getUsageStats();
    
    setFavorites(loadedFavorites);
    setRecentTools(loadedRecent);
    setUsageStats(loadedStats);
  }, []);

  // localStorage utilities (same as Layout)
  const getFavorites = (): string[] => {
    try {
      const stored = localStorage.getItem('super-tools-favorites');
      return stored ? JSON.parse(stored) : ['case-converter', 'lorem-ipsum-generator', 'letter-counter'];
    } catch {
      return ['case-converter', 'lorem-ipsum-generator', 'letter-counter'];
    }
  };

  const getUsageStats = (): UsageStats => {
    try {
      const stored = localStorage.getItem('super-tools-usage-stats');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const getRecentTools = (): RecentTool[] => {
    try {
      const stored = localStorage.getItem('super-tools-recent');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Quick actions for the dashboard
  const quickActions: QuickAction[] = [
    {
      id: 'case-converter',
      name: 'Case Converter',
      icon: <Type className="w-5 h-5" />,
      href: '/tools/case-converter',
      description: 'Convert text case quickly',
      category: 'Text'
    },
    {
      id: 'image-resizer',
      name: 'Image Resizer',
      icon: <Image className="w-5 h-5" />,
      href: '/tools/image-resizer',
      description: 'Resize images instantly',
      category: 'Image'
    },
    {
      id: 'css-loader-generator',
      name: 'CSS Loader',
      icon: <Palette className="w-5 h-5" />,
      href: '/tools/css-loader-generator',
      description: 'Generate CSS animations',
      category: 'CSS'
    },
    {
      id: 'qr-code-generator',
      name: 'QR Code Generator',
      icon: <Grid className="w-5 h-5" />,
      href: '/tools/qr-code-generator',
      description: 'Create QR codes',
      category: 'Code'
    },
    {
      id: 'base64-encoder-decoder',
      name: 'Base64 Converter',
      icon: <Code className="w-5 h-5" />,
      href: '/tools/base64-encoder-decoder',
      description: 'Encode/decode Base64',
      category: 'Code'
    },
    {
      id: 'lorem-ipsum-generator',
      name: 'Lorem Ipsum',
      icon: <Type className="w-5 h-5" />,
      href: '/tools/lorem-ipsum-generator',
      description: 'Generate placeholder text',
      category: 'Text'
    }
  ];

  // Get popular quick actions based on usage stats
  const popularQuickActions = useMemo(() => {
    const popularIds = Object.entries(usageStats)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 3)
      .map(([toolId]) => toolId);
    
    return quickActions.filter(action => popularIds.includes(action.id));
  }, [usageStats]);

  const handleQuickAction = (action: QuickAction) => {
    navigate(action.href);
    setShowQuickActions(false);
  };

  return (
    <div className="relative">
      {/* Quick Actions Panel */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuickActions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-4xl w-full rounded-2xl p-6 ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              } border shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-500" />
                  Quick Actions
                </h3>
                <button
                  onClick={() => setShowQuickActions(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction(action)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isDark 
                        ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isDark ? 'bg-slate-600' : 'bg-white'
                      }`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{action.name}</h4>
                        <p className={`text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {action.description}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                          isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {action.category}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {popularQuickActions.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Most Used
                  </h4>
                  <div className="flex gap-3">
                    {popularQuickActions.map((action) => (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickAction(action)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium transition-all hover:from-blue-600 hover:to-purple-700 flex items-center gap-2"
                      >
                        {action.icon}
                        {action.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Quick Actions Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQuickActions(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:shadow-xl transition-all"
        title="Quick Actions (Press Q)"
      >
        <Zap className="w-6 h-6" />
      </motion.button>

      {/* Main Dashboard Content */}
      <DashboardContent activeCategory={activeCategory} />
    </div>
  );
};

export default EnhancedDashboard;