import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, setupInstallPrompt } from './utils/pwa'
import { initPerformanceMonitoring } from './utils/performance'

// Initialize PWA features
if (import.meta.env.PROD) {
  registerServiceWorker();
  setupInstallPrompt();
}

// Initialize performance monitoring
initPerformanceMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
