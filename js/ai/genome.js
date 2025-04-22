import { GA_CONFIG } from './gaConfig.js';

export class Genome {
  constructor() {
    this.inputSize = GA_CONFIG.inputNeurons;
    this.hiddenLayers = [...GA_CONFIG.hiddenLayers]; // Array of hidden layer sizes
    this.outputSize = GA_CONFIG.outputNeurons;

    // Initialize weights for each layer
    this.weights = [];
    let prevSize = this.inputSize;
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      this.weights.push(this.randomMatrix(prevSize, this.hiddenLayers[i]));
      prevSize = this.hiddenLayers[i];
    }
    // Output layer
    this.weights.push(this.randomMatrix(prevSize, this.outputSize));

    this.fitness = 0;
  }

  randomMatrix(rows, cols) {
    const range = GA_CONFIG.weightRange || 1.0;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 2 * range - range)
    );
  }

  // Forward pass: inputs → outputs
  process(inputs) {
    let layerInput = inputs;
    for (let i = 0; i < this.weights.length; i++) {
      layerInput = this.activate(this.dot(layerInput, this.weights[i]));
    }
    return layerInput;
  }

  // Simple dot product
  dot(vec, matrix) {
    return matrix[0].map((_, colIndex) =>
      matrix.reduce((sum, row, rowIndex) => sum + vec[rowIndex] * row[colIndex], 0)
    );
  }

  // Sigmoid activation
  activate(vector) {
    return vector.map(v => 1 / (1 + Math.exp(-v)));
  }

  // Clone genome
  clone() {
    const clone = new Genome();
    clone.weights = this.weights.map(w => JSON.parse(JSON.stringify(w)));
    return clone;
  }

  // Mutate weights
  mutate() {
    const rate = GA_CONFIG.mutationRate || 0.1;
    const strength = GA_CONFIG.mutationStrength || 0.5;
    const mutateValue = (w) => (Math.random() < rate ? w + (Math.random() * 2 * strength - strength) : w);
    this.weights = this.weights.map(matrix => matrix.map(row => row.map(mutateValue)));
  }

  // Crossover (simple averaging)
  crossover(partner) {
    const child = new Genome();
    child.weights = this.weights.map((matrix, l) =>
      matrix.map((row, i) =>
        row.map((w, j) => (w + partner.weights[l][i][j]) / 2)
      )
    );
    return child;
  }
}

