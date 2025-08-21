import { useState, useEffect, useRef, useCallback } from 'react';
import { LaserType, AsteroidType, ExplosionType, Difficulty, GameObject } from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  SPACESHIP_WIDTH,
  SPACESHIP_HEIGHT,
  SPACESHIP_SPEED,
  LASER_WIDTH,
  LASER_HEIGHT,
  LASER_SPEED,
  DIFFICULTY_SETTINGS,
} from './constants';
import { createAsteroid, isColliding } from './utils';
import soundManager from './sounds';

// --- KEYBOARD INPUT HOOK ---
export const useKeyboardInput = () => {
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keysPressed;
};

// --- GAME LOGIC HOOK ---
const INITIAL_SPACESHIP_STATE = {
  id: 0,
  x: GAME_WIDTH / 2 - SPACESHIP_WIDTH / 2,
  y: GAME_HEIGHT - SPACESHIP_HEIGHT - 20,
  width: SPACESHIP_WIDTH,
  height: SPACESHIP_HEIGHT,
};

export const useGameLogic = (difficulty: Difficulty, onGameOver: (score: number) => void) => {
  const [score, setScore] = useState(0);
  const [spaceship, setSpaceship] = useState<GameObject>(INITIAL_SPACESHIP_STATE);
  const [lasers, setLasers] = useState<LaserType[]>([]);
  const [asteroids, setAsteroids] = useState<AsteroidType[]>(() => [createAsteroid(DIFFICULTY_SETTINGS[difficulty])]);
  const [explosions, setExplosions] = useState<ExplosionType[]>([]);

  const keysPressed = useKeyboardInput();
  const laserCooldown = useRef(0);
  const frameCount = useRef(0);
  const gameLoopRef = useRef<number | null>(null);

  const createExplosion = useCallback((x: number, y: number, size: number) => {
    setExplosions(prev => [...prev, { id: Date.now() + Math.random(), x, y, size, life: 1.0 }]);
  }, []);

  const gameLoop = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    frameCount.current++;
    if (laserCooldown.current > 0) laserCooldown.current--;

    // 1. Calculate next state for all game objects
    let nextSpaceshipState = { ...spaceship };
    if (keysPressed.current['ArrowLeft']) nextSpaceshipState.x -= SPACESHIP_SPEED;
    if (keysPressed.current['ArrowRight']) nextSpaceshipState.x += SPACESHIP_SPEED;
    if (keysPressed.current['ArrowUp']) nextSpaceshipState.y -= SPACESHIP_SPEED;
    if (keysPressed.current['ArrowDown']) nextSpaceshipState.y += SPACESHIP_SPEED;
    nextSpaceshipState.x = Math.max(0, Math.min(GAME_WIDTH - SPACESHIP_WIDTH, nextSpaceshipState.x));
    nextSpaceshipState.y = Math.max(0, Math.min(GAME_HEIGHT - SPACESHIP_HEIGHT, nextSpaceshipState.y));
    
    let nextAsteroids = asteroids.map(a => {
      const rad = (a.angle * Math.PI) / 180;
      return {
        ...a,
        x: a.x + Math.cos(rad) * a.speed,
        y: a.y + Math.sin(rad) * a.speed,
        rotation: (a.rotation + a.rotationSpeed) % 360,
      };
    });
    if (frameCount.current % settings.ASTEROID_SPAWN_INTERVAL === 0) {
      nextAsteroids.push(createAsteroid(settings));
    }

  let nextLasers = lasers.map(l => ({ ...l, y: l.y - LASER_SPEED }));
  // Double laser upgrade: triggers if high score >= 2000 (persists across games)
  const highScore = typeof window !== 'undefined' ? parseInt(localStorage.getItem('asteroidBlasterHighScore') || '0', 10) : 0;
  if (keysPressed.current[' '] && laserCooldown.current <= 0) {
    soundManager.playLaser();
    let laserConfigs = [];
    // Check both current score and high score for upgrades
    const highScore = typeof window !== 'undefined' ? parseInt(localStorage.getItem('asteroidBlasterHighScore') || '0', 10) : 0;
    const upgradeScore = Math.max(score, highScore);
    if (upgradeScore >= 5000) {
      // 4 lasers: leftmost, left, right, rightmost
      laserConfigs = [
        -18, // leftmost
        -6,  // left
        6,   // right
        18   // rightmost
      ];
    } else if (upgradeScore >= 3000) {
      // 3 lasers: left, center, right
      laserConfigs = [
        -12, // left
        0,   // center
        12   // right
      ];
    } else if (upgradeScore >= 2000) {
      // 2 lasers: left and right
      laserConfigs = [
        -10, // left
        10   // right
      ];
    } else {
      // Normal single laser
      laserConfigs = [0];
    }
    laserConfigs.forEach((offset, i) => {
      nextLasers.push({
        id: Date.now() + i,
        x: nextSpaceshipState.x + SPACESHIP_WIDTH / 2 - LASER_WIDTH / 2 + offset,
        y: nextSpaceshipState.y,
        width: LASER_WIDTH,
        height: LASER_HEIGHT,
      });
    });
    laserCooldown.current = settings.LASER_COOLDOWN;
  }

    // 2. Collision detection and game logic
    const hitLaserIds = new Set<number>();
    const survivingAsteroidsAfterLaserHits: AsteroidType[] = [];
    let scoreGained = 0;
    let gameOver = false;

    for (const asteroid of nextAsteroids) {
      let wasHitByLaser = false;
      for (const laser of nextLasers) {
        if (hitLaserIds.has(laser.id)) continue;
        if (isColliding(laser, asteroid)) {
          hitLaserIds.add(laser.id);
          wasHitByLaser = true;
          break;
        }
      }

      if (wasHitByLaser) {
        soundManager.playExplosion();
        createExplosion(asteroid.x, asteroid.y, asteroid.width);
        const scoreToAdd = Math.ceil(100 - asteroid.width);
        scoreGained += scoreToAdd;
      } else {
        survivingAsteroidsAfterLaserHits.push(asteroid);
      }
    }
    
    const finalLasers = nextLasers.filter(l => !hitLaserIds.has(l.id) && l.y + l.height > 0);
    
    const finalAsteroids = survivingAsteroidsAfterLaserHits.filter(asteroid => {
        if (isColliding(nextSpaceshipState, asteroid)) {
            soundManager.playGameOver();
            createExplosion(nextSpaceshipState.x, nextSpaceshipState.y, nextSpaceshipState.width * 2);
            createExplosion(asteroid.x, asteroid.y, asteroid.width);
            gameOver = true;
            return false;
        }
        return asteroid.y < GAME_HEIGHT;
    });
    
    // 3. Update state
    setSpaceship(nextSpaceshipState);
    setLasers(finalLasers);
    setAsteroids(finalAsteroids);
    if (scoreGained > 0) {
        setScore(s => s + scoreGained);
    }
    setExplosions(prev => prev.map(e => ({ ...e, life: e.life - 1 / 30.0 })).filter(e => e.life > 0));
    
    // 4. Handle game over or next frame
    if (gameOver) {
        onGameOver(score + scoreGained);
    } else {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

  }, [difficulty, onGameOver, createExplosion, score, spaceship, lasers, asteroids]);


  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  return { score, spaceship, lasers, asteroids, explosions };
};