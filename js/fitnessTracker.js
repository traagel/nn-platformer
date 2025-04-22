const canvas = document.getElementById('fitnessCanvas');
const ctx = canvas.getContext('2d');

let fitnessHistory = [];

export function recordFitness(fitness) {
  fitnessHistory.push(fitness);
  drawFitnessGraph();
}

function drawFitnessGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (fitnessHistory.length < 2) return;

  const maxFitness = Math.max(...fitnessHistory);
  const graphHeight = canvas.height - 20;
  const graphWidth = canvas.width - 20;

  ctx.beginPath();
  ctx.moveTo(10, graphHeight - (fitnessHistory[0] / maxFitness) * graphHeight);

  for (let i = 1; i < fitnessHistory.length; i++) {
    const x = (i / fitnessHistory.length) * graphWidth + 10;
    const y = graphHeight - (fitnessHistory[i] / maxFitness) * graphHeight;
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = 'green';
  ctx.stroke();

  // Draw axes
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(10, graphHeight);
  ctx.lineTo(canvas.width, graphHeight);
  ctx.stroke();

  // Display current max fitness
  ctx.fillStyle = '#000';
  ctx.fillText(`Max Fitness: ${Math.floor(maxFitness)}`, 20, 15);
}

