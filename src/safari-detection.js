// 🎯 Safari Detection and Consistency Fixes

// Detect Safari browser
const isSafari = () => {
  return navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
};

// Detect iOS Safari
const isIOSSafari = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && isSafari();
};

// Detect Android Chrome
const isAndroidChrome = () => {
  return /Android/.test(navigator.userAgent) && navigator.userAgent.includes('Chrome');
};

// Apply Safari-specific fixes
const applySafariFixes = () => {
  if (isSafari()) {
    console.log('🎯 Safari detected - applying consistency fixes');
    
    // Force consistent font rendering
    document.documentElement.style.setProperty('--webkit-font-smoothing', 'antialiased');
    document.documentElement.style.setProperty('--moz-osx-font-smoothing', 'grayscale');
    
    // Fix viewport issues
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
    }
    
    // Fix 100vh issue in iOS Safari
    if (isIOSSafari()) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
    }
    
    // Force hardware acceleration
    const elementsToOptimize = document.querySelectorAll('.animate-float, .animate-slide-up, .animate-fade-in, .animate-pulse, .animate-pulse-slow, .animate-ping');
    elementsToOptimize.forEach(element => {
      element.style.webkitTransform = 'translateZ(0)';
      element.style.transform = 'translateZ(0)';
      element.style.webkitBackfaceVisibility = 'hidden';
      element.style.backfaceVisibility = 'hidden';
      element.style.webkitPerspective = '1000px';
      element.style.perspective = '1000px';
    });
    
    // Fix button styling
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"]');
    buttons.forEach(button => {
      button.style.webkitAppearance = 'none';
      button.style.appearance = 'none';
      button.style.webkitTapHighlightColor = 'transparent';
      button.style.touchAction = 'manipulation';
      button.style.webkitUserSelect = 'none';
      button.style.userSelect = 'none';
    });
    
    // Fix form elements
    const formElements = document.querySelectorAll('input, textarea, select');
    formElements.forEach(element => {
      element.style.webkitAppearance = 'none';
      element.style.appearance = 'none';
      element.style.borderRadius = '0';
      element.style.fontSize = '16px';
      element.style.webkitTextSizeAdjust = '100%';
      element.style.webkitUserSelect = 'text';
      element.style.userSelect = 'text';
    });
    
    // Fix gradient text rendering
    const gradientTexts = document.querySelectorAll('.text-transparent.bg-clip-text');
    gradientTexts.forEach(element => {
      element.style.webkitBackgroundClip = 'text';
      element.style.backgroundClip = 'text';
      element.style.webkitTextFillColor = 'transparent';
      element.style.textFillColor = 'transparent';
    });
    
    // Fix backdrop blur
    const backdropElements = document.querySelectorAll('.backdrop-blur-sm');
    backdropElements.forEach(element => {
      element.style.webkitBackdropFilter = 'blur(4px)';
      element.style.backdropFilter = 'blur(4px)';
    });
    
    // Fix touch events
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
    
    // Add Safari-specific classes
    document.body.classList.add('safari-browser');
    
    console.log('✅ Safari fixes applied successfully');
  }
};

// Apply Android Chrome optimizations
const applyAndroidChromeOptimizations = () => {
  if (isAndroidChrome()) {
    console.log('🤖 Android Chrome detected - applying optimizations');
    
    // Ensure consistent rendering
    document.documentElement.style.setProperty('--webkit-font-smoothing', 'antialiased');
    document.documentElement.style.setProperty('--moz-osx-font-smoothing', 'grayscale');
    
    // Add Android-specific classes
    document.body.classList.add('android-chrome');
    
    console.log('✅ Android Chrome optimizations applied successfully');
  }
};

// Initialize fixes when DOM is ready
const initializeConsistencyFixes = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applySafariFixes();
      applyAndroidChromeOptimizations();
    });
  } else {
    applySafariFixes();
    applyAndroidChromeOptimizations();
  }
};

// Export functions for use in other modules
export {
  isSafari,
  isIOSSafari,
  isAndroidChrome,
  applySafariFixes,
  applyAndroidChromeOptimizations,
  initializeConsistencyFixes
};

// Auto-initialize
initializeConsistencyFixes(); 