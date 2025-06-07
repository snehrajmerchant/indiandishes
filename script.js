// Wheel options data
const Breakfast = [
    { text: "Aloo Paratha", color: "#FF6B6B" },
    { text: "Poha", color: "#4ECDC4" },
    { text: "Bhurji", color: "#45B7D1" },
    { text: "Uttappa", color: "#96CEB4" },
    { text: "Puri", color: "#FFEEAD" },
    { text: "Chilla", color: "#D4A5A5" },
    { text: "Fried Egg", color: "#9B59B6" },
    { text: "Omelette", color: "#3498DB" },
    { text: "Khurchala Anda", color: "#E67E22" },
    { text: "Bread Butter Jam", color: "#2ECC71" },
    { text: "Khari biscuit", color: "#E74C3C" },
    { text: "Bagel and Butter", color: "#F1C40F" }
];
const Lunch = [
    { text: "Aloo Bhindi", color: "#FF6B6B" },
    { text: "Aloo Gobi", color: "#4ECDC4" },
    { text: "Aloo Matar", color: "#45B7D1" },
    { text: "Aloo Flower", color: "#96CEB4" },
    { text: "Aloo Baigan", color: "#FFEEAD" },
    { text: "Aloo Anda", color: "#D4A5A5" },
    { text: "Aloo Jeera", color: "#9B59B6" },
    { text: "Shrimp Curry", color: "#3498DB" },
    { text: "Kadai Chicken", color: "#E67E22" },
    { text: "Butter Chicken", color: "#2ECC71" },
    { text: "Kheema", color: "#E74C3C" },
    { text: "Aloo Saragwa", color: "#F1C40F" }
];
const Dinner = [
    { text: "Baigan Bhartha", color: "#FF6B6B" },
    { text: "Raas wala Aloo", color: "#4ECDC4" },
    { text: "Kaanda Tamata", color: "#45B7D1" },
    { text: "Gosh wali Daal", color: "#96CEB4" },
    { text: "Chicken ka salna", color: "#FFEEAD" },
    { text: "Blackeye Beans", color: "#D4A5A5" },
    { text: "Moong ka Salna", color: "#9B59B6" },
    { text: "Dum Aloo", color: "#3498DB" },
    { text: "Chinese", color: "#E67E22" },
    { text: "Green Tomato", color: "#2ECC71" },
    { text: "Patice", color: "#E74C3C" },
    { text: "Talan", color: "#F1C40F" }
];

// Canvas setup
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const mealButtons = document.querySelectorAll('.meal-btn');

// Function to resize canvas
function resizeCanvas() {
    const container = canvas.parentElement;
    const size = container.clientWidth; // Use width since it's a square
    
    // Set canvas size to match container
    canvas.width = size;
    canvas.height = size;
    
    // Update wheel properties
    centerX = size / 2;
    centerY = size / 2;
    radius = (size / 2) - 10; // Leave 10px margin
    
    // Update text size based on wheel size
    const fontSize = Math.max(12, size / 20); // Minimum 12px, scales with wheel size
    
    // Force redraw
    drawWheel();
}

// Wheel properties
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let radius = Math.max(10, (canvas.width / 2) - 10); // Ensure minimum radius
let currentRotation = 0;
let isSpinning = false;
let currentMeal = 'Breakfast';

// Initialize canvas size
resizeCanvas();

// Update canvas size when window is resized
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
    }, 100); // Debounce resize events
});

// Use ResizeObserver to detect container size changes
const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
    }, 100);
});
resizeObserver.observe(canvas.parentElement);

// Function to update active meal button
function updateActiveMeal(meal) {
    mealButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.meal === meal) {
            btn.classList.add('active');
        }
    });
    // Update the title based on selected meal
    document.querySelector('h1').textContent = `${meal} Selection`;
}

// Function to get current meal options
function getCurrentMealOptions() {
    switch(currentMeal) {
        case 'Breakfast':
            return Breakfast;
        case 'Lunch':
            return Lunch;
        case 'Dinner':
            return Dinner;
        default:
            return Breakfast;
    }
}

// Draw the wheel
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentOptions = getCurrentMealOptions();
    const sliceAngle = (2 * Math.PI) / currentOptions.length;
    
    // Calculate responsive font size based on canvas size
    const fontSize = Math.max(12, Math.min(20, canvas.width / 25));
    
    currentOptions.forEach((option, index) => {
        const startAngle = index * sliceAngle + currentRotation;
        const endAngle = startAngle + sliceAngle;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = option.color;
        ctx.fill();
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillText(option.text, radius - (radius * 0.1), fontSize / 3);
        ctx.restore();
    });
}

// Spin the wheel
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    
    const currentOptions = getCurrentMealOptions();
    const targetIndex = Math.floor(Math.random() * currentOptions.length);
    const sliceAngle = (2 * Math.PI) / currentOptions.length;
    
    // Calculate the target angle for clockwise rotation
    const targetAngle = (2 * Math.PI) - (targetIndex * sliceAngle);
    const fullRotations = (Math.random() * 2 + 3) * Math.PI * 2;
    const spinAngle = fullRotations + targetAngle;
    
    const spinDuration = 5000;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        
        currentRotation = spinAngle * easeOut(progress);
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            
            // Calculate the final position to determine the selected option
            const finalRotation = currentRotation % (2 * Math.PI);
            // Adjust the calculation to account for the 180-degree offset
            const selectedIndex = Math.floor(
                (finalRotation + Math.PI) / sliceAngle
            ) % currentOptions.length;
            
            // Update active meal button to maintain selection
            updateActiveMeal(currentMeal);
        }
    }
    
    requestAnimationFrame(animate);
}

// Event listeners
spinBtn.addEventListener('click', spinWheel);

mealButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSpinning) return;
        currentMeal = btn.dataset.meal;
        updateActiveMeal(currentMeal);
        currentRotation = 0;
        drawWheel();
    });
});

// Initial draw
drawWheel(); 