/**
 * SmartResumeScan - Theme Toggle JavaScript
 * Handles dark/light mode switching functionality
 */

// Theme management variables
let currentTheme = 'light';
const THEME_STORAGE_KEY = 'smartresume_theme';

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
});

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (!themeToggle || !themeIcon) return;
    
    // Load saved theme or detect system preference
    loadTheme();
    
    // Add click handler
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(handleSystemThemeChange);
    }
    
    console.log('Theme toggle initialized');
}

/**
 * Load theme from localStorage or system preference
 */
function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        // Detect system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light';
        }
    }
    
    applyTheme(currentTheme);
}

/**
 * Apply theme to the document
 */
function applyTheme(theme) {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark');
    
    // Apply new theme
    body.classList.add(`theme-${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update icon
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(theme);
    
    // Trigger theme change event
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
    
    currentTheme = theme;
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add transition class for smooth animation
    document.body.classList.add('theme-transition');
    
    // Apply new theme
    applyTheme(newTheme);
    
    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
    
    // Show notification
    const themeName = newTheme === 'dark' ? 'Dark' : 'Light';
    if (window.SmartResumeUtils) {
        window.SmartResumeUtils.showNotification(`Switched to ${themeName} mode`, 'info', 2000);
    }
    
    // Track theme change
    trackThemeChange(newTheme);
}

/**
 * Handle system theme change
 */
function handleSystemThemeChange(e) {
    // Only apply system theme if user hasn't manually set a preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (!savedTheme) {
        const systemTheme = e.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
    }
}

/**
 * Update meta theme-color for mobile browsers
 */
function updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    
    const color = theme === 'dark' ? '#0f172a' : '#ffffff';
    metaThemeColor.content = color;
}

/**
 * Track theme change for analytics
 */
function trackThemeChange(theme) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_change', {
            'event_category': 'user_preference',
            'event_label': theme,
            'custom_map': {
                'dimension2': theme
            }
        });
    }
    
    console.log('Theme changed to:', theme);
}

/**
 * Get current theme
 */
function getCurrentTheme() {
    return currentTheme;
}

/**
 * Set theme programmatically
 */
function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
        console.warn('Invalid theme:', theme);
        return;
    }
    
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Reset theme to system preference
 */
function resetToSystemTheme() {
    localStorage.removeItem(THEME_STORAGE_KEY);
    
    const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(systemTheme);
    
    if (window.SmartResumeUtils) {
        window.SmartResumeUtils.showNotification('Theme reset to system preference', 'info', 2000);
    }
}

/**
 * Add theme transition styles
 */
function addThemeTransitionStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .theme-transition * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }
        
        .theme-transition .navbar {
            transition: background-color 0.3s ease, backdrop-filter 0.3s ease !important;
        }
        
        .theme-transition .btn {
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease !important;
        }
        
        .theme-transition .form-control,
        .theme-transition .form-select {
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease !important;
        }
        
        .theme-transition .card,
        .theme-transition .feature-card,
        .theme-transition .blog-post {
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Initialize theme transition styles
 */
addThemeTransitionStyles();

/**
 * Listen for theme change events
 */
window.addEventListener('themeChange', function(e) {
    const theme = e.detail.theme;
    
    // Update any theme-dependent elements
    const scoreCircles = document.querySelectorAll('.score-circle');
    scoreCircles.forEach(circle => {
        circle.style.transition = 'border-color 0.3s ease';
    });
    
    // Update charts or other visual elements if needed
    updateThemeSpecificElements(theme);
});

/**
 * Update theme-specific elements
 */
function updateThemeSpecificElements(theme) {
    // Update code blocks or syntax highlighting
    const codeBlocks = document.querySelectorAll('pre, code');
    codeBlocks.forEach(block => {
        if (theme === 'dark') {
            block.style.backgroundColor = '#1e293b';
            block.style.color = '#e2e8f0';
        } else {
            block.style.backgroundColor = '#f8fafc';
            block.style.color = '#334155';
        }
    });
    
    // Update any embedded content or iframes
    const embeddedContent = document.querySelectorAll('iframe[data-theme-responsive]');
    embeddedContent.forEach(iframe => {
        const src = iframe.src;
        if (src.includes('theme=')) {
            iframe.src = src.replace(/theme=\w+/, `theme=${theme}`);
        }
    });
}

/**
 * Keyboard shortcut for theme toggle
 */
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Shift + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
    }
});

/**
 * Export theme functions for global use
 */
window.ThemeManager = {
    getCurrentTheme,
    setTheme,
    toggleTheme,
    resetToSystemTheme,
    applyTheme
};

/**
 * Initialize theme preferences on page load
 */
window.addEventListener('load', function() {
    // Ensure theme is properly applied after all resources are loaded
    setTimeout(() => {
        applyTheme(currentTheme);
    }, 100);
});
