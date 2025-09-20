const CACHE_NAME = 'concentrare-v2.3'; // Mude a versão para forçar a atualização do cache
const FILES_TO_CACHE = [
    '/',
    'index.html',
    'css/style.css',
    'js/script.js',
    'manifest.json',
    // Ícones
    'assets/images/icon-192x192.png',
    'assets/images/icon-512x512.png',
    'assets/images/icon-maskable-512x512.png',
    //'assets/images/shortcut-focus.png',
    //'assets/images/shortcut-short-break.png',
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
    'assets/sounds/ambient/brown-noise.mp3',
    'assets/sounds/ambient/lo-fi.mp3',
    'assets/sounds/ambient/beach.mp3',
    // Dependências Extern'assets/sounds/ambient/lo-fi.mp3',as
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Abrindo cache e adicionando arquivos do app shell');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});