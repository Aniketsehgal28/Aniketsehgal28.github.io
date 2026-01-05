// assets/js/custom.js - UPDATED FOR LAB 5

document.addEventListener('DOMContentLoaded', function() {
    console.log('Custom JS loaded - Lab 5: JavaScript Forms');
    
    // Initialize all functionality
    initContactForm();
    initPhoneMasking();
    initRealTimeValidation();
    initSubmitButtonControl();
    initMemoryGame();
});

function initContactForm() {
    const contactForm = document.querySelector('.php-email-form');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }
    
    // Check if we need to add new fields
    if (!document.getElementById('surname')) {
        addFormFields(contactForm);
    }
    
    // Update form submission handler
    updateFormSubmission(contactForm);
}

function addFormFields(form) {
    // Find where to insert new fields (after email field)
    const emailField = form.querySelector('input[name="email"]');
    if (!emailField) return;
    
    const emailRow = emailField.closest('.row');
    if (!emailRow) return;
    
    // Create new fields HTML
    const newFieldsHTML = `
        <div class="row mt-3">
            <!-- Surname Field -->
            <div class="col-md-6">
                <div class="form-group">
                    <label for="surname">Surname *</label>
                    <input type="text" id="surname" name="surname" class="form-control" 
                           placeholder="Your Surname" required>
                    <div class="validation-error" id="surname-error"></div>
                </div>
            </div>
            
            <!-- Phone Number Field -->
            <div class="col-md-6">
                <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <div class="phone-input-group">
                        <input type="tel" id="phone" name="phone" class="form-control" 
                               placeholder="+370 6xx xxxxx" required maxlength="15">
                        <div class="validation-error" id="phone-error"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Address Field -->
        <div class="row mt-3">
            <div class="col-md-12">
                <div class="form-group">
                    <label for="address">Address *</label>
                    <input type="text" id="address" name="address" class="form-control" 
                           placeholder="Street, City, Country" required>
                    <div class="validation-error" id="address-error"></div>
                </div>
            </div>
        </div>
        
        <!-- Rating Questions -->
        <div class="row mt-4">
            <div class="col-md-12">
                <h5>Rating Questions (1-10 scale)</h5>
                
                <!-- Rating 1 -->
                <div class="form-group">
                    <label for="rating1">1. How would you rate my portfolio design? *</label>
                    <div class="rating-input">
                        <input type="range" id="rating1" name="rating1" min="1" max="10" 
                               value="5" class="rating-slider form-control-range">
                        <span class="rating-value" id="rating1-value">5</span>
                    </div>
                    <div class="validation-error" id="rating1-error"></div>
                </div>
                
                <!-- Rating 2 -->
                <div class="form-group">
                    <label for="rating2">2. How likely would you recommend my services? *</label>
                    <div class="rating-input">
                        <input type="range" id="rating2" name="rating2" min="1" max="10" 
                               value="5" class="rating-slider form-control-range">
                        <span class="rating-value" id="rating2-value">5</span>
                    </div>
                    <div class="validation-error" id="rating2-error"></div>
                </div>
                
                <!-- Rating 3 -->
                <div class="form-group">
                    <label for="rating3">3. How satisfied are you with the overall experience? *</label>
                    <div class="rating-input">
                        <input type="range" id="rating3" name="rating3" min="1" max="10" 
                               value="5" class="rating-slider form-control-range">
                        <span class="rating-value" id="rating3-value">5</span>
                    </div>
                    <div class="validation-error" id="rating3-error"></div>
                </div>
            </div>
        </div>
    `;
    
    // Insert after email row
    emailRow.insertAdjacentHTML('afterend', newFieldsHTML);
    
    // Initialize slider value updates
    initRatingSliders();
}

function initRatingSliders() {
    const sliders = document.querySelectorAll('.rating-slider');
    sliders.forEach(slider => {
        const valueDisplay = document.getElementById(slider.id + '-value');
        if (valueDisplay) {
            // Update display on slider move
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
                validateField(this);
                updateSubmitButton();
            });
            
            // Initial display
            valueDisplay.textContent = slider.value;
        }
    });
}

