/**
 * Performance utilities for optimization
 */

// Performance optimization: Use RAF for smooth animations
const rafThrottle = (callback) => {
    let ticking = false;
    return (...args) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                callback(...args);
                ticking = false;
            });
            ticking = true;
        }
    };
};

// Performance monitoring with Core Web Vitals
const initPerformanceMonitoring = () => {
    if ('performance' in window) {
        // Monitor loading performance
        window.addEventListener('load', function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && perfData.loadEventEnd > 0) {
                const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_load_time', { value: loadTime });
                }

                // Monitor Core Web Vitals
                if ('web-vitals' in window) {
                    window['web-vitals'].getCLS(console.log);
                    window['web-vitals'].getFID(console.log);
                    window['web-vitals'].getLCP(console.log);
                }
            }
        });

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('High memory usage detected');
                }
            }, 30000);
        }
    }

    // Service Worker for caching (if available)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }

    // Connection quality adaptation
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Reduce animations for slow connections
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
    }
};

// Enhanced prefetching with priority
const initPrefetching = (urls = []) => {
    // Use Intersection Observer to prefetch when user shows intent
    const prefetchObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const href = entry.target.href;
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                }
            }
        });
    }, { threshold: 0.5 });

    // Apply observer to links
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        prefetchObserver.observe(link);
    });

    // Immediate prefetch for high priority resources
    setTimeout(() => {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }, 1000);
};

// Export functions
window.performanceUtils = {
    rafThrottle,
    initPerformanceMonitoring,
    initPrefetching
};