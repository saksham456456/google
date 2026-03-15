// State Management
const state = {
    currentStage: 1,
    isMuted: true,
    isDarkMode: false,
    typingFinished: false,
    noButtonAttempts: 0,
    logoClicks: 0
};

// DOM Elements
const stages = document.querySelectorAll('.stage');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const muteToggle = document.getElementById('mute-toggle');
const soundIcon = document.querySelector('.sound-icon');
const modeIcon = document.querySelector('.mode-icon');

// Sound Effects
const sounds = {
    typing: document.getElementById('sound-typing'),
    click: document.getElementById('sound-click'),
    error: document.getElementById('sound-error'),
    celebration: document.getElementById('sound-celebration')
};

// --- Initialization ---
function init() {
    loadPreferences();
    setupEventListeners();
    // Start Stage 1 logic
    startStage1();
}

function loadPreferences() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        state.isDarkMode = true;
        document.body.classList.add('dark-mode');
        modeIcon.textContent = '☀️';
    }

    // Sound is muted by default as per requirements
    state.isMuted = true;
    soundIcon.textContent = '🔇';
}

function setupEventListeners() {
    darkModeToggle.addEventListener('click', toggleDarkMode);
    muteToggle.addEventListener('click', toggleMute);

    // Stage Transitions (for testing/flow)
    // Most transitions are triggered by specific buttons
}

// --- Helper Functions ---
function playSound(soundName) {
    if (!state.isMuted && sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play().catch(e => console.warn("Sound play failed:", e));
    }
}

function goToStage(stageNum) {
    const currentStageEl = document.getElementById(`stage-${state.currentStage}`);
    const nextStageEl = document.getElementById(`stage-${stageNum}`);

    if (currentStageEl) {
        currentStageEl.classList.remove('active');
        currentStageEl.classList.add('hidden');
    }

    if (nextStageEl) {
        nextStageEl.classList.remove('hidden');
        // Force reflow
        void nextStageEl.offsetWidth;
        nextStageEl.classList.add('active');
    }

    state.currentStage = stageNum;
}

function toggleDarkMode() {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('dark-mode');
    modeIcon.textContent = state.isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', state.isDarkMode);
    playSound('click');
}

function toggleMute() {
    state.isMuted = !state.isMuted;
    soundIcon.textContent = state.isMuted ? '🔇' : '🔊';
    // If unmuting, we might need to resume audio context if browser blocked it
    if (!state.isMuted) {
        // Play a silent sound to unlock audio if needed
        playSound('click');
    }
}

// --- Stage 1 Logic ---
function startStage1() {
    const input = document.getElementById('main-search-input');
    const history = document.getElementById('search-history');
    const suggestions = document.getElementById('autocomplete-suggestions');
    const logo = document.getElementById('logo');
    const searchBtn = document.getElementById('search-btn');

    input.addEventListener('focus', () => {
        if (input.value === '') {
            history.classList.remove('hidden');
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => history.classList.add('hidden'), 200);
    });

    logo.addEventListener('click', () => {
        state.logoClicks++;
        if (state.logoClicks === 5) {
            alert("Achievement unlocked: Developer feelings detected.");
            state.logoClicks = 0;
        }
    });

    searchBtn.addEventListener('click', () => {
        if (state.typingFinished) {
            goToStage(2);
        }
    });

    // Start auto-typing after 1s
    setTimeout(() => {
        typeSearchQuery("how to tell someone you like them", input, () => {
            state.typingFinished = true;
            setTimeout(() => {
                suggestions.classList.remove('hidden');
                setupSuggestions();
            }, 500);
        });
    }, 1000);
}

function typeSearchQuery(text, element, callback) {
    let i = 0;
    const interval = setInterval(() => {
        element.value += text.charAt(i);
        playSound('typing');
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            callback();
        }
    }, 80); // 70-90ms range
}

function setupSuggestions() {
    const suggestionItems = document.querySelectorAll('#autocomplete-suggestions li');
    suggestionItems.forEach(item => {
        item.addEventListener('click', () => {
            const val = item.getAttribute('data-value');
            document.getElementById('main-search-input').value = val;
            playSound('click');
            if (val === 'how to tell YOU I like you') {
                goToStage(2);
                startStage2();
            }
        });
    });
}

// --- Stage 2 Logic ---
function startStage2() {
    const runTestBtn = document.getElementById('run-test-btn');
    runTestBtn.addEventListener('click', () => {
        playSound('click');
        goToStage(3);
        startStage3();
    });
}

