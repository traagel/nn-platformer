import { Genome } from './genome.js';
import { generateGameStateInputs } from './agentUtils.js';

export class Agent {
  constructor(game) {
    this.genome = new Genome();
    this.alive = true;

    this.player = { x: 100, y: 300, width: 30, height: 30, velocityX: 0, velocityY: 0, isOnGround: false };

    this.maxX = 100;
    this.landingCount = 0;
    this.survivalTime = 0;
    this.idleFrames = 0;

    this.score = 0;

    // Store last controls
    this.lastInputs = null;
    this.lastOutputs = null;
    this.control = { jump: false, left: false, right: false };
  }

  // Decide controls for this frame
  think(platforms, gameSize) {
    if (!this.alive) return;
    const inputs = generateGameStateInputs(this.player, platforms, gameSize);
    const outputs = this.genome.process(inputs);
    this.lastInputs = inputs;
    this.lastOutputs = outputs;
    this.control = {
      jump: outputs[0] > 0.5,
      left: outputs[1] > 0.5,
      right: outputs[2] > 0.5
    };
  }

  // Only apply physics and movement using last-decided controls
  update(deltaTime, platforms, gameSize) {
    if (!this.alive) return;

    // Apply last-decided controls
    if (this.control.jump && this.player.isOnGround) {
      this.player.velocityY = -400;
    }
    if (this.control.left) {
      this.player.velocityX = -200;
    }
    if (this.control.right) {
      this.player.velocityX = 200;
    }

    // Physics
    this.player.velocityY += 1000 * deltaTime;
    this.player.x += this.player.velocityX * deltaTime;
    this.player.y += this.player.velocityY * deltaTime;

    if (this.player.x < 0) {
      this.player.x = 0;
      this.player.velocityX = 0;
    }

    if (this.player.x > gameSize.width - this.player.width) {
      this.player.x = gameSize.width - this.player.width;
      this.player.velocityX = 0;
    }

    // Track max X
    if (this.player.x > this.maxX) {
      this.maxX = this.player.x;
    }

    // Idle detection
    if (Math.abs(this.player.velocityX) < 10) {
      this.idleFrames++;
    }

    // Collision
    const prevOnGround = this.player.isOnGround;
    this.player.isOnGround = false;

    platforms.forEach(p => {
      const withinX = this.player.x + this.player.width > p.x && this.player.x < p.x + p.width;
      const feetY = this.player.y + this.player.height;
      const isFalling = this.player.velocityY >= 0;

      if (withinX && isFalling) {
        if (feetY >= p.y && feetY <= p.y + 5) {
          this.player.y = p.y - this.player.height;
          this.player.velocityY = 0;
          this.player.isOnGround = true;
        }
      }
    });

    // Count landings
    if (!prevOnGround && this.player.isOnGround) {
      this.landingCount++;
    }

    // Track survival time
    this.survivalTime += deltaTime;

    if (this.player.y > gameSize.height) {
      this.alive = false;
      this.calculateFitness();
    }
  }

  calculateFitness() {
    const distanceScore = this.maxX * 2;
    const landingBonus = this.landingCount * 500;
    const timeScore = this.survivalTime * 50;
    const idlePenalty = this.idleFrames * 2;

    this.score = distanceScore + landingBonus + timeScore - idlePenalty;
    if (this.score < 0) this.score = 0;  // Prevent negative fitness
  }
}

