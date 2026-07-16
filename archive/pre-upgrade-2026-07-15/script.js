// STAY WELL V2 - CORE INTERACTION ENGINE

// Global Privacy-Conscious Event Tracker
function trackEvent(name, data = {}) {
    console.log(`[Event] ${name}`, data);
    if (window.beacon) {
        window.beacon(name, data);
    }
}

// Global Error Listener
window.onerror = function(message, source, lineno, colno, error) {
    trackEvent('js_error', {
        msg: message,
        line: lineno,
        url: source
    });
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Intersection Observer for Fade-Up Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // 2. Navbar Scroll, Hero Parallax & Sticky Bar
    const navbar = document.querySelector('.navbar');
    const heroBg = document.querySelector('.hero-background');
    const stickyBar = document.getElementById('stickyBar');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hero Parallax (Disabled on mobile for performance)
        if (heroBg && window.innerWidth > 768) {
            heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        } else if (heroBg) {
            heroBg.style.transform = 'none';
        }

        // Sticky Bar Visibility (Show after 80vh)
        if (stickyBar) {
            if (scrollY > window.innerHeight * 0.8) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        }
    }, { passive: true });

    // 3. Hero Background Load Effect
    if (heroBg) {
        heroBg.classList.add('lazy-bg');
        const img = new Image();
        img.src = 'stay_well_navy_gold_hero_1777074342140.webp';
        img.onload = () => {
            heroBg.classList.add('loaded');
        };
    }

    // 4. Mobile Navigation Toggle & Accessibility
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksItems = navLinks.querySelectorAll('a');

    function toggleMenu() {
        const isOpen = navLinks.classList.contains('active');
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    // Close menu on link click
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // 5. Smooth Scrolling for Anchor Links (Internal Only)
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 6. Linear Booking Funnel Logic
    let currentStep = 1;
    const totalSteps = 5;
    const bookingData = {
        tier: null,
        focus: null,
        date: '',
        time: '',
        name: '',
        address: ''
    };

    const steps = document.querySelectorAll('.step-content');
    const indicators = document.querySelectorAll('.step-indicator');
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');

    function updateStep() {
        steps.forEach(s => {
            s.classList.remove('active');
            s.classList.remove('error');
        });
        indicators.forEach(i => i.classList.remove('active'));
        
        const activeStep = document.querySelector(`.step-content[data-step="${currentStep}"]`);
        const activeIndicator = document.querySelector(`.step-indicator[data-step="${currentStep}"]`);
        
        activeStep.classList.add('active');
        activeIndicator.classList.add('active');
        
        prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
        
        if (currentStep === totalSteps) {
            nextBtn.innerText = 'Confirm & Send';
            renderSummary();
        } else if (currentStep === totalSteps - 1) {
            nextBtn.innerText = 'Review Booking';
        } else {
            nextBtn.innerText = 'Continue';
        }

        // Scroll to top of booking section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(step) {
        const currentStepEl = document.querySelector(`.step-content[data-step="${step}"]`);
        currentStepEl.classList.remove('error');
        
        if (step === 1) {
            if (!bookingData.tier) {
                currentStepEl.classList.add('error');
                return false;
            }
        } else if (step === 2) {
            if (!bookingData.focus) {
                currentStepEl.classList.add('error');
                return false;
            }
        } else if (step === 3) {
            const dateInput = document.getElementById('bookingDate');
            const timeInput = document.getElementById('bookingTime');
            let valid = true;
            
            if (!dateInput.value) {
                dateInput.parentElement.classList.add('error');
                valid = false;
            } else {
                dateInput.parentElement.classList.remove('error');
            }
            
            if (!timeInput.value) {
                timeInput.parentElement.classList.add('error');
                valid = false;
            } else {
                timeInput.parentElement.classList.remove('error');
            }
            return valid;
        } else if (step === 4) {
            const nameInput = document.getElementById('userName');
            const addrInput = document.getElementById('userAddress');
            let valid = true;
            
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                valid = false;
            } else {
                nameInput.parentElement.classList.remove('error');
            }
            
            if (!addrInput.value.trim()) {
                addrInput.parentElement.classList.add('error');
                valid = false;
            } else {
                addrInput.parentElement.classList.remove('error');
            }
            return valid;
        }
        return true;
    }

    function renderSummary() {
        const summaryEl = document.getElementById('bookingSummary');
        if (!summaryEl) return;

        // Securely populate data
        bookingData.date = document.getElementById('bookingDate').value;
        bookingData.time = document.getElementById('bookingTime').value;
        bookingData.name = document.getElementById('userName').value.trim();
        bookingData.address = document.getElementById('userAddress').value.trim();

        // Clear existing content
        summaryEl.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'summary-container';

        const items = [
            { label: 'Sanctuary', value: bookingData.tier },
            { label: 'Focus', value: bookingData.focus },
            { label: 'Arrival', value: `${bookingData.date} at ${bookingData.time}` },
            { label: 'Location', value: bookingData.address },
            { label: 'Guest', value: bookingData.name }
        ];

        items.forEach(item => {
            const p = document.createElement('p');
            p.className = 'summary-item';
            
            const strong = document.createElement('strong');
            strong.className = 'summary-label';
            strong.textContent = `${item.label}: `;
            
            const span = document.createElement('span');
            span.textContent = item.value;
            
            p.appendChild(strong);
            p.appendChild(span);
            container.appendChild(p);
        });

        summaryEl.appendChild(container);
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStep();
            } else {
                handleBookingSubmit();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStep();
        }
    });

    // Option selection & Accessibility
    document.querySelectorAll('.option-card').forEach(card => {
        const selectOption = () => {
            const step = card.closest('.step-content').dataset.step;
            const value = card.getAttribute('data-value');

            // Update Global State
            if (step === "1") bookingData.tier = value;
            if (step === "2") bookingData.focus = value;

            // UI feedback
            card.parentElement.querySelectorAll('.option-card').forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('selected');
            card.setAttribute('aria-checked', 'true');
            card.closest('.step-content').classList.remove('error');
        };

        card.addEventListener('click', selectOption);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption();
            }
        });
    });
 
    function handleBookingSubmit() {
        trackEvent('booking_conversion', {
            tier: bookingData.tier,
            focus: bookingData.focus
        });
        const message = `Hello Stay Well! I'd like to book a session:
- Tier: ${bookingData.tier}
- Focus: ${bookingData.focus}
- Date/Time: ${bookingData.date} at ${bookingData.time}
- Name: ${bookingData.name}
- Address: ${bookingData.address}
- Source: Website Booking Engine`;

        const encodedMessage = encodeURIComponent(message);
        window.location.href = `https://wa.me/639469983624?text=${encodedMessage}`;
    }

    // 8. Contact Button Tracking
    document.querySelectorAll('.float-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.classList.contains('call') ? 'call' : 
                         this.classList.contains('whatsapp') ? 'whatsapp' : 
                         this.classList.contains('sms') ? 'sms' : 'unknown';
            trackEvent('contact_click', { type: type });
        });
    });

});

