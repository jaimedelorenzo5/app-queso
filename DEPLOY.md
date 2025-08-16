# 🚀 Deploy de CheeseRate PWA

## 📋 Prerrequisitos

- Node.js 18+ instalado
- Cuenta en [Netlify](https://netlify.com) o [Vercel](https://vercel.com)
- Git configurado

## 🔧 Build Local

```bash
# Instalar dependencias
npm install

# Generar iconos
node scripts/generate-icons.js

# Build para web
npm run build

# Preview local
npm run preview
```

## 🌐 Deploy en Netlify

### Opción 1: Deploy Automático (Recomendado)

1. **Conectar repositorio:**
   - Ve a [Netlify](https://app.netlify.com)
   - "New site from Git"
   - Selecciona tu repositorio de GitHub/GitLab

2. **Configuración automática:**
   - Build command: `npm run build`
   - Publish directory: `web-build`
   - Netlify detectará automáticamente `netlify.toml`

3. **Variables de entorno (opcional):**
   - Ve a Site settings → Environment variables
   - Añade `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Opción 2: Deploy Manual

```bash
# Instalar CLI de Netlify
npm install -g netlify-cli

# Login
netlify login

# Deploy
npm run deploy:netlify
```

## ⚡ Deploy en Vercel

### Opción 1: Deploy Automático (Recomendado)

1. **Conectar repositorio:**
   - Ve a [Vercel](https://vercel.com)
   - "New Project"
   - Importa tu repositorio de GitHub

2. **Configuración automática:**
   - Framework: Expo
   - Vercel detectará automáticamente `vercel.json`

3. **Variables de entorno:**
   - Añade `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Opción 2: Deploy Manual

```bash
# Instalar CLI de Vercel
npm install -g vercel

# Login
vercel login

# Deploy
npm run deploy:vercel
```

## 🧀 Verificar PWA

### 1. **Lighthouse Audit**
- Abre Chrome DevTools
- Ve a Lighthouse
- Ejecuta audit de PWA
- Debería obtener 90+ puntos

### 2. **Instalación**
- **Chrome/Edge:** Banner "Instalar CheeseRate"
- **Safari (iOS):** Compartir → "Añadir a pantalla de inicio"
- **Android:** Menú → "Instalar aplicación"

### 3. **Funcionalidades PWA**
- ✅ Icono personalizado en pantalla de inicio
- ✅ Funciona offline (cache básico)
- ✅ Experiencia standalone
- ✅ Actualizaciones automáticas

## 🔍 Troubleshooting

### **Service Worker no se registra**
- Verifica que `/sw.js` esté en la raíz del build
- Comprueba que no haya errores en la consola

### **Manifest no se carga**
- Verifica que `/manifest.webmanifest` esté accesible
- Comprueba el Content-Type en Network tab

### **Iconos no se muestran**
- Verifica que los iconos estén en `/icons/`
- Comprueba las rutas en el manifest

### **No funciona offline**
- Verifica que el Service Worker esté activo
- Comprueba que los assets estén en cache

## 📱 URLs de Deploy

- **Netlify:** `https://tu-app.netlify.app`
- **Vercel:** `https://tu-app.vercel.app`

## 🎯 Próximos Pasos

1. **Configurar dominio personalizado**
2. **Añadir analytics (Google Analytics, Plausible)**
3. **Implementar push notifications**
4. **Añadir más funcionalidades offline**

---

**¡Tu app de quesos ahora es una PWA profesional desplegable!** 🧀✨
