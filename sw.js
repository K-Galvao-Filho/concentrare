const CACHE_NAME = 'concentrare-v5'; // Aumentamos a versão para forçar a atualização do cache

// Lista de arquivos locais para o funcionamento offline.
const FILES_TO_CACHE = [
    '/',
    'index.html',
    'manifest.json',
    // Arquivos CSS
    'css/style.css',
    'css/bootstrap.min.css',
    'css/bootstrap-icons.min.css',
    'css/fonts.css',
    // Módulos JavaScript
    'js/main.js',
    'js/audio.js',
    'js/dom.js',
    'js/state.js',
    'js/timer.js',
    'js/ui.js',
    'js/bootstrap.bundle.min.js',
    // Ícones do PWA
    'assets/images/icon-192x192.png',
    'assets/images/icon-512x512.png',
    'assets/images/icon-maskable-512x512.png',
    'assets/images/shortcut-focus.png',
    'assets/images/shortcut-short-break.png',
    // Fontes
    'assets/fonts/bootstrap-icons.woff2',
    'assets/fonts/XRXV3I6Li01BKofIMeaBXso.woff2',
    'assets/fonts/XRXV3I6Li01BKofINeaB.woff2',
    'assets/fonts/XRXV3I6Li01BKofIO-aBXso.woff2',
    'assets/fonts/XRXV3I6Li01BKofIOOaBXso.woff2',
    'assets/fonts/XRXV3I6Li01BKofIOuaBXso.woff2',
    // Sons de Alarme
    'assets/sounds/notification.mp3',
    'assets/sounds/digital.mp3',
    'assets/sounds/bell.mp3',
    // Sons de Ambiente
    'assets/sounds/ambient/tick-tock.mp3',
    'assets/sounds/ambient/gentle-rain.mp3',
    'assets/sounds/ambient/heavy-rain.mp3',
    'assets/sounds/ambient/night-forest.mp3',
    'assets/sounds/ambient/library.mp3',
    'assets/sounds/ambient/beach.mp3',
    'assets/sounds/ambient/brown-noise.mp3',
    'assets/sounds/ambient/lo-fi.mp3'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Cache aberto. Adicionando arquivos do App Shell.');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`[Service Worker] Limpando cache antigo: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('youtube.com') || event.request.url.includes('googlevideo.com')) {
        return; // Ignora as requisições do YouTube, que precisam de rede
    }
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});