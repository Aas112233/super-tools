import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { HandwritingGenerator } from '../pages/tools/HandwritingGenerator';
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
  CreditCard
} from 'lucide-react';
import { Button } from "./ui/button";
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
  'fake-iban-generator': { id: 'fake-iban-generator', name: 'Mock IBAN Generator', href: '/tools/fake-iban-generator' },
  'graphics-editor': { id: 'graphics-editor', name: 'Graphics Editor', href: '/tools/graphics-editor' },
};

// Static categories configuration
const CATEGORIES_CONFIG: Category[] = [
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
    tools: ['case-converter', 'lorem-ipsum-generator', 'letter-counter']
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
      'css-clip-path-generator', 'css-background-pattern-generator', 'css-cubic-bezier-generator',
      'css-glassmorphism-generator'
    ]
  },
  {
    id: 'coding-tools',
    name: 'Coding Tools',
    icon: <Code className="w-5 h-5 text-rose-400 drop-shadow-sm" />,
    tools: [
      'code-to-image-converter', 'url-slug-generator', 'react-native-shadow-generator',
      'base64-encoder-decoder', 'html-encoder-decoder', 'url-encoder-decoder'
    ]
  },
  {
    id: 'social-media-tools',
    name: 'Social Media Tools',
    icon: <Share2 className="w-5 h-5 text-sky-400 drop-shadow-sm" />,
    tools: [
      'instagram-filters', 'instagram-post-generator', 'instagram-photo-downloader',
      'tweet-generator', 'tweet-to-image-converter', 'twitter-ad-revenue-generator'
    ]
  },
  {
    id: 'miscellaneous-tools',
    name: 'Miscellaneous Tools',
    icon: <MoreHorizontal className="w-5 h-5 text-slate-300 drop-shadow-sm" />,
    tools: [
      'strong-random-password-generator', 'list-randomizer', 'qr-code-generator',
      'barcode-generator', 'fake-iban-generator'
    ]
  }
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const isToolPage = location.pathname.startsWith('/tools/');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  console.log('Layout render - openCategories:', openCategories);

  useEffect(() => {
    setIsCollapsed(isToolPage);
  }, [isToolPage]);

  const toggleCategory = (categoryId: string, event?: React.MouseEvent) => {
    console.log('toggleCategory called:', categoryId);
    if (event) {
      event.stopPropagation();
    }
    setOpenCategories(prev => {
      const newState = {
        ...prev,
        [categoryId]: !prev[categoryId]
      };
      console.log('New openCategories state:', newState);
      return newState;
    });
  };

  const getToolIcon = (toolId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'case-converter': <Type className="w-4 h-4" />,
      'lorem-ipsum-generator': <FileText className="w-4 h-4" />,
      'letter-counter': <Hash className="w-4 h-4" />,
      'text-to-handwriting-converter': <PenTool className="w-4 h-4" />,
      'bionic-reading-converter': <Eye className="w-4 h-4" />,
      'multiple-whitespace-remover': <Scissors className="w-4 h-4" />,
      'google-fonts-pair-finder': <Type className="w-4 h-4" />,
      'image-cropper': <Crop className="w-4 h-4" />,
      'image-filters': <Filter className="w-4 h-4" />,
      'image-resizer': <Maximize className="w-4 h-4" />,
      'image-average-color-finder': <Droplets className="w-4 h-4" />,
      'image-color-extractor': <Palette className="w-4 h-4" />,
      'image-color-picker': <Droplets className="w-4 h-4" />,
      'css-loader-generator': <Loader className="w-4 h-4" />,
      'css-checkbox-generator': <CheckSquare className="w-4 h-4" />,
      'css-switch-generator': <ToggleLeft className="w-4 h-4" />,
      'css-clip-path-generator': <Scissors className="w-4 h-4" />,
      'css-background-pattern-generator': <Grid className="w-4 h-4" />,
      'css-cubic-bezier-generator': <Code className="w-4 h-4" />,
      'css-glassmorphism-generator': <Droplets className="w-4 h-4" />,
      'code-to-image-converter': <Camera className="w-4 h-4" />,
      'url-slug-generator': <LinkIcon className="w-4 h-4" />,
      'react-native-shadow-generator': <Smartphone className="w-4 h-4" />,
      'base64-encoder-decoder': <Binary className="w-4 h-4" />,
      'html-encoder-decoder': <Code className="w-4 h-4" />,
      'url-encoder-decoder': <Globe className="w-4 h-4" />,
      'instagram-filters': <Filter className="w-4 h-4" />,
      'instagram-post-generator': <Image className="w-4 h-4" />,
      'instagram-photo-downloader': <Image className="w-4 h-4" />,
      'tweet-generator': <Share2 className="w-4 h-4" />,
      'tweet-to-image-converter': <Share2 className="w-4 h-4" />,
      'twitter-ad-revenue-generator': <Share2 className="w-4 h-4" />,
      'strong-random-password-generator': <Lock className="w-4 h-4" />,
      'list-randomizer': <List className="w-4 h-4" />,
      'qr-code-generator': <QrCode className="w-4 h-4" />,
      'barcode-generator': <Barcode className="w-4 h-4" />,
      'fake-iban-generator': <CreditCard className="w-4 h-4" />,
      'graphics-editor': <PenTool className="w-4 h-4" />
    };
    return iconMap[toolId] || <Code className="w-4 h-4" />;
  };

  // Memoize categories with resolved tools to prevent unnecessary re-renders
  const categories = useMemo(() => 
    CATEGORIES_CONFIG.map(category => ({
      ...category,
      tools: category.tools.map(toolId => TOOLS_REGISTRY[toolId])
    })), []
  );

  return (
    <div className={`flex h-screen ${isDark 
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950' 
      : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'}`}>
      {/* Sidebar */}
      <motion.div 
        className={`sidebar-override ${isCollapsed ? 'collapsed' : ''} flex flex-col h-full`}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        onMouseEnter={() => isToolPage && setIsCollapsed(false)}
        onMouseLeave={() => isToolPage && setIsCollapsed(true)}
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <div className="sidebar-header-override relative">
          <Link to="/" className="flex items-center group">
            <motion.span 
              className={`bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 ${isDark ? 'text-slate-900' : 'text-white'} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-all duration-300`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-6 h-6" />
            </motion.span>
            {!isCollapsed && (
              <motion.h1 
                className="text-2xl font-bold ml-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Tools Dashboard
              </motion.h1>
            )}
          </Link>
          {!isCollapsed && (
            <motion.button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl ${isDark 
                ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300' 
                : 'bg-slate-100/50 hover:bg-slate-200/50 text-slate-600'} transition-all duration-300 shadow-sm hover:shadow-md`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          )}
        </div>
        
        {isCollapsed && (
          <div className={`p-4 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <motion.button
              onClick={toggleTheme}
              className={`w-12 h-12 mx-auto flex items-center justify-center rounded-xl ${isDark 
                ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300' 
                : 'bg-slate-100/50 hover:bg-slate-200/50 text-slate-600'} transition-all duration-300 shadow-sm hover:shadow-md`}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        )}
        
        <div className="collapse-container-override flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {categories.map((category, index) => (
            <motion.div 
              key={category.id} 
              className={`collapse-item-override ${openCategories[category.id] ? 'expanded' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <motion.button
                onClick={(e) => {
                  console.log('Category button clicked:', category.id, 'isCollapsed:', isCollapsed);
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (isCollapsed) {
                    setIsCollapsed(false);
                  } else {
                    toggleCategory(category.id);
                  }
                }}
                className="collapse-header-override w-full"
                title={isCollapsed ? category.name : ''}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCollapsed ? (
                  <div className="expand-icon-override">
                    {category.icon}
                  </div>
                ) : (
                  <span className="header-text-override">
                    <span className="category-icon-override">{category.icon}</span>
                    {category.name}
                  </span>
                )}
                {!isCollapsed && (
                  <motion.div
                    className="expand-icon-override"
                    animate={{ rotate: openCategories[category.id] ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                )}
              </motion.button>
              
              <AnimatePresence>
                {!isCollapsed && openCategories[category.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                    className="collapse-content-override"
                  >
                    <div className="category-tools-override">
                      {category.tools.map((tool, toolIndex) => (
                        <motion.div 
                          key={tool.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: toolIndex * 0.03 }}
                        >
                          <Link
                            to={tool.href}
                            className="category-tool-override group"
                          >
                            <motion.div 
                              className="tool-icon-tile"
                              whileHover={{ scale: 1.1, rotate: 2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="tool-icon-inner">
                                {getToolIcon(tool.id)}
                              </div>
                            </motion.div>
                            <span className="tool-name-override group-hover:font-semibold transition-all duration-200">{tool.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {!isCollapsed && (
          <motion.div 
            className={`p-6 border-t ${isDark 
              ? 'border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/20' 
              : 'border-slate-200/50 bg-gradient-to-r from-white/30 to-slate-50/20'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="secondary" 
                className={`w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:via-cyan-400 hover:to-blue-400 ${isDark ? 'text-slate-900' : 'text-white'} font-bold py-7 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/30`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  View All Tools
                </span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className={`flex-1 overflow-y-auto ${isDark 
          ? 'bg-gradient-to-br from-slate-950/50 via-slate-900/30 to-indigo-950/50' 
          : 'bg-gradient-to-br from-slate-50/50 via-white/30 to-blue-50/50'} backdrop-blur-sm`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
};