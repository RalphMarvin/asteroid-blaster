// --- AUDIO FILE URLS ---
// Using URLs from reliable CDNs with correct CORS headers to prevent loading errors.

const laserSoundSrc = 'sounds/laser.mp3';
const explosionSoundSrc = 'sounds/explosion.wav';
const gameOverSoundSrc = 'sounds/game-over.wav';
const backgroundMusicSrc = 'sounds/background-music.mp3';

let laserAudio: HTMLAudioElement;
let explosionAudio: HTMLAudioElement;
let gameOverAudio: HTMLAudioElement;
let musicAudio: HTMLAudioElement;

// Cloning the audio node allows for rapid, overlapping playback, essential for things like laser sounds.
const playSound = (audio: HTMLAudioElement) => {
    if (!audio) return;
    // Set volume for sound effects
    const sound = audio.cloneNode() as HTMLAudioElement;
    sound.volume = 0.5;
    sound.play().catch(e => console.error("Error playing sound:", e));
};

const soundManager = {
    isInitialized: false,

    init() {
            if (this.isInitialized) return;
            try {
                laserAudio = new Audio(laserSoundSrc);
                explosionAudio = new Audio(explosionSoundSrc);
                gameOverAudio = new Audio(gameOverSoundSrc);
                musicAudio = new Audio(backgroundMusicSrc);
                musicAudio.loop = true;
                musicAudio.volume = 0.3; // Background music should be quieter

                // Preload audio files
                laserAudio.preload = 'auto';
                explosionAudio.preload = 'auto';
                gameOverAudio.preload = 'auto';
                musicAudio.preload = 'auto';
                laserAudio.load();
                explosionAudio.load();
                gameOverAudio.load();
                musicAudio.load();

                // Add error listeners for debugging
                [laserAudio, explosionAudio, gameOverAudio, musicAudio].forEach((audio, i) => {
                    audio.addEventListener('error', (e) => {
                        const names = ['Laser', 'Explosion', 'GameOver', 'Music'];
                        console.error(`Audio error for ${names[i]}:`, e);
                    });
                });

                this.isInitialized = true;
            } catch (e) {
                console.error("Failed to initialize audio elements:", e);
            }
    },

    playLaser() {
        if (this.isInitialized) playSound(laserAudio);
    },

    playExplosion() {
        if (this.isInitialized) playSound(explosionAudio);
    },

    playGameOver() {
        if (this.isInitialized) playSound(gameOverAudio);
    },

    startMusic() {
        if (this.isInitialized && musicAudio.paused) {
            musicAudio.play().catch(e => console.error("Error playing music:", e));
        }
    },

    stopMusic() {
        if (this.isInitialized && !musicAudio.paused) {
            musicAudio.pause();
            musicAudio.currentTime = 0;
        }
    }
};

export default soundManager;