const canvas = document.getElementById('nnCanvas');
const ctx = canvas.getContext('2d');

// Activation function
function activate(vector) {
  return vector.map(v => 1 / (1 + Math.exp(-v)));  // Sigmoid
}

// Dot product for layer computation
function dot(vec, matrix) {
  return matrix[0].map((_, colIndex) =>
    matrix.reduce((sum, row, rowIndex) => sum + vec[rowIndex] * row[colIndex], 0)
  );
}

export function updateNNVisualizer(genome, inputs, outputs) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const inputCount = inputs.length;
  const hiddenCount = genome.hiddenSize;
  const outputCount = outputs.length;

  const neuronRadius = 12;

  const inputX = 50;
  const hiddenX = 200;
  const outputX = 350;

  const inputSpacing = canvas.height / (inputCount + 1);
  const hiddenSpacing = canvas.height / (hiddenCount + 1);
  const outputSpacing = canvas.height / (outputCount + 1);

  // --- Compute Hidden Activations ---
  const hiddenRaw = dot(inputs, genome.weightsInputHidden);
  const hiddenActivations = activate(hiddenRaw);

  // --- Draw Connections ---
  drawConnections(inputs, genome.weightsInputHidden, inputX, inputSpacing, hiddenX, hiddenSpacing);
  drawConnections(hiddenActivations, genome.weightsHiddenOutput, hiddenX, hiddenSpacing, outputX, outputSpacing);

  // --- Draw Input Neurons ---
  for (let i = 0; i < inputCount; i++) {
    drawNeuron(inputX, (i + 1) * inputSpacing, inputs[i], neuronRadius, 'blue');
  }

  // --- Draw Hidden Neurons ---
  for (let i = 0; i < hiddenCount; i++) {
    drawNeuron(hiddenX, (i + 1) * hiddenSpacing, hiddenActivations[i], neuronRadius, 'gray');
  }

  // --- Draw Output Neurons ---
  const labels = ['W', 'A', 'D'];
  for (let i = 0; i < outputCount; i++) {
    drawNeuron(outputX, (i + 1) * outputSpacing, outputs[i], neuronRadius, 'red');
    ctx.fillStyle = '#000';
    ctx.fillText(labels[i], outputX - 5, (i + 1) * outputSpacing + 5);
  }
}

function drawNeuron(x, y, value, radius, baseColor) {
  const intensity = Math.floor(value * 255);
  if (baseColor === 'blue') {
    ctx.fillStyle = `rgb(0,0,${intensity})`;
  } else if (baseColor === 'red') {
    ctx.fillStyle = `rgb(${intensity},0,0)`;
  } else if (baseColor === 'gray') {
    ctx.fillStyle = `rgb(${intensity},${intensity},${intensity})`;
  }

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(0,0,0,0.3)`;
  ctx.stroke();
}

function drawConnections(sourceVals, weights, srcX, srcSpacing, destX, destSpacing) {
  for (let i = 0; i < sourceVals.length; i++) {
    for (let j = 0; j < weights[0].length; j++) {
      const weight = weights[i][j];
      const color = weightColor(weight);
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(srcX, (i + 1) * srcSpacing);
      ctx.lineTo(destX, (j + 1) * destSpacing);
      ctx.stroke();
    }
  }
}

function weightColor(weight) {
  const norm = Math.tanh(weight);  // Normalize weight to [-1,1]
  if (norm > 0) {
    return `rgba(0,0,255,${Math.abs(norm)})`;  // Blue for positive
  } else {
    return `rgba(255,0,0,${Math.abs(norm)})`;  // Red for negative
  }
}

