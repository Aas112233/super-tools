import React, { useEffect } from 'react';
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
  Sparkles,
  BarChart2
} from 'lucide-react';
// @ts-ignore
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
    },
    {
      id: 'echarts-integration',
      name: 'Chart and Graph Tools',
      icon: <BarChart2 className="w-8 h-8 text-green-500" />,
      tools: ['ECharts Integration', 'Data Visualization Builder', 'Chart Exporter'],
      description: 'Create and customize interactive charts and graphs'
    }
  ];

  const popularTools = [
    { id: 'case-converter', name: 'Case Converter', category: 'Text Tools' },
    { id: 'qr-code-generator', name: 'QR Code Generator', category: 'QR & Barcode' },
    { id: 'css-loader-generator', name: 'CSS Loader', category: 'CSS Tools' },
    { id: 'image-cropper', name: 'Image Cropper', category: 'Image Tools' },
    { id: 'html-formatter', name: 'HTML Formatter', category: 'Coding Tools' },
    { id: 'instagram-post-generator', name: 'Instagram Post Creator', category: 'Social Media' },
    { id: 'echarts-integration', name: 'ECharts Chart Builder', category: 'Chart and Graph Tools' }
  ];

  // Create floating particles for background effect
  useEffect(() => {
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
      // Clear any existing particles
      particlesContainer.innerHTML = '';
      
      // Create new particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 10 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative">
        {/* Background elements */}
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
        
        {/* Floating decorative elements */}
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
        
        {/* Particles container */}
        <div className="particles-container absolute inset-0 overflow-hidden"></div>

        {/* Main content */}
        <div className="hero-content relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-badge animate-fade-in-up"
          >
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="hero-badge-text">Welcome to the future of tools</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-title animate-fade-in-up animate-delay-100"
          >
            Tools Dashboard
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-subtitle animate-fade-in-up animate-delay-200"
          >
            All the tools you need in one place
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hero-description animate-fade-in-up animate-delay-300"
          >
            Discover 100+ powerful, free online tools for developers, designers, and creators. 
            No registration required. Fast, secure, and always available.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hero-cta animate-fade-in-up animate-delay-400"
          >
            <Link 
              to="/tools" 
              className="btn-hero group flex items-center"
            >
              Explore Tools
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#categories" 
              className="btn-hero-outline group flex items-center"
            >
              <Play className="mr-2 w-5 h-5" />
              View Dashboard
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hero-stats animate-fade-in-up animate-delay-600"
          >
            <div className="stat-item">
              <div className="stat-value">100+</div>
              <div className="stat-label">Free Tools</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">1M+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Always Available</div>
            </div>
          </motion.div>
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
      <section className="features-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our Tools?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make your work easier and faster
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -10 }}
              className="feature-card"
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">
                {feature.title}
              </h3>
              <p className="feature-description">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="categories-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse Tool Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of tools organized by category
          </p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -10 }}
              className="category-card"
            >
              <div className="category-header">
                <div className="category-icon-container">
                  {category.icon}
                </div>
                <h3 className="category-title">
                  {category.name}
                </h3>
              </div>
              
              <div className="category-body">
                <p className="category-description">
                  {category.description}
                </p>
                
                <div className="category-tools">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Popular Tools:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.tools.map((tool, toolIndex) => (
                      <span 
                        key={toolIndex}
                        className="category-tool"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link 
                  to={`/tools#${category.id}`}
                  className="category-link flex items-center justify-center gap-2"
                >
                  Explore {category.name}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="popular-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most frequently used tools by our community
          </p>
        </div>
        
        <div className="popular-grid">
          {popularTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -10 }}
              className="popular-card"
            >
              <div className="popular-card-header">
                <h3 className="popular-card-title">
                  {tool.name}
                </h3>
                <div className="popular-badge">
                  Popular
                </div>
              </div>
              <p className="popular-card-category">
                {tool.category}
              </p>
              <Link 
                to={`/tools/${tool.id}`}
                className="popular-card-link flex items-center justify-center gap-1"
              >
                Try Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="max-w-3xl mx-auto">
          <h2 className="cta-title">
            Ready to Get Started?
          </h2>
          <p className="cta-description">
            Access all our tools instantly with no registration required
          </p>
          <Link 
            to="/tools" 
            className="cta-button"
          >
            Explore All Tools
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <Zap className="h-8 w-8 text-primary" />
              <span>Tools Dashboard</span>
            </div>
            <p className="footer-description">
              All the tools you need in one place. Free and easy to use.
            </p>
          </div>
          
          <div>
            <h3 className="footer-heading">Categories</h3>
            <ul className="footer-links">
              <li className="footer-link"><Link to="/tools#text-tools">Text Tools</Link></li>
              <li className="footer-link"><Link to="/tools#coding-tools">Coding Tools</Link></li>
              <li className="footer-link"><Link to="/tools#image-tools">Image Tools</Link></li>
              <li className="footer-link"><Link to="/tools#css-tools">CSS Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer-heading">Popular Tools</h3>
            <ul className="footer-links">
              <li className="footer-link"><Link to="/tools/qr-code-generator">QR Code Generator</Link></li>
              <li className="footer-link"><Link to="/tools/case-converter">Case Converter</Link></li>
              <li className="footer-link"><Link to="/tools/css-loader-generator">CSS Loader</Link></li>
              <li className="footer-link"><Link to="/tools/image-cropper">Image Cropper</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li className="footer-link"><a href="#">Help Center</a></li>
              <li className="footer-link"><a href="#">Contact Us</a></li>
              <li className="footer-link"><a href="#">Privacy Policy</a></li>
              <li className="footer-link"><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Tools Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;