function initPhoneMasking() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/[^\d+]/g, '');
        
        // Format Lithuanian phone number
        if (!value.startsWith('+370')) {
            if (value.startsWith('370')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+370' + value.substring(1);
            } else if (value.startsWith('6')) {
                value = '+370' + value;
            } else {
                value = '+370' + value;
            }
        }
        
        // Add spaces for readability
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
        
        this.value = formatted.substring(0, 15);
        validateField(this);
    });
    
    // Allow only numbers, plus, backspace, delete, arrows, tab
    phoneInput.addEventListener('keydown', function(e) {
        const allowedKeys = [8, 9, 13, 16, 17, 18, 27, 37, 38, 39, 40, 46, 107, 109, 173, 189];
        const isAllowedKey = allowedKeys.includes(e.keyCode);
        const isNumber = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
        const isPlus = e.keyCode === 107 || e.keyCode === 187;
        
        if (!isAllowedKey && !isNumber && !isPlus) {
            e.preventDefault();
        }
    });
}

function initRealTimeValidation() {
    const form = document.querySelector('.php-email-form');
    if (!form) return;
    
    const fields = form.querySelectorAll('input[name], textarea[name]');
    
    fields.forEach(field => {
        field.addEventListener('input', function() {
            validateField(this);
        });
        
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id || field.name;
    const errorElement = document.getElementById(fieldId + '-error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is empty
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Field-specific validation
        switch(fieldId) {
            case 'name':
            case 'surname':
                if (!/^[A-Za-z\s-]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Only letters, spaces, and hyphens allowed';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'address':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Address must be at least 10 characters';
                }
                break;
                
            case 'phone':
                const digits = value.replace(/\D/g, '');
                if (digits.length < 9) {
                    isValid = false;
                    errorMessage = 'Phone number must be at least 9 digits';
                }
                break;
                
            case 'rating1':
            case 'rating2':
            case 'rating3':
                const rating = parseInt(value);
                if (isNaN(rating) || rating < 1 || rating > 10) {
                    isValid = false;
                    errorMessage = 'Rating must be between 1 and 10';
                }
                break;
        }
    }
    
    // Update UI
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = isValid ? 'none' : 'block';
    }
    
    // Update field styling
    field.classList.toggle('field-error', !isValid);
    field.classList.toggle('field-valid', isValid && value !== '');
    
    return isValid;
}

function initSubmitButtonControl() {
    updateSubmitButton();
    
    // Update button on all field changes
    const form = document.querySelector('.php-email-form');
    if (!form) return;
    
    const fields = form.querySelectorAll('input[name], textarea[name]');
    fields.forEach(field => {
        field.addEventListener('input', updateSubmitButton);
        field.addEventListener('change', updateSubmitButton);
    });
}

function updateSubmitButton() {
    const submitBtn = document.querySelector('.php-email-form button[type="submit"]');
    if (!submitBtn) return;
    
    const allValid = isFormValid();
    submitBtn.disabled = !allValid;
    
    // Update styling
    submitBtn.classList.toggle('btn-disabled', !allValid);
    submitBtn.classList.toggle('btn-enabled', allValid);
}

function isFormValid() {
    const requiredFields = ['name', 'surname', 'email', 'phone', 'address', 'rating1', 'rating2', 'rating3'];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            return false;
        }
        
        // Additional validation
        if (!validateField(field)) {
            return false;
        }
    }
    
    return true;
}

function updateFormSubmission(form) {
    // Create results container
    let resultsContainer = document.getElementById('form-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'form-results';
        resultsContainer.className = 'form-results mt-4';
        form.parentNode.appendChild(resultsContainer);
    }
    
    // Override form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Final validation
        if (!isFormValid()) {
            alert('Please fill all fields correctly');
            return;
        }
        
        // Collect form data
        const formData = collectFormData();
        
        // 1. Print to console (REQUIRED)
        console.log('Form Data Object:', formData);
        
        // 2. Display below form (REQUIRED)
        displayFormResults(formData);
        
        // 3. Calculate and display average rating (REQUIRED)
        const average = calculateAverageRating(formData);
        displayAverageRating(formData, average);
        
        // 4. Show success popup (REQUIRED)
        showSuccessPopup();
        
        // Reset button state
        updateSubmitButton();
    });
}

