// assets/js/custom.js - Lab 5: JavaScript Forms & Memory Game
// FIXED VERSION - All bugs corrected


function ensureGameContainer() {
    // Check if memory game section exists
    if (!document.getElementById('memory-game')) {
        console.log('Creating memory game section...');
        
        // Create the section
        const gameSection = document.createElement('section');
        gameSection.id = 'memory-game';
        gameSection.className = 'memory-game-section py-5';
        
        // Insert it at the end of the main content or before footer
        const mainContent = document.querySelector('main') || document.querySelector('.container') || document.body;
        const footer = document.querySelector('footer');
        
        if (footer) {
            footer.parentNode.insertBefore(gameSection, footer);
        } else if (mainContent) {
            mainContent.appendChild(gameSection);
        } else {
            document.body.appendChild(gameSection);
        }
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    if (e.filename && (e.filename.includes('chrome-extension://') || 
                       e.filename.includes('extension://'))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    return true;
});

// ===== INITIALIZATION =====
// ===== INITIALIZATION =====
// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Custom JS loaded - Lab 5');
    
    // Initialize form functions
    initContactForm();
    initPhoneMasking();
    initRealTimeValidation();
    initSubmitButtonControl();
    
    // Initialize game - WAIT for DOM to be fully ready
    setTimeout(() => {
        ensureGameContainer();
        initAdvancedMemoryGame();
    }, 100);
});

// Add this helper function near the top of your file:
function ensureGameContainer() {
    if (!document.getElementById('memory-game')) {
        console.log('Creating memory game section...');
        
        const gameSection = document.createElement('section');
        gameSection.id = 'memory-game';
        gameSection.className = 'memory-game-section py-5';
        
        // Try to insert it in a logical place
        const main = document.querySelector('main');
        const container = document.querySelector('.container');
        const contactForm = document.querySelector('.php-email-form');
        
        if (contactForm && contactForm.parentNode) {
            contactForm.parentNode.insertBefore(gameSection, contactForm.nextSibling);
        } else if (main) {
            main.appendChild(gameSection);
        } else if (container) {
            container.appendChild(gameSection);
        } else {
            document.body.appendChild(gameSection);
        }
    }
}

// ===== FORM FUNCTIONS =====
function initContactForm() {
    const contactForm = document.querySelector('.php-email-form');
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    contactForm.removeAttribute('action');
    updateFormSubmission(contactForm);
}

function initPhoneMasking() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/[^\d+]/g, '');
        
        if (!value.startsWith('+370')) {
            if (value.startsWith('370')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+370' + value.substring(1);
            } else if (value.startsWith('6')) {
                value = '+370' + value;
            } else if (value.length >= 8) {
                value = '+370' + value;
            }
        }
        
        let formatted = value;
        if (value.length > 4) {
            formatted = value.substring(0, 4) + ' ' + value.substring(4);
        }
        if (value.length > 7) {
            formatted = formatted.substring(0, 8) + ' ' + formatted.substring(8);
        }
        if (value.length > 10) {
            formatted = formatted.substring(0, 12) + ' ' + formatted.substring(12);
        }
        
        this.value = formatted.substring(0, 16);
        setTimeout(() => validateField(this), 50);
    });
    
    phoneInput.addEventListener('blur', function() {
        validateField(this);
    });
}

function initRealTimeValidation() {
    const form = document.querySelector('.php-email-form');
    if (!form) return;
    
    const fields = form.querySelectorAll('input[name], textarea[name], select[name]');
    
    fields.forEach(field => {
        field.addEventListener('input', function() {
            validateField(this);
            updateSubmitButton();
        });
        
        field.addEventListener('blur', function() {
            validateField(this);
            updateSubmitButton();
        });
        
        setTimeout(() => validateField(field), 100);
    });
}

