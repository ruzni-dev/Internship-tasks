// ============ INIT AOS ============
        AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

        // ============ NAVBAR SCROLL ============
        const navbar = document.getElementById('mainNav');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
            updateActiveNav();
        });

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

        // ============ SMOOTH SCROLL ============
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                    const collapse = document.getElementById('navContent');
                    if (collapse.classList.contains('show')) collapse.classList.remove('show');
                }
            });
        });

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

        // ============ CONTACT FORM ============
        const form = document.getElementById('premiumContactForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Inquiry Received';
            btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
                // Notify via chat
                const chatMsgs = document.getElementById('chatMessages');
                const note = document.createElement('div');
                note.className = 'chat-msg bot';
                note.textContent = '📬 Thank you! Your inquiry has been received. Our team will respond within 4 business hours.';
                chatMsgs.appendChild(note);
                chatMsgs.scrollTop = chatMsgs.scrollHeight;
            }, 2800);
        });

        console.log('%c🏛️ NexusForge AI %cPremium Multi-Page Experience',
            'font-size:1.4rem;font-weight:bold;color:#c8a45c;',
            'font-size:1rem;color:#94a3b8;');
        console.log('%cAI Chat widget ready — click the gold button ↘️', 'color:#2dd4bf;');

        // ============ HERO COUNTERS ============
        const counterNodes = document.querySelectorAll('.counter-val');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target') || '0', 10);
                const duration = 1600;
                const start = performance.now();
                const initial = 0;

                function animate(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const value = Math.floor(initial + (target - initial) * progress);
                    el.textContent = value.toString();
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }

                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.6 });

        counterNodes.forEach(node => counterObserver.observe(node));

        // ============ ROI CALCULATOR ============
        const teamSize = document.getElementById('calc-team-size');
        const downtime = document.getElementById('calc-downtime');
        const hourlyRate = document.getElementById('calc-hourly-rate');
        const outLoss = document.getElementById('out-loss');
        const outSavings = document.getElementById('out-savings');
        const outRoi = document.getElementById('out-roi');
        const progressFill = document.getElementById('calc-progress-fill');
        const valTeamSize = document.getElementById('val-team-size');
        const valDowntime = document.getElementById('val-downtime');
        const valHourlyRate = document.getElementById('val-hourly-rate');

        function formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(value);
        }

        function updateCalculator() {
            if (!teamSize || !downtime || !hourlyRate) return;
            const team = Number(teamSize.value);
            const hours = Number(downtime.value);
            const rate = Number(hourlyRate.value);
            const loss = team * hours * rate;
            const savings = Math.round(loss * 0.65);
            const roi = Math.max(Math.round((savings / Math.max(loss, 1)) * 1000), 100);
            const efficiency = Math.min(Math.round((savings / Math.max(loss, 1)) * 100), 100);

            if (valTeamSize) valTeamSize.textContent = team.toString();
            if (valDowntime) valDowntime.textContent = hours.toString();
            if (valHourlyRate) valHourlyRate.textContent = rate.toString();
            if (outLoss) outLoss.textContent = formatCurrency(loss);
            if (outSavings) outSavings.textContent = formatCurrency(savings);
            if (outRoi) outRoi.textContent = `${roi}%`;
            if (progressFill) progressFill.style.width = `${efficiency}%`;
        }

        [teamSize, downtime, hourlyRate].forEach(input => {
            if (!input) return;
            input.addEventListener('input', updateCalculator);
        });

        updateCalculator();