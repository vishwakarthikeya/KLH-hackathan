// ============================================================================
// BUGSCOPE AI - Bug Severity Prediction System
// JavaScript for Interactive Features
// ============================================================================

// DOM Elements
const bugForm = document.getElementById('bugForm');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const severityDisplay = document.getElementById('severityDisplay');
const explanationText = document.getElementById('explanationText');
const recommendedActions = document.getElementById('recommendedActions');

// Sample Bug Data for Demo
const sampleBugs = [
    {
        title: "Login page crashes on mobile Safari",
        description: "When users attempt to login using Safari browser on iOS devices, the page crashes immediately after entering credentials. This affects approximately 30% of mobile users. Error logs show memory overflow in authentication module.",
        category: "Functional",
        domain: "Mobile"
    },
    {
        title: "Slow database query on user dashboard",
        description: "The user dashboard takes 8-10 seconds to load due to inefficient database queries. This affects all users but is particularly noticeable for users with large amounts of data. The issue occurs consistently during peak hours.",
        category: "Performance",
        domain: "Web"
    },
    {
        title: "Password reset vulnerability",
        description: "The password reset functionality doesn't validate token expiration properly, allowing old reset links to work indefinitely. This poses a security risk and needs immediate attention.",
        category: "Security",
        domain: "Web"
    },
    {
        title: "Inconsistent button colors in dark mode",
        description: "Some buttons in dark mode don't follow the design system color palette. This is a visual inconsistency but doesn't affect functionality.",
        category: "UI/UX",
        domain: "Web"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log("BUGSCOPE AI initialized");
    
    // Set up event listeners
    setupEventListeners();
    
    // Load first sample by default
    loadSampleBug(0);
});

// Event Listeners Setup
function setupEventListeners() {
    // Form submission
    bugForm.addEventListener('submit', function(e) {
        e.preventDefault();
        predictSeverity();
    });
    
    // Clear form
    clearBtn.addEventListener('click', clearForm);
    
    // Load sample bug
    sampleBtn.addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * sampleBugs.length);
        loadSampleBug(randomIndex);
    });
    
    // Add input validation feedback
    const inputs = bugForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
}

// Form Validation
function validateInput(input) {
    if (input.value.trim() === '') {
        input.style.borderColor = 'var(--danger-color)';
        return false;
    } else {
        input.style.borderColor = 'var(--border-color)';
        return true;
    }
}

// Clear Form Function
function clearForm() {
    bugForm.reset();
    
    // Reset all inputs to default border color
    const inputs = bugForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.borderColor = 'var(--border-color)';
    });
    
    // Reset severity display
    resetSeverityDisplay();
    
    showNotification('Form cleared successfully!', 'info');
}

// Load Sample Bug
function loadSampleBug(index) {
    const sample = sampleBugs[index];
    
    document.getElementById('bugTitle').value = sample.title;
    document.getElementById('bugDescription').value = sample.description;
    document.getElementById('bugCategory').value = sample.category;
    document.getElementById('bugDomain').value = sample.domain;
    
    // Validate all inputs
    const inputs = bugForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        validateInput(input);
    });
    
    showNotification(`Loaded sample bug #${index + 1}: ${sample.title}`, 'success');
    
    // Auto-predict for sample
    setTimeout(predictSeverity, 500);
}

