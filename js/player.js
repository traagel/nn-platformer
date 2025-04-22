export const player = {
  x: 100,
  y: 300,
  width: 30,
  height: 30,
  color: 'blue',
  velocityY: 0,
  velocityX: 0,
  speed: 200,         // Horizontal speed (pixels/sec)
  jumpStrength: -400,
  isOnGround: false
};

const gravity = 1000;
const friction = 0.85;

export function updatePlayer(deltaTime, game) {
  // Apply horizontal movement
  player.x += player.velocityX * deltaTime;
  player.velocityX *= friction;

  // Apply gravity
  player.velocityY += gravity * deltaTime;
  player.y += player.velocityY * deltaTime;

  // Ground collision handled by platform.js
  const maxX = game.width - player.width;
  const minX = 0;
  if (player.x < minX) player.x = minX;
  if (player.x > maxX) player.x = maxX;
}

export function playerJump() {
  if (player.isOnGround) {
    player.velocityY = player.jumpStrength;
  }
}

