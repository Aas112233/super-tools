import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Filter
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

const TOOLS_REGISTRY: Record<string, Tool> = {
  'case-converter': { id: 'case-converter', name: 'Text Case Transformer', href: '/tools/case-converter' },
  'lorem-ipsum-generator': { id: 'lorem-ipsum-generator', name: 'Placeholder Text Generator', href: '/tools/lorem-ipsum-generator' },
  'letter-counter': { id: 'letter-counter', name: 'Character Counter', href: '/tools/letter-counter' },
  'text-to-handwriting-converter': { id: 'text-to-handwriting-converter', name: 'Handwriting Text Generator', href: '/tools/text-to-handwriting-converter' },
  'image-cropper': { id: 'image-cropper', name: 'Image Trimmer', href: '/tools/image-cropper' },
  'image-filters': { id: 'image-filters', name: 'Photo Filters', href: '/tools/image-filters' },
  'image-resizer': { id: 'image-resizer', name: 'Image Dimension Adjuster', href: '/tools/image-resizer' },
  'image-average-color-finder': { id: 'image-average-color-finder', name: 'Average Color Detector', href: '/tools/image-average-color-finder' },
  'css-loader-generator': { id: 'css-loader-generator', name: 'Loading Animation Creator', href: '/tools/css-loader-generator' },
  'css-checkbox-generator': { id: 'css-checkbox-generator', name: 'Custom Checkbox Designer', href: '/tools/css-checkbox-generator' },
  'css-switch-generator': { id: 'css-switch-generator', name: 'Toggle Switch Creator', href: '/tools/css-switch-generator' },
  'css-clip-path-generator': { id: 'css-clip-path-generator', name: 'Clip Path Designer', href: '/tools/css-clip-path-generator' },
  'css-glassmorphism-generator': { id: 'css-glassmorphism-generator', name: 'Glassmorphism Generator', href: '/tools/css-glassmorphism-generator' },
  'code-to-image-converter': { id: 'code-to-image-converter', name: 'Code Screenshot Generator', href: '/tools/code-to-image-converter' },
  'url-slug-generator': { id: 'url-slug-generator', name: 'SEO URL Creator', href: '/tools/url-slug-generator' },
  'react-native-shadow-generator': { id: 'react-native-shadow-generator', name: 'React Native Shadow Creator', href: '/tools/react-native-shadow-generator' },
  'base64-encoder-decoder': { id: 'base64-encoder-decoder', name: 'Base64 Converter', href: '/tools/base64-encoder-decoder' },
  'instagram-filters': { id: 'instagram-filters', name: 'Instagram Filter Effects', href: '/tools/instagram-filters' },
  'instagram-post-generator': { id: 'instagram-post-generator', name: 'Instagram Post Creator', href: '/tools/instagram-post-generator' },
  'tweet-generator': { id: 'tweet-generator', name: 'Twitter Post Creator', href: '/tools/tweet-generator' },
  'tweet-to-image-converter': { id: 'tweet-to-image-converter', name: 'Tweet Image Generator', href: '/tools/tweet-to-image-converter' },
  'strong-random-password-generator': { id: 'strong-random-password-generator', name: 'Secure Password Creator', href: '/tools/strong-random-password-generator' },
  'qr-code-generator': { id: 'qr-code-generator', name: 'QR Code Creator', href: '/tools/qr-code-generator' },
  'barcode-generator': { id: 'barcode-generator', name: 'Barcode Maker', href: '/tools/barcode-generator' },
  'list-randomizer': { id: 'list-randomizer', name: 'Item Shuffler', href: '/tools/list-randomizer' },
};

