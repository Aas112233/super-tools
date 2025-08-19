// Cloudflare Pages configuration for super-tools
// This file defines build settings for Cloudflare Pages deployment

export default {
  // Build settings
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  
  // Environment variables (if needed)
  env: {
    NODE_VERSION: '18'
  },
  
  // Routing configuration
  routes: [
    {
      pattern: '/assets/*',
      serve: '/assets/'
    },
    {
      pattern: '*',
      serve: '/index.html'
    }
  ]
};