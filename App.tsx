import React, { useState, useCallback, useEffect } from 'react';
import Confetti from './Confetti';
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
  const [highScore, setHighScore] = useState<number>(() => {
    const stored = localStorage.getItem('asteroidBlasterHighScore');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [muted, setMuted] = useState(false); // Play with sound enabled by default
  // Customization handler stub
  const handleCustomize = useCallback(() => {
    alert('Customization screen coming soon!');
  }, []);

  // Mute toggle handler
  const handleToggleMute = useCallback(() => {
    setMuted(m => {
      const newMuted = !m;
      soundManager.muted = newMuted;
      if (newMuted) {
        soundManager.stopMusic();
      }
      return newMuted;
    });
  }, []);

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
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('asteroidBlasterHighScore', score.toString());
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    setGameState('gameOver');
  }, [highScore]);

  const handlePlayAgain = useCallback(() => {
    setGameId(id => id + 1); // Reset game component with a new key
    setGameState('playing');
  }, []);

  const handleMainMenu = useCallback(() => {
    setGameState('selectDifficulty');
  }, []);

  useEffect(() => {
    if (!audioInitialized) return;
    if (gameState === 'playing' && !muted) {
      soundManager.startMusic();
    } else {
      soundManager.stopMusic();
    }
  }, [gameState, audioInitialized, muted]);


  const renderGameState = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartGame} onCustomize={handleCustomize} muted={muted} onToggleMute={handleToggleMute} />;
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
      <div className="text-lg text-yellow-400 font-bold mb-2">HIGH SCORE: {highScore}</div>
      <GameScreen>
        {renderGameState()}
      </GameScreen>
      <Confetti trigger={showConfetti} />
    </main>
  );
};

export default App;