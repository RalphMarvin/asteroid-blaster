
# 🚀 Asteroid Blaster

Asteroid Blaster is a fast-paced arcade game built with React and Vite. Pilot your spaceship, blast asteroids, and aim for the highest score! Choose your difficulty and challenge your reflexes.

## Features

- Multiple difficulty levels: Easy, Medium, Hard, Extreme
- Responsive controls and smooth gameplay
- Dynamic asteroid spawning and increasing challenge
- Score tracking and game over screen
- Play again and difficulty selection
- Sound effects (optional)

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd asteroid-blaster
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser to play.

## Project Structure

- `App.tsx` — Main app logic and state management
- `Game.tsx` — Core game loop and rendering
- `components.tsx` — UI and game object components
- `hooks.ts` — Custom hooks for game logic
- `constants.ts` — Game settings and difficulty parameters
- `types.ts` — TypeScript types for game objects and props
- `sounds.ts` — Sound manager (optional)
- `index.tsx` — Entry point
- `vite.config.ts` — Vite configuration

## Build for Production

```sh
npm run build
```

## Credits

- Developed by BoldInnovations Lab
- Powered by React, TypeScript, and Vite

---
Enjoy blasting asteroids and chasing high scores!
