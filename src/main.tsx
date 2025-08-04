import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx'
import './index.css'
import './safari-android-consistency.css'
import './safari-detection.js'
import { initPerformanceOptimizations } from './performance-optimizations'

// Inicializar optimizaciones de rendimiento
initPerformanceOptimizations();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 