function validateField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    const fieldId = field.id || field.name;
    let errorElement = document.getElementById(fieldId + '-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = fieldId + '-error';
        errorElement.className = 'validation-error mt-1';
        field.parentNode.appendChild(errorElement);
    }
    
    let isValid = true;
    let errorMessage = '';
    
    const isRequired = field.hasAttribute('required') || 
                      (fieldId && ['name', 'surname', 'email', 'phone', 'address', 'rating1', 'rating2', 'rating3', 'message'].includes(fieldId));
    
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (value) {
        switch(fieldId) {
            case 'name':
            case 'surname':
                if (!/^[A-Za-z\s\-']+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Only letters, spaces, hyphens, and apostrophes allowed';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Must be at least 2 characters';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address (example@domain.com)';
                }
                break;
                
            case 'address':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Address must be at least 10 characters';
                }
                break;
                
            // Replace the phone validation case (around line 120):
case 'phone':
    const digits = value.replace(/\D/g, '');
    // Accept: +370xxxxxxxx, 8xxxxxxxx, 06xxxxxxxx, 370xxxxxxxx
    const phoneRegex = /^(\+370|370|8|6)\d{7,8}$/;
    if (!phoneRegex.test(digits) && digits.length > 0) {
        isValid = false;
        errorMessage = 'Valid formats: +370xxxxxxxx, 8xxxxxxxx, 06xxxxxxxx';
    } else if (digits.length < 8 && digits.length > 0) {
        isValid = false;
        errorMessage = 'Phone number must be 8-9 digits after prefix';
    }
    break;
                
            case 'rating1':
            case 'rating2':
            case 'rating3':
                const rating = parseInt(value);
                if (isNaN(rating)) {
                    if (value !== '') {
                        isValid = false;
                        errorMessage = 'Please enter a number between 1 and 10';
                    }
                } else if (rating < 1 || rating > 10) {
                    isValid = false;
                    errorMessage = 'Rating must be between 1 and 10';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }
    }
    
    errorElement.textContent = errorMessage;
    errorElement.style.display = isValid ? 'none' : 'block';
    
    if (!isValid) {
        field.classList.add('field-error');
        field.classList.remove('field-valid');
    } else if (value !== '') {
        field.classList.remove('field-error');
        field.classList.add('field-valid');
    } else {
        field.classList.remove('field-error', 'field-valid');
    }
    
    return isValid;
}

function initSubmitButtonControl() {
    setTimeout(updateSubmitButton, 100);
    
    const form = document.querySelector('.php-email-form');
    if (!form) return;
    
    const fields = form.querySelectorAll('input[name], textarea[name], select[name]');
    fields.forEach(field => {
        field.addEventListener('input', updateSubmitButton);
        field.addEventListener('change', updateSubmitButton);
        field.addEventListener('blur', updateSubmitButton);
    });
}

function updateSubmitButton() {
    const submitBtn = document.querySelector('.php-email-form button[type="submit"]');
    if (!submitBtn) return;
    
    const allValid = isFormValid();
    submitBtn.disabled = !allValid;
    
    if (allValid) {
        submitBtn.classList.add('btn-enabled');
        submitBtn.classList.remove('btn-disabled');
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    } else {
        submitBtn.classList.add('btn-disabled');
        submitBtn.classList.remove('btn-enabled');
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
    }
}

// Replace the isFormValid function (around line 200):
function isFormValid() {
    const requiredFields = ['name', 'surname', 'email', 'phone', 'address', 'rating1', 'rating2', 'rating3', 'message'];
    let allValid = true;
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field) {
            console.warn('Field not found:', fieldId);
            allValid = false;
            continue;
        }
        
        // Check if field is empty
        if (!field.value.trim()) {
            allValid = false;
            continue;
        }
        
        // Validate field content
        if (!validateField(field)) {
            allValid = false;
        }
    }
    
    return allValid;
}

function updateFormSubmission(form) {
    let resultsContainer = document.getElementById('form-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'form-results';
        resultsContainer.className = 'form-results mt-4';
        form.parentNode.appendChild(resultsContainer);
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Form submit triggered');
        
        if (!isFormValid()) {
            showErrorPopup('Please fill all required fields correctly');
            return false;
        }
        
        const formData = collectFormData();
        
        console.log('=== FORM SUBMITTED ===');
        console.log('Form Data:', formData);
        
        displayFormResults(formData);
        
        const average = calculateAverageRating(formData);
        displayAverageRating(formData, average);
        
        showSuccessPopup();
        
        return false;
    });
}

