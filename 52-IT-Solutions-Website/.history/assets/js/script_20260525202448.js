// ============ INIT AOS ============
AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

// Ensure the home page opens at the top instead of restoring a scrolled position.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

function resetInitialScroll() {
    if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
}

window.addEventListener('load', resetInitialScroll);
window.addEventListener('pageshow', resetInitialScroll);

// ============ NAVBAR SCROLL ============
const navbar = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
});

// ============ SMOOTH SCROLL HELPER ============
function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY || document.documentElement.scrollTop;
    const distance = targetY - startY;
    const defaultDuration = Math.min(1200, Math.max(350, Math.abs(distance) * 0.45));
    const dur = typeof duration === 'number' ? duration : defaultDuration;
    const startTime = performance.now();

    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / dur);
        const eased = easeInOutCubic(t);
        window.scrollTo(0, Math.round(startY + distance * eased));
        if (elapsed < dur) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

// ============ TOP PROGRESS BAR ============
const topProgressBar = document.querySelector('#top-progress .bar');
function updateTopProgress() {
    const bar = document.querySelector('#top-progress .bar');
    if (!bar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const winHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollable = docHeight - winHeight;
    const percent = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
}

window.addEventListener('scroll', () => {
    // use rAF for smoother updates
    window.requestAnimationFrame(updateTopProgress);
});
window.addEventListener('resize', () => window.requestAnimationFrame(updateTopProgress));
window.addEventListener('load', () => window.requestAnimationFrame(updateTopProgress));

// ============ ACTIVE NAV TRACKING ============
function updateActiveNav() {
    const sections = document.querySelectorAll('.page-section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === current) link.classList.add('active');
    });
}

// ============ SMOOTH SCROLL (Anchors) ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const targetY = Math.max(0, target.offsetTop - 80);
            smoothScrollTo(targetY);
            const collapse = document.getElementById('navContent');
            if (collapse && collapse.classList.contains('show')) collapse.classList.remove('show');
        }
    });
});

// ============ COUNT-UP STATS ANIMATION ============
const statsCounters = document.querySelectorAll('.counter-val');
if (statsCounters.length > 0) {
    const startCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const speed = 100; // lower number = faster
        const increment = target / speed;
        let count = 0;

        const updateCount = () => {
            count += increment;
            if (count < target) {
                el.innerText = Math.ceil(count);
                setTimeout(updateCount, 15);
            } else {
                el.innerText = target;
            }
        };

        updateCount();
    };

    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statsCounters.forEach(counter => statsObserver.observe(counter));
}

// ============ NEXUSCALC ROI / COST ESTIMATOR ============
const calcTeamSize = document.getElementById('calc-team-size');
const calcDowntime = document.getElementById('calc-downtime');
const calcHourlyRate = document.getElementById('calc-hourly-rate');

const valTeamSize = document.getElementById('val-team-size');
const valDowntime = document.getElementById('val-downtime');
const valHourlyRate = document.getElementById('val-hourly-rate');

const outLoss = document.getElementById('out-loss');
const outSavings = document.getElementById('out-savings');
const outRoi = document.getElementById('out-roi');
const progressBarFill = document.getElementById('calc-progress-fill');

function calculateITLosses() {
    if (!calcTeamSize || !calcDowntime || !calcHourlyRate) return;

    const teamSize = parseInt(calcTeamSize.value, 10);
    const downtimeHours = parseInt(calcDowntime.value, 10);
    const hourlyRate = parseInt(calcHourlyRate.value, 10);

    if (valTeamSize) valTeamSize.innerText = teamSize;
    if (valDowntime) valDowntime.innerText = downtimeHours;
    if (valHourlyRate) valHourlyRate.innerText = hourlyRate;

    const monthlySalaryLoss = teamSize * downtimeHours * hourlyRate;
    const monthlyRevenueLoss = downtimeHours * (teamSize * 15);
    const totalMonthlyLoss = monthlySalaryLoss + monthlyRevenueLoss;

    const expectedSavings = Math.round(totalMonthlyLoss * 0.85);
    const roiPercentage = 312;

    if (outLoss) outLoss.innerText = '$' + totalMonthlyLoss.toLocaleString();
    if (outSavings) outSavings.innerText = '$' + expectedSavings.toLocaleString();
    if (outRoi) outRoi.innerText = roiPercentage + '%';

    if (progressBarFill) {
        const efficiencyFactor = Math.min(100, Math.round((expectedSavings / 150000) * 100));
        progressBarFill.style.width = `${Math.max(15, efficiencyFactor)}%`;
    }
}

