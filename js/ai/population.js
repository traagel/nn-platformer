import { Agent } from './agent.js';
import { generateInitialPlatforms } from '../platform.js';
import { recordFitness } from '../fitnessTracker.js';
import { GA_CONFIG } from './gaConfig.js';

export class Population {
  constructor(game) {
    this.agents = [];
    this.platforms = generateInitialPlatforms(game);
    this.generation = 1;
    this.gameSize = { width: game.width, height: game.height };

    this.initPopulation();
  }

  initPopulation() {
    this.agents = [];
    for (let i = 0; i < GA_CONFIG.populationSize; i++) {
      this.agents.push(new Agent(this.gameSize));
    }
  }

  // Call this ONCE per frame, before sub-stepping
  thinkAll() {
    this.agents.forEach(agent => agent.think(this.platforms, this.gameSize));
  }

  update(deltaTime) {
    // Scroll platforms
    const SCROLL_SPEED = 150;
    this.platforms.forEach(p => p.x -= SCROLL_SPEED * deltaTime);

    // Generate new platforms dynamically
    const lastPlatform = this.platforms[this.platforms.length - 1];
    if (lastPlatform.x + lastPlatform.width < this.gameSize.width) {
      // Add variation in gap, width, and Y position
      const gap = Math.floor(Math.random() * 101) + 100; // 100-200
      const width = Math.floor(Math.random() * 101) + 100; // 100-200
      const heightOffset = Math.floor(Math.random() * 61) - 30; // -30 to +30
      const newY = Math.min(Math.max(lastPlatform.y + heightOffset, 200), this.gameSize.height - 50);
      this.platforms.push({ x: lastPlatform.x + lastPlatform.width + gap, y: newY, width, height: 20 });
    }

    // Remove off-screen platforms
    this.platforms = this.platforms.filter(p => p.x + p.width > 0);

    // Update all agents (physics only)
    this.agents.forEach(agent => agent.update(deltaTime, this.platforms, this.gameSize));

    if (this.agents.every(agent => !agent.alive)) {
      this.evolve();
    }
  }

  evolve() {
    this.agents.sort((a, b) => b.score - a.score);

    const bestFitness = this.agents[0].score;
    recordFitness(bestFitness);

    let newAgents;
    if (window.forceRandomPopulation) {
      newAgents = [];
      for (let i = 0; i < GA_CONFIG.populationSize; i++) {
        newAgents.push(new Agent(this.gameSize));
      }
    } else {
      const eliteCount = Math.floor(GA_CONFIG.populationSize * 0.1);
      const elites = this.agents.slice(0, eliteCount);
      const survivors = this.agents.slice(0, GA_CONFIG.populationSize / 2);
      newAgents = [...elites];
      while (newAgents.length < GA_CONFIG.populationSize) {
        const parentA = this.selectParent(survivors);
        const parentB = this.selectParent(survivors);
        let childGenome = parentA.genome.crossover(parentB.genome);
        childGenome.mutate();
        const child = new Agent(this.gameSize);
        child.genome = childGenome;
        newAgents.push(child);
      }
    }
    this.agents = newAgents;
    this.platforms = generateInitialPlatforms(this.gameSize);
    this.generation++;
  }

  selectParent(survivors) {
    return survivors[Math.floor(Math.random() * survivors.length)];
  }
}

