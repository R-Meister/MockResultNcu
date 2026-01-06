// ===== GPA Predictor Application =====

// Grade Point Mapping
const GRADE_POINTS = {
    'A+': 10,
    'A': 9,
    'B+': 8,
    'B': 7,
    'C+': 6,
    'C': 5,
    'D': 4,
    'F': 0
};

const GRADE_NAMES = {
    10: 'A+',
    9: 'A',
    8: 'B+',
    7: 'B',
    6: 'C+',
    5: 'C',
    4: 'D',
    0: 'F'
};

// State
let courses = [];
let animations = {};

// DOM Elements
const elements = {
    currentCGPA: document.getElementById('currentCGPA'),
    completedCredits: document.getElementById('completedCredits'),
    courseName: document.getElementById('courseName'),
    courseCredits: document.getElementById('courseCredits'),
    expectedGrade: document.getElementById('expectedGrade'),
    addCourseBtn: document.getElementById('addCourseBtn'),
    courseList: document.getElementById('courseList'),
    emptyState: document.getElementById('emptyState'),
    sgpaValue: document.getElementById('sgpaValue'),
    cgpaValue: document.getElementById('cgpaValue'),
    sgpaBar: document.getElementById('sgpaBar'),
    cgpaBar: document.getElementById('cgpaBar'),
    semesterCredits: document.getElementById('semesterCredits'),
    totalCredits: document.getElementById('totalCredits'),
    cgpaChange: document.getElementById('cgpaChange'),
    changeIcon: document.getElementById('changeIcon'),
    changeText: document.getElementById('changeText'),
    resultsCard: document.getElementById('resultsCard'),
    successOverlay: document.getElementById('successOverlay'),
    gradeRefHeader: document.getElementById('gradeRefHeader'),
    gradeTableWrapper: document.getElementById('gradeTableWrapper')
};

