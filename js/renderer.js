import { player } from './player.js';
import { platforms } from './platform.js';

export function renderGame(game, score) {
  const ctx = game.ctx;
  ctx.clearRect(0, 0, game.width, game.height);

  // DEBUG: Fill with solid red to confirm drawing
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, game.width, game.height);

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
  gradient.addColorStop(0, '#aeefff');   // Light blue sky
  gradient.addColorStop(1, '#ffffff');   // Soft white ground
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, game.width, game.height);

  // Draw platforms
  ctx.fillStyle = 'rgba(80, 80, 80, 0.6)'; // Semi-transparent dark gray
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