function collectFormData() {
    const formData = {};
    
    const fields = [
        'name', 'surname', 'email', 'phone', 'address', 
        'rating1', 'rating2', 'rating3'
    ];
    
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
    if (!resultsContainer) {
        console.error('Results container not found!');
        return;
    }
    
    console.log('=== DISPLAY FORM RESULTS ===');
    console.log('Form data:', formData);
    
    // Field labels for display
    const labels = {
        name: 'Name',
        surname: 'Surname',
        email: 'Email',
        phone: 'Phone Number',
        address: 'Address',
        rating1: 'Design Rating',
        rating2: 'Recommendation Rating',
        rating3: 'Experience Rating'
    };
    
    let html = `
        <div class="results-container">
            <h4>Submitted Information:</h4>
            <div class="results-list">
    `;
    
    for (const [key, label] of Object.entries(labels)) {
        if (formData[key]) {
            html += `
                <div class="result-item">
                    <strong>${label}:</strong> ${formData[key]}
                </div>
            `;
        }
    }
    
    html += '</div></div>';
    
    console.log('Setting results container HTML');
    resultsContainer.innerHTML = html;
    
    // Verify it was set
    console.log('Results container now has:', resultsContainer.innerHTML.length, 'characters');
}

function calculateAverageRating(formData) {
    // Get rating values and convert to numbers
    const rating1 = parseFloat(formData.rating1) || 0;
    const rating2 = parseFloat(formData.rating2) || 0;
    const rating3 = parseFloat(formData.rating3) || 0;
    
    // Calculate average
    const average = (rating1 + rating2 + rating3) / 3;
    
    // Return as number (not string)
    return average; // This is now a NUMBER like 7.5
}

function displayAverageRating(formData, average) {
    console.log('=== DISPLAY AVERAGE RATING STARTED ===');
    console.log('Input average:', average, 'Type:', typeof average);
    
    const resultsContainer = document.getElementById('form-results');
    if (!resultsContainer) {
        console.error('Results container is null!');
        // Create it if it doesn't exist
        const form = document.querySelector('.php-email-form');
        if (form && form.parentNode) {
            console.log('Creating results container');
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'form-results';
            resultsContainer.className = 'form-results mt-4';
            form.parentNode.appendChild(resultsContainer);
        } else {
            console.error('Cannot create results container - no form found');
            return;
        }
    }
    
    const name = formData.name || '';
    const surname = formData.surname || '';
    const fullName = `${name} ${surname}`.trim() || 'Anonymous';
    
    const averageDisplay = average.toFixed(1);
    
    console.log('Full name:', fullName);
    console.log('Average display:', averageDisplay);
    
    // SIMPLE COLOR LOGIC - Test with hardcoded value first
    console.log('Testing color logic:');
    console.log('  average =', average);
    console.log('  average > 7 =', average > 7);
    console.log('  average >= 4 =', average >= 4);
    
    let colorClass = 'rating-red';
    if (average > 7) {
        colorClass = 'rating-green';
        console.log('  Selected: GREEN');
    } else if (average >= 4) {
        colorClass = 'rating-orange';
        console.log('  Selected: ORANGE');
    } else {
        console.log('  Selected: RED');
    }
    
    console.log('Final color class:', colorClass);
    
    const averageHTML = `
        <div class="average-rating">
            <strong>Average Rating:</strong>
            <span class="${colorClass}" style="border: 2px solid currentColor; padding: 4px; border-radius: 4px;">${fullName}: ${averageDisplay}</span>
        </div>
    `;
    
    console.log('Generated HTML:', averageHTML);
    
    // Remove existing average if present
    const existingAvg = resultsContainer.querySelector('.average-rating');
    if (existingAvg) {
        console.log('Removing existing average rating');
        existingAvg.remove();
    }
    
    console.log('Adding new average rating to container');
    resultsContainer.insertAdjacentHTML('beforeend', averageHTML);
    
    // Verify it was added
    setTimeout(() => {
        const newElement = resultsContainer.querySelector('.average-rating');
        console.log('After insertion - element exists:', !!newElement);
        console.log('Container HTML length:', resultsContainer.innerHTML.length);
        console.log('Container innerHTML:', resultsContainer.innerHTML);
    }, 100);
    
    console.log('=== DISPLAY AVERAGE RATING COMPLETE ===');
}

