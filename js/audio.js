// js/audio.js
import * as dom from './dom.js';

let youtubePlayer;
let audioContext;
let audioBuffers = new Map();
let currentAmbientSource = null;
let isAudioInitialized = false;

// --- LÓGICA DA API DO YOUTUBE ---
window.onYouTubeIframeAPIReady = function() {
    // ATUALIZAÇÃO IMPORTANTE AQUI
    const currentOrigin = window.location.origin;

    youtubePlayer = new YT.Player('youtube-player', {
        height: '150',
        width: '100%',
        videoId: 'jfKfPfyJRdk', 
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'origin': currentOrigin // <-- ADICIONADO: Diz ao YouTube qual é o nosso site
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.setVolume(50);
}

function playYoutubeMusic(videoId) {
    if (youtubePlayer && typeof youtubePlayer.loadVideoById === 'function') {
        youtubePlayer.loadVideoById(videoId);
    } else if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
        youtubePlayer.playVideo();
    }
}

function pauseYoutubeMusic() {
    if (youtubePlayer && typeof youtubePlayer.pauseVideo === 'function') {
        youtubePlayer.pauseVideo();
    }
}

// --- LÓGICA DA WEB AUDIO API ---
export function initAudio() {
    if (isAudioInitialized) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        document.querySelectorAll('audio').forEach(sound => {
            sound.play().catch(() => {});
            sound.pause();
            sound.currentTime = 0;
        });
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
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(audioContext.destination);
    source.start(0);
    currentAmbientSource = source;
}

function stopAmbientSound() {
    if (currentAmbientSource) {
        currentAmbientSource.stop(0);
        currentAmbientSource = null;
    }
}

// --- FUNÇÕES MESTRE DE CONTROLE ---
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