if (calcTeamSize && calcDowntime && calcHourlyRate) {
    [calcTeamSize, calcDowntime, calcHourlyRate].forEach(input => {
        input.addEventListener('input', calculateITLosses);
    });
    calculateITLosses();
}

// ============ CHAT PANEL TOGGLE ============
function toggleChatPanel() {
    const panel = document.getElementById('chatPanel');
    const btn = document.getElementById('chatFabBtn');
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
        panel.classList.remove('open');
        btn.innerHTML = '<i class="bi bi-robot"></i><span class="pulse-ring"></span>';
    } else {
        panel.classList.add('open');
        btn.innerHTML = '<i class="bi bi-x-lg"></i>';
        setTimeout(() => document.getElementById('chatInputField').focus(), 300);
    }
}

function openChatDemo() {
    const panel = document.getElementById('chatPanel');
    const btn = document.getElementById('chatFabBtn');
    if (!panel.classList.contains('open')) {
        panel.classList.add('open');
        btn.innerHTML = '<i class="bi bi-x-lg"></i>';
    }
    const input = document.getElementById('chatInputField');
    input.value = 'Tell me about NexusConverse AI';
    sendPremiumChat();
    setTimeout(() => input.focus(), 200);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function sendPremiumChat() {
    const input = document.getElementById('chatInputField');
    const msg = input.value.trim();
    if (!msg) return;
    const messages = document.getElementById('chatMessages');
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.textContent = msg;
    messages.appendChild(userDiv);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-msg bot';
        botDiv.textContent = generatePremiumResponse(msg);
        messages.appendChild(botDiv);
        messages.scrollTop = messages.scrollHeight;
    }, 700 + Math.random() * 1000);
}

function generatePremiumResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes('price') || m.includes('cost') || m.includes('pricing') || m.includes('quote')) {
        return "Our engagements are tailored to each client's needs. Enterprise projects typically range from $50K to $2M+. I'd be happy to connect you with our solutions team for a detailed proposal. 📋";
    } else if (m.includes('cloud') || m.includes('aws') || m.includes('azure') || m.includes('migration')) {
        return "We've executed 200+ cloud migrations with zero downtime. Our multi-cloud expertise spans AWS, Azure, and GCP. Would you like to see a relevant case study? ☁️";
    } else if (m.includes('ai') || m.includes('machine learning') || m.includes('nexusconverse')) {
        return "NexusConverse AI is our flagship conversational platform — deployed across 40+ enterprise clients. It supports 50+ languages and integrates with all major CRMs. Shall I schedule a demo? 🤖";
    } else if (m.includes('security') || m.includes('cyber') || m.includes('soc')) {
        return "Our cybersecurity practice is ISO 27001 certified and we've helped 150+ clients achieve SOC 2, HIPAA, and GDPR compliance. Zero-trust is our standard. 🔒";
    } else if (m.includes('hello') || m.includes('hi') || m.includes('hey') || m.includes('help')) {
        return "Hello! I'm here to assist with any questions about NexusForge AI — services, case studies, pricing, or technical capabilities. What would you like to explore? ✨";
    } else {
        const replies = [
            "Excellent question. Our team of 280+ engineers has deep expertise in this area. Would you like me to connect you with a specialist? 💡",
            "We've delivered transformative results across 500+ engagements. I can share a relevant case study if you're interested. 📊",
            "That's exactly the kind of challenge we excel at solving. Let me arrange a consultation with our technical leadership team. 🎯",
            "Our approach combines strategic consulting with deep technical execution. Would you like to learn more about our methodology? 🚀"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }
}

// ============ CONTACT FORMS ============
const onboardingForm = document.getElementById('nexus-onboarding-form');

