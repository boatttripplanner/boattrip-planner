// public/gtag.js
// 📊 Configuración de Google Analytics 4

// Configuración global de Google Analytics
window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

// Inicializar Google Analytics
gtag('js', new Date());

// Configuración principal
gtag('config', 'G-VR3KE7RXBD', {
  // Configuración básica
  page_title: document.title,
  page_location: window.location.href,
  
  // Configuración de privacidad
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
  
  // Configuración de cookies
  cookie_flags: 'SameSite=None;Secure',
  
  // Configuración de eventos personalizados
  custom_map: {
    'custom_parameter_1': 'product_id',
    'custom_parameter_2': 'product_category',
    'custom_parameter_3': 'source',
    'custom_parameter_4': 'post_slug'
  },
  
  // Configuración de conversiones
  send_page_view: true,
  
  // Configuración de debugging (solo en desarrollo)
  debug_mode: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
});

// Eventos personalizados predefinidos
gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href,
  page_path: window.location.pathname
});

// Tracking de errores de JavaScript
window.addEventListener('error', function(e) {
  gtag('event', 'exception', {
    description: e.message,
    fatal: false,
    file_name: e.filename,
    line_number: e.lineno
  });
});

// Tracking de errores de recursos
window.addEventListener('unhandledrejection', function(e) {
  gtag('event', 'exception', {
    description: e.reason,
    fatal: false,
    event_type: 'unhandled_promise_rejection'
  });
});

// Tracking de performance
if ('performance' in window) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        gtag('event', 'timing_complete', {
          name: 'load',
          value: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
          event_category: 'performance'
        });
      }
    }, 0);
  });
}

// Tracking de scroll
let scrollDepth = 0;
window.addEventListener('scroll', function() {
  const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  if (scrollPercent > scrollDepth && scrollPercent % 25 === 0) { // Cada 25%
    scrollDepth = scrollPercent;
    gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `scroll_${scrollPercent}%`,
      value: scrollPercent
    });
  }
});

// Tracking de clicks en enlaces externos
document.addEventListener('click', function(e) {
  const target = e.target.closest('a');
  if (target && target.hostname !== window.location.hostname) {
    gtag('event', 'click', {
      event_category: 'outbound',
      event_label: target.href,
      value: 1
    });
  }
});

// Tracking de formularios
document.addEventListener('submit', function(e) {
  const form = e.target;
  if (form.tagName === 'FORM') {
    gtag('event', 'form_submit', {
      event_category: 'engagement',
      event_label: form.action || 'unknown_form',
      value: 1
    });
  }
});

// Exportar función gtag globalmente
window.gtag = gtag;

console.log('✅ Google Analytics configurado correctamente');
