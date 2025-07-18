/**
 * SmartResumeScan - Main JavaScript
 * Handles general functionality, scroll animations, and user interactions
 */

// Global variables
let isScrolling = false;
let scrollTimeout;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeScrollAnimations();
    initializeCookieConsent();
    initializeTooltips();
    initializeSmoothScrolling();
    initializeFormValidation();
    initializeNavbarAnimation();
});

/**
 * Initialize the main application
 */
function initializeApp() {
    console.log('SmartResumeScan initialized');
    
    // Check if user has visited before
    const hasVisited = localStorage.getItem('smartresume_visited');
    if (!hasVisited) {
        localStorage.setItem('smartresume_visited', 'true');
        // Show welcome message or tutorial if needed
    }
    
    // Initialize performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }
            }, 0);
        });
    }
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect for multiple elements
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.animationDelay = `${delay}ms`;
                
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.feature-card, .blog-post, .team-card, .value-card, .story-item');
    animateElements.forEach((element, index) => {
        element.classList.add('scroll-fade');
        element.dataset.delay = index * 100; // Stagger animations
        observer.observe(element);
    });
}

/**
 * Initialize cookie consent functionality
 */
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccepted = localStorage.getItem('cookieConsent');
    
    if (!cookieAccepted && cookieConsent) {
        // Show cookie consent after a short delay
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 2000);
    }
}

/**
 * Accept cookies
 */
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.classList.remove('show');
        setTimeout(() => {
            cookieConsent.style.display = 'none';
        }, 300);
    }
    
    // Initialize analytics if cookies are accepted
    initializeAnalytics();
}

/**
 * Decline cookies
 */
function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.classList.remove('show');
        setTimeout(() => {
            cookieConsent.style.display = 'none';
        }, 300);
    }
}

/**
 * Initialize analytics (placeholder)
 */
function initializeAnalytics() {
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            form.classList.add('was-validated');
        });
    });
    
    // Custom validation for specific fields
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.setCustomValidity('Please enter a valid email address');
            } else {
                this.setCustomValidity('');
            }
        });
    });
}

/**
 * Initialize navbar animation on scroll
 */
function initializeNavbarAnimation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

/**
 * Utility function to debounce events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to throttle events
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Show loading state
 */
function showLoading(element) {
    if (element) {
        element.disabled = true;
        const originalContent = element.innerHTML;
        element.dataset.originalContent = originalContent;
        element.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    }
}

/**
 * Hide loading state
 */
function hideLoading(element) {
    if (element && element.dataset.originalContent) {
        element.disabled = false;
        element.innerHTML = element.dataset.originalContent;
        delete element.dataset.originalContent;
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1060;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 150);
        }
    }, duration);
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate file type
 */
function validateFileType(file, allowedTypes = ['.pdf', '.doc', '.docx']) {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
}

/**
 * Handle resize events
 */
const handleResize = throttle(function() {
    // Trigger custom resize event
    window.dispatchEvent(new CustomEvent('smartresize'));
}, 250);

window.addEventListener('resize', handleResize);

/**
 * Handle visibility change
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
    }
});

/**
 * Initialize keyboard navigation
 */
document.addEventListener('keydown', function(e) {
    // ESC key to close modals or overlays
    if (e.key === 'Escape') {
        const cookieConsent = document.getElementById('cookieConsent');
        if (cookieConsent && cookieConsent.classList.contains('show')) {
            declineCookies();
        }
    }
    
    // Handle form submission with Enter key
    if (e.key === 'Enter' && e.target.tagName === 'FORM') {
        e.target.submit();
    }
});

/**
 * Initialize error handling
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Show user-friendly error message for critical errors
    if (e.error && e.error.message) {
        showNotification('An error occurred. Please refresh the page and try again.', 'danger');
    }
});

/**
 * Initialize unhandled promise rejection handling
 */
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    
    // Prevent the default behavior
    e.preventDefault();
    
    // Show user-friendly error message
    showNotification('Something went wrong. Please try again.', 'warning');
});

/**
 * Export utility functions for use in other modules
 */
window.SmartResumeUtils = {
    debounce,
    throttle,
    showLoading,
    hideLoading,
    showNotification,
    formatFileSize,
    validateFileType
};
