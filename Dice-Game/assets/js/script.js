// ----------------------------------------------------
// GAME STATE MANAGEMENT
// ----------------------------------------------------
const gameState = {
  scores: { p1: 0, p2: 0 },
  names: { p1: 'Player 1', p2: 'Player 2' },
  targetScore: 5,
  mode: '1v1', // '1v1' or 'vs-cpu'
  soundEnabled: true,
  roundNumber: 0,
  isRolling: false,
  rollCount: 0,
  prevP2Name: 'Player 2'
};

// 3D Dice face rotation vectors (target rotations to bring face forward)
const faceRotations = {
  1: { x: 0, y: 0 },
  6: { x: 0, y: 180 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  2: { x: -90, y: 0 },
  5: { x: 90, y: 0 }
};

// ----------------------------------------------------
// DOM ELEMENTS
// ----------------------------------------------------
const p1NameEl = document.getElementById('p1-name');
const p2NameEl = document.getElementById('p2-name');
const p1ScoreEl = document.getElementById('p1-score-bubble');
const p2ScoreEl = document.getElementById('p2-score-bubble');
const p1ResultVal = document.getElementById('p1-result-val');
const p2ResultVal = document.getElementById('p2-result-val');
const statusBanner = document.getElementById('status-banner');
const rollBtn = document.getElementById('roll-btn');
const resetBtn = document.getElementById('reset-btn');
const soundBtn = document.getElementById('sound-btn');
const soundOnIcon = document.getElementById('sound-on-icon');
const soundOffIcon = document.getElementById('sound-off-icon');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const modeSelect = document.getElementById('mode-select');
const targetScoreSelect = document.getElementById('target-score');
const targetScoreDisplay = document.getElementById('target-score-display');
const historyToggle = document.getElementById('history-toggle');
const historyLog = document.getElementById('history-log');
const winnerModal = document.getElementById('winner-modal');
const modalWinnerTitle = document.getElementById('modal-winner-title');
const modalWinnerDetail = document.getElementById('modal-winner-detail');
const modalRestartBtn = document.getElementById('modal-restart-btn');

const diceCube1 = document.getElementById('dice-cube-1');
const diceCube2 = document.getElementById('dice-cube-2');
const diceStage1 = diceCube1.parentElement;
const diceStage2 = diceCube2.parentElement;

const p1Card = document.getElementById('player1-card');
const p2Card = document.getElementById('player2-card');

// ----------------------------------------------------
// AUDIO SYNTHESIZER ENGINE (Web Audio API)
// ----------------------------------------------------
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Generate a quick organic click sound
function playClickSound(time, pitchScale = 1.0) {
  if (!gameState.soundEnabled || !audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime((400 + Math.random() * 200) * pitchScale, time);
  osc.frequency.exponentialRampToValueAtTime(60 * pitchScale, time + 0.05);
  
  gain.gain.setValueAtTime(0.12, time);
  gain.gain.exponentialRampToValueAtTime(0.005, time + 0.05);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(time);
  osc.stop(time + 0.06);
}

// Play a full rattling roll audio sequence
function playRollAudio(delay = 0, pitchScale = 1.0) {
  initAudio();
  if (!gameState.soundEnabled) return;
  
  const now = audioCtx.currentTime + delay;
  const numClicks = 6 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numClicks; i++) {
    const clickTime = now + (i * 0.08) + (Math.random() * 0.03);
    playClickSound(clickTime, pitchScale);
  }
}

// Synthesize a major chord chime for victors
function playVictoryAudio() {
  initAudio();
  if (!gameState.soundEnabled || !audioCtx) return;
  
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.1);
    
    gain.gain.setValueAtTime(0.08, now + index * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.4);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now + index * 0.1);
    osc.stop(now + index * 0.1 + 0.5);
  });
}

// Synthesize a neutral/minor sound for draws
function playDrawAudio() {
  initAudio();
  if (!gameState.soundEnabled || !audioCtx) return;
  
  const now = audioCtx.currentTime;
  const notes = [293.66, 293.66]; // D4 chime
  
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.08);
    
    gain.gain.setValueAtTime(0.08, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.4);
  });
}

