/* =====================================================
   KURT REINTSCH | SALUD DIGITAL PARA LA PAZ
   JavaScript — Animations, Interactions & Utilities
   ===================================================== */

'use strict';

/* ========== PARTICLES ========== */
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    const count = window.innerWidth < 768 ? 20 : 50;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px; height: ${size}px;
            animation-delay: ${Math.random() * -20}s;
            animation-duration: ${15 + Math.random() * 12}s;
            opacity: ${Math.random() * 0.5 + 0.1};
        `;
        container.appendChild(p);
    }
}

/* ========== NAVBAR ========== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        // Back to top
        const btn = document.getElementById('back-to-top');
        if (btn) btn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ========== MOBILE MENU ========== */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        const isOpen = menu.classList.contains('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        // Animate hamburger
        const spans = toggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });

    // Close on link click
    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            document.body.style.overflow = '';
            const spans = toggle.querySelectorAll('span');
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });
}

/* ========== SMOOTH SCROLL ========== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 88;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });
}

/* ========== SCROLL REVEAL ========== */
function initScrollReveal() {
    const cards = document.querySelectorAll('.reveal-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    // Group cards so stagger works by section
    const sections = {};
    cards.forEach(card => {
        const section = card.closest('section');
        const key = section ? section.id : 'generic';
        if (!sections[key]) sections[key] = [];
        sections[key].push(card);
    });

    // Observe each group with per-group staggering
    Object.values(sections).forEach(group => {
        group.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.06}s`;
        });
        const groupObserver = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) {
                group.forEach(card => card.classList.add('visible'));
                groupObserver.disconnect();
            }
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        if (group[0]) groupObserver.observe(group[0]);
    });
}

/* ========== ANIMATED COUNTERS ========== */
function animateCounter(el, target, duration = 2200) {
    let start = 0;
    const startTime = performance.now();
    const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo
        const eased = 1 - Math.pow(1 - progress, 4);
        const val = Math.round(eased * target * 10) / 10;
        el.textContent = val === Math.floor(val) ? Math.floor(val) : val.toFixed(1);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ========== FLIP CARDS (touch support) ========== */
function initFlipCards() {
    const isTouchDevice = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    if (!isTouchDevice()) return; // Desktop: CSS hover handles it

    document.querySelectorAll('.service-card-flip').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

/* ========== PARALLAX ========== */
function initParallax() {
    if (window.innerWidth < 1024) return;
    const heroBg = document.querySelector('.hero-bg-gradient');
    const onScroll = debounce(() => {
        const scrolled = window.scrollY;
        if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, 10);
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ========== BACK TO TOP ========== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ========== FORM / GOOGLE FORMS ========== */
function handleFormSubmit(e) {
    // Note: Do not preventDefault if using target="hidden_iframe"
    const form = e.target;
    // We only change UI, form submission proceeds to iframe
    const btn = form.querySelector('button[type="submit"]');
    btn.dataset.originalHTML = btn.innerHTML; // save for later
    btn.innerHTML = '<span>Enviando...</span>';
    btn.disabled = true;
}

window.showFormSuccess = function () {
    const btn = document.getElementById('btn-enviar');
    if (!btn) return;

    // Changing UI to success state
    btn.innerHTML = '<span>✓ Mensaje Enviado</span>';
    btn.style.background = 'linear-gradient(135deg, #15803d, #22c55e)';
    showToast('¡Gracias! Nos pondremos en contacto contigo pronto. ¡Viva LIBRE! 🇧🇴');

    // Reset form
    document.getElementById('contact-form').reset();

    // Restore button after delay
    setTimeout(() => {
        btn.innerHTML = btn.dataset.originalHTML || '<span>Enviar Mensaje</span>';
        btn.disabled = false;
        btn.style.background = '';
        window.submitted = false; // reset state
    }, 4000);
};
window.handleFormSubmit = handleFormSubmit;

function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4500);
    });
}

/* ========== NAVBAR ACTIVE LINK ========== */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const onScroll = debounce(() => {
        let current = '';
        sections.forEach(section => {
            const sTop = section.offsetTop - 120;
            if (window.scrollY >= sTop) current = section.id;
        });
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--primary-400)';
            }
        });
    }, 50);

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ========== CARD MOUSE EFFECT ========== */
function initCardMouseEffect() {
    if (window.innerWidth < 1024) return;
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
            card.style.transform = `translateY(-4px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ========== DEBOUNCE ========== */
function debounce(fn, wait) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

/* ========== WHATSAPP WIDGET ========== */
function initWhatsAppWidget() {
    const waWidget = document.getElementById('wa-widget');
    const waFab = document.getElementById('wa-fab');
    const waCloseBtn = document.getElementById('wa-close-btn');
    const waTooltip = document.getElementById('wa-tooltip');

    if (!waWidget || !waFab) return;

    // Show tooltip briefly on load after 2s
    setTimeout(() => {
        if (waTooltip && !waWidget.classList.contains('open')) {
            waTooltip.classList.add('show');
            setTimeout(() => {
                if (waTooltip) waTooltip.classList.remove('show');
            }, 6000);
        }
    }, 2000);

    const toggleChat = (e) => {
        if (e) e.preventDefault();
        waWidget.classList.toggle('open');
        if (waTooltip) waTooltip.classList.remove('show'); // Hide tooltip when clicked
    };

    waFab.addEventListener('click', toggleChat);
    if (waCloseBtn) waCloseBtn.addEventListener('click', toggleChat);
}

// Global function to open literal WhatsApp app or web version
window.openWhatsApp = function (message, customNumber) {
    const number = customNumber || window.WA_NUMBER || '59176000000';
    const msg = encodeURIComponent(message || window.WA_MESSAGE || 'Hola');
    const url = `https://wa.me/${number}?text=${msg}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Close the widget after clicking
    const waWidget = document.getElementById('wa-widget');
    if (waWidget) waWidget.classList.remove('open');
};

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initFlipCards();
    initParallax();
    initBackToTop();
    initActiveNavLinks();
    initCardMouseEffect();
    initWhatsAppWidget();

    // Hero animations
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, i) => {
        if (!el.classList.contains('animate-fade-up') &&
            !el.classList.contains('animate-scale-in') &&
            !el.classList.contains('animate-fade-rotate')) {
            el.style.opacity = '1';
        }
    });

    console.log('%c🇧🇴 Kurt Reintsch | Salud Digital Para La Paz', 'color:#F97316;font-size:16px;font-weight:bold;');
    console.log('%c"EL BOLIVIANO PUEDE" — LIBRE 2025–2028', 'color:#C62828;font-size:12px;');
});