function showSuccessPopup() {
    // Remove existing popup if any
    const existingPopup = document.querySelector('.success-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create new popup
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="popup-close">&times;</span>
            <div class="popup-icon">
                <i class="bi bi-check-circle-fill"></i>
            </div>
            <h3>Form Submitted Successfully!</h3>
            <p>Your feedback has been recorded.</p>
            <p>Check the results below the form.</p>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Show with animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Close functionality
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.addEventListener('click', function() {
        popup.classList.remove('show');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 300);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (popup.parentNode && popup.classList.contains('show')) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        }
    }, 5000);
}

function testColorCodingManually() {
    console.log('=== MANUAL COLOR CODING TEST ===');
    
    // Test the calculation function
    const testData = {
        rating1: "10",
        rating2: "10", 
        rating3: "10"
    };
    
    const average = calculateAverageRating(testData);
    console.log('Test average for 10,10,10:', average);
    
    // Test the display function
    const mockResultsContainer = document.createElement('div');
    mockResultsContainer.id = 'form-results-test';
    document.body.appendChild(mockResultsContainer);
    
    displayAverageRating(testData, average);
    
    // Check what was created
    const element = mockResultsContainer.querySelector('span');
    console.log('Created element:', element);
    console.log('Element class:', element?.className);
    
    // Clean up
    mockResultsContainer.remove();
}

// Call this from browser console when needed
window.testColorCoding = testColorCodingManually;

// ===== MEMORY GAME FUNCTIONS =====
// ===== MEMORY GAME FUNCTIONS =====
function initMemoryGame() {
    console.log('Initializing Memory Game...');
    
    // Check if memory game section exists
    const memoryGameSection = document.getElementById('memory-game');
    if (!memoryGameSection) {
        console.log('Memory game section not found');
        return;
    }
    
    console.log('Found memory game section:', memoryGameSection);
    
    // Create game HTML structure
    createGameStructure(memoryGameSection);
}

function createGameStructure(section) {
    // Create game container if it doesn't exist
    let gameContainer = section.querySelector('.game-container');
    
    if (!gameContainer) {
        // Create game container
        gameContainer = document.createElement('div');
        gameContainer.className = 'game-container mt-4';
        
        // Create game HTML
        gameContainer.innerHTML = `
            <div class="game-controls mb-4">
                <button id="start-game-btn" class="btn btn-primary me-3">Start Game</button>
                <button id="reset-game-btn" class="btn btn-secondary" disabled>Reset Game</button>
                <div class="game-stats d-flex gap-4 mt-3 justify-content-center">
                    <div class="stat text-center">
                        <div class="stat-label text-muted small">Moves</div>
                        <div id="moves-count" class="stat-value fw-bold fs-4">0</div>
                    </div>
                    <div class="stat text-center">
                        <div class="stat-label text-muted small">Matches</div>
                        <div id="matches-count" class="stat-value fw-bold fs-4">0/8</div>
                    </div>
                    <div class="stat text-center">
                        <div class="stat-label text-muted small">Time</div>
                        <div id="timer" class="stat-value fw-bold fs-4">0s</div>
                    </div>
                </div>
            </div>
            
            <div class="game-message alert alert-info text-center" id="game-message" style="display: none;"></div>
            
            <div class="cards-grid" id="cards-grid">
                <!-- Cards will be added here by JavaScript -->
            </div>
        `;
        
        // Insert after the section title
        const sectionTitle = section.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.insertAdjacentHTML('afterend', gameContainer.outerHTML);
        } else {
            section.appendChild(gameContainer);
        }
    }
    
    // Initialize the game
    initializeGame();
}

