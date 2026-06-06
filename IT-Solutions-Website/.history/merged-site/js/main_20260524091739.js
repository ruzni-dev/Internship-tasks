// Merged site main JS: AOS init, navbar scroll, active nav, chat widget, contact form
document.addEventListener('DOMContentLoaded', function() {
    if (window.AOS) AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

    // Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
            updateActiveNav();
        });
    }

    // Active nav based on current page
    function updateActiveNav() {
        const navLinks = document.querySelectorAll('.nav-link');
        const path = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (!href) return;
            if (href === path || (href === 'index.html' && path === '')) link.classList.add('active');
            // anchors on same page
            if (href.includes('#') && path === href.split('#')[0]) link.classList.add('active');
        });
    }
    updateActiveNav();

    // Smooth scroll only for same-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Chat widget
    window.toggleChatPanel = function() {
        const panel = document.getElementById('chatPanel');
        const btn = document.getElementById('chatFabBtn');
        if (!panel || !btn) return;
        const isOpen = panel.classList.contains('open');
        if (isOpen) {
            panel.classList.remove('open');
            btn.innerHTML = '<i class="bi bi-robot"></i><span class="pulse-ring"></span>';
        } else {
            panel.classList.add('open');
            btn.innerHTML = '<i class="bi bi-x-lg"></i>';
            setTimeout(() => document.getElementById('chatInputField')?.focus(), 300);
        }
    };

    window.openChatDemo = function() {
        const panel = document.getElementById('chatPanel');
        const btn = document.getElementById('chatFabBtn');
        if (!panel || !btn) return;
        if (!panel.classList.contains('open')) {
            panel.classList.add('open');
            btn.innerHTML = '<i class="bi bi-x-lg"></i>';
        }
        const input = document.getElementById('chatInputField');
        if (input) {
            input.value = 'Tell me about NexusConverse AI';
            sendPremiumChat();
            setTimeout(() => input.focus(), 200);
        }
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    window.sendPremiumChat = function() {
        const input = document.getElementById('chatInputField');
        if (!input) return;
        const msg = input.value.trim(); if (!msg) return;
        const messages = document.getElementById('chatMessages');
        const userDiv = document.createElement('div'); userDiv.className = 'chat-msg user'; userDiv.textContent = msg; messages.appendChild(userDiv);
        input.value = ''; messages.scrollTop = messages.scrollHeight;
        setTimeout(() => {
            const botDiv = document.createElement('div'); botDiv.className = 'chat-msg bot'; botDiv.textContent = generatePremiumResponse(msg); messages.appendChild(botDiv); messages.scrollTop = messages.scrollHeight;
        }, 700 + Math.random()*1000);
    };

    function generatePremiumResponse(msg) {
        const m = msg.toLowerCase();
        if (m.includes('price')||m.includes('cost')||m.includes('pricing')) return "Our engagements are tailored; enterprise projects range widely. Contact us for a proposal.";
        if (m.includes('cloud')||m.includes('aws')||m.includes('azure')) return "We handle multi-cloud migrations with minimal downtime — ask for a case study.";
        if (m.includes('ai')||m.includes('machine learning')) return "NexusConverse is our conversational AI platform — we can schedule a demo.";
        if (m.includes('security')||m.includes('cyber')) return "Our cybersecurity practice is ISO 27001 aligned and delivers compliance support.";
        return "Thanks — a NexusForge specialist will follow up to help with details.";
    }

    // Contact form demo behavior
    const form = document.getElementById('premiumContactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            if (!btn) return;
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Inquiry Received';
            btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)'; btn.disabled = true;
            setTimeout(()=>{ btn.innerHTML = orig; btn.style.background=''; btn.disabled=false; form.reset(); const chatMsgs = document.getElementById('chatMessages'); if(chatMsgs){ const note=document.createElement('div'); note.className='chat-msg bot'; note.textContent='📬 Thank you! Your inquiry has been received.'; chatMsgs.appendChild(note); chatMsgs.scrollTop = chatMsgs.scrollHeight;} }, 2200);
        });
    }
    console.log('Merged site JS loaded');
});
