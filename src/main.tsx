import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, setupInstallPrompt } from './utils/pwa'

// Initialize PWA features
if (import.meta.env.PROD) {
  registerServiceWorker();
  setupInstallPrompt();
}

createRoot(document.getElementById("root")!).render(<App />);