function collectFormData() {
    const formData = {};
    const fields = ['name', 'surname', 'email', 'phone', 'address', 'subject', 'rating1', 'rating2', 'rating3', 'message'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            formData[fieldId] = field.value.trim();
        }
    });
    
    return formData;
}

function displayFormResults(formData) {
    const resultsContainer = document.getElementById('form-results');
    if (!resultsContainer) return;
    
    const labels = {
        name: 'Name',
        surname: 'Surname',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        subject: 'Subject',
        rating1: 'Design Rating',
        rating2: 'Recommendation Rating',
        rating3: 'Experience Rating',
        message: 'Message'
    };
    
    let html = `
        <div class="results-container p-4 rounded" style="background: #f8f9fa; border: 1px solid #dee2e6;">
            <h4 class="mb-3" style="color: #2c3e50;">Submitted Information:</h4>
            <div class="row">
    `;
    
    for (const [key, label] of Object.entries(labels)) {
        if (formData[key] !== undefined && formData[key] !== '') {
            const value = formData[key];
            html += `
                <div class="col-md-6 mb-2">
                    <strong style="color: #3498db;">${label}:</strong> 
                    <span class="ms-2">${value}</span>
                </div>
            `;
        }
    }
    
    html += '</div></div>';
    resultsContainer.innerHTML = html;
}

function calculateAverageRating(formData) {
    const rating1 = parseFloat(formData.rating1) || 0;
    const rating2 = parseFloat(formData.rating2) || 0;
    const rating3 = parseFloat(formData.rating3) || 0;
    
    if (rating1 === 0 && rating2 === 0 && rating3 === 0) {
        return 0;
    }
    
    return (rating1 + rating2 + rating3) / 3;
}

function displayAverageRating(formData, average) {
    const resultsContainer = document.getElementById('form-results');
    if (!resultsContainer) return;
    
    const name = formData.name || '';
    const surname = formData.surname || '';
    const fullName = `${name} ${surname}`.trim() || 'Anonymous';
    const averageDisplay = average.toFixed(1);
    
    let colorClass = 'bg-danger';
    let colorText = 'text-danger';
    let feedback = 'Needs improvement';
    
    if (average > 7) {
        colorClass = 'bg-success';
        colorText = 'text-success';
        feedback = 'Excellent!';
    } else if (average >= 4) {
        colorClass = 'bg-warning';
        colorText = 'text-warning';
        feedback = 'Good!';
    }
    
    const averageHTML = `
        <div class="average-rating mt-4 p-4 rounded" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">📊 Rating Summary</h5>
                <span class="badge ${colorClass} p-2">${feedback}</span>
            </div>
            
            <div class="text-center mb-3">
                <div style="font-size: 2.5rem; font-weight: bold;">
                    ${averageDisplay}<small style="font-size: 1rem;">/10</small>
                </div>
                <div style="font-size: 0.9rem; opacity: 0.9;">Average Rating</div>
            </div>
            
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <small>Design: ${formData.rating1 || 0}/10</small>
                    <small>Recommendation: ${formData.rating2 || 0}/10</small>
                    <small>Experience: ${formData.rating3 || 0}/10</small>
                </div>
                <div class="progress" style="height: 10px; background: rgba(255,255,255,0.2);">
                    <div class="progress-bar ${colorClass}" style="width: ${average * 10}%"></div>
                </div>
            </div>
            
            <div class="text-center" style="font-size: 0.9rem; opacity: 0.9;">
                ${fullName}'s overall rating
            </div>
        </div>
    `;
    
    const existingAvg = resultsContainer.querySelector('.average-rating');
    if (existingAvg) {
        existingAvg.remove();
    }
    
    resultsContainer.insertAdjacentHTML('beforeend', averageHTML);
}

