import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/tools.css'
import './styles/landing.css'
import performanceMonitor from './utils/performanceMonitor.ts'
import './utils/devUtils' // Import development utilities to suppress WebSocket warnings

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Measure Core Web Vitals
performanceMonitor.measureLCP()
// FID has been replaced with INP in the latest web vitals update
// performanceMonitor.measureFID() is maintained in the custom implementation

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)