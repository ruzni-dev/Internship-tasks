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

/* Javascript details for NexusTech AI Solutions Website */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Navbar Effect
  const navbar = document.querySelector('.navbar-custom');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Count-up Stats Animation
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

  // 3. NexusCalc ROI / Cost Estimator Logic
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

    const teamSize = parseInt(calcTeamSize.value);
    const downtimeHours = parseInt(calcDowntime.value);
    const hourlyRate = parseInt(calcHourlyRate.value);

    // Update Slider text
    valTeamSize.innerText = teamSize;
    valDowntime.innerText = downtimeHours;
    valHourlyRate.innerText = hourlyRate;

    // Math:
    // Downtime cost = Team size * downtime hours * hourly salary rate
    // Plus lost revenue buffer (approx 1.5x salary loss)
    const monthlySalaryLoss = teamSize * downtimeHours * hourlyRate;
    const monthlyRevenueLoss = downtimeHours * (teamSize * 15); // estimation of system productivity loss
    const totalMonthlyLoss = monthlySalaryLoss + monthlyRevenueLoss;
    
    // NexusTech reduces downtime by 85%
    const expectedSavings = Math.round(totalMonthlyLoss * 0.85);
    const roiPercentage = 312; // Typical ROI for cloud-native automated ops

    // Format numbers
    outLoss.innerText = '$' + totalMonthlyLoss.toLocaleString();
    outSavings.innerText = '$' + expectedSavings.toLocaleString();
    outRoi.innerText = roiPercentage + '%';

    // Update efficiency progress index
    const efficiencyFactor = Math.min(100, Math.round((expectedSavings / 150000) * 100));
    progressBarFill.style.width = `${Math.max(15, efficiencyFactor)}%`;
  }

  if (calcTeamSize) {
    [calcTeamSize, calcDowntime, calcHourlyRate].forEach(input => {
      input.addEventListener('input', calculateITLosses);
    });
    // Run initial calculation
    calculateITLosses();
  }

  // 4. NexusBot AI Chatbot Simulation
  const botChatMessages = document.getElementById('bot-chat-messages');
  const botInputField = document.getElementById('bot-input-field');
  const botSendBtn = document.getElementById('bot-send-btn');
  const suggestionChips = document.querySelectorAll('.bot-suggestion-chip');

  const botResponses = {
    greetings: [
      "Hello! I am NexusBot, your IT solutions advisor. How can I help boost your company's digital infrastructure today?",
      "Hi there! Welcome to NexusTech AI. Looking for IT infrastructure support, custom AI integrations, or cybersecurity solutions?"
    ],
    downtime: "Downtime costs companies thousands hourly. NexusTech offers 24/7 Proactive Monitoring and Automated Failover systems to guarantee 99.99% system availability. Would you like to check out our Cyber Security solutions or setup a custom audit?",
    cloud: "We design and manage secure Cloud Migrations (AWS, Azure, Google Cloud) tailored to your workflow. We typically cut cloud hosting waste by 30% through automated resource sizing. Interested in getting a consultation?",
    security: "Cybersecurity is our priority. We offer zero-trust network access configurations, real-time threat detection, and comprehensive compliance certifications (SOC2, HIPAA). We protect over 250 enterprise businesses globally.",
    price: "Our services are custom-tailored to your company's scale. Typically, startups begin at $1,500/mo, and fully managed enterprise plans scale up from there. You can use our NexusCalc tool on the home page for a rough ROI savings estimate!",
    contact: "You can schedule a free consultation with our senior architects! Head over to the Contact page, fill out our onboarding questionnaire, or email us at support@nexustech-ai.com.",
    default: "Thank you for asking. NexusTech specializes in 24/7 Managed IT, Cloud Migrations, Cybersecurity audits, and Custom AI deployments. To proceed, we recommend scheduling a 15-minute call with our engineers. Type 'contact' for info!"
  };

  function addChatMessage(message, isUser = false) {
    if (!botChatMessages) return;

    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble');
    if (isUser) {
      bubble.classList.add('chat-bubble-user');
    } else {
      bubble.classList.add('chat-bubble-bot');
    }
    bubble.innerText = message;
    botChatMessages.appendChild(bubble);

    // Scroll to bottom
    botChatMessages.scrollTop = botChatMessages.scrollHeight;
  }

  function handleBotResponse(userMsg) {
    // Show typing simulation shortly
    const typing = document.createElement('div');
    typing.classList.add('chat-bubble', 'chat-bubble-bot', 'typing-indicator');
    typing.innerText = "...";
    botChatMessages.appendChild(typing);
    botChatMessages.scrollTop = botChatMessages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const msgLower = userMsg.toLowerCase();
      let response = botResponses.default;

      if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
        response = botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
      } else if (msgLower.includes('downtime') || msgLower.includes('slow') || msgLower.includes('crash')) {
        response = botResponses.downtime;
      } else if (msgLower.includes('cloud') || msgLower.includes('aws') || msgLower.includes('azure') || msgLower.includes('server')) {
        response = botResponses.cloud;
      } else if (msgLower.includes('security') || msgLower.includes('hack') || msgLower.includes('protect') || msgLower.includes('cyber')) {
        response = botResponses.security;
      } else if (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('how much') || msgLower.includes('quote')) {
        response = botResponses.price;
      } else if (msgLower.includes('contact') || msgLower.includes('call') || msgLower.includes('consultation') || msgLower.includes('email')) {
        response = botResponses.contact;
      }

      addChatMessage(response, false);
    }, 850);
  }

  function submitUserMessage() {
    if (!botInputField) return;
    const text = botInputField.value.trim();
    if (text === '') return;

    addChatMessage(text, true);
    botInputField.value = '';
    handleBotResponse(text);
  }

  if (botSendBtn && botInputField) {
    botSendBtn.addEventListener('click', submitUserMessage);
    botInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitUserMessage();
    });

    suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.innerText;
        addChatMessage(text, true);
        handleBotResponse(text);
      });
    });

    // Add initial bot greeting
    setTimeout(() => {
      addChatMessage(botResponses.greetings[0], false);
    }, 300);
  }

  // 5. Contact Form Onboarding Steps Logic
  const contactForm = document.getElementById('nexus-onboarding-form');
  if (contactForm) {
    const steps = contactForm.querySelectorAll('.step-container');
    const stepBadges = document.querySelectorAll('.step-badge');
    let currentStep = 0;

    const btnNext = contactForm.querySelectorAll('.btn-next');
    const btnPrev = contactForm.querySelectorAll('.btn-prev');

    function updateStepUI() {
      steps.forEach((step, idx) => {
        if (idx === currentStep) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });

      stepBadges.forEach((badge, idx) => {
        badge.classList.remove('active', 'completed');
        if (idx < currentStep) {
          badge.classList.add('completed');
          badge.innerHTML = '&#10003;'; // Checkmark
        } else if (idx === currentStep) {
          badge.classList.add('active');
          badge.innerText = idx + 1;
        } else {
          badge.innerText = idx + 1;
        }
      });
    }

    btnNext.forEach(btn => {
      btn.addEventListener('click', () => {
        // Simple validation of current step input
        const activeFields = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
        let valid = true;
        activeFields.forEach(field => {
          if (!field.value.trim()) {
            field.classList.add('is-invalid');
            valid = false;
          } else {
            field.classList.remove('is-invalid');
          }
        });

        if (valid) {
          if (currentStep < steps.length - 1) {
            currentStep++;
            updateStepUI();
          }
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

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Submit questionnaire final step
      const finalFields = steps[currentStep].querySelectorAll('input[required], textarea[required]');
      let valid = true;
      finalFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          valid = false;
        } else {
          field.classList.remove('is-invalid');
        }
      });

      if (valid) {
        // Show success state
        const formInner = document.getElementById('form-inner-wrapper');
        if (formInner) {
          formInner.innerHTML = `
            <div class="text-center py-5">
              <div class="mb-4" style="font-size: 4rem; color: var(--emerald);">&#10004;</div>
              <h3 class="gradient-text mb-3">Onboarding Project Sent!</h3>
              <p class="text-secondary px-md-4">
                Thank you for submitting your technical requirements. An IT solutions architect from NexusTech AI will review your infrastructure parameters and follow up with a detailed proposal within 2 hours.
              </p>
              <a href="index.html" class="btn btn-gradient mt-4">Return Home</a>
            </div>
          `;
        }
      }
    });

    // Initialize UI
    updateStepUI();
  }
});