function showSuccessPopup() {
    const existingPopup = document.querySelector('.success-popup');
    if (existingPopup) existingPopup.remove();
    
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content bg-white p-4 rounded shadow-lg" style="max-width: 400px;">
            <button class="popup-close btn btn-link text-dark" style="position: absolute; top: 10px; right: 10px; border: none; background: none; font-size: 1.5rem;">×</button>
            <div class="text-center mb-3">
                <div style="color: #28a745; font-size: 3rem;">✔</div>
                <h4 class="mb-2">Success!</h4>
                <p class="mb-0">Form submitted successfully.</p>
                <p>Check results below the form.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    popup.querySelector('.popup-close').addEventListener('click', function() {
        popup.classList.remove('show');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 300);
    });
    
    setTimeout(() => {
        if (popup.parentNode && popup.classList.contains('show')) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        }
    }, 3000);
}

function showErrorPopup(message) {
    const existingPopup = document.querySelector('.error-popup');
    if (existingPopup) existingPopup.remove();
    
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    popup.innerHTML = `
        <div class="popup-content bg-white p-4 rounded shadow-lg" style="max-width: 400px;">
            <button class="popup-close btn btn-link text-dark" style="position: absolute; top: 10px; right: 10px; border: none; background: none; font-size: 1.5rem;">×</button>
            <div class="text-center mb-3">
                <div style="color: #dc3545; font-size: 3rem;">⚠️</div>
                <h4 class="mb-2">Error</h4>
                <p class="mb-0">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    popup.querySelector('.popup-close').addEventListener('click', function() {
        popup.classList.remove('show');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 300);
    });
    
    setTimeout(() => {
        if (popup.parentNode && popup.classList.contains('show')) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        }
    }, 3000);
}
// ===== ADVANCED MEMORY GAME =====
function initAdvancedMemoryGame() {
    console.log('🎮 Setting up advanced memory game...');
    
    const section = document.getElementById('memory-game');
    if (!section) return;
    
    // Clear and setup section
    section.innerHTML = '';
    section.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 60px 0;
        border-radius: 20px;
        margin: 40px 0;
        position: relative;
        overflow: hidden;
    `;
    
    // Create game structure
    const gameHTML = `
        <div class="container">
            <!-- Game Header -->
            <div class="text-center mb-5">
                <h1 class="text-white mb-3">🧠 Memory Master</h1>
                <p class="text-light opacity-75">Match pairs to unlock levels!</p>
            </div>
            
            <!-- Game Controls -->
            <div class="row justify-content-center mb-4">
                <div class="col-auto">
                    <button id="start-game" class="btn btn-lg btn-light me-3 px-4">
                        <i class="fas fa-play me-2"></i>Start
                    </button>
                    <button id="restart-game" class="btn btn-lg btn-outline-light me-3 px-4" disabled>
                        <i class="fas fa-redo me-2"></i>Restart
                    </button>
                    <button id="level-up" class="btn btn-lg btn-warning px-4" style="display:none">
                        <i class="fas fa-arrow-up me-2"></i>Next Level
                    </button>
                </div>
            </div>
            
            <!-- Game Stats -->
            <div class="row justify-content-center mb-5">
                <div class="col-md-8">
                    <div class="row g-3 text-center">
                        <div class="col">
                            <div class="stats-card bg-white p-3 rounded shadow">
                                <div class="stats-label text-muted">Level</div>
                                <div id="level" class="stats-value display-6 text-primary">1</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="stats-card bg-white p-3 rounded shadow">
                                <div class="stats-label text-muted">Moves</div>
                                <div id="moves" class="stats-value display-6 text-info">0</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="stats-card bg-white p-3 rounded shadow">
                                <div class="stats-label text-muted">Time</div>
                                <div id="timer" class="stats-value display-6 text-danger">00:00</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="stats-card bg-white p-3 rounded shadow">
                                <div class="stats-label text-muted">Score</div>
                                <div id="score" class="stats-value display-6 text-success">0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Game Board -->
            <div class="row justify-content-center">
                <div class="col-12">
                    <div id="game-board" class="game-board mx-auto">
                        <!-- Cards will be generated here -->
                    </div>
                </div>
            </div>
            
            <!-- Progress -->
            <div class="row justify-content-center mt-5">
                <div class="col-md-6">
                    <div class="progress-container">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-light">Progress</span>
                            <span id="progress-text" class="text-light">0/6</span>
                        </div>
                        <div class="progress" style="height: 10px;">
                            <div id="progress-bar" class="progress-bar bg-success" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Message Display -->
            <div id="game-message" class="alert alert-dismissible fade show mt-4 mx-auto" style="max-width: 500px; display: none;">
                <span id="message-text"></span>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
            
            <!-- Game Instructions -->
            <div class="text-center mt-5">
                <div class="accordion bg-transparent" id="gameInstructions">
                    <div class="accordion-item bg-transparent border-0">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed bg-transparent text-light" type="button" data-bs-toggle="collapse" data-bs-target="#instructionsCollapse">
                                <i class="fas fa-info-circle me-2"></i>How to Play
                            </button>
                        </h2>
                        <div id="instructionsCollapse" class="accordion-collapse collapse">
                            <div class="accordion-body text-start text-light">
                                <ul class="list-unstyled">
                                    <li class="mb-2"><i class="fas fa-mouse-pointer me-2"></i>Click on cards to reveal them</li>
                                    <li class="mb-2"><i class="fas fa-puzzle-piece me-2"></i>Find matching pairs of symbols</li>
                                    <li class="mb-2"><i class="fas fa-trophy me-2"></i>Complete levels to unlock higher difficulties</li>
                                    <li class="mb-2"><i class="fas fa-star me-2"></i>Score points for faster completion</li>
                                    <li><i class="fas fa-brain me-2"></i>Challenge your memory with increasing card counts!</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Celebration Effect Container -->
        <div id="celebration"></div>
    `;
    
    section.innerHTML = gameHTML;
    addAdvancedGameStyles();
    
    // Initialize game state
    window.game = {
        level: 1,
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        score: 0,
        time: 0,
        timer: null,
        isPlaying: false,
        canFlip: true,
        cardSymbols: ['🎯', '🌟', '💎', '🍕', '🎮', '⭐', '🚀', '🎨', '🏆', '🔑', '💡', '🎵'],
        totalPairs: 6, // Start with 6 pairs (12 cards)
        gridSize: 4 // 4x4 grid
    };
    
    // Event listeners
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('restart-game').addEventListener('click', restartGame);
    document.getElementById('level-up').addEventListener('click', nextLevel);
    
    // Generate initial cards
    generateCards();
}

