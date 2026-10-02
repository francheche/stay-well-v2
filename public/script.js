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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 1. Intersection Observer for Fade-Up Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    const fadeElements = document.querySelectorAll('.fade-up');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        fadeElements.forEach(el => el.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        fadeElements.forEach(el => observer.observe(el));
    }

    // 2. Navbar Scroll, Hero Parallax & Sticky Bar
    const navbar = document.querySelector('.navbar');
    const heroBg = document.querySelector('.hero-background');
    const stickyBar = document.getElementById('stickyBar');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Hero Parallax (Disabled on mobile for performance)
        if (heroBg && window.innerWidth > 768 && !prefersReducedMotion) {
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
    const navLinksItems = navLinks ? navLinks.querySelectorAll('a') : [];

    function toggleMenu() {
        if (!navToggle || !navLinks) return;
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
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            toggleMenu();
            navToggle.focus();
        }
    });

    // 5. Smooth Scrolling for Anchor Links (Internal Only)
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
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
    const bookingDate = document.getElementById('bookingDate');

    if (bookingDate) {
        const today = new Date();
        const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        bookingDate.min = localToday;
    }

    function updateStep() {
        steps.forEach(s => {
            s.classList.remove('active');
            s.classList.remove('error');
        });
        indicators.forEach(i => {
            i.classList.remove('active');
            i.removeAttribute('aria-current');
        });
        
        const activeStep = document.querySelector(`.step-content[data-step="${currentStep}"]`);
        const activeIndicator = document.querySelector(`.step-indicator[data-step="${currentStep}"]`);
        
        activeStep.classList.add('active');
        activeIndicator.classList.add('active');
        activeIndicator.setAttribute('aria-current', 'step');
        
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
                currentStepEl.querySelector('.option-card')?.focus();
                return false;
            }
        } else if (step === 2) {
            if (!bookingData.focus) {
                currentStepEl.classList.add('error');
                currentStepEl.querySelector('.option-card')?.focus();
                return false;
            }
        } else if (step === 3) {
            const dateInput = document.getElementById('bookingDate');
            const timeInput = document.getElementById('bookingTime');
            let valid = true;
            
            if (!dateInput.value || (dateInput.min && dateInput.value < dateInput.min)) {
                dateInput.parentElement.classList.add('error');
                dateInput.setAttribute('aria-invalid', 'true');
                valid = false;
            } else {
                dateInput.parentElement.classList.remove('error');
                dateInput.setAttribute('aria-invalid', 'false');
            }
            
            if (!timeInput.value) {
                timeInput.parentElement.classList.add('error');
                timeInput.setAttribute('aria-invalid', 'true');
                valid = false;
            } else {
                timeInput.parentElement.classList.remove('error');
                timeInput.setAttribute('aria-invalid', 'false');
            }
            if (!valid) currentStepEl.querySelector('[aria-invalid="true"]')?.focus();
            return valid;
        } else if (step === 4) {
            const nameInput = document.getElementById('userName');
            const addrInput = document.getElementById('userAddress');
            let valid = true;
            
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                nameInput.setAttribute('aria-invalid', 'true');
                valid = false;
            } else {
                nameInput.parentElement.classList.remove('error');
                nameInput.setAttribute('aria-invalid', 'false');
            }
            
            if (!addrInput.value.trim()) {
                addrInput.parentElement.classList.add('error');
                addrInput.setAttribute('aria-invalid', 'true');
                valid = false;
            } else {
                addrInput.parentElement.classList.remove('error');
                addrInput.setAttribute('aria-invalid', 'false');
            }
            if (!valid) currentStepEl.querySelector('[aria-invalid="true"]')?.focus();
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

    if (nextBtn && prevBtn && steps.length === totalSteps && indicators.length === totalSteps) {
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
    }

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
            } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                const cards = Array.from(card.parentElement.querySelectorAll('.option-card'));
                const direction = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
                const nextCard = cards[(cards.indexOf(card) + direction + cards.length) % cards.length];
                nextCard.focus();
                nextCard.click();
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
        const datetimeVal = encodeURIComponent((bookingData.date || '') + (bookingData.time ? ' at ' + bookingData.time : ''));
        const destination = `/booking-request/?tier=${encodeURIComponent(bookingData.tier || '')}&focus=${encodeURIComponent(bookingData.focus || '')}&datetime=${datetimeVal}&name=${encodeURIComponent(bookingData.name || '')}&address=${encodeURIComponent(bookingData.address || '')}&text=${encodedMessage}`;
        window.location.href = destination;
    }

    // 8. Ensure WhatsApp Floating Button is Present on All Pages
    const floatingContact = document.querySelector('.floating-contact');
    if (floatingContact && !floatingContact.querySelector('.float-btn.whatsapp')) {
        const waFloat = document.createElement('a');
        waFloat.href = 'https://wa.me/639469983624';
        waFloat.className = 'float-btn whatsapp';
        waFloat.setAttribute('data-label', 'WhatsApp');
        waFloat.setAttribute('title', 'WhatsApp Message');
        waFloat.setAttribute('aria-label', 'Message Stay Well Massage on WhatsApp');
        waFloat.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
        floatingContact.insertBefore(waFloat, floatingContact.firstChild);
    }

    // 9. Universal WhatsApp Conversion Trigger & Click Delegation
    let lastWhatsAppConversionTime = 0;
    function reportWhatsAppConversion(sourceLabel, destinationUrl) {
        const now = Date.now();
        if (now - lastWhatsAppConversionTime < 1200) {
            return; // Debounce rapid consecutive clicks or duplicate events
        }
        lastWhatsAppConversionTime = now;

        trackEvent('contact_click', {
            type: 'whatsapp',
            source: sourceLabel || 'unknown',
            url: destinationUrl || ''
        });

        try {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'conversion', {
                    'send_to': 'AW-18485234681/2ZG8COaCjY0dEPmXue5E',
                    'value': 1.0,
                    'currency': 'PHP',
                    'transport_type': 'beacon'
                });
            } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
                window.dataLayer.push({
                    'event': 'conversion',
                    'send_to': 'AW-18485234681/2ZG8COaCjY0dEPmXue5E',
                    'value': 1.0,
                    'currency': 'PHP'
                });
            }
        } catch (err) {
            console.warn('[Tracking] WhatsApp conversion event error:', err);
        }
    }

    // Capture-phase listener for ANY WhatsApp link or button clicked on the site
    document.addEventListener('click', (e) => {
        const clickable = e.target.closest('a, button, [role="button"]');
        if (!clickable) return;

        const href = clickable.getAttribute('href') || clickable.dataset.href || '';
        const isWhatsAppHref = /wa\.me|whatsapp\.com|api\.whatsapp\.com|web\.whatsapp\.com/i.test(href);
        const hasWhatsAppClass = clickable.classList.contains('whatsapp') || 
                                 clickable.classList.contains('btn-whatsapp') || 
                                 clickable.id === 'whatsapp-fallback';

        if (isWhatsAppHref || hasWhatsAppClass) {
            const label = clickable.getAttribute('data-label') || 
                          clickable.getAttribute('aria-label') || 
                          clickable.textContent.trim().slice(0, 30) || 
                          'whatsapp_cta';
            reportWhatsAppConversion(label, href);
        } else if (clickable.classList.contains('call') || /^tel:/i.test(href)) {
            trackEvent('contact_click', { type: 'call' });
        } else if (clickable.classList.contains('sms') || /^sms:/i.test(href)) {
            trackEvent('contact_click', { type: 'sms' });
        }
    }, true);

    // Global helper exposed to window for inline onclicks or external redirects
    window.gtag_report_conversion = function(url) {
        var redirected = false;
        var callback = function () {
            if (!redirected && typeof url !== 'undefined' && url) {
                redirected = true;
                window.location.href = url;
            }
        };
        setTimeout(callback, 800);
        reportWhatsAppConversion('gtag_report_conversion', url);
        try {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'conversion', {
                    'send_to': 'AW-18485234681/2ZG8COaCjY0dEPmXue5E',
                    'value': 1.0,
                    'currency': 'PHP',
                    'transport_type': 'beacon',
                    'event_callback': callback
                });
                return false;
            }
        } catch (e) {
            console.warn('[Tracking] gtag_report_conversion fallback error:', e);
        }
        callback();
        return false;
    };

    // 9. Deep-link Parameter Navigation (e.g. ?view=services, ?view=reviews, ?view=areas)
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const view = urlParams.get('view');
        if (view) {
            const targetSection = document.getElementById(view);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 150);
            }
        }
    } catch (e) {}

});
