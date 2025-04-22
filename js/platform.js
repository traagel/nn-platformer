import { getRandomInt } from './utils.js';

const PLATFORM_HEIGHT = 20;
const SCROLL_SPEED = 150;  // pixels per second

export let platforms = [];

export function initPlatforms(game) {
  platforms = [];
  // Start with a base platform under the player
  platforms.push({ x: 50, y: game.height - 100, width: 200, height: PLATFORM_HEIGHT });
}

export function updatePlatforms(deltaTime, game) {
  // Move platforms to the left
  platforms.forEach(p => p.x -= SCROLL_SPEED * deltaTime);

  // Remove platforms that are off-screen
  platforms = platforms.filter(p => p.x + p.width > 0);

  // Generate new platforms if needed
  const lastPlatform = platforms[platforms.length - 1];
  if (lastPlatform.x + lastPlatform.width < game.width) {
    const gap = getRandomInt(100, 200);
    const width = getRandomInt(100, 200);
    const heightOffset = getRandomInt(-30, 30);

    const newPlatformY = Math.min(Math.max(lastPlatform.y + heightOffset, 200), game.height - 50);
    platforms.push({
      x: lastPlatform.x + lastPlatform.width + gap,
      y: newPlatformY,
      width: width,
      height: PLATFORM_HEIGHT
    });
  }
}

export function checkPlayerCollision(player) {
  const tolerance = 5;  // Allow slight overlap for smoother landing

  for (let p of platforms) {
    const withinX = player.x + player.width > p.x && player.x < p.x + p.width;
    const feetY = player.y + player.height;
    const isFalling = player.velocityY >= 0;

    if (withinX && isFalling) {
      const platformTop = p.y;
      const platformBottom = p.y + p.height;

      // Check if player's feet are within landing zone
      if (feetY >= platformTop && feetY <= platformTop + tolerance) {
        player.y = platformTop - player.height;
        player.velocityY = 0;
        player.isOnGround = true;
        return;
      }
    }
  }
  // If no collision detected
  player.isOnGround = false;
}

export function generateInitialPlatforms(game) {
  const platforms = [];
  platforms.push({ x: 50, y: game.height - 100, width: 200, height: 20 });

  // Pre-generate a few platforms ahead
  let lastPlatform = platforms[0];
  for (let i = 0; i < 5; i++) {
    const gap = 150;
    const width = 150;
    const heightOffset = 0;

    const newPlatformY = Math.min(Math.max(lastPlatform.y + heightOffset, 200), game.height - 50);
    platforms.push({
      x: lastPlatform.x + lastPlatform.width + gap,
      y: newPlatformY,
      width: width,
      height: 20
    });

    lastPlatform = platforms[platforms.length - 1];
  }

  return platforms;
}