const categories: Category[] = [
  {
    id: 'favorite-tools',
    name: 'Bookmarked Tools',
    icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" />,
    tools: [
      TOOLS_REGISTRY['case-converter'],
      TOOLS_REGISTRY['lorem-ipsum-generator'],
      TOOLS_REGISTRY['letter-counter'],
      TOOLS_REGISTRY['text-to-handwriting-converter']
    ]
  },
  {
    id: 'text-tools',
    name: 'Text Processing',
    icon: <Type className="w-5 h-5 text-blue-400" />,
    tools: [
      TOOLS_REGISTRY['case-converter'],
      TOOLS_REGISTRY['lorem-ipsum-generator'],
      TOOLS_REGISTRY['letter-counter'],
      TOOLS_REGISTRY['text-to-handwriting-converter']
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
      TOOLS_REGISTRY['image-average-color-finder']
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
      TOOLS_REGISTRY['base64-encoder-decoder']
    ]
  },
  {
    id: 'social-media-tools',
    name: 'Social Media Helpers',
    icon: <Share2 className="w-5 h-5 text-sky-400" />,
    tools: [
      TOOLS_REGISTRY['instagram-filters'],
      TOOLS_REGISTRY['instagram-post-generator'],
      TOOLS_REGISTRY['tweet-generator'],
      TOOLS_REGISTRY['tweet-to-image-converter']
    ]
  }
];

const DashboardContent: React.FC = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTools = Object.keys(TOOLS_REGISTRY).length;
    const totalCategories = categories.length;
    const favoriteTools = categories.find(cat => cat.id === 'favorite-tools')?.tools.length || 0;
    
    return {
      totalTools,
      totalCategories,
      favoriteTools
    };
  }, []);

  // Filter tools based on search term and selected category
  const filteredCategories = useMemo(() => {
    if (!searchTerm && !selectedCategory) {
      return categories;
    }

    return categories
      .filter(category => {
        // Filter by selected category
        if (selectedCategory && category.id !== selectedCategory) {
          return false;
        }
        
        // Filter by search term
        if (searchTerm) {
          const matchesCategory = category.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesTools = category.tools.some(tool => 
            tool.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return matchesCategory || matchesTools;
        }
        
        return true;
      })
      .map(category => {
        if (!searchTerm) return category;
        
        // Filter tools within category based on search term
        const filteredTools = category.tools.filter(tool => 
          tool.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return {
          ...category,
          tools: filteredTools
        };
      })
      .filter(category => category.tools.length > 0); // Remove categories with no matching tools
  }, [searchTerm, selectedCategory]);

  return (
    <div className="p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Tools Dashboard</h1>
          <p className={`text-gray-300 mb-6 text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Browse through all available tools organized by category</p>
          
          {/* Stats Cards */}
          <div className="dashboard-stats-grid">
            <motion.div 
              className="dashboard-stat-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dashboard-stat-header">
                <div className="dashboard-stat-icon">
                  <Grid className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="dashboard-stat-title">Total Tools</p>
                  <p className="dashboard-stat-value">{stats.totalTools}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="dashboard-stat-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dashboard-stat-header">
                <div className="dashboard-stat-icon">
                  <List className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="dashboard-stat-title">Categories</p>
                  <p className="dashboard-stat-value">{stats.totalCategories}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="dashboard-stat-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dashboard-stat-header">
                <div className="dashboard-stat-icon">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <p className="dashboard-stat-title">Bookmarked</p>
                  <p className="dashboard-stat-value">{stats.favoriteTools}</p>
                </div>
              </div>
            </motion.div>
          </div>
          
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
        </motion.div>
        
        {/* Categories */}
        {filteredCategories.length === 0 ? (
          <motion.div 
            className="dashboard-no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No tools found matching your search.</p>
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
                whileHover={{ y: viewMode === 'grid' ? -8 : 0 }}
              >
                {viewMode === 'list' ? (
                  <>
                    <div className="dashboard-category-header mb-0 mr-6">
                      <span className="dashboard-category-icon">
                        {category.icon}
                      </span>
                      <h2 className="dashboard-category-title">{category.name}</h2>
                    </div>
                    <div className="dashboard-tools-list-container flex-1">
                      {category.tools.map((tool) => (
                        <Link 
                          key={tool.id}
                          to={tool.href} 
                          className="dashboard-tool-link"
                        >
                          <span className="dashboard-tool-bullet"></span>
                          {tool.name}
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
                      <h2 className="dashboard-category-title">{category.name}</h2>
                    </div>
                    <ul className="space-y-3">
                      {category.tools.map((tool) => (
                        <li key={tool.id}>
                          <Link 
                            to={tool.href} 
                            className="dashboard-tool-link"
                          >
                            <span className="dashboard-tool-bullet"></span>
                            {tool.name}
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
      </div>
    </div>
  );
};

export default DashboardContent;