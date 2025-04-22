import { player } from './player.js';
import { platforms } from './platform.js';

export function renderGame(game, score) {
  const ctx = game.ctx;
  ctx.clearRect(0, 0, game.width, game.height);

  // Draw platforms
  ctx.fillStyle = '#555';
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${Math.floor(score)}`, 10, 30);
}

