import { startGameLoop } from './gameLoop.js';
import { initAISimulation } from './aiSimulator.js';
import { setupInput } from './input.js';
import { initPlatforms } from './platform.js';
import { GA_CONFIG } from './ai/gaConfig.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = {
  canvas,
  ctx,
  width: canvas.width,
  height: canvas.height,
  lastTime: 0,
  platforms: []
};

initPlatforms(game);

const MODE = 'AI';  // Change to 'MANUAL' to play yourself

let aiSimCleanup = null;

if (MODE === 'MANUAL') {
  setupInput();
  startGameLoop(game);
} else if (MODE === 'AI') {
  aiSimCleanup = startAISim();
}

// --- Settings Panel Logic ---
const settingsPanel = document.getElementById('settings-panel');
const settingsToggle = document.getElementById('settings-toggle');
const hidden1 = document.getElementById('hidden1');
const hidden2 = document.getElementById('hidden2');
const hidden3 = document.getElementById('hidden3');
const hidden1Val = document.getElementById('hidden1Value');
const hidden2Val = document.getElementById('hidden2Value');
const hidden3Val = document.getElementById('hidden3Value');
const applyBtn = document.getElementById('applySettings');
const ffSpeed = document.getElementById('ffSpeed');
const ffSpeedVal = document.getElementById('ffSpeedValue');
const resetBtn = document.getElementById('resetGenome');
let fastForwardSpeed = parseInt(ffSpeed.value);

// New genome/GA sliders
const mutationRate = document.getElementById('mutationRate');
const mutationRateVal = document.getElementById('mutationRateValue');
const mutationStrength = document.getElementById('mutationStrength');
const mutationStrengthVal = document.getElementById('mutationStrengthValue');
const weightRange = document.getElementById('weightRange');
const weightRangeVal = document.getElementById('weightRangeValue');

// Square Count slider
const squareCount = document.getElementById('squareCount');
const squareCountVal = document.getElementById('squareCountValue');

settingsToggle.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');
});

function updateHiddenVals() {
  hidden1Val.textContent = hidden1.value;
  hidden2Val.textContent = hidden2.value;
  hidden3Val.textContent = hidden3.value;
}
function updateGAParamVals() {
  mutationRateVal.textContent = mutationRate.value;
  mutationStrengthVal.textContent = mutationStrength.value;
  weightRangeVal.textContent = weightRange.value;
  squareCountVal.textContent = squareCount.value;
}
hidden1.addEventListener('input', updateHiddenVals);
hidden2.addEventListener('input', updateHiddenVals);
hidden3.addEventListener('input', updateHiddenVals);
mutationRate.addEventListener('input', updateGAParamVals);
mutationStrength.addEventListener('input', updateGAParamVals);
weightRange.addEventListener('input', updateGAParamVals);
squareCount.addEventListener('input', updateGAParamVals);

ffSpeed.addEventListener('input', () => {
  ffSpeedVal.textContent = ffSpeed.value;
  fastForwardSpeed = parseInt(ffSpeed.value);
});

applyBtn.addEventListener('click', () => {
  // Build hiddenLayers array (ignore 0-sized layers)
  const layers = [parseInt(hidden1.value), parseInt(hidden2.value), parseInt(hidden3.value)].filter(n => n > 0);
  GA_CONFIG.hiddenLayers = layers.length ? layers : [6]; // fallback to [6] if all zero

  // Update genome/GA params
  GA_CONFIG.mutationRate = parseFloat(mutationRate.value);
  GA_CONFIG.mutationStrength = parseFloat(mutationStrength.value);
  GA_CONFIG.weightRange = parseFloat(weightRange.value);
  GA_CONFIG.populationSize = parseInt(squareCount.value);

  // Update fast forward speed
  fastForwardSpeed = parseInt(ffSpeed.value);

  // Restart AI simulation
  if (typeof aiSimCleanup === 'function') aiSimCleanup();
  aiSimCleanup = startAISim();
  settingsPanel.classList.add('hidden');
});

resetBtn.addEventListener('click', () => {
  // Reset hidden layers to current settings
  const layers = [parseInt(hidden1.value), parseInt(hidden2.value), parseInt(hidden3.value)].filter(n => n > 0);
  GA_CONFIG.hiddenLayers = layers.length ? layers : [6];
  // Reset genome/GA params
  GA_CONFIG.mutationRate = parseFloat(mutationRate.value);
  GA_CONFIG.mutationStrength = parseFloat(mutationStrength.value);
  GA_CONFIG.weightRange = parseFloat(weightRange.value);
  GA_CONFIG.populationSize = parseInt(squareCount.value);
  // Reset fast forward speed
  fastForwardSpeed = parseInt(ffSpeed.value);
  // Restart AI simulation with new random genomes
  if (typeof aiSimCleanup === 'function') aiSimCleanup();
  window.forceRandomPopulation = true;
  aiSimCleanup = startAISim();
  settingsPanel.classList.add('hidden');
  setTimeout(() => { window.forceRandomPopulation = false; }, 100); // Only for one restart
});

function startAISim() {
  // Re-import and re-init platforms for a clean start
  initPlatforms(game);
  // Start new simulation
  initAISimulation(game);
  // Return a cleanup function (if needed in future)
  return () => {};
}

// Initialize values on load
updateHiddenVals();
updateGAParamVals();

// --- Overlay Button Logic ---
const fastForwardBtn = document.getElementById('fastForwardBtn');
const resetGenomeBtn = document.getElementById('resetGenomeBtn');

if (fastForwardBtn) {
  fastForwardBtn.addEventListener('click', () => {
    // Simulate pressing the 'F' key to toggle fast forward
    const event = new KeyboardEvent('keydown', { code: 'KeyF' });
    window.dispatchEvent(event);
  });
}

if (resetGenomeBtn) {
  resetGenomeBtn.addEventListener('click', () => {
    // Call the same logic as the settings panel reset button
    if (typeof resetBtn?.onclick === 'function') {
      resetBtn.onclick();
    } else {
      resetBtn.click();
    }
  });
}

