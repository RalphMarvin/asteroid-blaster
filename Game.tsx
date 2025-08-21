import React from 'react';
import { GameProps } from './types';
import { useGameLogic } from './hooks';
import { Spaceship, Asteroid } from './components';

const Game: React.FC<GameProps> = ({ difficulty, onGameOver }) => {
    const { score, spaceship, lasers, asteroids, explosions } = useGameLogic(difficulty, onGameOver);
    const highScore = typeof window !== 'undefined' ? parseInt(localStorage.getItem('asteroidBlasterHighScore') || '0', 10) : 0;

    return (
        <>
            <div className="absolute top-2 left-4 text-2xl font-bold text-white z-10" style={{ textShadow: '2px 2px 4px #000' }}>
                SCORE: {score}
                <span className="ml-6 text-yellow-400 text-lg">HIGH: {highScore}</span>
            </div>

            <div className="absolute" style={{ left: spaceship.x, top: spaceship.y, width: spaceship.width, height: spaceship.height }}>
                <Spaceship />
            </div>

            {lasers.map(l => (
                <div
                    key={l.id}
                    className="absolute bg-red-500 rounded-full"
                    style={{ left: l.x, top: l.y, width: l.width, height: l.height, boxShadow: '0 0 10px #f00, 0 0 20px #f00' }}
                />
            ))}

            {asteroids.map(a => (
                <div
                    key={a.id}
                    className="absolute text-gray-400"
                    style={{ left: a.x, top: a.y, width: a.width, height: a.height }}
                >
                    <Asteroid rotation={a.rotation}/>
                </div>
            ))}

            {explosions.map(e => (
                <div key={e.id} className="absolute rounded-full bg-yellow-500"
                    style={{
                        left: e.x + e.size / 2,
                        top: e.y + e.size / 2,
                        width: e.size * (1 - e.life),
                        height: e.size * (1 - e.life),
                        transform: 'translate(-50%, -50%)',
                        opacity: e.life,
                        boxShadow: `0 0 ${e.size * e.life * 2}px #ff0`
                    }}
                />
            ))}
        </>
    );
};

export default Game;
