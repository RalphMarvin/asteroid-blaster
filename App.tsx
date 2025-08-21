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
  const [badge, setBadge] = useState<string | null>(null);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
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

  const getBadgeName = (score: number) => {
    if (score >= 10000) return 'Lord of the Asteroids';
    if (score >= 8500) return 'Galaxy Destroyer';
    if (score >= 5000) return 'Mr Shooter';
    if (score >= 2500) return 'The Rookie';
    return null;
  };

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
    let earnedBadge = null;
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('asteroidBlasterHighScore', score.toString());
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      earnedBadge = getBadgeName(score);
      setBadge(earnedBadge);
      if (earnedBadge) {
        setShowBadgePopup(true);
      }
    } else {
      // If not a new high score, show badge for current high score
      earnedBadge = getBadgeName(highScore);
      setBadge(earnedBadge);
      if (earnedBadge) {
        setShowBadgePopup(true);
      }
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


  // Compute badge for current high score
  const currentBadge = getBadgeName(highScore);

  const renderGameState = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartGame} onCustomize={handleCustomize} muted={muted} onToggleMute={handleToggleMute} badge={currentBadge} highScore={highScore} />;
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
      {showBadgePopup && badge && (
        <div className="fixed top-1/2 left-1/2 z-[9999]" style={{ transform: 'translate(-50%, -50%)' }}>
          <div className="bg-gradient-to-br from-cyan-700 via-purple-700 to-yellow-500 border-4 border-yellow-400 rounded-xl shadow-2xl px-10 py-8 text-center animate-bounce relative">
            <button
              onClick={() => setShowBadgePopup(false)}
              className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-full text-lg font-bold hover:bg-red-500 transition"
              aria-label="Close badge popup"
            >✕</button>
            <div className="text-4xl font-extrabold text-yellow-300 mb-2" style={{ textShadow: '0 0 10px #fff' }}>BADGE UNLOCKED!</div>
            <div className="text-2xl font-bold text-white mb-2">{badge}</div>
            <div className="text-lg text-cyan-200">Congratulations, you earned a new badge!</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;