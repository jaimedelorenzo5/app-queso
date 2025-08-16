import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  // Variables CSS equivalentes
  tabbarHeight: 72 as any,
  safeAreaTop: 0 as any,
  safeAreaBottom: 0 as any,
  
  // Contenedor de página principal
  page: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },
  
  // Barra superior pegada
  appbar: {
    position: 'absolute',
    top: 0,
    zIndex: 10 as any,
    paddingTop: 0,
    backgroundColor: '#A67C52',
  },
  
  // Contenido que hace scroll
  content: {
    flex: 1,
    paddingBottom: 72,
  },
  
  // Tabbar pegada abajo
  tabbar: {
    position: 'absolute',
    bottom: 0,
    height: 72,
    paddingBottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    zIndex: 11 as any,
  },
  
  // Hero image container
  hero: {
    height: 300,
    overflow: 'hidden',
    borderRadius: 12,
  },
  
  // Lock scroll para modales
  lockScroll: {
    overflow: 'hidden',
    height: '100%',
  },
});

// Estilos CSS para web (se aplicarán en index.html)
export const GlobalCSS = `
  :root { 
    --tabbar-h: 72px; 
    --safe-area-top: env(safe-area-inset-top);
    --safe-area-bottom: env(safe-area-inset-bottom);
  }
  
  html, body, #root { 
    height: 100%; 
    overflow: auto;
  }
  
  body { 
    overflow: auto; 
    -webkit-overflow-scrolling: touch;
  }
  
  .page {
    min-height: 100svh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background: #FFFDF8;
  }
  
  .appbar {
    position: sticky;
    top: 0;
    z-index: 10;
    padding-top: var(--safe-area-top);
    background: #A67C52;
    color: #fff;
  }
  
  .content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: calc(var(--tabbar-h) + var(--safe-area-bottom));
    scroll-behavior: smooth;
  }
  
  .tabbar {
    position: sticky;
    bottom: 0;
    height: var(--tabbar-h);
    padding-bottom: var(--safe-area-bottom);
    background: #fff;
    border-top: 1px solid rgba(0,0,0,.06);
    z-index: 11;
  }
  
  .hero {
    height: 300px;
    overflow: hidden;
    border-radius: 12px;
  }
  
  .lock-scroll, .lock-scroll body { 
    overflow: hidden; 
    height: 100%; 
  }
  
  /* Estilos específicos para WebScrollView */
  .web-scroll-view {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  .web-scroll-content {
    padding-bottom: 120px;
  }
  
  /* Forzar scroll en web */
  .web-scroll-view::-webkit-scrollbar {
    width: 8px;
  }
  
  .web-scroll-view::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .web-scroll-view::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  .web-scroll-view::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;
