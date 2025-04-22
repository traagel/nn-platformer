import { updatePlayer, player } from './player.js';
import { updatePlatforms, checkPlayerCollision } from './platform.js';
import { renderGame } from './renderer.js';

let score = 0;

import { handleMovement } from './input.js';

import { processAI } from './aiInterface.js';

export function startGameLoop(game) {
  function loop(timestamp) {
    const deltaTime = (timestamp - game.lastTime) / 1000;
    game.lastTime = timestamp;

    handleMovement();  // Manual input

    processAI(game);   // <<< Add this line for AI state processing

    updatePlatforms(deltaTime, game);
    updatePlayer(deltaTime, game);
    checkPlayerCollision(player);

    score += deltaTime * 100;

    if (player.y > game.height) {
      alert(`Game Over! Score: ${Math.floor(score)}`);
      window.location.reload();
    }

    renderGame(game, score);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

