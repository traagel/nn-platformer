const canvas = document.getElementById('nnCanvas');
const ctx = canvas.getContext('2d');

// Input neuron legend (update if you change generateGameStateInputs)
const inputLabels = [
  'Player X',
  'Player Y',
  'Velocity Y',
  'On Ground',
  'Next Plat Dist',
  'Next Plat Y',
  'Gap Size'
];

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

  // --- Draw info/legend at top ---
  ctx.save();
  ctx.font = 'bold 1.05rem Segoe UI, Arial, sans-serif';
  ctx.fillStyle = '#4fd1ff';
  ctx.fillText(
    `Hidden Layers: [${genome.hiddenLayers ? genome.hiddenLayers.join(', ') : (genome.hiddenSize || '?')}]`,
    16, 28
  );
  ctx.font = '0.95rem Segoe UI, Arial, sans-serif';
  ctx.fillStyle = '#333';
  ctx.fillText(
    `Inputs: ${inputLabels.slice(0, inputs.length).join(', ')}`,
    16, 48
  );
  ctx.restore();

  // --- Layout for multiple hidden layers ---
  const inputCount = inputs.length;
  const outputCount = outputs.length;
  const hiddenLayers = genome.hiddenLayers || [genome.hiddenSize];
  const layerCount = 2 + hiddenLayers.length; // input + hidden(s) + output
  const neuronRadius = 12;
  const layerXs = [];
  for (let i = 0; i < layerCount; i++) {
    layerXs.push(50 + (i * (canvas.width - 100) / (layerCount - 1)));
  }

  // Neuron counts per layer
  const neuronCounts = [inputCount, ...hiddenLayers, outputCount];
  const neuronYs = neuronCounts.map(count =>
    Array.from({ length: count }, (_, i) => (canvas.height / (count + 1)) * (i + 1))
  );

  // --- Draw connections ---
  let prevActivations = inputs;
  let prevYs = neuronYs[0];
  for (let l = 0; l < hiddenLayers.length + 1; l++) {
    const weights = genome.weights[l];
    const nextCount = neuronCounts[l + 1];
    const nextYs = neuronYs[l + 1];
    for (let i = 0; i < prevActivations.length; i++) {
      for (let j = 0; j < nextCount; j++) {
        const weight = weights[i][j];
        ctx.strokeStyle = weightColor(weight);
        ctx.beginPath();
        ctx.moveTo(layerXs[l], prevYs[i]);
        ctx.lineTo(layerXs[l + 1], nextYs[j]);
        ctx.stroke();
      }
    }
    // Compute next activations for next layer (for coloring, not used here)
    prevActivations = Array(nextCount).fill(0); // Not used for coloring
    prevYs = nextYs;
  }

  // --- Draw neurons ---
  // Input neurons
  for (let i = 0; i < inputCount; i++) {
    drawNeuron(layerXs[0], neuronYs[0][i], inputs[i], neuronRadius, 'blue');
  }
  // Hidden neurons
  for (let l = 0; l < hiddenLayers.length; l++) {
    for (let i = 0; i < hiddenLayers[l]; i++) {
      drawNeuron(layerXs[l + 1], neuronYs[l + 1][i], 0.5, neuronRadius, 'gray');
    }
  }
  // Output neurons
  const labels = ['W', 'A', 'D'];
  for (let i = 0; i < outputCount; i++) {
    const isOn = outputs[i] > 0.5;
    drawOutputNeuron(layerXs[layerXs.length - 1], neuronYs[layerXs.length - 1][i], neuronRadius, isOn);
    ctx.fillStyle = '#000';
    ctx.fillText(labels[i], layerXs[layerXs.length - 1] - 5, neuronYs[layerXs.length - 1][i] + 5);
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

function weightColor(weight) {
  const norm = Math.tanh(weight);  // Normalize weight to [-1,1]
  if (norm > 0) {
    return `rgba(0,0,255,${Math.abs(norm)})`;  // Blue for positive
  } else {
    return `rgba(255,0,0,${Math.abs(norm)})`;  // Red for negative
  }
}

function drawOutputNeuron(x, y, radius, isOn) {
  ctx.save();
  if (isOn) {
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.shadowColor = 'rgba(255,0,0,0.6)';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 4;
  } else {
    ctx.fillStyle = 'rgb(120,0,0)';
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.5;
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = isOn ? 'rgb(255,80,80)' : 'rgba(80,0,0,0.4)';
  ctx.stroke();
  ctx.restore();
}