// Predict Severity Function
function predictSeverity() {
    // Get form values
    const title = document.getElementById('bugTitle').value.trim();
    const description = document.getElementById('bugDescription').value.trim();
    const category = document.getElementById('bugCategory').value;
    const domain = document.getElementById('bugDomain').value;
    
    // Validate required fields
    if (!title || !description) {
        showNotification('Please fill in all required fields (title and description)', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState(true);
    
    // Simulate API call/ML model prediction (in real app, this would be an actual API call)
    setTimeout(() => {
        // Generate mock prediction (in real app, this would come from your ML model)
        const prediction = generateMockPrediction(title, description, category, domain);
        
        // Update UI with prediction
        updateSeverityDisplay(prediction);
        updateExplanation(prediction);
        updateRecommendedActions(prediction.severity);
        
        // Hide loading state
        showLoadingState(false);
        
        // Show success notification
        showNotification(`Severity predicted: ${prediction.severity} with ${prediction.confidence}% confidence`, 'success');
        
        // Log prediction data
        console.log('Prediction Results:', prediction);
        
    }, 1500); // Simulate network/processing delay
}

// Generate Mock Prediction (Replace with actual ML model call)
function generateMockPrediction(title, description, category, domain) {
    // This is a mock prediction function
    // In a real application, you would:
    // 1. Send the data to your backend API
    // 2. The API would call your ML model
    // 3. Return the actual prediction
    
    const text = (title + ' ' + description).toLowerCase();
    
    // Simple rule-based mock prediction (for demo purposes)
    let severity;
    let confidence;
    
    // Keywords that suggest high severity
    const highSeverityKeywords = ['crash', 'vulnerability', 'security', 'data loss', 'hack', 'exploit', 'critical'];
    // Keywords that suggest medium severity
    const mediumSeverityKeywords = ['slow', 'error', 'bug', 'issue', 'problem', 'broken', 'not working'];
    // Keywords that suggest low severity
    const lowSeverityKeywords = ['cosmetic', 'color', 'font', 'alignment', 'spacing', 'visual', 'ui'];
    
    // Count keyword matches
    let highCount = 0, mediumCount = 0, lowCount = 0;
    
    highSeverityKeywords.forEach(keyword => {
        if (text.includes(keyword)) highCount++;
    });
    
    mediumSeverityKeywords.forEach(keyword => {
        if (text.includes(keyword)) mediumCount++;
    });
    
    lowSeverityKeywords.forEach(keyword => {
        if (text.includes(keyword)) lowCount++;
    });
    
    // Determine severity based on keywords and category
    if (highCount > 0 || category === 'Security') {
        severity = 'High';
        confidence = 70 + Math.random() * 20;
    } else if (mediumCount > 0 || category === 'Performance') {
        severity = 'Medium';
        confidence = 75 + Math.random() * 15;
    } else {
        severity = 'Low';
        confidence = 80 + Math.random() * 10;
    }
    
    // Adjust confidence based on description length (longer descriptions = more confident)
    const descriptionLength = description.length;
    if (descriptionLength > 200) {
        confidence += 5;
    } else if (descriptionLength < 50) {
        confidence -= 10;
    }
    
    // Cap confidence between 50-95%
    confidence = Math.max(50, Math.min(95, confidence));
    
    // Generate probabilities for each severity level
    const probabilities = {
        Low: severity === 'Low' ? confidence : (100 - confidence) / 2,
        Medium: severity === 'Medium' ? confidence : (100 - confidence) / 2,
        High: severity === 'High' ? confidence : (100 - confidence) / 2
    };
    
    // Normalize probabilities to sum to 100%
    const total = probabilities.Low + probabilities.Medium + probabilities.High;
    probabilities.Low = Math.round((probabilities.Low / total) * 100);
    probabilities.Medium = Math.round((probabilities.Medium / total) * 100);
    probabilities.High = Math.round((probabilities.High / total) * 100);
    
    return {
        severity,
        confidence: Math.round(confidence),
        probabilities,
        keywords: {
            high: highSeverityKeywords.filter(kw => text.includes(kw)),
            medium: mediumSeverityKeywords.filter(kw => text.includes(kw)),
            low: lowSeverityKeywords.filter(kw => text.includes(kw))
        },
        category,
        domain
    };
}

// Update Severity Display
function updateSeverityDisplay(prediction) {
    const severityIndicators = severityDisplay.querySelectorAll('.severity-indicator');
    
    // Remove active class from all indicators
    severityIndicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Find and activate the correct severity indicator
    severityIndicators.forEach(indicator => {
        if (indicator.classList.contains(prediction.severity.toLowerCase())) {
            indicator.classList.add('active');
            
            // Update percentage
            const percentageElement = indicator.querySelector('.severity-percentage');
            percentageElement.textContent = `${prediction.probabilities[prediction.severity]}%`;
        } else {
            // Update other severity percentages
            const severityClass = Array.from(indicator.classList)
                .find(cls => ['low', 'medium', 'high'].includes(cls));
            
            if (severityClass) {
                const severity = severityClass.charAt(0).toUpperCase() + severityClass.slice(1);
                const percentageElement = indicator.querySelector('.severity-percentage');
                percentageElement.textContent = `${prediction.probabilities[severity]}%`;
            }
        }
    });
    
    // Update confidence meter
    const meterFill = document.querySelector('.meter-fill');
    const meterValue = document.querySelector('.meter-value');
    
    meterFill.style.width = `${prediction.confidence}%`;
    meterValue.textContent = `${prediction.confidence}%`;
    
    // Update confidence badge
    const confidenceBadge = document.querySelector('.confidence-badge span');
    if (prediction.confidence >= 80) {
        confidenceBadge.textContent = 'High Confidence';
        confidenceBadge.parentElement.style.background = 'rgba(16, 185, 129, 0.1)';
        confidenceBadge.parentElement.style.color = 'var(--success-color)';
    } else if (prediction.confidence >= 60) {
        confidenceBadge.textContent = 'Medium Confidence';
        confidenceBadge.parentElement.style.background = 'rgba(245, 158, 11, 0.1)';
        confidenceBadge.parentElement.style.color = 'var(--warning-color)';
    } else {
        confidenceBadge.textContent = 'Low Confidence';
        confidenceBadge.parentElement.style.background = 'rgba(239, 68, 68, 0.1)';
        confidenceBadge.parentElement.style.color = 'var(--danger-color)';
    }
}

// Reset Severity Display
function resetSeverityDisplay() {
    const severityIndicators = severityDisplay.querySelectorAll('.severity-indicator');
    
    // Remove active class from all indicators
    severityIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        
        // Reset to default percentages
        const severityClass = Array.from(indicator.classList)
            .find(cls => ['low', 'medium', 'high'].includes(cls));
        
        if (severityClass === 'low') {
            indicator.querySelector('.severity-percentage').textContent = '45%';
        } else if (severityClass === 'medium') {
            indicator.querySelector('.severity-percentage').textContent = '78%';
        } else if (severityClass === 'high') {
            indicator.querySelector('.severity-percentage').textContent = '32%';
        }
    });
    
    // Reset confidence meter
    const meterFill = document.querySelector('.meter-fill');
    const meterValue = document.querySelector('.meter-value');
    
    meterFill.style.width = '78%';
    meterValue.textContent = '78%';
    
    // Reset confidence badge
    const confidenceBadge = document.querySelector('.confidence-badge span');
    confidenceBadge.textContent = 'High Confidence';
    confidenceBadge.parentElement.style.background = 'rgba(16, 185, 129, 0.1)';
    confidenceBadge.parentElement.style.color = 'var(--success-color)';
}

