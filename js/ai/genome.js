import { GA_CONFIG } from './gaConfig.js';

export class Genome {
  constructor() {
    this.inputSize = GA_CONFIG.inputNeurons;
    this.hiddenSize = GA_CONFIG.hiddenNeurons;
    this.outputSize = GA_CONFIG.outputNeurons;

    // Initialize weights randomly (-1 to 1)
    this.weightsInputHidden = this.randomMatrix(this.inputSize, this.hiddenSize);
    this.weightsHiddenOutput = this.randomMatrix(this.hiddenSize, this.outputSize);

    this.fitness = 0;
  }

  randomMatrix(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 2 - 1)
    );
  }

  // Forward pass: inputs → outputs
  process(inputs) {
    const hidden = this.activate(this.dot(inputs, this.weightsInputHidden));
    const outputs = this.activate(this.dot(hidden, this.weightsHiddenOutput));
    return outputs;
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
    clone.weightsInputHidden = JSON.parse(JSON.stringify(this.weightsInputHidden));
    clone.weightsHiddenOutput = JSON.parse(JSON.stringify(this.weightsHiddenOutput));
    return clone;
  }

  // Mutate weights
  mutate() {
    const mutateValue = (w) => (Math.random() < GA_CONFIG.mutationRate ? w + (Math.random() * 2 - 1) * 0.5 : w);

    this.weightsInputHidden = this.weightsInputHidden.map(row => row.map(mutateValue));
    this.weightsHiddenOutput = this.weightsHiddenOutput.map(row => row.map(mutateValue));
  }

  // Crossover (simple averaging)
  crossover(partner) {
    const child = new Genome();

    child.weightsInputHidden = this.weightsInputHidden.map((row, i) =>
      row.map((w, j) => (w + partner.weightsInputHidden[i][j]) / 2)
    );

    child.weightsHiddenOutput = this.weightsHiddenOutput.map((row, i) =>
      row.map((w, j) => (w + partner.weightsHiddenOutput[i][j]) / 2)
    );

    return child;
  }
}

