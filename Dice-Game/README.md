# 🎲 Dice Royale — Modern 3D Dice Battle

🔗 **Live Demo:** [ruzni-dev.github.io/Dice-Game](https://ruzni-dev.github.io/Dice-Game/)

Dice Royale is a premium, fully responsive, and interactive 3D Dice Game built from the ground up using pure HTML5, CSS3, and JavaScript. 

Originally a simple static dice page, this project has been elevated to a state-of-the-art gaming experience featuring real-time CSS 3D physics simulation, synthesized Web Audio sound effects, custom gameplay settings, and canvas particle celebrations.

---

## ✨ Features

- **🎮 Dynamic Game Modes**: Play with a friend in **1v1 Player vs Player** or challenge the computer in **Player vs CPU (AI)** mode.
- **🎲 3D CSS Physics Simulation**: Watch the dice shake and spin dynamically in 3D space. Advanced rotation algorithms ensure they always spin naturally and land on the exact rolled values.
- **🔊 Synthesized Web Audio Sound**: Enjoy procedurally synthesized dice rolling clicks and celebratory chord chimes using the browser's Web Audio API—no heavy static audio file downloads required.
- **🏆 Custom Match Targets**: Select target victory scores (First to 3, 5, or 10 wins) or practice indefinitely in Endless Mode.
- **📝 Customizable Player Names**: Click or double-click player names to personalize names on the fly.
- **📜 Live Match Log**: Scroll through previous rounds and inspect history details.
- **📱 Responsive Glassmorphic UI**: Tailored with beautiful glowing backdrops, dark-mode styling, and flexible grids designed to adapt to desktop, tablet, and mobile screens.
- **🎉 Confetti Celebrations**: Features a custom HTML5 Canvas particle confetti system to celebrate match wins.

---

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5 markup
- **Styling**: Vanilla CSS3 (featuring HSL variables, CSS 3D Transforms, custom animations, and Glassmorphism layouts)
- **Logic & Audio**: ES6+ JavaScript & Web Audio API
- **Visuals**: Embedded inline SVGs & pure CSS rendering (no external image assets needed)

---

## 🚀 Getting Started

Since Dice Royale is built using pure frontend technologies, it can be run directly in any modern web browser. 

### Running Locally

To avoid potential browser security restrictions when using the Web Audio API on `file://` protocols, it is recommended to run a lightweight local static server:

#### Option 1: Python (Recommended)
If you have Python installed, run this command in your project directory:
```bash
python -m http.server 8000
```
Then, open your browser and navigate to `http://localhost:8000`.

#### Option 2: Node.js (http-server)
If you have Node.js installed, you can serve the directory instantly:
```bash
npx http-server -p 8000
```
Then, open your browser and navigate to `http://localhost:8000`.

---

## 📂 Project Structure

```text
├── index.html          # Main HTML structure, layout viewport, and winner modal
├── README.md           # Documentation
└── assets/
    ├── css/
    │   └── style.css   # Neon dark-mode design system, 3D cube calculations, animations
    └── js/
        └── script.js   # Game logic, Web Audio synthesizer, canvas confetti system
```

---

## 🕹️ How to Play

1. **Configure Your Game**: Click the ⚙️ Settings icon in the top right to select your **Game Mode** (1v1 vs. CPU) and set your **Target Score**.
2. **Name Your Players**: Click on the player's name tag or the edit icon to edit player names.
3. **Roll the Dice**: Click the large **ROLL DICE** button at the center. The dice will start rolling. Player 1's die rolls first, followed quickly by Player 2 (or CPU).
4. **Win the Match**: Win rounds by rolling higher values. The first player to reach the Target Score wins the match, launching a victory banner and confetti.
5. **Reset & Restart**: Toggle sound on/off with the 🔊 icon, reset the current game state with the 🔄 icon, or click "PLAY AGAIN" in the victory modal.