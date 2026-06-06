**Project Overview**
- **Name:** NexusForge AI — Premium IT Solutions & Intelligent Automation.
- **Type:** Static multi-page marketing site (HTML/CSS/JS).
- **Purpose:** Showcase services, AI products, portfolio case studies, and collect project intake via a multi-step onboarding form.

**Quick Preview (Local)**
- **Open locally:** Double-click `index.html` or serve the folder with a simple HTTP server:

```bash
python -m http.server 8000
# then visit http://localhost:8000/
```

**Primary Files & Structure**
- **Root pages:** `index.html`, `README.md`
- **Site pages:** `pages/about.html`, `pages/ai-solutions.html`, `pages/contact.html`, `pages/portfolio.html`, `pages/services.html`
- **Assets:** `assets/css/style.css`, `assets/js/script.js`, `assets/images/` (icons, favicons, visuals)

**Recent Changes (what I implemented / updated)**
- **Multi-step onboarding contact form** implemented in `pages/contact.html` (form id `nexus-onboarding-form`) with stepper UI and success flow.
- **Form validation & UX:** `assets/js/script.js` contains onboarding handlers (step navigation, `checkValidity()`-based validation, and live invalid-state cleanup).
- **Styles:** `assets/css/style.css` updated with stepper styles, premium form controls, pill-style radios/checkboxes, and mobile breakpoint fixes (stacking and spacing).
- **Content additions:** Hero/intro sections and feature blocks added to `pages/portfolio.html`, `pages/services.html`, `pages/about.html`, and `pages/ai-solutions.html` to match the site's premium hero pattern.
- **CTA / anchor fixes:** Fixed conflicting section IDs and button targets (e.g., portfolio case-studies link) to ensure in-page anchors work on mobile and desktop.

**How to Test Key Flows**
- **Contact onboarding:** Open [pages/contact.html](pages/contact.html) and step through the form: Step 1 (contact details) → Step 2 (technical environment choices) → Step 3 (requirements) → Submit. Expected: client-side validation highlights required fields, invalid states clear when fields are corrected, and submission shows a confirmation fragment.
- **Hero + CTA checks:** Open [pages/portfolio.html](pages/portfolio.html) and click "Browse Case Studies" — it should scroll to the case studies section. Check responsiveness under narrow viewports.
- **AI demo buttons:** On [pages/ai-solutions.html](pages/ai-solutions.html) the `Launch Demo` button triggers `openChatDemo()` (defined in `assets/js/script.js`).

**Developer Notes**
- JS hooks to review: `nexus-onboarding-form` handlers and functions in `assets/js/script.js` (step navigation, `validateStep`, `updateStepUI`, input `change` listeners that remove `is-invalid`).
- CSS classes of interest: `.step-indicator`, `.step-badge`, `.step-container`, `.form-control-premium`, `.btn-gradient`, `.btn-outline-custom`.
- Keep section IDs unique across pages (e.g., `#portfolio`, `#portfolio-case-studies`, `#contact`, `#contact-next-steps`) to avoid anchor collisions.

**Known / Suggested Next Steps**
- Manual cross-device QA (iOS Safari, Android Chrome) for the onboarding flow and hero layouts.
- Optionally wire the form submit to a backend endpoint or a serverless webhook for real intake processing.
- Run automated link checks across pages and confirm there are no duplicate IDs.

**Change Log (edited files)**
- pages/contact.html — replaced contact form with 3-step onboarding form, added stepper and next-steps section.
- assets/js/script.js — added onboarding form logic and validation helpers.
- assets/css/style.css — added stepper and contact UI styles and mobile breakpoint adjustments.
- pages/portfolio.html, pages/ai-solutions.html, pages/services.html, pages/about.html — added hero/intro and additional content blocks; fixed CTA anchor on portfolio.

**Contact / Next Actions**
- If you want, I can: run a local static server, open the site in a headless browser for screenshots, or commit these changes to Git with a suggested commit message.

----
Generated: May 25, 2026 — README produced from recent workspace state.
# 52-IT-Solutions-Website