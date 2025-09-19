const CACHE_NAME = 'pomodoro-produtivo-v1';
const FILES_TO_CACHE = [
    '/',
    'index.html',
    'css/style.css',
    'js/script.js',
    'manifest.json',
    'assets/sounds/notification.mp3',
    'assets/sounds/digital.mp3',
    'assets/sounds/bell.mp3',
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