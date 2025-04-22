const MAX_FALL_SPEED = 1000;

export function generateGameStateInputs(player, platforms, gameSize) {
  const inputs = [];

  // 1. Player X Position (normalized)
  inputs.push(player.x / gameSize.width);

  // 2. Player Y Position (normalized)
  inputs.push(player.y / gameSize.height);

  // 3. Player Y Velocity (normalized to [-1, 1] shifted to [0,1])
  let velY = player.velocityY / MAX_FALL_SPEED;
  velY = Math.max(-1, Math.min(velY, 1));
  inputs.push((velY + 1) / 2);

  // 4. Is On Ground
  inputs.push(player.isOnGround ? 1 : 0);

  // Find Next Platform Ahead
  const nextPlatform = platforms.find(p => p.x + p.width > player.x);
  if (nextPlatform) {
    const distance = nextPlatform.x - player.x;
    inputs.push(distance / gameSize.width);

    inputs.push(nextPlatform.y / gameSize.height);

    const index = platforms.indexOf(nextPlatform);
    const prevPlatform = platforms[index - 1] || nextPlatform;
    const gapSize = nextPlatform.x - (prevPlatform.x + prevPlatform.width);
    inputs.push(gapSize / gameSize.width);
  } else {
    inputs.push(1, 1, 1);
  }

  return inputs;
}

