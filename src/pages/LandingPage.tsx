import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Code, 
  Type, 
  Image, 
  Palette, 
  QrCode, 
  Share2, 
  MoreHorizontal,
  ChevronRight,
  Star,
  Shield,
  Clock,
  Play,
  Sparkles
} from 'lucide-react';
import heroBackground from '../assets/hero-background.jpg';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "100+ Free Tools",
      description: "Access over 100 powerful tools completely free of charge"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "No Registration Required",
      description: "Use all tools instantly without creating an account"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "All tools work instantly in your browser"
    }
  ];

  const categories = [
    {
      id: 'text-tools',
      name: 'Text Tools',
      icon: <Type className="w-8 h-8 text-blue-500" />,
      tools: ['Case Converter', 'Lorem Ipsum Generator', 'Letter Counter'],
      description: 'Transform and analyze your text with powerful utilities'
    },
    {
      id: 'coding-tools',
      name: 'Coding Tools',
      icon: <Code className="w-8 h-8 text-rose-500" />,
      tools: ['HTML Formatter', 'CSS Minifier', 'JS Formatter'],
      description: 'Format, minify, and convert your code effortlessly'
    },
    {
      id: 'image-tools',
      name: 'Image Tools',
      icon: <Image className="w-8 h-8 text-emerald-500" />,
      tools: ['Image Cropper', 'Image Filters', 'Image Resizer'],
      description: 'Edit and optimize your images without uploading'
    },
    {
      id: 'css-tools',
      name: 'CSS Tools',
      icon: <Palette className="w-8 h-8 text-violet-500" />,
      tools: ['CSS Loader', 'CSS Checkbox', 'CSS Switch'],
      description: 'Create beautiful CSS components with ease'
    },
    {
      id: 'barcode-tools',
      name: 'QR & Barcode',
      icon: <QrCode className="w-8 h-8 text-amber-500" />,
      tools: ['QR Code Generator', 'Barcode Maker', 'Bulk Generator'],
      description: 'Generate scannable codes for any purpose'
    },
    {
      id: 'social-tools',
      name: 'Social Media',
      icon: <Share2 className="w-8 h-8 text-sky-500" />,
      tools: ['Instagram Filters', 'Tweet Generator', 'Post Creator'],
      description: 'Create engaging social media content'
    }
  ];

  const popularTools = [
    { id: 'case-converter', name: 'Case Converter', category: 'Text Tools' },
    { id: 'qr-code-generator', name: 'QR Code Generator', category: 'QR & Barcode' },
    { id: 'css-loader-generator', name: 'CSS Loader', category: 'CSS Tools' },
    { id: 'image-cropper', name: 'Image Cropper', category: 'Image Tools' },
    { id: 'html-formatter', name: 'HTML Formatter', category: 'Coding Tools' },
    { id: 'instagram-post-generator', name: 'Instagram Post Creator', category: 'Social Media' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-animated opacity-90"></div>
        
        {/* Hero background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroBackground} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-secondary/10 rounded-full blur-xl float-delayed"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-xl float"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-primary/10 rounded-full blur-xl float-delayed"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-glass-bg border border-glass-border rounded-full px-6 py-3 mb-8 backdrop-blur-md animate-fade-in"
            >
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground">Welcome to the future of tools</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold mb-6 animate-slide-in-up"
            >
              <span className="text-gradient font-poppins">Tools Dashboard</span>
            </motion.h1>

            {/* Tagline */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-5xl font-semibold mb-8 text-foreground animate-slide-in-up animate-delay-200"
            >
              All the tools you need in one place
            </motion.h2>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-in-up animate-delay-300"
            >
              Discover 100+ powerful, free online tools for developers, designers, and creators. 
              No registration required. Fast, secure, and always available.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-in-up animate-delay-400"
            >
              <Link 
                to="/tools" 
                className="btn-hero group"
              >
                Explore Tools
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#categories" 
                className="btn-hero-outline group"
              >
                <Play className="mr-2 w-5 h-5" />
                View Dashboard
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in animate-delay-600"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">100+</div>
                <div className="text-muted-foreground">Free Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">1M+</div>
                <div className="text-muted-foreground">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">24/7</div>
                <div className="text-muted-foreground">Always Available</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Why Choose Our Tools?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features designed to make your work easier and faster
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories" className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Browse Tool Categories
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Explore our wide range of tools organized by category
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      {category.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                      Popular Tools:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.tools.map((tool, toolIndex) => (
                        <span 
                          key={toolIndex}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/tools#${category.id}`}
                    className="w-full py-2 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white font-medium rounded-lg flex items-center justify-center gap-2 hover:shadow-md transition-all duration-300"
                  >
                    Explore {category.name}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Tools Section */}
      <div className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Popular Tools
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Most frequently used tools by our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {tool.category}
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-full">
                    Popular
                  </div>
                </div>
                <Link 
                  to={`/tools/${tool.id}`}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-1 hover:shadow-md transition-all duration-300"
                >
                  Try Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Access all our tools instantly with no registration required
          </p>
          <Link 
            to="/tools" 
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Explore All Tools
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold text-white">Tools Dashboard</span>
              </div>
              <p className="text-slate-400">
                All the tools you need in one place. Free and easy to use.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link to="/tools#text-tools" className="hover:text-white transition-colors">Text Tools</Link></li>
                <li><Link to="/tools#coding-tools" className="hover:text-white transition-colors">Coding Tools</Link></li>
                <li><Link to="/tools#image-tools" className="hover:text-white transition-colors">Image Tools</Link></li>
                <li><Link to="/tools#css-tools" className="hover:text-white transition-colors">CSS Tools</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Popular Tools</h3>
              <ul className="space-y-2">
                <li><Link to="/tools/qr-code-generator" className="hover:text-white transition-colors">QR Code Generator</Link></li>
                <li><Link to="/tools/case-converter" className="hover:text-white transition-colors">Case Converter</Link></li>
                <li><Link to="/tools/css-loader-generator" className="hover:text-white transition-colors">CSS Loader</Link></li>
                <li><Link to="/tools/image-cropper" className="hover:text-white transition-colors">Image Cropper</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Tools Dashboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;