function showContactSuccess(message) {
    const chatMsgs = document.getElementById('chatMessages');
    if (chatMsgs) {
        const note = document.createElement('div');
        note.className = 'chat-msg bot';
        note.textContent = message;
        chatMsgs.appendChild(note);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }
}

if (onboardingForm) {
    const steps = onboardingForm.querySelectorAll('.step-container');
    const stepBadges = document.querySelectorAll('.step-badge');
    let currentStep = 0;

    const btnNext = onboardingForm.querySelectorAll('.btn-next');
    const btnPrev = onboardingForm.querySelectorAll('.btn-prev');

    function updateStepUI() {
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx === currentStep);
        });

        stepBadges.forEach((badge, idx) => {
            badge.classList.remove('active', 'completed');
            if (idx < currentStep) {
                badge.classList.add('completed');
                badge.innerHTML = '&#10003;';
            } else if (idx === currentStep) {
                badge.classList.add('active');
                badge.innerText = idx + 1;
            } else {
                badge.innerText = idx + 1;
            }
        });
    }

    function clearFieldInvalidState(field) {
        if (field.checkValidity()) {
            field.classList.remove('is-invalid');
        }
    }

    function validateStep(stepIndex) {
        const fields = steps[stepIndex].querySelectorAll('input[required], select[required], textarea[required]');
        let valid = true;
        fields.forEach(field => {
            if (!field.checkValidity()) {
                field.classList.add('is-invalid');
                valid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        return valid;
    }

    onboardingForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => clearFieldInvalidState(field));
        field.addEventListener('change', () => clearFieldInvalidState(field));
    });

    btnNext.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!validateStep(currentStep)) return;
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStepUI();
            }
        });
    });

    btnPrev.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepUI();
            }
        });
    });

    onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const formInner = document.getElementById('form-inner-wrapper');
        if (formInner) {
            formInner.innerHTML = `
                <div class="text-center py-5">
                    <div class="mb-4" style="font-size: 4rem; color: var(--teal);">&#10004;</div>
                    <h3 class="gradient-text mb-3">Onboarding Project Sent!</h3>
                    <p class="text-secondary px-md-4">
                        Thank you for submitting your technical requirements. An IT solutions architect from NexusForge AI will review your infrastructure parameters and follow up with a detailed proposal within 2 hours.
                    </p>
                    <a href="../index.html" class="btn btn-gradient mt-4">Return Home</a>
                </div>
            `;
        }

        showContactSuccess('📬 Thank you! Your onboarding brief has been received. Our team will respond within 2 business hours.');
    });

    updateStepUI();
} else {
    const legacyContactForm = document.getElementById('premiumContactForm');
    if (legacyContactForm) {
        legacyContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = legacyContactForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Inquiry Received';
            btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.disabled = false;
                legacyContactForm.reset();
                showContactSuccess('📬 Thank you! Your inquiry has been received. Our team will respond within 4 business hours.');
            }, 2800);
        });
    }
}

console.log('%c🏛️ NexusForge AI %cPremium Multi-Page Experience',
    'font-size:1.4rem;font-weight:bold;color:#c8a45c;',
    'font-size:1rem;color:#94a3b8;');
console.log('%cAI Chat widget ready — click the gold button ↘️', 'color:#2dd4bf;');

// ============ GO TO TOP BUTTON BEHAVIOR ============
const goTopBtn = document.getElementById('goTopBtn');
function updateGoTopVisibility() {
    const btn = document.getElementById('goTopBtn');
    if (!btn) return;
    const showAfter = 300; // px
    if (window.scrollY > showAfter) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
}

function scrollToTopSmooth() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => window.requestAnimationFrame(updateGoTopVisibility));
window.addEventListener('load', () => window.requestAnimationFrame(updateGoTopVisibility));

document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;
    if (target.closest && target.closest('#goTopBtn')) {
        e.preventDefault();
        scrollToTopSmooth();
    }
});

// keyboard accessibility
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Home' || (e.ctrlKey && e.key === 'ArrowUp')) && document.getElementById('goTopBtn')) {
        scrollToTopSmooth();
    }
});