// ===== Lottie Animations =====
function initAnimations() {
    // Logo animation - Book/Education theme
    animations.logo = lottie.loadAnimation({
        container: document.getElementById('logoAnimation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets3.lottiefiles.com/packages/lf20_1a8dx7zj.json'
    });

    // Status animation - Chart/Graph
    animations.status = lottie.loadAnimation({
        container: document.getElementById('statusAnimation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets5.lottiefiles.com/packages/lf20_qp1q7mct.json'
    });

    // Course animation - Add/Plus icon
    animations.course = lottie.loadAnimation({
        container: document.getElementById('courseAnimation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets9.lottiefiles.com/packages/lf20_ky24lkyk.json'
    });

    // Result animation - Trophy/Success
    animations.result = lottie.loadAnimation({
        container: document.getElementById('resultAnimation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_touohxv0.json'
    });

    // Empty state animation
    animations.empty = lottie.loadAnimation({
        container: document.getElementById('emptyAnimation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets4.lottiefiles.com/packages/lf20_wnqlfojb.json'
    });

    // Success animation (for adding courses)
    animations.success = lottie.loadAnimation({
        container: document.getElementById('successAnimation'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'https://assets1.lottiefiles.com/packages/lf20_jbrw3hcz.json'
    });

    // Play success animation once when triggered
    animations.success.addEventListener('complete', () => {
        elements.successOverlay.classList.remove('show');
    });
}

// ===== Event Listeners =====
function initEventListeners() {
    // Add course button
    elements.addCourseBtn.addEventListener('click', addCourse);

    // Enter key to add course
    elements.courseName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCourse();
    });
    elements.courseCredits.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCourse();
    });

    // Recalculate on input change
    elements.currentCGPA.addEventListener('input', calculateResults);
    elements.completedCredits.addEventListener('input', calculateResults);

    // Grade reference toggle
    elements.gradeRefHeader.addEventListener('click', toggleGradeReference);

    // Input validation
    elements.currentCGPA.addEventListener('input', () => {
        let val = parseFloat(elements.currentCGPA.value);
        if (val > 10) elements.currentCGPA.value = 10;
        if (val < 0) elements.currentCGPA.value = 0;
    });

    elements.completedCredits.addEventListener('input', () => {
        let val = parseFloat(elements.completedCredits.value);
        if (val < 0) elements.completedCredits.value = 0;
    });

    elements.courseCredits.addEventListener('input', () => {
        let val = parseFloat(elements.courseCredits.value);
        if (val > 12) elements.courseCredits.value = 12;
        if (val < 1) elements.courseCredits.value = 1;
    });
}

// ===== Add Course =====
function addCourse() {
    const name = elements.courseName.value.trim();
    const credits = parseInt(elements.courseCredits.value);
    const gradePoints = parseInt(elements.expectedGrade.value);

    // Validation
    if (!name) {
        elements.courseName.classList.add('shake');
        setTimeout(() => elements.courseName.classList.remove('shake'), 300);
        elements.courseName.focus();
        return;
    }

    if (!credits || credits < 1) {
        elements.courseCredits.classList.add('shake');
        setTimeout(() => elements.courseCredits.classList.remove('shake'), 300);
        elements.courseCredits.focus();
        return;
    }

    // Create course object
    const course = {
        id: Date.now(),
        name,
        credits,
        gradePoints,
        gradeName: GRADE_NAMES[gradePoints]
    };

    courses.push(course);

    // Show success animation briefly
    showSuccessAnimation();

    // Clear inputs
    elements.courseName.value = '';
    elements.courseCredits.value = '';
    elements.courseName.focus();

    // Update UI
    renderCourses();
    calculateResults();
}

// ===== Show Success Animation =====
function showSuccessAnimation() {
    elements.successOverlay.classList.add('show');
    animations.success.goToAndPlay(0);
}

// ===== Delete Course =====
function deleteCourse(id) {
    courses = courses.filter(course => course.id !== id);
    renderCourses();
    calculateResults();
}

// ===== Render Courses =====
function renderCourses() {
    if (courses.length === 0) {
        elements.emptyState.style.display = 'flex';
        // Clear any existing course items
        const courseItems = elements.courseList.querySelectorAll('.course-item');
        courseItems.forEach(item => item.remove());
        return;
    }

    elements.emptyState.style.display = 'none';

    // Build HTML
    let html = '';
    courses.forEach(course => {
        html += `
            <div class="course-item" data-id="${course.id}">
                <div class="course-info">
                    <div class="course-name">${escapeHtml(course.name)}</div>
                    <div class="course-details">${course.credits} credits • Expected: ${course.gradeName}</div>
                </div>
                <div class="course-grade grade-${course.gradePoints}">${course.gradePoints}</div>
                <button class="delete-btn" onclick="deleteCourse(${course.id})" aria-label="Delete course">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
    });

    // Remove old course items and add new ones
    const oldItems = elements.courseList.querySelectorAll('.course-item');
    oldItems.forEach(item => item.remove());
    elements.courseList.insertAdjacentHTML('beforeend', html);
}

// ===== Calculate Results =====
function calculateResults() {
    const currentCGPA = parseFloat(elements.currentCGPA.value) || 0;
    const completedCredits = parseInt(elements.completedCredits.value) || 0;

    // Calculate semester credits and weighted points
    let semesterCredits = 0;
    let semesterWeightedPoints = 0;

    courses.forEach(course => {
        semesterCredits += course.credits;
        semesterWeightedPoints += course.credits * course.gradePoints;
    });

    // Calculate SGPA
    const sgpa = semesterCredits > 0 
        ? semesterWeightedPoints / semesterCredits 
        : 0;

    // Calculate updated CGPA
    // Formula: New CGPA = (Old CGPA * Old Credits + Semester Points) / (Old Credits + Semester Credits)
    const oldWeightedPoints = currentCGPA * completedCredits;
    const totalCredits = completedCredits + semesterCredits;
    const newCGPA = totalCredits > 0 
        ? (oldWeightedPoints + semesterWeightedPoints) / totalCredits 
        : 0;

    // Calculate change
    const cgpaChange = newCGPA - currentCGPA;

    // Update UI
    updateResultsUI(sgpa, newCGPA, cgpaChange, semesterCredits, totalCredits, currentCGPA);
}

// ===== Update Results UI =====
function updateResultsUI(sgpa, newCGPA, cgpaChange, semesterCredits, totalCredits, currentCGPA) {
    // Animate value changes
    animateValue(elements.sgpaValue, sgpa);
    animateValue(elements.cgpaValue, newCGPA);

    // Update bars (scale 0-10 to 0-100%)
    elements.sgpaBar.style.width = `${(sgpa / 10) * 100}%`;
    elements.cgpaBar.style.width = `${(newCGPA / 10) * 100}%`;

    // Update credits text
    elements.semesterCredits.textContent = `${semesterCredits} credits this semester`;
    elements.totalCredits.textContent = `${totalCredits} total credits`;

    // Update change indicator
    if (courses.length === 0) {
        elements.cgpaChange.className = 'cgpa-change';
        elements.changeIcon.textContent = '→';
        elements.changeText.textContent = 'Add courses to see prediction';
    } else if (cgpaChange > 0.001) {
        elements.cgpaChange.className = 'cgpa-change positive';
        elements.changeIcon.textContent = '↑';
        elements.changeText.textContent = `CGPA will increase by ${cgpaChange.toFixed(2)} points`;
    } else if (cgpaChange < -0.001) {
        elements.cgpaChange.className = 'cgpa-change negative';
        elements.changeIcon.textContent = '↓';
        elements.changeText.textContent = `CGPA will decrease by ${Math.abs(cgpaChange).toFixed(2)} points`;
    } else {
        elements.cgpaChange.className = 'cgpa-change';
        elements.changeIcon.textContent = '→';
        if (currentCGPA > 0) {
            elements.changeText.textContent = 'CGPA will remain unchanged';
        } else {
            elements.changeText.textContent = 'Enter current CGPA to see change';
        }
    }

    // Add pulse animation to results
    elements.sgpaValue.classList.add('pulse');
    elements.cgpaValue.classList.add('pulse');
    setTimeout(() => {
        elements.sgpaValue.classList.remove('pulse');
        elements.cgpaValue.classList.remove('pulse');
    }, 500);
}

// ===== Animate Value =====
function animateValue(element, targetValue) {
    const duration = 500;
    const startValue = parseFloat(element.textContent) || 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (targetValue - startValue) * easeProgress;
        
        if (targetValue === 0 && courses.length === 0 && !elements.currentCGPA.value) {
            element.textContent = '--';
        } else {
            element.textContent = currentValue.toFixed(2);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== Toggle Grade Reference =====
function toggleGradeReference() {
    elements.gradeRefHeader.classList.toggle('collapsed');
    elements.gradeTableWrapper.classList.toggle('expanded');
}

// ===== Escape HTML =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initEventListeners();
    
    // Initial calculation
    calculateResults();

    // Start with grade reference expanded
    elements.gradeRefHeader.classList.remove('collapsed');
    elements.gradeTableWrapper.classList.add('expanded');
});

// Make deleteCourse available globally
window.deleteCourse = deleteCourse;
