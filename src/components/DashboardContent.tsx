import React from 'react';
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
  MoreHorizontal
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
  return (
    <div className="p-8 overflow-y-auto">
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
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              className={`${isDark 
                ? 'bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/40 border-slate-600/30 hover:border-slate-500/50' 
                : 'bg-gradient-to-br from-white/80 via-slate-50/60 to-white/40 border-slate-200/30 hover:border-slate-300/50'} backdrop-blur-xl rounded-2xl shadow-2xl p-6 border transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: isDark ? "0 25px 50px -12px rgba(59, 130, 246, 0.15)" : "0 25px 50px -12px rgba(59, 130, 246, 0.1)" }}
            >
              <div className="flex items-center mb-4">
                <span className={`mr-3 p-2 ${isDark 
                  ? 'bg-gradient-to-br from-slate-700/80 to-slate-800/60' 
                  : 'bg-gradient-to-br from-slate-100/80 to-slate-200/60'} rounded-xl shadow-lg`}>
                  {category.icon}
                </span>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{category.name}</h2>
              </div>
              <ul className="space-y-3">
                {category.tools.map((tool) => (
                  <li key={tool.id}>
                    <Link 
                      to={tool.href} 
                      className={`${isDark 
                        ? 'text-emerald-400 hover:text-cyan-300' 
                        : 'text-emerald-600 hover:text-cyan-600'} font-medium flex items-center group transition-colors duration-200`}
                    >
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mr-2 group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-200 shadow-sm"></span>
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
  );
};

export default DashboardContent;