// ----------------------------------------------------
// CANVAS CONFETTI ENGINE
// ----------------------------------------------------
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];
let confettiIntervalId = null;

function resizeConfettiCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -50 - 20;
    this.size = Math.random() * 8 + 6;
    this.color = `hsl(${Math.random() * 360}, 85%, 55%)`;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 + 4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 6 - 3;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function startConfetti() {
  stopConfetti();
  confettiParticles = [];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push(new ConfettiParticle());
  }
  animateConfetti();
}

function stopConfetti() {
  if (confettiIntervalId) {
    cancelAnimationFrame(confettiIntervalId);
    confettiIntervalId = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let active = 0;
  confettiParticles.forEach(p => {
    p.update();
    p.draw();
    if (p.y < canvas.height) {
      active++;
    }
  });
  if (active > 0) {
    confettiIntervalId = requestAnimationFrame(animateConfetti);
  }
}

// ----------------------------------------------------
// DICE GAME PHYSICS & MECHANICS
// ----------------------------------------------------
function rollDice() {
  if (gameState.isRolling) return;
  gameState.isRolling = true;
  gameState.rollCount++;
  
  // Clean active UI highlights
  p1Card.classList.remove('active-turn', 'winner-pulse');
  p2Card.classList.remove('active-turn', 'winner-pulse');
  
  // Disable interface
  rollBtn.disabled = true;
  statusBanner.textContent = 'Rolling the dice...';
  statusBanner.className = 'status-banner';
  
  p1ResultVal.textContent = '...';
  p2ResultVal.textContent = '...';
  
  // Generate random outcomes
  const p1Roll = Math.floor(Math.random() * 6) + 1;
  const p2Roll = Math.floor(Math.random() * 6) + 1;
  
  // Compute spin coordinates using rollCount to force forward spinning
  const spinFactor = 3; // Number of full revolutions
  
  const p1X = faceRotations[p1Roll].x + (gameState.rollCount * 360 * spinFactor);
  const p1Y = faceRotations[p1Roll].y + (gameState.rollCount * 360 * spinFactor);
  const p1Z = gameState.rollCount * 360 * 2;
  
  // Slight delay for P2 to make it feel natural
  const p2DelayMs = 150;
  const p2X = faceRotations[p2Roll].x + (gameState.rollCount * 360 * (spinFactor + 1)); // Add extra spin loops
  const p2Y = faceRotations[p2Roll].y + (gameState.rollCount * 360 * (spinFactor - 1));
  const p2Z = gameState.rollCount * 360 * 3;

  // Apply visual shaking physics
  diceStage1.classList.add('rolling');
  diceCube1.classList.add('shaking');
  
  setTimeout(() => {
    diceStage2.classList.add('rolling');
    diceCube2.classList.add('shaking');
  }, p2DelayMs);
  
  // Play sound synthesis
  playRollAudio(0, 1.05); // Player 1 higher pitch
  setTimeout(() => {
    playRollAudio(0, 0.95); // Player 2 lower pitch
  }, p2DelayMs);

  // Transition the 3D transforms
  setTimeout(() => {
    diceCube1.classList.remove('shaking');
    diceCube1.style.transform = `rotateX(${p1X}deg) rotateY(${p1Y}deg) rotateZ(${p1Z}deg)`;
  }, 400);

  setTimeout(() => {
    diceCube2.classList.remove('shaking');
    diceCube2.style.transform = `rotateX(${p2X}deg) rotateY(${p2Y}deg) rotateZ(${p2Z}deg)`;
  }, 400 + p2DelayMs);

  // Wait for 3D physics settle transition (1.6 seconds total)
  setTimeout(() => {
    diceStage1.classList.remove('rolling');
    diceStage2.classList.remove('rolling');
    resolveRound(p1Roll, p2Roll);
  }, 1800);
}

function resolveRound(p1Roll, p2Roll) {
  gameState.roundNumber++;
  
  p1ResultVal.textContent = p1Roll;
  p2ResultVal.textContent = p2Roll;
  
  let outcomeText = '';
  let outcomeClass = '';
  let roundWinner = '';
  
  if (p1Roll > p2Roll) {
    gameState.scores.p1++;
    roundWinner = 'p1';
    outcomeText = `${gameState.names.p1} Wins the Round!`;
    outcomeClass = 'win1';
    p1Card.classList.add('active-turn');
    p1ScoreEl.textContent = gameState.scores.p1;
    // Animate score increment
    p1ScoreEl.style.transform = 'scale(1.3)';
    setTimeout(() => p1ScoreEl.style.transform = 'scale(1)', 400);
    playVictoryAudio();
  } else if (p2Roll > p1Roll) {
    gameState.scores.p2++;
    roundWinner = 'p2';
    outcomeText = `${gameState.names.p2} Wins the Round!`;
    outcomeClass = 'win2';
    p2Card.classList.add('active-turn');
    p2ScoreEl.textContent = gameState.scores.p2;
    // Animate score increment
    p2ScoreEl.style.transform = 'scale(1.3)';
    setTimeout(() => p2ScoreEl.style.transform = 'scale(1)', 400);
    playVictoryAudio();
  } else {
    roundWinner = 'draw';
    outcomeText = "It's a Draw!";
    outcomeClass = 'draw';
    playDrawAudio();
  }
  
  // Update status banner
  statusBanner.textContent = outcomeText;
  statusBanner.className = 'status-banner win-gradient';
  
  // Log inside history panel
  addHistoryLog(gameState.roundNumber, p1Roll, p2Roll, roundWinner);
  
  // Check Match Victory
  if (gameState.scores.p1 >= gameState.targetScore) {
    endMatch(gameState.names.p1, 'p1');
  } else if (gameState.scores.p2 >= gameState.targetScore) {
    endMatch(gameState.names.p2, 'p2');
  } else {
    // Unlock interface
    rollBtn.disabled = false;
    gameState.isRolling = false;
  }
}

function addHistoryLog(round, r1, r2, winner) {
  // Clear empty placeholder
  const empty = historyLog.querySelector('.empty-history');
  if (empty) empty.remove();
  
  const item = document.createElement('div');
  item.className = 'history-item';
  
  let outcomeHTML = '';
  if (winner === 'p1') {
    outcomeHTML = `<span class="history-outcome win1">${gameState.names.p1} won</span>`;
  } else if (winner === 'p2') {
    outcomeHTML = `<span class="history-outcome win2">${gameState.names.p2} won</span>`;
  } else {
    outcomeHTML = `<span class="history-outcome draw">Draw</span>`;
  }
  
  item.innerHTML = `
    <span class="history-round">Round ${round}</span>
    <div class="history-dice-summary">
      <span>${gameState.names.p1} (<span class="history-dice-val p1-color">${r1}</span>)</span>
      <span>vs</span>
      <span>${gameState.names.p2} (<span class="history-dice-val p2-color">${r2}</span>)</span>
    </div>
    ${outcomeHTML}
  `;
  
  historyLog.prepend(item);
}

function endMatch(winnerName, winnerId) {
  modalWinnerTitle.textContent = `${winnerName.toUpperCase()} WINS!`;
  modalWinnerTitle.className = winnerId === 'p1' ? 'p1-color' : 'p2-color';
  modalWinnerDetail.textContent = `Victory achieved in ${gameState.roundNumber} rounds with ${gameState.scores[winnerId]} wins.`;
  
  // Highlight winner card
  const winnerCard = winnerId === 'p1' ? p1Card : p2Card;
  winnerCard.classList.add('winner-pulse');
  
  // Open Modal & Launch Confetti
  setTimeout(() => {
    winnerModal.classList.remove('hidden');
    startConfetti();
  }, 600);
}

function resetGame(fullReset = false) {
  stopConfetti();
  winnerModal.classList.add('hidden');
  
  gameState.scores.p1 = 0;
  gameState.scores.p2 = 0;
  gameState.roundNumber = 0;
  gameState.isRolling = false;
  
  p1ScoreEl.textContent = '0';
  p2ScoreEl.textContent = '0';
  
  p1ResultVal.textContent = '-';
  p2ResultVal.textContent = '-';
  
  p1Card.classList.remove('active-turn', 'winner-pulse');
  p2Card.classList.remove('active-turn', 'winner-pulse');
  
  statusBanner.textContent = 'Game reset. Press roll to start!';
  statusBanner.className = 'status-banner';
  
  rollBtn.disabled = false;
  
  // Clear history log
  historyLog.innerHTML = '<div class="empty-history">No rounds rolled yet. Start playing!</div>';
  
  // Default dice rotations to original Front face
  diceCube1.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
  diceCube2.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
  
  if (fullReset) {
    gameState.rollCount = 0;
  }
}

// ----------------------------------------------------
// UI INTERACTION LISTENERS
// ----------------------------------------------------

// Roll trigger
rollBtn.addEventListener('click', () => {
  initAudio();
  rollDice();
});

// Sound Toggle
soundBtn.addEventListener('click', () => {
  gameState.soundEnabled = !gameState.soundEnabled;
  if (gameState.soundEnabled) {
    soundOnIcon.classList.remove('hidden');
    soundOffIcon.classList.add('hidden');
    initAudio();
    // Play quick audio chime as feedback
    playClickSound(audioCtx.currentTime, 1.2);
  } else {
    soundOnIcon.classList.add('hidden');
    soundOffIcon.classList.remove('hidden');
  }
});

// Reset Button
resetBtn.addEventListener('click', () => {
  resetGame(true);
});

// Restart Modal Button
modalRestartBtn.addEventListener('click', () => {
  resetGame(true);
});

// Settings Toggle Panel
settingsBtn.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');
  settingsBtn.classList.toggle('active-btn');
});

