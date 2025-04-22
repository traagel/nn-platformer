import { startGameLoop } from './gameLoop.js';
import { initAISimulation } from './aiSimulator.js';
import { setupInput } from './input.js';
import { initPlatforms } from './platform.js';

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

if (MODE === 'MANUAL') {
  setupInput();
  startGameLoop(game);
} else if (MODE === 'AI') {
  initAISimulation(game);
}