// Update Explanation
function updateExplanation(prediction) {
    const severity = prediction.severity;
    const category = prediction.category;
    const domain = prediction.domain;
    
    let explanation = `The bug is classified as <strong>${severity} Severity</strong> `;
    
    if (severity === 'High') {
        explanation += `because it represents a critical issue affecting core functionality or security. `;
        explanation += `The ${category.toLowerCase()} category in ${domain.toLowerCase()} domain requires immediate attention.`;
    } else if (severity === 'Medium') {
        explanation += `as it impacts user experience but doesn't prevent core functionality. `;
        explanation += `The ${category.toLowerCase()} issue should be addressed in the next development cycle.`;
    } else {
        explanation += `since it's a minor issue that doesn't affect functionality. `;
        explanation += `This ${category.toLowerCase()} issue can be addressed during regular maintenance.`;
    }
    
    if (prediction.keywords.high.length > 0) {
        explanation += ` Keywords like "${prediction.keywords.high.join(', ')}" indicate significant impact.`;
    }
    
    explanationText.innerHTML = explanation;
    
    // Update feature tags
    const featureTagsContainer = document.querySelector('.explanation-features');
    featureTagsContainer.innerHTML = '';
    
    // Add keyword tags
    const allKeywords = [
        ...prediction.keywords.high,
        ...prediction.keywords.medium,
        ...prediction.keywords.low
    ].slice(0, 5); // Show max 5 tags
    
    allKeywords.forEach(keyword => {
        const tag = document.createElement('span');
        tag.className = 'feature-tag';
        tag.innerHTML = `<i class="fas fa-keyword"></i> ${keyword}`;
        featureTagsContainer.appendChild(tag);
    });
    
    // Add category and domain tags
    const categoryTag = document.createElement('span');
    categoryTag.className = 'feature-tag';
    categoryTag.innerHTML = `<i class="fas fa-tag"></i> ${category}`;
    featureTagsContainer.appendChild(categoryTag);
    
    const domainTag = document.createElement('span');
    domainTag.className = 'feature-tag';
    domainTag.innerHTML = `<i class="fas fa-globe"></i> ${domain}`;
    featureTagsContainer.appendChild(domainTag);
}