// Mode Selector
modeSelect.addEventListener('change', (e) => {
  gameState.mode = e.target.value;
  
  const p2EditBtn = p2Card.querySelector('.edit-name-btn');
  
  if (gameState.mode === 'vs-cpu') {
    // Save current Player 2 name and lock to CPU
    gameState.prevP2Name = gameState.names.p2;
    gameState.names.p2 = 'CPU (AI)';
    p2NameEl.textContent = 'CPU (AI)';
    p2NameEl.contentEditable = 'false';
    p2EditBtn.style.display = 'none';
  } else {
    // Restore Player 2 name and unlock
    gameState.names.p2 = gameState.prevP2Name === 'CPU (AI)' ? 'Player 2' : gameState.prevP2Name;
    p2NameEl.textContent = gameState.names.p2;
    p2NameEl.contentEditable = 'true';
    p2EditBtn.style.display = '';
  }
  
  resetGame();
});

// Target Score selector
targetScoreSelect.addEventListener('change', (e) => {
  const score = parseInt(e.target.value);
  gameState.targetScore = score;
  targetScoreDisplay.textContent = score === 999 ? 'Endless Mode' : `First to ${score}`;
  resetGame();
});

// History Collapsible Toggle
historyToggle.addEventListener('click', () => {
  historyLog.classList.toggle('hidden');
  historyToggle.classList.toggle('open');
});

// Name Customization Editors
function setupNameEditor(nameEl, playerKey) {
  const editBtn = nameEl.nextElementSibling;
  
  // Double-click name
  nameEl.addEventListener('dblclick', () => {
    if (nameEl.contentEditable === 'true') {
      nameEl.focus();
      selectText(nameEl);
    }
  });
  
  // Edit button click
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      if (nameEl.contentEditable === 'true') {
        nameEl.focus();
        selectText(nameEl);
      }
    });
  }
  
  nameEl.addEventListener('blur', () => {
    saveName(nameEl, playerKey);
  });
  
  nameEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nameEl.blur();
    }
  });
}

function selectText(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function saveName(el, playerKey) {
  let newName = el.textContent.trim();
  if (newName === '') {
    newName = playerKey === 'p1' ? 'Player 1' : 'Player 2';
  }
  
  // Cap name length to prevent layout breaks
  if (newName.length > 14) {
    newName = newName.substring(0, 14);
  }
  
  gameState.names[playerKey] = newName;
  el.textContent = newName;
}

setupNameEditor(p1NameEl, 'p1');
setupNameEditor(p2NameEl, 'p2');