// ===== SIMPLE WORKING MEMORY GAME =====
function initMemoryGame() {
    console.log('🚀 Initializing Memory Game...');
    
    // Wait a moment to ensure DOM is loaded
    setTimeout(function() {
        const gameSection = document.getElementById('memory-game');
        if (!gameSection) {
            console.error('❌ Game section not found');
            return;
        }
        
        console.log('✅ Found game section');
        
        // Check if game already exists
        if (gameSection.querySelector('.memory-game-container')) {
            console.log('Game already exists, skipping...');
            return;
        }
        
        // Create game container
        const gameContainer = document.createElement('div');
        gameContainer.className = 'memory-game-container mt-5';
        gameContainer.innerHTML = `
            <div class="game-header text-center mb-4">
                <h3>Memory Card Game</h3>
                <p class="text-muted">Match pairs of cards. Click to flip them.</p>
            </div>
            
            <div class="game-controls text-center mb-4">
                <button id="start-btn" class="btn btn-success btn-lg px-4">Start Game</button>
                <button id="reset-btn" class="btn btn-warning btn-lg px-4" disabled>Reset Game</button>
            </div>
            
            <div class="game-stats text-center mb-4">
                <div class="d-flex justify-content-center gap-5">
                    <div class="stat">
                        <div class="stat-label">Moves</div>
                        <div id="moves" class="stat-value fs-3 fw-bold">0</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Matches</div>
                        <div id="matches" class="stat-value fs-3 fw-bold">0/8</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Time</div>
                        <div id="time" class="stat-value fs-3 fw-bold">0s</div>
                    </div>
                </div>
            </div>
            
            <div class="message-container mb-4">
                <div id="game-message" class="alert alert-info text-center" style="display: none;"></div>
            </div>
            
            <div class="cards-container" id="cards-container">
                <!-- Cards will be added here -->
            </div>
        `;
        
        // Find where to insert (after the section-title)
        const sectionTitle = gameSection.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.parentNode.insertBefore(gameContainer, sectionTitle.nextSibling);
        } else {
            gameSection.appendChild(gameContainer);
        }
        
        // Initialize the game
        initializeGame();
        
    }, 100);
}

function initializeGame() {
    console.log('🃏 Creating game cards...');
    
    const container = document.getElementById('cards-container');
    if (!container) {
        console.error('Cards container not found');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Define card symbols (8 pairs)
    const symbols = ['⭐', '🌟', '✨', '💫', '🔥', '💎', '🚀', '🎯'];
    
    // Duplicate for pairs and shuffle
    let cards = [...symbols, ...symbols];
    cards = shuffleArray(cards);
    
    // Create card elements
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span class="card-text">?</span>
                </div>
                <div class="card-back">
                    <span class="card-text">${symbol}</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Setup game state
    window.memoryGame = {
        gameActive: false,
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        time: 0,
        timer: null,
        totalPairs: symbols.length
    };
    
    // Setup event listeners
    setupEventListeners();
    
    // Add CSS styles
    addMemoryGameStyles();
    
    console.log(`✅ Created ${cards.length} cards`);
}

function setupEventListeners() {
    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            startMemoryGame();
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetMemoryGame();
        });
    }
    
    // Card clicks
    const container = document.getElementById('cards-container');
    if (container) {
        container.addEventListener('click', function(event) {
            const card = event.target.closest('.memory-card');
            if (card && window.memoryGame.gameActive) {
                flipCard(card);
            }
        });
    }
}

function startMemoryGame() {
    if (window.memoryGame.gameActive) return;
    
    console.log('🎮 Starting memory game...');
    
    // Reset game state
    window.memoryGame = {
        gameActive: true,
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        time: 0,
        timer: null,
        totalPairs: 8
    };
    
    // Update UI
    document.getElementById('start-btn').disabled = true;
    document.getElementById('reset-btn').disabled = false;
    updateGameUI();
    
    // Reset all cards (face down)
    document.querySelectorAll('.memory-card').forEach(card => {
        card.classList.remove('flipped', 'matched');
    });
    
    // Start timer
    clearInterval(window.memoryGame.timer);
    window.memoryGame.timer = setInterval(function() {
        window.memoryGame.time++;
        document.getElementById('time').textContent = window.memoryGame.time + 's';
    }, 1000);
    
    showMessage('Game started! Find matching pairs.', 'info');
}

