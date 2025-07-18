/**
 * SmartResumeScan - Resume Scanner JavaScript
 * Handles file upload, resume analysis, and scoring functionality
 */

// Global variables for resume scanning
let currentFile = null;
let analysisInProgress = false;

// Resume analysis data and scoring algorithms
const RESUME_ANALYSIS_DATA = {
    strengths: [
        'Clear contact information',
        'Professional summary present',
        'Relevant work experience',
        'Education section included',
        'Skills section well-organized',
        'Consistent formatting',
        'Action verbs used effectively',
        'Quantified achievements',
        'Appropriate length',
        'ATS-friendly formatting',
        'Industry-relevant keywords',
        'Professional email address',
        'Proper grammar and spelling',
        'Logical structure',
        'Clear job titles'
    ],
    weaknesses: [
        'Missing contact information',
        'No professional summary',
        'Gaps in work history',
        'Inconsistent formatting',
        'Too lengthy or too short',
        'Missing keywords',
        'Weak action verbs',
        'No quantified achievements',
        'Poor grammar/spelling',
        'Unprofessional email',
        'Missing skills section',
        'Outdated information',
        'Generic objective statement',
        'Complex formatting for ATS',
        'Missing education details'
    ],
    tips: [
        'Add specific metrics and numbers to quantify your achievements',
        'Include relevant keywords from the job description',
        'Use strong action verbs to start each bullet point',
        'Ensure consistent formatting throughout the document',
        'Keep your resume to 1-2 pages maximum',
        'Use a professional email address',
        'Include a compelling professional summary',
        'Proofread carefully for spelling and grammar errors',
        'Use standard section headings (Experience, Education, Skills)',
        'Save your resume as both PDF and Word formats',
        'Customize your resume for each job application',
        'Remove outdated or irrelevant information',
        'Use white space effectively for readability',
        'Include relevant certifications and training',
        'Add your LinkedIn profile URL'
    ]
};

// Initialize resume scanner when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeResumeScanner();
});

/**
 * Initialize resume scanner functionality
 */
function initializeResumeScanner() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('resumeUpload');
    const loadingState = document.getElementById('loadingState');
    const resultsSection = document.getElementById('resultsSection');
    
    if (!uploadArea || !fileInput) return;
    
    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop handlers
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    console.log('Resume scanner initialized');
}

/**
 * Prevent default drag behaviors
 */
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

/**
 * Handle drag over event
 */
function handleDragOver(e) {
    e.preventDefault();
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.add('drag-over');
}

/**
 * Handle drag leave event
 */
function handleDragLeave(e) {
    e.preventDefault();
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('drag-over');
}

/**
 * Handle file drop event
 */
