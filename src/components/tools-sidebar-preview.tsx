import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  Star, 
  Type, 
  Image, 
  Palette, 
  Code, 
  Share2, 
  MoreHorizontal,
  Zap
} from 'lucide-react';
import { Button } from "./ui/button";

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
  'case-converter': { id: 'case-converter', name: 'Text Case Transformer', href: '/tools/case-converter' },
  'lorem-ipsum-generator': { id: 'lorem-ipsum-generator', name: 'Placeholder Text Generator', href: '/tools/lorem-ipsum-generator' },
  'letter-counter': { id: 'letter-counter', name: 'Character Counter', href: '/tools/letter-counter' },
  'text-to-handwriting-converter': { id: 'text-to-handwriting-converter', name: 'Handwriting Text Generator', href: '/tools/text-to-handwriting-converter' },
  'bionic-reading-converter': { id: 'bionic-reading-converter', name: 'Bionic Text Converter', href: '/tools/bionic-reading-converter' },
  'multiple-whitespace-remover': { id: 'multiple-whitespace-remover', name: 'Whitespace Cleaner', href: '/tools/multiple-whitespace-remover' },
  'google-fonts-pair-finder': { id: 'google-fonts-pair-finder', name: 'Font Pairing Finder', href: '/tools/google-fonts-pair-finder' },
  'image-cropper': { id: 'image-cropper', name: 'Image Trimmer', href: '/tools/image-cropper' },
  'image-filters': { id: 'image-filters', name: 'Photo Filters', href: '/tools/image-filters' },
  'image-resizer': { id: 'image-resizer', name: 'Image Dimension Adjuster', href: '/tools/image-resizer' },
  'image-average-color-finder': { id: 'image-average-color-finder', name: 'Average Color Detector', href: '/tools/image-average-color-finder' },
  'image-color-extractor': { id: 'image-color-extractor', name: 'Color Palette Extractor', href: '/tools/image-color-extractor' },
  'image-color-picker': { id: 'image-color-picker', name: 'Color Selector', href: '/tools/image-color-picker' },
  'css-loader-generator': { id: 'css-loader-generator', name: 'Loading Animation Creator', href: '/tools/css-loader-generator' },
  'css-checkbox-generator': { id: 'css-checkbox-generator', name: 'Custom Checkbox Designer', href: '/tools/css-checkbox-generator' },
  'css-switch-generator': { id: 'css-switch-generator', name: 'Toggle Switch Creator', href: '/tools/css-switch-generator' },
  'css-clip-path-generator': { id: 'css-clip-path-generator', name: 'Clip Path Designer', href: '/tools/css-clip-path-generator' },
  'css-background-pattern-generator': { id: 'css-background-pattern-generator', name: 'Background Pattern Maker', href: '/tools/css-background-pattern-generator' },
  'css-cubic-bezier-generator': { id: 'css-cubic-bezier-generator', name: 'Animation Curve Designer', href: '/tools/css-cubic-bezier-generator' },
  'css-glassmorphism-generator': { id: 'css-glassmorphism-generator', name: 'Glassmorphism Generator', href: '/tools/css-glassmorphism-generator' },
  'code-to-image-converter': { id: 'code-to-image-converter', name: 'Code Screenshot Generator', href: '/tools/code-to-image-converter' },
  'url-slug-generator': { id: 'url-slug-generator', name: 'SEO URL Creator', href: '/tools/url-slug-generator' },
  'react-native-shadow-generator': { id: 'react-native-shadow-generator', name: 'React Native Shadow Creator', href: '/tools/react-native-shadow-generator' },
  'base64-encoder-decoder': { id: 'base64-encoder-decoder', name: 'Base64 Converter', href: '/tools/base64-encoder-decoder' },
  'html-encoder-decoder': { id: 'html-encoder-decoder', name: 'HTML Encoder/Decoder', href: '/tools/html-encoder-decoder' },
  'url-encoder-decoder': { id: 'url-encoder-decoder', name: 'URL Encoder/Decoder', href: '/tools/url-encoder-decoder' },
  'instagram-filters': { id: 'instagram-filters', name: 'Instagram Filter Effects', href: '/tools/instagram-filters' },
  'instagram-post-generator': { id: 'instagram-post-generator', name: 'Instagram Post Creator', href: '/tools/instagram-post-generator' },
  'instagram-photo-downloader': { id: 'instagram-photo-downloader', name: 'Instagram Image Downloader', href: '/tools/instagram-photo-downloader' },
  'tweet-generator': { id: 'tweet-generator', name: 'Twitter Post Creator', href: '/tools/tweet-generator' },
  'tweet-to-image-converter': { id: 'tweet-to-image-converter', name: 'Tweet Image Generator', href: '/tools/tweet-to-image-converter' },
  'twitter-ad-revenue-generator': { id: 'twitter-ad-revenue-generator', name: 'Twitter Ad Earnings Calculator', href: '/tools/twitter-ad-revenue-generator' },
  'strong-random-password-generator': { id: 'strong-random-password-generator', name: 'Secure Password Creator', href: '/tools/strong-random-password-generator' },
  'list-randomizer': { id: 'list-randomizer', name: 'Item Shuffler', href: '/tools/list-randomizer' },
  'qr-code-generator': { id: 'qr-code-generator', name: 'QR Code Creator', href: '/tools/qr-code-generator' },
  'barcode-generator': { id: 'barcode-generator', name: 'Barcode Maker', href: '/tools/barcode-generator' },
  'fake-iban-generator': { id: 'fake-iban-generator', name: 'Mock IBAN Generator', href: '/tools/fake-iban-generator' },
};

