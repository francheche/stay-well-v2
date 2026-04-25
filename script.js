// STAY WELL V2 - CORE INTERACTION ENGINE

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Intersection Observer for Fade-Up Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target);
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

        // Hero Parallax
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        }

        // Sticky Bar Visibility (Show after 80vh)
        if (stickyBar) {
            if (scrollY > window.innerHeight * 0.8) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        }
    });

    // 3. Hero Background Load Effect
    if (heroBg) {
        heroBg.classList.add('lazy-bg');
        const img = new Image();
        img.src = 'hero.jpg';
        img.onload = () => {
            heroBg.classList.add('loaded');
        };
    }

    // 3. Mobile Navigation Toggle (Placeholder logic)
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('open');
        });
    }

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 5. Linear Booking Funnel Logic
    let currentStep = 1;
    const totalSteps = 5;
    const bookingData = {
        tier: 'Not selected',
        focus: 'Not selected',
        date: 'TBD',
        time: 'TBD',
        name: 'Guest',
        address: 'TBD'
    };

    const steps = document.querySelectorAll('.step-content');
    const indicators = document.querySelectorAll('.step-indicator');
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');

    function updateStep() {
        steps.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));
        
        document.querySelector(`.step-content[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');
        
        prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
        
        if (currentStep === totalSteps) {
            nextBtn.innerText = 'Confirm & Send';
            renderSummary();
        } else if (currentStep === totalSteps - 1) {
            nextBtn.innerText = 'Review Booking';
        } else {
            nextBtn.innerText = 'Continue';
        }
    }

    function renderSummary() {
        const summaryEl = document.getElementById('bookingSummary');
        if (!summaryEl) return;

        // Final pull of input fields
        bookingData.date = document.getElementById('bookingDate').value || 'TBD';
        bookingData.time = document.getElementById('bookingTime').value || 'TBD';
        bookingData.name = document.getElementById('userName').value || 'Guest';
        bookingData.address = document.getElementById('userAddress').value || 'TBD';

        summaryEl.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px; color: #1a1a1a; text-align: left; font-family: var(--font-heading);">
                <p style="margin:0; border-bottom: 1px solid rgba(184, 134, 11, 0.1); padding-bottom: 8px;"><strong style="color: #b8860b; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em;">Sanctuary:</strong> ${bookingData.tier}</p>
                <p style="margin:0; border-bottom: 1px solid rgba(184, 134, 11, 0.1); padding-bottom: 8px;"><strong style="color: #b8860b; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em;">Focus:</strong> ${bookingData.focus}</p>
                <p style="margin:0; border-bottom: 1px solid rgba(184, 134, 11, 0.1); padding-bottom: 8px;"><strong style="color: #b8860b; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em;">Arrival:</strong> ${bookingData.date} at ${bookingData.time}</p>
                <p style="margin:0; border-bottom: 1px solid rgba(184, 134, 11, 0.1); padding-bottom: 8px;"><strong style="color: #b8860b; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em;">Location:</strong> ${bookingData.address}</p>
                <p style="margin:0;"><strong style="color: #b8860b; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em;">Guest:</strong> ${bookingData.name}</p>
            </div>
        `;
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep();
        } else {
            handleBookingSubmit();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStep();
        }
    });

    // Option selection
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            const step = this.closest('.step-content').dataset.step;
            const value = this.getAttribute('data-value');

            // Update Global State
            if (step === "1") bookingData.tier = value;
            if (step === "2") bookingData.focus = value;

            // UI feedback
            this.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    function handleBookingSubmit() {
        const tier = document.querySelector('.step-content[data-step="1"] .option-card.selected')?.dataset.value || 'Not selected';
        const focus = document.querySelector('.step-content[data-step="2"] .option-card.selected')?.dataset.value || 'Not selected';
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const name = document.getElementById('userName').value;
        const address = document.getElementById('userAddress').value;

        const message = `Hello Stay Well! I'd like to book an ${tier} session:
- Tier: ${tier}
- Focus: ${focus}
- Date/Time: ${date} at ${time}
- Name: ${name}
- Address: ${address}
- Source: Website Booking Engine`;

        const encodedMessage = encodeURIComponent(message);
        window.location.href = `https://wa.me/639469983624?text=${encodedMessage}`;
    }

});