function handleFileDrop(e) {
    e.preventDefault();
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

/**
 * Handle file selection
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

/**
 * Process the uploaded file
 */
function processFile(file) {
    // Validate file type
    if (!SmartResumeUtils.validateFileType(file)) {
        SmartResumeUtils.showNotification('Please upload a PDF, DOC, or DOCX file.', 'danger');
        return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        SmartResumeUtils.showNotification('File size must be less than 10MB.', 'danger');
        return;
    }
    
    currentFile = file;
    analyzeResume(file);
}

/**
 * Analyze the resume file
 */
function analyzeResume(file) {
    if (analysisInProgress) return;
    
    analysisInProgress = true;
    
    // Show loading state
    showLoadingState();
    
    // Simulate file processing and analysis
    setTimeout(() => {
        const analysisResult = performResumeAnalysis(file);
        displayResults(analysisResult);
        analysisInProgress = false;
    }, 2000 + Math.random() * 1000); // Random delay between 2-3 seconds
}

/**
 * Show loading state
 */
function showLoadingState() {
    const uploadArea = document.getElementById('uploadArea');
    const loadingState = document.getElementById('loadingState');
    const resultsSection = document.getElementById('resultsSection');
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (loadingState) loadingState.classList.remove('d-none');
    if (resultsSection) resultsSection.classList.add('d-none');
}

/**
 * Perform resume analysis (simulated)
 */
function performResumeAnalysis(file) {
    // Generate a realistic score based on various factors
    const baseScore = 60 + Math.random() * 35; // Base score between 60-95
    const score = Math.round(baseScore);
    
    // Determine score status
    let status;
    if (score >= 90) status = 'Excellent';
    else if (score >= 80) status = 'Very Good';
    else if (score >= 70) status = 'Good';
    else if (score >= 60) status = 'Fair';
    else status = 'Needs Improvement';
    
    // Select random strengths and weaknesses
    const numStrengths = Math.floor(Math.random() * 3) + 3; // 3-5 strengths
    const numWeaknesses = Math.floor(Math.random() * 3) + 2; // 2-4 weaknesses
    const numTips = Math.floor(Math.random() * 3) + 3; // 3-5 tips
    
    const selectedStrengths = getRandomItems(RESUME_ANALYSIS_DATA.strengths, numStrengths);
    const selectedWeaknesses = getRandomItems(RESUME_ANALYSIS_DATA.weaknesses, numWeaknesses);
    const selectedTips = getRandomItems(RESUME_ANALYSIS_DATA.tips, numTips);
    
    return {
        score,
        status,
        fileName: file.name,
        fileSize: SmartResumeUtils.formatFileSize(file.size),
        strengths: selectedStrengths,
        weaknesses: selectedWeaknesses,
        tips: selectedTips,
        timestamp: new Date().toISOString()
    };
}

/**
 * Get random items from an array
 */
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Display analysis results
 */
function displayResults(result) {
    const loadingState = document.getElementById('loadingState');
    const resultsSection = document.getElementById('resultsSection');
    const scoreValue = document.getElementById('scoreValue');
    const scoreStatus = document.getElementById('scoreStatus');
    const strengthsList = document.getElementById('strengthsList');
    const improvementsList = document.getElementById('improvementsList');
    const tipsList = document.getElementById('tipsList');
    
    // Hide loading state
    if (loadingState) loadingState.classList.add('d-none');
    
    // Show results section
    if (resultsSection) resultsSection.classList.remove('d-none');
    
    // Update score display
    if (scoreValue) {
        scoreValue.textContent = result.score;
        
        // Update score circle progress
        const scoreCircle = scoreValue.closest('.score-circle');
        if (scoreCircle) {
            const angle = (result.score / 100) * 360;
            scoreCircle.style.setProperty('--score-angle', `${angle}deg`);
            
            // Add animation
            setTimeout(() => {
                scoreCircle.style.setProperty('--score-angle', `${angle}deg`);
            }, 100);
        }
    }
    
    if (scoreStatus) {
        scoreStatus.textContent = result.status;
        
        // Update status color
        scoreStatus.className = 'h5 mb-0';
        if (result.score >= 80) scoreStatus.classList.add('text-success');
        else if (result.score >= 60) scoreStatus.classList.add('text-warning');
        else scoreStatus.classList.add('text-danger');
    }
    
    // Update strengths list
    if (strengthsList) {
        strengthsList.innerHTML = result.strengths.map(strength => 
            `<li class="mb-2"><i class="fas fa-check text-success me-2"></i>${strength}</li>`
        ).join('');
    }
    
    // Update improvements list
    if (improvementsList) {
        improvementsList.innerHTML = result.weaknesses.map(weakness => 
            `<li class="mb-2"><i class="fas fa-times text-warning me-2"></i>${weakness}</li>`
        ).join('');
    }
    
    // Update tips list
    if (tipsList) {
        tipsList.innerHTML = result.tips.map(tip => 
            `<div class="mb-2"><i class="fas fa-lightbulb text-info me-2"></i>${tip}</div>`
        ).join('');
    }
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Track analysis event
    trackAnalysisEvent(result);
    
    // Show success notification
    SmartResumeUtils.showNotification(
        `Resume analyzed successfully! Score: ${result.score}/100`,
        'success'
    );
}

/**
 * Track analysis event for analytics
 */
function trackAnalysisEvent(result) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'resume_analysis', {
            'event_category': 'engagement',
            'event_label': 'resume_upload',
            'score': result.score,
            'custom_map': {
                'dimension1': result.status
            }
        });
    }
    
    // Log to console for debugging
    console.log('Resume analysis completed:', {
        score: result.score,
        status: result.status,
        fileName: result.fileName,
        timestamp: result.timestamp
    });
}