function resetMemoryGame() {
    console.log('🔄 Resetting game...');
    
    // Stop timer
    clearInterval(window.memoryGame.timer);
    
    // Reset state
    window.memoryGame = {
        gameActive: false,
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        time: 0,
        timer: null,
        totalPairs: 8
    };
    
    // Update UI
    document.getElementById('start-btn').disabled = false;
    document.getElementById('reset-btn').disabled = true;
    updateGameUI();
    
    // Reset cards
    document.querySelectorAll('.memory-card').forEach(card => {
        card.classList.remove('flipped', 'matched');
    });
    
    // Re-shuffle and recreate cards
    initializeGame();
    
    showMessage('Game reset. Ready to start!', 'info');
}

function flipCard(card) {
    // Don't flip if already flipped or matched, or if 2 cards are already flipped
    if (card.classList.contains('flipped') || 
        card.classList.contains('matched') || 
        window.memoryGame.flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    window.memoryGame.flippedCards.push(card);
    
    // If two cards are flipped, check for match
    if (window.memoryGame.flippedCards.length === 2) {
        window.memoryGame.moves++;
        updateGameUI();
        
        const card1 = window.memoryGame.flippedCards[0];
        const card2 = window.memoryGame.flippedCards[1];
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Match found
            setTimeout(function() {
                card1.classList.add('matched');
                card2.classList.add('matched');
                window.memoryGame.matchedPairs++;
                window.memoryGame.flippedCards = [];
                updateGameUI();
                
                // Check for win
                if (window.memoryGame.matchedPairs === window.memoryGame.totalPairs) {
                    endGame(true);
                }
            }, 500);
        } else {
            // No match - flip back
            setTimeout(function() {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                window.memoryGame.flippedCards = [];
            }, 1000);
        }
    }
}

function endGame(isWin) {
    clearInterval(window.memoryGame.timer);
    window.memoryGame.gameActive = false;
    document.getElementById('start-btn').disabled = false;
    
    if (isWin) {
        showMessage(
            `🎉 You won! ${window.memoryGame.moves} moves in ${window.memoryGame.time} seconds!`,
            'success'
        );
    }
}

function updateGameUI() {
    document.getElementById('moves').textContent = window.memoryGame.moves;
    document.getElementById('matches').textContent = `${window.memoryGame.matchedPairs}/${window.memoryGame.totalPairs}`;
    document.getElementById('time').textContent = window.memoryGame.time + 's';
}

function showMessage(text, type) {
    const messageEl = document.getElementById('game-message');
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `alert alert-${type} text-center`;
        messageEl.style.display = 'block';
        
        if (type !== 'success') {
            setTimeout(function() {
                messageEl.style.display = 'none';
            }, 3000);
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function addMemoryGameStyles() {
    // Only add styles once
    if (document.querySelector('#memory-game-styles')) return;
    
    const styles = `
        .memory-game-container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        
        .game-stats .stat {
            background: #f8f9fa;
            padding: 15px 25px;
            border-radius: 10px;
            min-width: 120px;
        }
        
        .stat-label {
            font-size: 14px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .cards-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .memory-card {
            aspect-ratio: 2/3;
            cursor: pointer;
            perspective: 1000px;
        }
        
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.5s;
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
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .card-front {
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            color: white;
        }
        
        .card-back {
            background: white;
            color: #333;
            border: 3px solid #6a11cb;
            transform: rotateY(180deg);
        }
        
        .memory-card.matched .card-back {
            background: linear-gradient(45deg, #28a745, #20c997);
            border-color: #28a745;
            color: white;
        }
        
        .card-text {
            font-size: 2.5rem;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .cards-container {
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }
            
            .card-text {
                font-size: 2rem;
            }
            
            .game-stats .d-flex {
                flex-direction: column;
                gap: 10px;
            }
            
            .stat {
                min-width: auto;
                width: 200px;
                margin: 0 auto;
            }
        }
        
        @media (max-width: 480px) {
            .cards-container {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .memory-game-container {
                padding: 20px;
            }
        }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'memory-game-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
}

// Quick test: expose initMemoryGame globally for manual testing
window.initMemoryGame = initMemoryGame;
console.log('✅ Memory game functions loaded');

// Auto-initialize after a short delay to ensure DOM is ready
setTimeout(initMemoryGame, 500);