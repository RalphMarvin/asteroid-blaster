export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const SPACESHIP_WIDTH = 40;
export const SPACESHIP_HEIGHT = 50;
export const SPACESHIP_SPEED = 7;

export const LASER_WIDTH = 5;
export const LASER_HEIGHT = 20;
export const LASER_SPEED = 10;

export const ASTEROID_MIN_SIZE = 30;
export const ASTEROID_MAX_SIZE = 80;

export const EXPLOSION_DURATION = 0.5; // in seconds
export const EXPLOSION_PARTICLES = 20;

export const DIFFICULTY_SETTINGS = {
  easy: {
    ASTEROID_MIN_SPEED: 1,
    ASTEROID_MAX_SPEED: 3,
    ASTEROID_SPAWN_INTERVAL: 45, // frames
    LASER_COOLDOWN: 15, // frames
  },
  medium: { // Previously 'extreme'
    ASTEROID_MIN_SPEED: 4,
    ASTEROID_MAX_SPEED: 7,
    ASTEROID_SPAWN_INTERVAL: 18,
    LASER_COOLDOWN: 8,
  },
  hard: {
    ASTEROID_MIN_SPEED: 5,
    ASTEROID_MAX_SPEED: 8.5,
    ASTEROID_SPAWN_INTERVAL: 15,
    LASER_COOLDOWN: 7,
  },
  extreme: {
    ASTEROID_MIN_SPEED: 6.5,
    ASTEROID_MAX_SPEED: 10,
    ASTEROID_SPAWN_INTERVAL: 12,
    LASER_COOLDOWN: 6,
  }
};