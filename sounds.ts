// --- AUDIO FILE URLS ---
// Using URLs from reliable CDNs with correct CORS headers to prevent loading errors.

const laserSoundSrc = 'https://cdn.freesound.org/previews/27/27568_32267-lq.mp3';
const explosionSoundSrc = 'https://cdn.freesound.org/previews/51/51485_40915-lq.mp3';
const gameOverSoundSrc = 'https://cdn.freesound.org/previews/45/45696_40915-lq.mp3';
const backgroundMusicSrc = 'https://cdn.pixabay.com/audio/2022/10/11/audio_62f1c84b90.mp3';

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