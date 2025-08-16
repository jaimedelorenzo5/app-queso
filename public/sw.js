const CACHE_NAME = 'cheeserate-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('🧀 Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('❌ Error al instalar cache:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones fetch
self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Excluir peticiones a APIs externas
  if (event.request.url.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la petición es exitosa, actualizar el cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar servir desde cache
        return caches.match(event.request).then((response) => {
          if (response) {
            console.log('📱 Sirviendo desde cache:', event.request.url);
            return response;
          }
          
          // Si no está en cache, mostrar página offline
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
