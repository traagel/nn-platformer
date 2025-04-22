import { player } from './player.js';
import { platforms } from './platform.js';
import { updateNNVisualizer } from './nnVisualizer.js';

const MAX_FALL_SPEED = 1000;

export function processAI(game) {
  const inputs = [];

  // 1. Player X Position (normalized)
  inputs.push(player.x / game.width);

  // 2. Player Y Position (normalized)
  inputs.push(player.y / game.height);

  // 3. Player Y Velocity (normalized to [-1, 1])
  let velY = player.velocityY / MAX_FALL_SPEED;
  velY = Math.max(-1, Math.min(velY, 1));
  inputs.push((velY + 1) / 2);  // Shift to [0,1] for visualization

  // 4. Is On Ground
  inputs.push(player.isOnGround ? 1 : 0);

  // Find Next Platform (ahead of player.x)
  const nextPlatform = platforms.find(p => p.x + p.width > player.x);
  if (nextPlatform) {
    // 5. Next Platform Distance (normalized)
    const distance = nextPlatform.x - player.x;
    inputs.push(distance / game.width);

    // 6. Next Platform Height (normalized)
    inputs.push(nextPlatform.y / game.height);

    // 7. Gap Size (distance from current platform end to next start)
    const index = platforms.indexOf(nextPlatform);
    const prevPlatform = platforms[index - 1] || nextPlatform;
    const gapSize = nextPlatform.x - (prevPlatform.x + prevPlatform.width);
    inputs.push(gapSize / game.width);
  } else {
    // Default values if no platform found
    inputs.push(1, 1, 1);
  }

  // Dummy AI Outputs for now (random decisions)
  const outputs = [
    Math.random() > 0.95 ? 1 : 0,  // W (Jump occasionally)
    0,                             // A (No move left)
    1                              // D (Always move right)
  ];

  // Update Visualizer
  updateNNVisualizer(inputs, outputs);

  // Later: Apply outputs to control player
}