// Static categories configuration
const CATEGORIES_CONFIG: Category[] = [
  {
    id: 'favorite-tools',
    name: 'Bookmarked Tools',
    icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" />,
    tools: ['case-converter', 'lorem-ipsum-generator', 'letter-counter']
  },
  {
    id: 'text-tools',
    name: 'Text Processing',
    icon: <Type className="w-5 h-5 text-blue-400" />,
    tools: [
      'case-converter', 'lorem-ipsum-generator', 'letter-counter',
      'text-to-handwriting-converter', 'bionic-reading-converter',
      'multiple-whitespace-remover', 'google-fonts-pair-finder'
    ]
  },
  {
    id: 'image-tools',
    name: 'Image Editing',
    icon: <Image className="w-5 h-5 text-emerald-400" />,
    tools: [
      'image-cropper', 'image-filters', 'image-resizer',
      'image-average-color-finder', 'image-color-extractor', 'image-color-picker'
    ]
  },
  {
    id: 'css-tools',
    name: 'CSS Generators',
    icon: <Palette className="w-5 h-5 text-violet-400" />,
    tools: [
      'css-loader-generator', 'css-checkbox-generator', 'css-switch-generator',
      'css-clip-path-generator', 'css-background-pattern-generator', 'css-cubic-bezier-generator',
      'css-glassmorphism-generator'
    ]
  },
  {
    id: 'coding-tools',
    name: 'Developer Tools',
    icon: <Code className="w-5 h-5 text-rose-400" />,
    tools: [
      'code-to-image-converter', 'url-slug-generator', 'react-native-shadow-generator',
      'base64-encoder-decoder', 'html-encoder-decoder', 'url-encoder-decoder'
    ]
  },
  {
    id: 'social-media-tools',
    name: 'Social Media Helpers',
    icon: <Share2 className="w-5 h-5 text-sky-400" />,
    tools: [
      'instagram-filters', 'instagram-post-generator', 'instagram-photo-downloader',
      'tweet-generator', 'tweet-to-image-converter', 'twitter-ad-revenue-generator'
    ]
  },
  {
    id: 'miscellaneous-tools',
    name: 'Other Utilities',
    icon: <MoreHorizontal className="w-5 h-5 text-gray-300" />,
    tools: [
      'strong-random-password-generator', 'list-randomizer', 'qr-code-generator',
      'barcode-generator', 'fake-iban-generator'
    ]
  }
];

export default function DarkToolsSidebar() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'favorite-tools': true,
    'text-tools': true,
  });

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Memoize categories with resolved tools to prevent unnecessary re-renders
  const categories = useMemo(() => 
    CATEGORIES_CONFIG.map(category => ({
      ...category,
      tools: category.tools.map(toolId => TOOLS_REGISTRY[toolId])
    })), []
  );

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <motion.div 
        className="w-80 bg-gray-800 text-white flex flex-col h-full shadow-2xl border-r border-gray-700"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <Zap className="w-5 h-5" />
            </span>
            Tools Dashboard
          </h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {categories.map((category) => (
            <div key={category.id} className="mb-2">
              <motion.button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-gray-700 transition-all duration-200 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <span className="mr-3 p-2 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
                    {category.icon}
                  </span>
                  <span className="font-semibold text-lg">{category.name}</span>
                </div>
                <motion.div
                  animate={{ rotate: openCategories[category.id] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openCategories[category.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 space-y-1">
                      {category.tools.map((tool) => (
                        <motion.div key={tool.id} whileHover={{ x: 5 }}>
                          <Link
                            to={tool.href}
                            className="flex items-center p-3 rounded-lg hover:bg-gray-700 text-gray-200 hover:text-white transition-all duration-200 group"
                          >
                            <div className="bg-gray-700 border border-gray-600 rounded-lg w-7 h-7 mr-3 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium">{tool.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <Button 
            variant="secondary" 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-gray-900 font-bold py-6 rounded-xl transition-all duration-300 shadow-lg"
          >
            View All Tools
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">Tools Dashboard</h1>
            <p className="text-gray-300 mb-8 text-lg">Browse through all available tools organized by category</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => (
              <motion.div 
                key={category.id}
                className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
              >
                <div className="flex items-center mb-4">
                  <span className="mr-3 p-2 bg-gray-700 rounded-lg">
                    {category.icon}
                  </span>
                  <h2 className="text-xl font-bold text-white">{category.name}</h2>
                </div>
                <ul className="space-y-3">
                  {category.tools.slice(0, 4).map((tool) => (
                    <li key={tool.id}>
                      <Link 
                        to={tool.href} 
                        className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center group"
                      >
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2 group-hover:bg-cyan-400"></span>
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}