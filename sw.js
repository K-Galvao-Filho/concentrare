// Mude a versão (ex: 'v4') sempre que atualizar os arquivos para forçar a atualização.
const CACHE_NAME = 'concentrare-v3';

// Lista de todos os arquivos essenciais para o funcionamento offline.
const FILES_TO_CACHE = [
    '/',
    'index.html',
    'manifest.json',
    'css/style.css',
    // Módulos JavaScript
    'js/main.js',
    'js/audio.js',
    'js/dom.js',
    'js/state.js',
    'js/timer.js',
    'js/ui.js',
    // Ícones do PWA
    'assets/images/icon-192x192.png',
    'assets/images/icon-512x512.png',
    'assets/images/icon-maskable-512x512.png',
    'assets/images/shortcut-focus.png',
    'assets/images/shortcut-short-break.png',
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
    // Dependências Externas (CDNs)
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap'
];

// Evento 'install': Salva os arquivos essenciais no cache.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Cache aberto. Adicionando arquivos do App Shell.');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Evento 'activate': Limpa os caches antigos.
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

// Evento 'fetch': Intercepta as requisições de rede.
self.addEventListener('fetch', (event) => {
    // Não tentamos fazer cache de requisições do YouTube ou de anúncios
    if (event.request.url.includes('youtube.com') || event.request.url.includes('googlevideo.com') || event.request.url.includes('googleads')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});