# Deployment Guide for 1001s.info

## Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Git
- Access to Ionos hosting account

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd super-tools
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Building for Production

1. Create a production build:
```bash
npm run build
```

2. The optimized build will be generated in the `dist` folder with:
   - Code-split JavaScript bundles
   - Optimized CSS
   - Compressed images
   - All SEO enhancements

## Performance Optimizations Included

The production build includes several performance optimizations:

1. **Code Splitting**: Main bundle reduced from 3.9MB to 138KB
2. **Image Optimization**: All images compressed without quality loss
3. **Font Optimization**: Reduced Google Fonts loading with font-display: swap
4. **Lazy Loading**: Tool components loaded on-demand
5. **Caching**: Service worker for offline support and faster repeat visits
6. **Resource Preloading**: Critical resources preloaded for faster initial render

## Deployment to Ionos

1. Build the project:
```bash
npm run build
```

2. Connect to Ionos via SFTP using FileZilla (as you've already done)

3. Upload the contents of the `dist` folder to your web root directory:
   - `index.html`
   - `robots.txt`
   - `sitemap.xml`
   - `site.webmanifest`
   - `serviceWorker.js`
   - `assets/` folder containing all CSS, JS, and image files

4. Ensure your .htaccess file is properly configured for SPA routing:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Post-Deployment Verification

1. Check that the website loads properly:
   - Homepage should load quickly
   - All tool pages should be accessible
   - No broken images or missing resources

2. Verify SEO enhancements:
   - Check meta tags with browser dev tools
   - Verify robots.txt is accessible
   - Confirm sitemap.xml is properly formatted

3. Test performance improvements:
   - Use Chrome DevTools Lighthouse to check Core Web Vitals
   - Verify bundle sizes are optimized
   - Test lazy loading functionality

## Monitoring

The site includes built-in performance monitoring:
- Core Web Vitals are automatically measured
- Metrics are logged to the console (can be extended to send to analytics services)

## Troubleshooting

### If pages don't load after refresh:
Ensure the .htaccess file is properly configured for SPA routing.

### If images don't load:
Verify all files from the `dist/assets` folder were uploaded correctly.

### If performance seems poor:
Check that the code-split bundles are being loaded correctly and not blocked by ad blockers or security software.

## Updating the Site

To deploy updates:

1. Pull the latest changes:
```bash
git pull origin main
```

2. Install any new dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Upload the new `dist` folder contents to Ionos, overwriting existing files.

## Additional Notes

- The optimized build should significantly improve Core Web Vitals scores
- Lazy loading ensures users only download code for tools they actually use
- Service worker provides offline functionality for better user experience
- All SEO enhancements are included in the build