// Update Recommended Actions
function updateRecommendedActions(severity) {
    const actionsList = recommendedActions;
    actionsList.innerHTML = '';
    
    let actions = [];
    
    if (severity === 'High') {
        actions = [
            '<i class="fas fa-exclamation-triangle"></i> Address immediately (within 24 hours)',
            '<i class="fas fa-user-shield"></i> Assign to senior developer',
            '<i class="fas fa-bell"></i> Notify stakeholders',
            '<i class="fas fa-history"></i> Implement temporary workaround',
            '<i class="fas fa-file-alt"></i> Create detailed incident report'
        ];
    } else if (severity === 'Medium') {
        actions = [
            '<i class="fas fa-clock"></i> Address within 3-5 business days',
            '<i class="fas fa-users"></i> Assign to development team',
            '<i class="fas fa-test"></i> Test on multiple devices',
            '<i class="fas fa-history"></i> Monitor for similar reports',
            '<i class="fas fa-calendar"></i> Schedule for next sprint'
        ];
    } else {
        actions = [
            '<i class="fas fa-calendar"></i> Address in next release cycle',
            '<i class="fas fa-paint-brush"></i> Assign to UI/UX team',
            '<i class="fas fa-check"></i> Verify with design system',
            '<i class="fas fa-low-vision"></i> Check accessibility impact',
            '<i class="fas fa-tasks"></i> Add to backlog'
        ];
    }
    
    actions.forEach(action => {
        const li = document.createElement('li');
        li.innerHTML = action;
        actionsList.appendChild(li);
    });
}

// Show Loading State
function showLoadingState(isLoading) {
    const predictButton = bugForm.querySelector('.btn-primary');
    const buttons = bugForm.querySelectorAll('.btn');
    
    if (isLoading) {
        // Disable all buttons
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.7';
            btn.style.cursor = 'not-allowed';
        });
        
        // Update predict button
        predictButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing Bug...';
        
        // Add loading animation to result card
        const resultCard = document.querySelector('.result-card');
        resultCard.classList.add('loading');
        
    } else {
        // Re-enable all buttons
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
        
        // Reset predict button
        predictButton.innerHTML = '<i class="fas fa-brain"></i> Predict Severity';
        
        // Remove loading animation
        const resultCard = document.querySelector('.result-card');
        resultCard.classList.remove('loading');
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            ${icon}
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                max-width: 400px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .notification-success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border-left: 4px solid #047857;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                border-left: 4px solid #b91c1c;
            }
            
            .notification-warning {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                border-left: 4px solid #b45309;
            }
            
            .notification-info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border-left: 4px solid #1d4ed8;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0;
                font-size: 1rem;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add slideOut animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyle);

// Export functionality (mock implementation)
document.querySelectorAll('.export-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const exportType = this.textContent.trim().split(' ')[0];
        
        switch (exportType) {
            case 'PDF':
                showNotification('PDF report generation started...', 'info');
                // In real app: Generate and download PDF
                break;
            case 'CSV':
                showNotification('CSV data exported successfully!', 'success');
                // In real app: Generate and download CSV
                break;
            case 'Copy':
                copyToClipboard();
                break;
        }
    });
});

// Copy to clipboard function
function copyToClipboard() {
    const title = document.getElementById('bugTitle').value;
    const severity = document.querySelector('.severity-indicator.active .severity-label span').textContent;
    const confidence = document.querySelector('.meter-value').textContent;
    
    const summary = `Bug Summary:
Title: ${title}
Predicted Severity: ${severity}
Confidence: ${confidence}%

Generated by BUGSCOPE AI`;

    navigator.clipboard.writeText(summary)
        .then(() => {
            showNotification('Summary copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
}