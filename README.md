# Infinite Platformer AI

A modern, interactive platformer game where a neural network AI learns to play by evolving over generations. Visualize the neural net in real time, track fitness progress, and watch the AI improve its skills!

## Features

- **Neural Network AI:** Agents use a simple neural network to control movement and jumping.
- **Genetic Algorithm:** The population evolves over generations, improving performance.
- **Real-Time Visualization:** See the neural network's activations and outputs as the best agent plays.
- **Fitness Graph:** Track the best fitness score over time.
- **Fast-Forward Mode:** Speed up training with a single keypress.
- **Responsive UI:** Works great on desktop and mobile devices.
- **Modern Design:** Clean, dynamic layout with gradient backgrounds and clear overlays.

## Controls

- **F** — Toggle fast-forward simulation (5x speed).
- **(Manual mode)** — Use `A`/`D` or arrow keys to move, `Space` to jump (if enabled).

## How It Works

- Each agent is controlled by a neural network that receives game state inputs (position, velocity, platform info).
- Agents are evaluated on distance, landings, and survival time.
- The best agents are selected and mutated/crossed over to form the next generation.
- The best agent's neural network is visualized live, with output neurons showing which "buttons" are pressed.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone git@github.com:traagel/nn-platformer.git
   cd nn-platformer
   ```

2. **Open `index.html` in your browser:**
   - No build step required! Just open the file directly, or use a simple HTTP server:
     ```bash
     python -m http.server
     # Then visit http://localhost:8000
     ```

3. **Enjoy watching the AI learn!**

## Project Structure

```
js/
  ai/              # Neural net, agent, and genetic algorithm logic
  aiSimulator.js   # AI simulation loop and rendering
  nnVisualizer.js  # Neural network visualizer
  platform.js      # Platform generation and collision
  player.js        # Player/agent physics
  renderer.js      # Manual mode rendering
  fitnessTracker.js# Fitness graph
  main.js          # Entry point
css/
  style.css        # Modern, responsive styles
index.html         # Main HTML file
```

## Customization

- Tweak neural net and GA parameters in `js/ai/gaConfig.js`.
- Adjust visuals and UI in `css/style.css` and `index.html`.
- Add new features or experiment with different fitness functions!

## License

MIT License

---

_Made with ❤️ for AI platformer experiments._
