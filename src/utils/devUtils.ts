// Development utilities to handle WebSocket and HMR issues

export const isDevelopment = import.meta.env.DEV;

// Suppress WebSocket connection warnings in development
if (isDevelopment) {
  // Override console.warn to filter out WebSocket warnings
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    // Filter out common WebSocket/HMR warnings
    if (
      message.includes('WebSocket connection') ||
      message.includes('HMR') ||
      message.includes('ws://') ||
      message.includes('Failed to connect to WebSocket')
    ) {
      return; // Suppress these warnings
    }
    
    // Allow other warnings through
    originalWarn.apply(console, args);
  };

  // Override console.error to filter out WebSocket errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Filter out common WebSocket/HMR errors
    if (
      message.includes('WebSocket connection') ||
      message.includes('Failed to connect to WebSocket') ||
      message.includes('ws://localhost')
    ) {
      return; // Suppress these errors
    }
    
    // Allow other errors through
    originalError.apply(console, args);
  };
}

// Utility to check if element exists in DOM
export const waitForElement = (selector: string, timeout = 5000): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
};

// Utility to ensure tool container exists
export const ensureToolContainer = (): HTMLElement => {
  let container = document.querySelector('.tool-container') as HTMLElement;
  
  if (!container) {
    container = document.createElement('div');
    container.className = 'tool-container min-h-screen p-6';
    document.body.appendChild(container);
  }
  
  return container;
};