function addAdvancedGameStyles() {
    const style = document.createElement('style');
    style.id = 'advanced-game-styles';
    style.textContent = `
        .game-board {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            max-width: 600px;
            margin: 0 auto;
            padding: 25px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .memory-card {
            width: 100%;
            aspect-ratio: 1;
            cursor: pointer;
            perspective: 1000px;
            transition: transform 0.3s;
        }
        
        .memory-card:hover {
            transform: scale(1.05);
        }
        
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            border-radius: 12px;
        }
        
        .memory-card.flipped .card-inner {
            transform: rotateY(180deg);
        }
        
        .memory-card.matched .card-inner {
            transform: rotateY(180deg);
        }
        
        .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .card-front {
            background: linear-gradient(45deg, #3498db, #8e44ad);
            color: white;
            border: 3px solid rgba(255, 255, 255, 0.3);
        }
        
        .card-back {
            background: white;
            color: #2c3e50;
            transform: rotateY(180deg);
            border: 3px solid rgba(52, 152, 219, 0.3);
        }
        
        .memory-card.matched .card-back {
            background: linear-gradient(45deg, #2ecc71, #27ae60);
            color: white;
            border-color: #27ae60;
            animation: pulse 0.5s ease-in-out;
        }
        
        .memory-card.matched {
            cursor: default;
            pointer-events: none;
        }
        
        .memory-card.matched .card-back::after {
            content: "✓";
            position: absolute;
            bottom: 8px;
            right: 8px;
            font-size: 1rem;
            color: white;
        }
        
        .stats-card {
            transition: all 0.3s;
        }
        
        .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
        }
        
        .stats-label {
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .stats-value {
            font-weight: 800;
            margin-top: 5px;
        }
        
        /* Celebration effects */
        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background: #f00;
            top: -10px;
        }
        
        @keyframes pulse {
            0% { transform: scale(1) rotateY(180deg); }
            50% { transform: scale(1.1) rotateY(180deg); }
            100% { transform: scale(1) rotateY(180deg); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes bounce {
            0%, 20%, 60%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            80% { transform: translateY(-10px); }
        }
        
        /* Level-specific styles */
        .level-2 .game-board { grid-template-columns: repeat(4, 1fr); max-width: 700px; }
        .level-3 .game-board { grid-template-columns: repeat(5, 1fr); max-width: 800px; }
        .level-4 .game-board { grid-template-columns: repeat(6, 1fr); max-width: 900px; }
        .level-5 .game-board { grid-template-columns: repeat(6, 1fr); max-width: 900px; gap: 12px; }
        
        @media (max-width: 768px) {
            .game-board {
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 10px;
                padding: 15px;
            }
            
            .card-front, .card-back {
                font-size: 1.5rem;
            }
        }
        
        @media (max-width: 576px) {
            .game-board {
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 8px;
                padding: 10px;
            }
            
            .card-front, .card-back {
                font-size: 1.25rem;
            }
            
            .stats-value {
                font-size: 1.5rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

function generateCards() {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return;
    
    gameBoard.innerHTML = '';
    gameBoard.className = `game-board level-${window.game.level}`;
    
    // Get symbols for current level
    const symbols = window.game.cardSymbols.slice(0, window.game.totalPairs);
    const cardPairs = [...symbols, ...symbols];
    
    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    
    // Create cards
    cardPairs.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span style="opacity: 0.8;">?</span>
                </div>
                <div class="card-back">
                    ${symbol}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
    
    // Update game stats display
    updateStats();
}

function startGame() {
    if (window.game.isPlaying) return;
    
    window.game.isPlaying = true;
    window.game.moves = 0;
    window.game.time = 0;
    window.game.matchedPairs = 0;
    window.game.score = 0;
    window.game.flippedCards = [];
    window.game.canFlip = true;
    
    // Update UI
    document.getElementById('start-game').disabled = true;
    document.getElementById('restart-game').disabled = false;
    document.getElementById('level-up').style.display = 'none';
    
    // Reset all cards
    document.querySelectorAll('.memory-card').forEach(card => {
        card.classList.remove('flipped', 'matched');
        card.style.pointerEvents = 'auto';
    });
    
    // Start timer
    clearInterval(window.game.timer);
    window.game.timer = setInterval(() => {
        window.game.time++;
        updateTimer();
    }, 1000);
    
    // Show message
    showMessage('Game started! Find matching pairs.', 'info');
    updateProgress();
}

function flipCard(card) {
    if (!window.game.isPlaying || !window.game.canFlip) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    // Flip the card
    card.classList.add('flipped');
    window.game.flippedCards.push(card);
    
    // Play flip sound (optional)
    playSound('flip');
    
    // Check for match when two cards are flipped
    if (window.game.flippedCards.length === 2) {
        window.game.moves++;
        window.game.canFlip = false;
        
        const [card1, card2] = window.game.flippedCards;
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                window.game.matchedPairs++;
                window.game.score += 100 * window.game.level;
                
                // Play match sound
                playSound('match');
                
                // Shake animation for match
                card1.style.animation = 'pulse 0.5s';
                card2.style.animation = 'pulse 0.5s';
                
                window.game.flippedCards = [];
                window.game.canFlip = true;
                
                updateStats();
                updateProgress();
                
                // Check if level completed
                if (window.game.matchedPairs === window.game.totalPairs) {
                    levelComplete();
                } else {
                    showMessage(`Match found! ${window.game.totalPairs - window.game.matchedPairs} pairs left.`, 'success');
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                window.game.flippedCards = [];
                window.game.canFlip = true;
                
                // Shake animation for no match
                card1.style.animation = 'shake 0.5s';
                card2.style.animation = 'shake 0.5s';
                
                showMessage('Not a match. Try again!', 'warning');
            }, 1000);
        }
        
        updateStats();
    }
}

function levelComplete() {
    clearInterval(window.game.timer);
    window.game.isPlaying = false;
    
    // Calculate bonus score
    const timeBonus = Math.max(0, 500 - (window.game.time * 5));
    const moveBonus = Math.max(0, 300 - (window.game.moves * 2));
    const totalBonus = timeBonus + moveBonus;
    window.game.score += totalBonus;
    
    // Update stats
    updateStats();
    
    // Show celebration
    createCelebration();
    
    // Show success message
    const message = `
        🎉 Level ${window.game.level} Complete!<br>
        Time: ${window.game.time}s | Moves: ${window.game.moves}<br>
        Bonus: +${totalBonus} points<br>
        Total Score: ${window.game.score}
    `;
    
    showMessage(message, 'success');
    
    // Show level up button if not max level
    if (window.game.level < 5) {
        document.getElementById('level-up').style.display = 'inline-block';
    }
    
    // Enable restart
    document.getElementById('restart-game').disabled = false;
}

function nextLevel() {
    if (window.game.level < 5) {
        window.game.level++;
        
        // Increase difficulty
        switch(window.game.level) {
            case 2:
                window.game.totalPairs = 8; // 16 cards
                break;
            case 3:
                window.game.totalPairs = 10; // 20 cards
                break;
            case 4:
                window.game.totalPairs = 12; // 24 cards
                break;
            case 5:
                window.game.totalPairs = 15; // 30 cards
                break;
        }
        
        // Update level display
        document.getElementById('level').textContent = window.game.level;
        
        // Hide level up button
        document.getElementById('level-up').style.display = 'none';
        
        // Generate new cards
        generateCards();
        
        // Start new level automatically
        setTimeout(startGame, 1000);
        
        showMessage(`Level ${window.game.level} unlocked! Get ready for more cards!`, 'info');
    }
}

function restartGame() {
    clearInterval(window.game.timer);
    
    // Reset to level 1
    window.game.level = 1;
    window.game.totalPairs = 6;
    
    // Update display
    document.getElementById('level').textContent = '1';
    document.getElementById('level-up').style.display = 'none';
    document.getElementById('start-game').disabled = false;
    document.getElementById('restart-game').disabled = true;
    
    // Generate new cards
    generateCards();
    
    // Clear message
    document.getElementById('game-message').style.display = 'none';
    
    showMessage('Game reset. Click Start to begin!', 'info');
}

function updateStats() {
    document.getElementById('moves').textContent = window.game.moves;
    document.getElementById('score').textContent = window.game.score;
    updateTimer();
}

function updateTimer() {
    const minutes = Math.floor(window.game.time / 60);
    const seconds = window.game.time % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgress() {
    const progress = (window.game.matchedPairs / window.game.totalPairs) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = 
        `${window.game.matchedPairs}/${window.game.totalPairs}`;
}

function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('game-message');
    const textEl = document.getElementById('message-text');
    
    if (!messageEl || !textEl) return;
    
    textEl.innerHTML = text;
    messageEl.className = `alert alert-${type} alert-dismissible fade show mt-4 mx-auto`;
    messageEl.style.display = 'block';
    
    // Auto-hide after 3 seconds if not level complete
    if (!text.includes('Complete')) {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}

function createCelebration() {
    const celebration = document.getElementById('celebration');
    if (!celebration) return;
    
    celebration.innerHTML = '';
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        
        celebration.appendChild(confetti);
    }
    
    // Add celebration CSS
    if (!document.getElementById('celebration-styles')) {
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function playSound(type) {
    // Simple sound effects using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'flip':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                break;
            case 'match':
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                break;
        }
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Update initialization
function initSimpleMemoryGame() {
    console.log('🎮 Initializing advanced memory game...');
    initAdvancedMemoryGame();
}

function createCards() {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return;
    
    gameBoard.innerHTML = '';
    
    const symbols = ['🎯', '🌟', '💎', '🍕', '🎮', '⭐'];
    const cards = [...symbols, ...symbols];
    
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        
        card.addEventListener('click', () => flipMemoryCard(card));
        gameBoard.appendChild(card);
    });
    
    updateGameStats();
}

function startMemoryGame() {
    if (window.gameState.isPlaying) return;
    
    console.log('🎯 Starting memory game...');
    
    window.gameState = {
        isPlaying: true,
        flippedCards: [],
        matches: 0,
        moves: 0,
        time: 0,
        timer: null,
        canFlip: true,
        totalPairs: 6
    };
    
    // Add after line 450 (in startMemoryGame function):
document.querySelectorAll('.memory-card').forEach(card => {
    card.classList.remove('flipped', 'matched');
    card.style.pointerEvents = 'auto';
    card.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
});
    
    document.getElementById('start-btn').disabled = true;
    document.getElementById('reset-btn').disabled = false;
    updateGameStats();
    
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.style.display = 'none';
    }
    
    clearInterval(window.gameState.timer);
    window.gameState.timer = setInterval(() => {
        window.gameState.time++;
        document.getElementById('timer').textContent = window.gameState.time + 's';
    }, 1000);
    
    showGameMessage('Game started! Find matching pairs.', '#3498db');
}

function resetMemoryGame() {
    console.log('🔄 Resetting memory game...');
    
    clearInterval(window.gameState.timer);
    
    window.gameState = {
        isPlaying: false,
        flippedCards: [],
        matches: 0,
        moves: 0,
        time: 0,
        timer: null,
        canFlip: true,
        totalPairs: 6
    };
    
    document.getElementById('start-btn').disabled = false;
    document.getElementById('reset-btn').disabled = true;
    updateGameStats();
    
    createCards();
    
    showGameMessage('Game reset. Click "Start Game" to begin!', '#3498db');
}

function flipMemoryCard(card) {
    if (!window.gameState.isPlaying || !window.gameState.canFlip) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    window.gameState.flippedCards.push(card);
    
    if (window.gameState.flippedCards.length === 2) {
        window.gameState.moves++;
        window.gameState.canFlip = false;
        updateGameStats();
        
        const card1 = window.gameState.flippedCards[0];
        const card2 = window.gameState.flippedCards[1];
        
        // Replace lines 494-520 with:
if (card1.dataset.symbol === card2.dataset.symbol) {
    // FIXED: Match found - cards stay visible
    setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');
        // Keep 'flipped' class so cards stay visible
        
        window.gameState.matches++;
        window.gameState.flippedCards = [];
        window.gameState.canFlip = true;
        updateGameStats();
        
        if (window.gameState.matches === window.gameState.totalPairs) {
            endMemoryGame();
        } else {
            showGameMessage(`Match found! ${window.gameState.totalPairs - window.gameState.matches} pairs left.`, '#2ecc71');
        }
    }, 500);
}

function endMemoryGame() {
    clearInterval(window.gameState.timer);
    window.gameState.isPlaying = false;
    document.getElementById('start-btn').disabled = false;
    
    const message = `🎉 You won! ${window.gameState.moves} moves in ${window.gameState.time} seconds`;
    showGameMessage(message, '#2ecc71');
}

function updateGameStats() {
    document.getElementById('moves').textContent = window.gameState.moves;
    document.getElementById('matches').textContent = `${window.gameState.matches}/${window.gameState.totalPairs}`;
    document.getElementById('timer').textContent = window.gameState.time + 's';
}

function showGameMessage(text, color) {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.style.display = 'block';
    messageEl.style.backgroundColor = color + '20';
    messageEl.style.color = color;
    messageEl.style.borderColor = color;
    messageEl.style.borderRadius = '8px';
    messageEl.style.padding = '10px 15px';
    
    if (!text.includes('won')) {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 2000);
    }
}

console.log('✅ Custom.js loaded successfully - All bugs fixed!');

// Debug: Check if game is loading
setTimeout(() => {
    console.log('Debug check:', {
        gameSection: document.getElementById('memory-game'),
        gameBoard: document.getElementById('game-board'),
        gameState: window.game
    });
    
    if (!document.getElementById('memory-game')) {
        console.error('❌ Game section not found in DOM');
        console.log('Available sections:', document.querySelectorAll('section'));
    }
}, 500);

// Debug: Check if game loaded
window.addEventListener('load', function() {
    setTimeout(() => {
        console.log('Page fully loaded. Checking game...');
        console.log('Memory game element:', document.getElementById('memory-game'));
        console.log('Game state:', window.game || 'Not initialized');
        
        if (!document.getElementById('memory-game')) {
            console.error('CRITICAL: Memory game section still not found!');
            // Create it immediately
            createMemoryGameSection();
            initAdvancedMemoryGame();
        }
    }, 1000);
});
    }
}