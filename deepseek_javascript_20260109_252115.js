// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryModal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.modal-close');
const messageForm = document.getElementById('messageForm');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const currentMonthEl = document.getElementById('currentMonth');
const calendarDays = document.getElementById('calendarDays');

// Current date for calendar
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

// Navigation
function navigateToSection(sectionId) {
    // Update active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show the selected section
    pageSections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
    
    // Scroll to top of section
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Navigation event listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        navigateToSection(sectionId);
    });
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Gallery Filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter gallery items
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Gallery Modal
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        const caption = item.querySelector('.gallery-overlay p').textContent;
        
        modalImage.setAttribute('src', imgSrc);
        modalCaption.textContent = caption;
        galleryModal.style.display = 'flex';
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    galleryModal.style.display = 'none';
});

// Close modal when clicking outside the image
galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        galleryModal.style.display = 'none';
    }
});

// Contact Form
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    // For now, we'll just show an alert
    alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} regarding "${subject}".`);
    
    // Reset form
    messageForm.reset();
});

// Calendar Functions
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// School events data (month is 0-indexed)
const schoolEvents = {
    11: { // December (month 11)
        15: "Final Exams Begin",
        20: "Last Day of Semester",
        23: "Winter Break Begins",
        25: "Christmas Day"
    },
    0: { // January (month 0)
        1: "New Year's Day",
        3: "School Reopens",
        10: "Spring Semester Begins",
        15: "MLK Day (No School)"
    }
};

function renderCalendar(year, month) {
    // Update month display
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;
    
    // Clear previous calendar days
    calendarDays.innerHTML = '';
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    // Get number of days in month
    const daysInMonth = lastDay.getDate();
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayIndex = firstDay.getDay();
    
    // Previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Next month's first days
    const nextMonthFirstDayIndex = lastDay.getDay();
    
    // Today's date
    const today = new Date();
    const isToday = (day) => {
        return year === today.getFullYear() && 
               month === today.getMonth() && 
               day === today.getDate();
    };
    
    // Previous month days
    for (let i = firstDayIndex; i > 0; i--) {
        const day = prevMonthLastDay - i + 1;
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell prev-month';
        dayCell.textContent = day;
        calendarDays.appendChild(dayCell);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        
        // Check if today
        if (isToday(day)) {
            dayCell.classList.add('today');
        }
        
        // Check if has event
        if (schoolEvents[month] && schoolEvents[month][day]) {
            dayCell.classList.add('event-day');
            
            const eventMarker = document.createElement('span');
            eventMarker.className = 'event-marker';
            eventMarker.textContent = schoolEvents[month][day];
            dayCell.appendChild(eventMarker);
        }
        
        calendarDays.appendChild(dayCell);
    }
    
    // Next month days
    const daysNeeded = 42 - (firstDayIndex + daysInMonth); // 6 rows * 7 days = 42
    for (let day = 1; day <= daysNeeded; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell next-month';
        dayCell.textContent = day;
        calendarDays.appendChild(dayCell);
    }
}

// Calendar Navigation
prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
});

// Initialize calendar
renderCalendar(currentYear, currentMonth);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    navigateToSection('home');
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});

// Add current year to footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }
});