/**
 * Reset the scanner to initial state
 */
function resetScanner() {
    const uploadArea = document.getElementById('uploadArea');
    const loadingState = document.getElementById('loadingState');
    const resultsSection = document.getElementById('resultsSection');
    const fileInput = document.getElementById('resumeUpload');
    
    // Reset file input
    if (fileInput) fileInput.value = '';
    
    // Show upload area
    if (uploadArea) uploadArea.style.display = 'block';
    
    // Hide loading and results
    if (loadingState) loadingState.classList.add('d-none');
    if (resultsSection) resultsSection.classList.add('d-none');
    
    // Reset global variables
    currentFile = null;
    analysisInProgress = false;
}

/**
 * Download sample resume template
 */
function downloadSampleResume() {
    // This would typically trigger a download of a sample resume
    SmartResumeUtils.showNotification('Sample resume download will be available soon!', 'info');
}

/**
 * Export analysis results
 */
function exportResults(format = 'pdf') {
    if (!currentFile) {
        SmartResumeUtils.showNotification('No analysis results to export.', 'warning');
        return;
    }
    
    SmartResumeUtils.showNotification(`Exporting results as ${format.toUpperCase()}...`, 'info');
    
    // This would typically generate and download the results
    setTimeout(() => {
        SmartResumeUtils.showNotification('Export functionality will be available soon!', 'info');
    }, 1000);
}

/**
 * Share results on social media
 */
function shareResults(platform) {
    if (!currentFile) {
        SmartResumeUtils.showNotification('No results to share.', 'warning');
        return;
    }
    
    const shareText = `I just analyzed my resume with SmartResumeScan and got valuable insights! Check it out: ${window.location.origin}`;
    
    let shareUrl;
    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
            break;
        default:
            SmartResumeUtils.showNotification('Unsupported sharing platform.', 'warning');
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

/**
 * Get improvement suggestions based on score
 */
function getImprovementSuggestions(score) {
    if (score >= 90) {
        return ['Your resume is excellent! Consider minor tweaks for specific job applications.'];
    } else if (score >= 80) {
        return [
            'Add more quantified achievements',
            'Include relevant keywords for your target industry',
            'Consider adding a professional summary'
        ];
    } else if (score >= 70) {
        return [
            'Improve formatting consistency',
            'Add more specific details about your accomplishments',
            'Update your skills section',
            'Proofread for grammar and spelling errors'
        ];
    } else if (score >= 60) {
        return [
            'Restructure your resume with clear sections',
            'Add more relevant work experience details',
            'Include a skills section',
            'Use stronger action verbs',
            'Quantify your achievements with numbers'
        ];
    } else {
        return [
            'Complete rewrite recommended',
            'Add missing contact information',
            'Include professional summary',
            'Add work experience section',
            'Include education and skills',
            'Use professional formatting',
            'Proofread thoroughly'
        ];
    }
}

/**
 * Initialize keyboard shortcuts for resume scanner
 */
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + U to upload file
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        const fileInput = document.getElementById('resumeUpload');
        if (fileInput) fileInput.click();
    }
    
    // Ctrl/Cmd + R to reset scanner
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetScanner();
    }
});

// Export functions for global use
window.ResumeScanner = {
    resetScanner,
    downloadSampleResume,
    exportResults,
    shareResults,
    analyzeResume
};
