import { Population } from './ai/population.js';
import { updateNNVisualizer } from './nnVisualizer.js';

let population;
let lastTime = 0;
let gameTemplate;

export function initAISimulation(templateGame) {
  gameTemplate = templateGame;
  population = new Population(gameTemplate);

  lastTime = performance.now();
  requestAnimationFrame(aiLoop);
}

function aiLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  population.update(deltaTime);

  renderSwarm(population);
  updateStatsOverlay(population);

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

  // Draw platforms
  ctx.fillStyle = '#555';
  pop.platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  // Draw agents
  pop.agents.forEach(agent => {
    if (!agent.alive) return;
    ctx.fillStyle = agent === pop.agents[0] ? 'green' : 'rgba(0, 150, 255, 0.4)';
    const p = agent.player;
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

function updateStatsOverlay(pop) {
  const stats = document.getElementById('aiStats');
  stats.innerHTML = `
        <strong>AI Simulation Mode</strong><br>
        Generation: ${pop.generation} <br>
        Best Fitness: ${pop.agents[0].score.toFixed(0)} <br>
        Landings: ${pop.agents[0].landingCount} <br>
        Alive Agents: ${pop.agents.filter(a => a.alive).length} / ${pop.agents.length}
    `;
}

