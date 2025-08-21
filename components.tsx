import React from 'react';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import {
    WelcomeScreenProps,
    DifficultyScreenProps,
    GameOverScreenProps,
    GameScreenProps,
    AsteroidIconProps
} from './types';


// --- GAME OBJECT COMPONENTS ---

export const Spaceship: React.FC = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full text-cyan-400">
    <path d="M10 2.5l7.5 15h-15l7.5-15z" stroke="white" strokeWidth="1" />
    <path d="M10 17.5v-5" stroke="white" strokeWidth="1.5" />
    <path d="M7 14h6" stroke="white" strokeWidth="1" />
  </svg>
);

export const Asteroid: React.FC<AsteroidIconProps> = ({ rotation }) => (
    <div className="w-full h-full" style={{ transform: `rotate(${rotation}deg)` }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
                d="M85.2,62.3c-8.8,19.9-30.7,33-55.5,29.3c-24.8-3.7-41.2-25.1-37.5-49.9C-4.1,16.8,17.3-0.5,42.1,3.2C66.9,6.9,84,28.3,87.7,53.1C88.4,56.3,87.3,59.6,85.2,62.3z"
                className="fill-current text-gray-500"
                stroke="gray"
                strokeWidth="3"
            />
        </svg>
    </div>
);

// --- SCREEN & LAYOUT COMPONENTS ---

export const GameScreen: React.FC<GameScreenProps> = ({ children }) => (
  <div className="relative bg-black bg-opacity-70 rounded-lg shadow-2xl overflow-hidden border-2 border-cyan-500/50"
    style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
    {children}
  </div>
);

export const WelcomeScreen: React.FC<WelcomeScreenProps & {
    onCustomize?: () => void;
    muted?: boolean;
    onToggleMute?: () => void;
    badge?: string | null;
    highScore: number;
}> = ({ onStart, onCustomize, muted, onToggleMute, badge, highScore }) => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-black/50 p-8">
        {badge && (
            <div className="mb-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded-full text-sm">
                {badge.toUpperCase()}
            </div>
        )}
        <div className="text-yellow-400 font-bold text-lg mb-4">
            {highScore >= 10000 ? (
                '⭐ All badges unlocked! ⭐'
            ) : highScore >= 8500 ? (
                'Reach 10,000 points to unlock: Lord of the Asteroids'
            ) : highScore >= 5000 ? (
                'Reach 8,500 points to unlock: Galaxy Destroyer'
            ) : highScore >= 2500 ? (
                'Reach 5,000 points to unlock: Mr Shooter'
            ) : (
                'Reach 2,500 points to unlock: The Rookie'
            )}
        </div>
        <p className="mb-8 text-lg text-gray-300 max-w-sm">Use [Arrow Keys] to move and [Spacebar] to shoot.</p>
        <div className="flex flex-col space-y-4 w-full max-w-xs">
            <button
                onClick={onStart}
                className="px-8 py-4 bg-cyan-500 text-black font-bold text-2xl rounded-md transition-transform transform hover:scale-110 hover:bg-cyan-400 shadow-lg shadow-cyan-500/50 animate-pulse"
            >
                START GAME
            </button>
            <button
                onClick={onCustomize}
                className="px-8 py-4 bg-purple-500 text-white font-bold text-xl rounded-md transition-transform transform hover:scale-105 hover:bg-purple-400 shadow-lg shadow-purple-500/50"
            >
                CUSTOMIZE
            </button>
            <button
                onClick={onToggleMute}
                className={`px-8 py-4 ${muted ? 'bg-gray-400 text-gray-900' : 'bg-green-500 text-white'} font-bold text-xl rounded-md transition-transform transform hover:scale-105 shadow-lg ${muted ? 'shadow-gray-400/50' : 'shadow-green-500/50'}`}
            >
                {muted ? 'PLAY WITH SOUND' : 'PLAY MUTED'}
            </button>
        </div>
    </div>
);

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({ onSelectDifficulty }) => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-black/50 p-8">
        <h2 className="text-4xl mb-8 text-white">SELECT DIFFICULTY</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <button
                onClick={() => onSelectDifficulty('easy')}
                className="px-6 py-3 bg-cyan-500 text-black font-bold text-xl rounded-md transition-transform transform hover:scale-105 hover:bg-cyan-400 shadow-lg shadow-cyan-500/50"
            >
                EASY
            </button>
            <button
                onClick={() => onSelectDifficulty('medium')}
                className="px-6 py-3 bg-yellow-500 text-black font-bold text-xl rounded-md transition-transform transform hover:scale-105 hover:bg-yellow-400 shadow-lg shadow-yellow-500/50"
            >
                MEDIUM
            </button>
            <button
                onClick={() => onSelectDifficulty('hard')}
                className="px-6 py-3 bg-orange-500 text-white font-bold text-xl rounded-md transition-transform transform hover:scale-105 hover:bg-orange-400 shadow-lg shadow-orange-500/50"
            >
                HARD
            </button>
            <button
                onClick={() => onSelectDifficulty('extreme')}
                className="px-6 py-3 bg-red-600 text-white font-bold text-xl rounded-md transition-transform transform hover:scale-105 hover:bg-red-500 shadow-lg shadow-red-600/50"
            >
                EXTREME
            </button>
        </div>
    </div>
);

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onPlayAgain, onMainMenu }) => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-black/70">
        <h2 className="text-6xl text-red-500 font-extrabold mb-4" style={{ textShadow: '0 0 10px #f00' }}>GAME OVER</h2>
        <p className="text-3xl mb-2 text-white">FINAL SCORE</p>
        <p className="text-5xl font-bold text-cyan-400 mb-8">{score}</p>
        <div className="flex space-x-4">
            <button
                onClick={onPlayAgain}
                className="px-8 py-4 bg-cyan-500 text-black font-bold text-xl rounded-md transition-transform transform hover:scale-110 hover:bg-cyan-400 shadow-lg shadow-cyan-500/50"
            >
                PLAY AGAIN
            </button>
            <button
                onClick={onMainMenu}
                className="px-8 py-4 bg-gray-600 text-white font-bold text-xl rounded-md transition-transform transform hover:scale-110 hover:bg-gray-500 shadow-lg shadow-gray-600/50"
            >
                MAIN MENU
            </button>
        </div>
    </div>
);
