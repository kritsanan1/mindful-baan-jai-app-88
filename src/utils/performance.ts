// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  if (import.meta.env.DEV) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};

export const measureAsyncPerformance = async (name: string, fn: () => Promise<any>) => {
  if (import.meta.env.DEV) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  } else {
    return await fn();
  }
};

// Web Vitals measurement
export const measureWebVitals = () => {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('LCP:', entry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('FID:', (entry as any).processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let clsValue = 0;
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

// Memory usage monitoring
export const logMemoryUsage = () => {
  if (import.meta.env.DEV && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
    });
  }
};

// Bundle size analyzer
export const logBundleInfo = () => {
  if (import.meta.env.DEV) {
    console.group('Bundle Analysis');
    console.log('Total bundles loaded:', document.querySelectorAll('script[src]').length);
    console.log('Total stylesheets loaded:', document.querySelectorAll('link[rel="stylesheet"]').length);
    console.groupEnd();
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (import.meta.env.DEV) {
    measureWebVitals();
    
    // Log initial metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        logMemoryUsage();
        logBundleInfo();
      }, 1000);
    });
  }
};