// --- Stage 3 Logic ---
function startStage3() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const testForm = document.getElementById('test-form');
    const progressSection = document.getElementById('analysis-progress');
    const resultSection = document.getElementById('analysis-result');
    const progressBar = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');
    const revealReason = document.getElementById('reveal-reason');
    const viewAnalysisBtn = document.getElementById('view-analysis-btn');

    analyzeBtn.addEventListener('click', () => {
        playSound('click');
        testForm.classList.add('hidden');
        progressSection.classList.remove('hidden');

        const steps = [
            "Analyzing personality...",
            "Scanning shared vibes...",
            "Checking emotional compatibility...",
            "Connecting to destiny servers...",
            "Finalizing results..."
        ];

        let currentStep = 0;
        const totalDuration = 5000; // 5 seconds
        const stepDuration = totalDuration / steps.length;

        const interval = setInterval(() => {
            progressText.textContent = steps[currentStep];
            progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
            currentStep++;

            if (currentStep >= steps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    progressSection.classList.add('hidden');
                    resultSection.classList.remove('hidden');

                    setTimeout(() => {
                        revealReason.classList.remove('hidden');
                        viewAnalysisBtn.classList.remove('hidden');
                    }, 1000);
                }, 500);
            }
        }, stepDuration);
    });

    viewAnalysisBtn.addEventListener('click', () => {
        playSound('click');
        goToStage(4);
        startStage4();
    });
}

// --- Stage 4 Logic ---
function startStage4() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const continueBtn = document.getElementById('faq-continue-btn');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            playSound('click');
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    continueBtn.addEventListener('click', () => {
        playSound('click');
        goToStage(5);
        startStage5();
    });
}

// --- Stage 5 Logic ---
function startStage5() {
    const grid = document.getElementById('images-grid');
    grid.innerHTML = ''; // Clear previous

    const memes = [
        "When someone makes a whole website for you",
        "POV: you're reading a confession website",
        "Friend: Just tell them\nMe: builds a website instead",
        "100% normal behavior",
        "This was easier than texting",
        "Don't scroll too fast",
        "You're getting close to the secret",
        "You found the hidden message\nClick me"
    ];

    memes.forEach((text, index) => {
        const card = document.createElement('div');
        card.className = 'meme-card';
        if (index === 7) {
            card.classList.add('hidden-message-card');
        }
        card.innerText = text;

        card.addEventListener('click', () => {
            playSound('click');
            if (index === 7) {
                startStage6();
            }
        });

        grid.appendChild(card);
    });
}

// --- Stage 6 & 7 Logic ---
function startStage6() {
    const modal = document.getElementById('ai-modal');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const errorPopup = document.getElementById('error-popup');

    modal.classList.remove('hidden');

    yesBtn.onclick = () => {
        playSound('click');
        modal.classList.add('hidden');
        goToStage(8);
        startStage8();
    };

    noBtn.onmouseover = () => {
        moveNoButton(noBtn);
    };

    noBtn.onclick = (e) => {
        e.preventDefault();
        moveNoButton(noBtn);
    };
}

function moveNoButton(btn) {
    state.noButtonAttempts++;
    playSound('error');

    const errorPopup = document.getElementById('error-popup');
    errorPopup.classList.remove('hidden');

    if (state.noButtonAttempts === 1) {
        errorPopup.textContent = "Error: Incorrect choice detected.";
    } else if (state.noButtonAttempts === 2) {
        errorPopup.textContent = "Are you sure?";
        btn.textContent = "Are you sure?";
    } else if (state.noButtonAttempts === 3) {
        errorPopup.textContent = "That button doesn't work";
        btn.style.transform = "scale(0.8)";
    } else if (state.noButtonAttempts === 4) {
        btn.style.transform = "scale(0.5)";
    } else if (state.noButtonAttempts >= 5) {
        btn.classList.add('hidden');
        errorPopup.textContent = "Selection locked.";
    }

    const x = Math.random() * (window.innerWidth - btn.offsetWidth - 100);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight - 100);

    btn.style.position = 'fixed';
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    btn.style.zIndex = '3000';
}

// --- Stage 8 Logic ---
function startStage8() {
    playSound('celebration');
    startConfetti();
    startHearts();

    const memeBtn = document.getElementById('meme-btn');
    const memeOverlay = document.getElementById('meme-overlay');
    const closeMemeBtn = document.getElementById('close-meme-btn');
    const randomMemeCard = document.getElementById('random-meme-card');

    memeBtn.onclick = () => {
        playSound('click');
        const memes = [
            "You just got searched by love.",
            "Results: 1 found, and it's you.",
            "I could have just texted, but this was more fun.",
            "Error 404: Chill not found.",
            "You: *exists*\nMe: *builds website*"
        ];
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        randomMemeCard.className = 'meme-card';
        randomMemeCard.innerText = randomMeme;
        memeOverlay.classList.remove('hidden');
    };

    closeMemeBtn.onclick = () => {
        playSound('click');
        memeOverlay.classList.add('hidden');
    };
}

function startConfetti() {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 20);
    }
}

function startHearts() {
    setInterval(() => {
        if (state.currentStage === 8) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerText = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '100vh';
            heart.style.fontSize = Math.random() * 20 + 10 + 'px';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }
    }, 300);
}

// Start the app
window.addEventListener('DOMContentLoaded', init);
