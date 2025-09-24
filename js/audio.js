import * as dom from './dom.js';
import * as state from './state.js';

let youtubePlayer;
let audioContext;
let audioBuffers = new Map();
let currentAmbientSource = null;
let gainNode = null; // Nó de ganho para controle de volume
let isAudioInitialized = false;

export function initializeYouTubeAPI() {
    const currentOrigin = window.location.origin;
    youtubePlayer = new YT.Player('youtube-player', {
        height: '150',
        width: '100%',
        videoId: 'jfKfPfyJRdk',
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'origin': currentOrigin
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Define o volume inicial com base nas configurações carregadas
    event.target.setVolume(state.settings.ambientVolume * 100);
}

// Função para atualizar o volume dos sons ambientes
export function updateAmbientVolume() {
    const volume = state.settings.ambientVolume;
    if (gainNode && audioContext) {
        // O valor do ganho é linear (0 a 1)
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }
    if (youtubePlayer && typeof youtubePlayer.setVolume === 'function') {
        // A API do YouTube usa um valor de 0 a 100
        youtubePlayer.setVolume(volume * 100);
    }
}


function playYoutubeMusic(videoId) {
    if (youtubePlayer && typeof youtubePlayer.loadVideoById === 'function') {
        updateAmbientVolume(); // Garante que o volume está correto
        youtubePlayer.loadVideoById(videoId);
        youtubePlayer.playVideo(); // Adicionado para garantir que o vídeo toque ao carregar
    } else if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
        youtubePlayer.playVideo();
    }
}

function pauseYoutubeMusic() {
    if (youtubePlayer && typeof youtubePlayer.pauseVideo === 'function') {
        youtubePlayer.pauseVideo();
    }
}

export function initAudio() {
    if (isAudioInitialized) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Inicializa o nó de ganho principal
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        isAudioInitialized = true;
        console.log("Contexto de áudio inicializado com sucesso.");
    } catch (e) { console.error("Web Audio API não é suportada.", e); }
}

async function getAudioBuffer(soundId) {
    if (audioBuffers.has(soundId)) { return audioBuffers.get(soundId); }
    if (!audioContext) { return null; }
    try {
        const response = await fetch(`assets/sounds/ambient/${soundId}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers.set(soundId, audioBuffer);
        return audioBuffer;
    } catch (error) { console.error(`Erro ao carregar o som ${soundId}:`, error); return null; }
}

async function playAmbientSound(soundId) {
    if (soundId === 'none' || !audioContext) return;
    const buffer = await getAudioBuffer(soundId);
    if (!buffer) return;
    
    // Garante que o nó de ganho exista e esteja conectado
    if (!gainNode) {
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
    }
    
    // Define o volume atual das configurações
    updateAmbientVolume();
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNode); // Conecta a fonte ao nó de ganho
    source.start(0);
    currentAmbientSource = source;
}

function stopAmbientSound() {
    if (currentAmbientSource) {
        currentAmbientSource.stop(0);
        currentAmbientSource = null;
    }
}

export function playSelectedSound(soundId) {
    stopAllSounds();
    if (soundId.startsWith('youtube_')) {
        dom.youtubePlayerContainer.classList.remove('hidden');
        const videoId = soundId.substring(8);
        playYoutubeMusic(videoId);
    } else {
        dom.youtubePlayerContainer.classList.add('hidden');
        playAmbientSound(soundId);
    }
}

export function stopAllSounds() {
    stopAmbientSound();
    pauseYoutubeMusic();
}