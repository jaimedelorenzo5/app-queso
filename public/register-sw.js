// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('🧀 Service Worker registrado exitosamente:', registration.scope);
        
        // Verificar si hay una nueva versión disponible
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                console.log('🔄 Nueva versión de CheeseRate disponible');
                
                // Mostrar notificación al usuario
                if (confirm('Hay una nueva versión disponible. ¿Quieres actualizar?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Error registrando Service Worker:', error);
      });
  });
  
  // Manejar actualizaciones del Service Worker
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
} else {
  console.log('❌ Service Worker no soportado en este navegador');
}
