// Elements ko select kar rahe hain - DOM manipulation ke liye
const progress = document.getElementById('progress');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const circles = document.querySelectorAll('.circle');
const stepLabels = document.querySelectorAll('.step-label');
const progressText = document.getElementById('progressText');

// Current active step track karne ke liye variable
let currentActive = 1;

// Next button ka event listener - Age badhne ke liye
next.addEventListener('click', () => {
    currentActive++;
    
    // Maximum steps se zyada nahi jane dena
    if(currentActive > circles.length) {
        currentActive = circles.length;
    }
    
    // UI update karna
    update();
});

// Previous button ka event listener - Piche jane ke liye
prev.addEventListener('click', () => {
    currentActive--;
    
    // Minimum 1 se kam nahi jane dena
    if(currentActive < 1) {
        currentActive = 1;
    }
    
    // UI update karna
    update();
});

// Circle click functionality - Direct step par jane ke liye
circles.forEach((circle, index) => {
    circle.addEventListener('click', () => {
        currentActive = index + 1;
        update();
    });
});

// Keyboard navigation - Accessibility ke liye
document.addEventListener('keydown', (e) => {
    // Arrow keys se navigation
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if(currentActive < circles.length) {
            currentActive++;
            update();
        }
    } else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if(currentActive > 1) {
            currentActive--;
            update();
        }
    }
    // Space ya Enter se next step
    else if(e.key === ' ' || e.key === 'Enter') {
        if(document.activeElement === next && !next.disabled) {
            next.click();
        } else if(document.activeElement === prev && !prev.disabled) {
            prev.click();
        }
    }
});

// Main update function - Ye sab kuch handle karta hai
function update() {
    // Progress text update kar rahe hain current step ke saath
    progressText.textContent = `Step ${currentActive} of ${circles.length}`;
    
    // Circles ko update kar rahe hain - states manage karna
    circles.forEach((circle, idx) => {
        // Pehle sab classes remove karna
        circle.classList.remove('active', 'completed');
        
        if(idx + 1 < currentActive) {
            // Completed steps ke liye - jo steps complete ho gaye
            circle.classList.add('completed');
            circle.innerHTML = ''; // Number hat jayega, checkmark aa jayega CSS se
        } else if(idx + 1 === currentActive) {
            // Current active step ke liye - jo step abhi chal raha
            circle.classList.add('active');
            circle.innerHTML = idx + 1; // Number wapis aa jayega
        } else {
            // Future steps ke liye - jo steps abhi pending hain
            circle.innerHTML = idx + 1;
            circle.style.color = 'var(--text-light)';
        }
    });

    // Step labels ko update kar rahe hain
    stepLabels.forEach((label, idx) => {
        label.classList.remove('active');
        if(idx + 1 === currentActive) {
            label.classList.add('active');
        }
    });

    // Progress bar ki width calculate kar rahe hain
    // Formula: (current - 1) / (total - 1) * 100
    const progressPercentage = ((currentActive - 1) / (circles.length - 1)) * 100;
    progress.style.width = progressPercentage + '%';

    // Buttons ko enable/disable kar rahe hain
    prev.disabled = currentActive === 1;
    next.disabled = currentActive === circles.length;

    // Last step par congratulations message
    if(currentActive === circles.length) {
        progressText.innerHTML = '🎉 Congratulations! All steps completed!';
        
        // Optional: Confetti effect ya celebration animation add kar sakte hain
        celebrateCompletion();
    }
    
    // First step par welcome message
    if(currentActive === 1) {
        progressText.textContent = 'Welcome! Let\'s get started with Step 1 of ' + circles.length;
    }
}

// Celebration function - Last step complete hone par
function celebrateCompletion() {
    // Container ko slightly shake kar sakte hain
    const container = document.querySelector('.container');
    container.style.animation = 'celebrate 0.5s ease-in-out';
    
    // Animation complete hone ke baad remove kar dena
    setTimeout(() => {
        container.style.animation = '';
    }, 500);
}

// CSS animation keyframe add karna completion ke liye
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrate {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) scale(1.02); }
        75% { transform: translateX(5px) scale(1.02); }
    }
`;
document.head.appendChild(style);

// Progress percentage calculate karne ka helper function
function getProgressPercentage() {
    return ((currentActive - 1) / (circles.length - 1)) * 100;
}

// Reset function - Agar chahiye to use kar sakte hain
function resetProgress() {
    currentActive = 1;
    update();
}

// Auto-advance function - Timer ke saath automatic progression
function startAutoProgress(intervalSeconds = 3) {
    const autoInterval = setInterval(() => {
        if(currentActive < circles.length) {
            currentActive++;
            update();
        } else {
            clearInterval(autoInterval);
        }
    }, intervalSeconds * 1000);
    
    return autoInterval; // Return karte hain taaki clear kar sake
}

// Local storage mein progress save karna (optional feature)
function saveProgress() {
    localStorage.setItem('progressStepperState', currentActive);
}

function loadProgress() {
    const saved = localStorage.getItem('progressStepperState');
    if(saved) {
        currentActive = parseInt(saved);
        update();
    }
}

// Initial load par progress load karna (uncomment if needed)
// loadProgress();

// Page leave karne se pehle progress save karna (uncomment if needed)
// window.addEventListener('beforeunload', saveProgress);

// Initial load par update chalana - Starting point
update();

// Console mein instructions print karna developers ke liye
console.log('Progress Stepper Controls:');
console.log('- Use Arrow keys for navigation');
console.log('- Click on circles to jump to specific step');
console.log('- Use resetProgress() to start over');
console.log('- Use startAutoProgress(seconds) for auto progression');