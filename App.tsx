import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Difficulty } from './types';
import { WelcomeScreen, DifficultyScreen, GameOverScreen, GameScreen } from './components';
import Game from './Game';
import soundManager from './sounds';

const App = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [finalScore, setFinalScore] = useState(0);
  const [gameId, setGameId] = useState(1);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const handleStartGame = useCallback(() => {
    if (!audioInitialized) {
      soundManager.init();
      setAudioInitialized(true);
    }
    setGameState('selectDifficulty');
  }, [audioInitialized]);

  const handleSelectDifficulty = useCallback((level: Difficulty) => {
    setDifficulty(level);
    setGameId(id => id + 1); // Reset game component with a new key
    setGameState('playing');
  }, []);

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
    setGameState('gameOver');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameId(id => id + 1); // Reset game component with a new key
    setGameState('playing');
  }, []);

  const handleMainMenu = useCallback(() => {
    setGameState('selectDifficulty');
  }, []);

  useEffect(() => {
    if (!audioInitialized) return;
    if (gameState === 'playing') {
      soundManager.startMusic();
    } else {
      soundManager.stopMusic();
    }
  }, [gameState, audioInitialized]);


  const renderGameState = () => {
      switch (gameState) {
          case 'welcome':
              return <WelcomeScreen onStart={handleStartGame} />;
          case 'selectDifficulty':
              return <DifficultyScreen onSelectDifficulty={handleSelectDifficulty} />;
          case 'playing':
              return <Game key={gameId} difficulty={difficulty} onGameOver={handleGameOver} />;
          case 'gameOver':
              return <GameOverScreen score={finalScore} onPlayAgain={handlePlayAgain} onMainMenu={handleMainMenu} />;
          default:
              return null;
      }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white font-mono">
      <h1 className="text-5xl font-bold text-cyan-400 mb-2 tracking-widest"
        style={{ textShadow: '0 0 10px #0ff, 0 0 20px #0ff' }}>
        ASTEROID BLASTER
      </h1>
      <GameScreen>
        {renderGameState()}
      </GameScreen>
    </main>
  );
};

export default App;