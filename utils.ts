import { AsteroidType, GameObject } from './types';
import { ASTEROID_MAX_SIZE, ASTEROID_MIN_SIZE, GAME_WIDTH } from './constants';

export const createAsteroid = (settings: { ASTEROID_MIN_SPEED: number; ASTEROID_MAX_SPEED: number; }): AsteroidType => {
  const size = Math.random() * (ASTEROID_MAX_SIZE - ASTEROID_MIN_SIZE) + ASTEROID_MIN_SIZE;
  const x = Math.random() * (GAME_WIDTH - size);
  const speed = Math.random() * (settings.ASTEROID_MAX_SPEED - settings.ASTEROID_MIN_SPEED) + settings.ASTEROID_MIN_SPEED;
  // 25% chance to drop straight down
  const angle = Math.random() < 0.25 ? 90 : Math.random() * 120 + 30; // 30 to 150 degrees, or straight down
  const rotation = Math.random() * 360;
  const rotationSpeed = (Math.random() - 0.5) * 4;

  return {
    id: Date.now() + Math.random(),
    x,
    y: -size,
    width: size,
    height: size,
    speed,
    angle,
    rotation,
    rotationSpeed
  };
};

export const isColliding = (obj1: {x:number, y:number, width:number, height:number}, obj2: {x:number, y:number, width:number, height:number}) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};
