import { Population } from './ai/population.js';
import { updateNNVisualizer } from './nnVisualizer.js';

let population;
let lastTime = 0;
let gameTemplate;
let simSpeed = 1; // 1x normal, fast-forward set by settings
let fastForwardActive = false;

export function initAISimulation(templateGame) {
  gameTemplate = templateGame;
  population = new Population(gameTemplate);

  lastTime = performance.now();
  window.addEventListener('keydown', handleFastForwardToggle);
  requestAnimationFrame(aiLoop);
}

function handleFastForwardToggle(e) {
  if (e.code === 'KeyF') {
    fastForwardActive = !fastForwardActive;
    simSpeed = fastForwardActive ? (window.fastForwardSpeed || 5) : 1;
  }
}

function aiLoop(timestamp) {
  let deltaTime = ((timestamp - lastTime) / 1000) * simSpeed;
  lastTime = timestamp;

  // AI decisions: ONCE per frame
  population.thinkAll();

  // Sub-step physics to avoid tunneling at high simSpeed
  const maxStep = 1 / 60; // 60 FPS
  while (deltaTime > 0) {
    const step = Math.min(deltaTime, maxStep);
    population.update(step);
    deltaTime -= step;
  }

  renderSwarm(population);

  // --- Neural Network Visualization (Best Agent) ---
  const bestAgent = population.agents.find(a => a.alive) || population.agents[0];
  if (bestAgent.lastInputs && bestAgent.lastOutputs) {
    updateNNVisualizer(bestAgent.genome, bestAgent.lastInputs, bestAgent.lastOutputs);
  }

  requestAnimationFrame(aiLoop);
}

function renderSwarm(pop) {
  const ctx = gameTemplate.ctx;
  ctx.clearRect(0, 0, gameTemplate.width, gameTemplate.height);

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, gameTemplate.height);
  gradient.addColorStop(0, '#aeefff');   // Light blue sky
  gradient.addColorStop(1, '#ffffff');   // Soft white ground
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, gameTemplate.width, gameTemplate.height);

  // Draw platforms
  ctx.fillStyle = '#555';
  pop.platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  // Find the best agent (first alive, or fallback to first)
  const bestAgent = pop.agents.find(a => a.alive) || pop.agents[0];
  if (bestAgent && bestAgent.player) {
    const p = bestAgent.player;
    drawIndicatorArrow(ctx, p.x + p.width / 2, p.y - 10, p.width);
  }

  // Draw agents
  pop.agents.forEach(agent => {
    if (!agent.alive) return;
    ctx.fillStyle = agent === bestAgent ? 'green' : 'rgba(0, 150, 255, 0.4)';
    const p = agent.player;
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });

  // Draw AI stats/info overlay on canvas
  drawAIStatsOverlay(ctx, pop, bestAgent);
}

function drawAIStatsOverlay(ctx, pop, bestAgent) {
  const padding = 18;
  const lineHeight = 28;
  const boxWidth = 290;
  const boxHeight = 5 * lineHeight + 38;
  const x = 18;
  const y = 18;

  // Draw semi-transparent background box
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#b2e0f7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, boxWidth, boxHeight, 14);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();

  // Draw text
  ctx.fillStyle = '#222';
  ctx.font = 'bold 1.15rem Segoe UI, Arial, sans-serif';
  ctx.fillText('AI Simulation Mode', x + padding, y + lineHeight);
  ctx.font = '1rem Segoe UI, Arial, sans-serif';
  ctx.fillText(`Generation: ${pop.generation}`, x + padding, y + 2 * lineHeight);
  ctx.fillText(`Best Fitness: ${bestAgent.score.toFixed(0)}`, x + padding, y + 3 * lineHeight);
  ctx.fillText(`Landings: ${bestAgent.landingCount}`, x + padding, y + 4 * lineHeight);
  ctx.fillText(`Alive Agents: ${pop.agents.filter(a => a.alive).length} / ${pop.agents.length}`, x + padding, y + 5 * lineHeight);
  ctx.font = '0.95rem Segoe UI, Arial, sans-serif';
  ctx.fillStyle = fastForwardActive ? '#ff9800' : '#666';
  ctx.fillText(fastForwardActive ? 'FAST FORWARD (F)' : 'Press F to toggle Fast-Forward', x + padding, y + boxHeight - 18);
  ctx.restore();
}

// Draw a downward-pointing triangle arrow above the agent
function drawIndicatorArrow(ctx, centerX, topY, width) {
  const arrowWidth = Math.max(18, width * 0.7);
  const arrowHeight = 16;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX - arrowWidth / 2, topY - arrowHeight);
  ctx.lineTo(centerX + arrowWidth / 2, topY - arrowHeight);
  ctx.lineTo(centerX, topY);
  ctx.closePath();
  ctx.fillStyle = '#ff9800'; // Orange arrow
  ctx.shadowColor = 'rgba(255, 152, 0, 0.5)';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

