export interface GameObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LaserType extends GameObject {}

export interface AsteroidType extends GameObject {
  speed: number;
  angle: number;
  rotation: number;
  rotationSpeed: number;
}

export interface ExplosionType {
    id: number;
    x: number;
    y: number;
    size: number;
    life: number; // Represents lifetime, e.g., 1.0 (full) to 0.0 (gone)
}

export type GameState = 'welcome' | 'selectDifficulty' | 'playing' | 'gameOver';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

// Component Prop Types
export interface WelcomeScreenProps {
    onStart: () => void;
}

export interface DifficultyScreenProps {
    onSelectDifficulty: (difficulty: Difficulty) => void;
}

export interface GameOverScreenProps {
    score: number;
    onPlayAgain: () => void;
    onMainMenu: () => void;
}

export interface GameProps {
    difficulty: Difficulty;
    onGameOver: (score: number) => void;
}

export interface GameScreenProps {
  children: React.ReactNode;
}

export interface AsteroidIconProps {
  rotation: number;
}
