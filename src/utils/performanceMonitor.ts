// Performance monitoring utility for Core Web Vitals
interface WebVitalsMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: WebVitalsMetrics = {};
  private observers: MutationObserver[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Measure FCP and LCP
    if ('performance' in window) {
      // Measure FCP
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            this.reportMetric('FCP', entry.startTime);
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
      
      // Measure TTFB
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
            this.reportMetric('TTFB', this.metrics.TTFB);
          }
        }, 0);
      });
    }
    
    // Measure CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as LayoutShift).value;
        }
      }
      this.metrics.CLS = clsValue;
      this.reportMetric('CLS', clsValue);
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  // Measure LCP when page is fully loaded
  public measureLCP() {
    if ('performance' in window && 'PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.LCP = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    }
  }

  // Measure FID
  public measureFID() {
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        if (firstInput) {
          const fid = firstInput.processingStart - firstInput.startTime;
          this.metrics.FID = fid;
          this.reportMetric('FID', fid);
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }
  }

  private reportMetric(name: string, value: number) {
    // In production, you would send this data to your analytics service
    console.log(`[Web Vitals] ${name}: ${value.toFixed(2)}`);
    
    // Example: Send to Google Analytics or your own analytics service
    // gtag('event', 'web_vital', {
    //   'name': name,
    //   'value': Math.round(name === 'CLS' ? value * 1000 : value),
    //   'event_label': window.location.pathname,
    // });
  }

  public getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for use in other parts of the application
export default performanceMonitor;

// Types for TypeScript
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}