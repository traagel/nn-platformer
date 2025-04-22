import { player } from './player.js';

const keys = {
  left: false,
  right: false
};

export function setupInput() {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      playerJump();
    }
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      keys.left = true;
    }
    if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      keys.right = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      keys.left = false;
    }
    if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      keys.right = false;
    }
  });
}

function playerJump() {
  if (player.isOnGround) {
    player.velocityY = player.jumpStrength;
  }
}

// Apply movement based on key states
export function handleMovement() {
  if (keys.left) {
    player.velocityX = -player.speed;
  }
  if (keys.right) {
    player.velocityX = player.speed;
  }
}

