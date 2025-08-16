# 🧀 CheeseRate

Una aplicación estilo Vivino para descubrir, valorar y compartir quesos. Desarrollada con React Native + Expo y Supabase.

## 🚀 Características

- **Autenticación**: Magic link sin contraseñas
- **Base de datos real**: PostgreSQL con Supabase
- **Almacenamiento**: Fotos de quesos con thumbnails automáticos
- **Feed social**: Actividad de usuarios en tiempo real
- **Sistema de reviews**: Valoraciones con fotos y notas
- **Seguimiento**: Follow/unfollow entre usuarios
- **Cross-platform**: iOS, Android y Web

## 🛠️ Stack Tecnológico

- **Frontend**: React Native + Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Autenticación**: Magic link + OAuth
- **Almacenamiento**: Supabase Storage con Edge Functions
- **Base de datos**: PostgreSQL con RLS
- **Deploy**: Expo + Supabase

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Expo CLI
- Cuenta de Supabase

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd cheese-rate
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Configurar Supabase

#### Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL y anon key del proyecto

#### Ejecutar el esquema de base de datos

1. Ve al SQL Editor en tu dashboard de Supabase
2. Copia y ejecuta el contenido de `supabase/schema.sql`

#### Configurar Storage

1. Ve a Storage en tu dashboard de Supabase
2. Crea dos buckets:
   - `cheese-photos` (público)
   - `user-uploads` (privado)

#### Configurar políticas de Storage

```sql
-- Política para cheese-photos (lectura pública)
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'cheese-photos');

-- Política para user-uploads (solo owner)
CREATE POLICY "Users can upload own files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own files" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

#### Desplegar Edge Function

1. Instala Supabase CLI:
```bash
npm install -g supabase
```

2. Inicia sesión:
```bash
supabase login
```

3. Vincula tu proyecto:
```bash
supabase link --project-ref your-project-ref
```

4. Despliega la Edge Function:
```bash
supabase functions deploy img-thumb
```

### 5. Importar datos iniciales

Ejecuta el script de seed para importar los quesos:

```bash
# Configura las variables de entorno para el script
export SUPABASE_URL=your_supabase_url
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Ejecuta el script
npx ts-node scripts/seed-cheeses.ts
```

## 🚀 Ejecutar la aplicación

### Desarrollo local

```bash
# Iniciar en web
npx expo start --web

# Iniciar en iOS
npx expo start --ios

# Iniciar en Android
npx expo start --android
```

### Build para producción

```bash
# Build para web
npx expo build:web

# Build para iOS
npx expo build:ios

# Build para Android
npx expo build:android
```

## 📱 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AuthProvider.tsx # Provider de autenticación
│   ├── SafeImage.tsx    # Componente de imagen segura
│   └── ...
├── screens/             # Pantallas de la aplicación
│   ├── LoginScreen.tsx  # Pantalla de login
│   ├── HomeRecommendedScreen.tsx
│   ├── ExploreScreen.tsx
│   ├── CameraScreen.tsx
│   ├── FollowingScreen.tsx
│   ├── MyCheesesScreen.tsx
│   └── CheeseDetailScreen.tsx
├── navigation/          # Configuración de navegación
│   ├── AppNavigator.tsx
│   └── TabNavigator.tsx
├── lib/                 # Utilidades y helpers
│   ├── supabase.ts      # Cliente y helpers de Supabase
│   ├── storage.ts       # Helpers de almacenamiento
│   ├── reco.ts          # Lógica de recomendaciones
│   ├── ocr.ts           # Simulación de OCR
│   └── format.ts        # Utilidades de formato
├── constants/           # Constantes y configuración
│   └── designSystem.ts  # Sistema de diseño
└── types/               # Tipos TypeScript
    └── index.ts

supabase/
├── schema.sql           # Esquema de base de datos
└── functions/
    └── img-thumb/       # Edge Function para thumbnails
        └── index.ts

scripts/
└── seed-cheeses.ts      # Script de importación de datos
```

## 🔐 Autenticación

La aplicación usa magic links de Supabase:

1. El usuario ingresa su email
2. Recibe un enlace mágico por email
3. Al hacer clic, se autentica automáticamente
4. Se crea un perfil automáticamente

## 📊 Base de Datos

### Tablas principales:

- **profiles**: Perfiles de usuario
- **cheeses**: Catálogo de quesos
- **reviews**: Valoraciones de usuarios
- **photos**: Fotos de quesos
- **follows**: Relaciones de seguimiento
- **activities**: Feed de actividad

### RLS (Row Level Security):

- Usuarios solo pueden editar sus propios datos
- Fotos requieren aprobación antes de ser públicas
- Lectura pública de quesos y reviews aprobadas

## 🖼️ Almacenamiento

### Buckets:

- **cheese-photos**: Fotos públicas de quesos
- **user-uploads**: Fotos privadas de usuarios

### Proceso de subida:

1. Usuario sube foto → `user-uploads`
2. Edge Function genera thumbnails
3. Moderación aprueba/rechaza
4. Si aprobada → mueve a `cheese-photos`

## 🔧 Configuración Avanzada

### Variables de entorno adicionales:

```env
# Para desarrollo local
EXPO_PUBLIC_ENV=development

# Para producción
EXPO_PUBLIC_ENV=production
```

### Configuración de Expo:

```json
{
  "expo": {
    "scheme": "cheeserate",
    "web": {
      "bundler": "metro"
    }
  }
}
```

## 🚀 Deploy

### Web (Vercel/Netlify)

1. Conecta tu repositorio
2. Configura las variables de entorno
3. Build command: `npx expo build:web`
4. Output directory: `web-build`

### Mobile (EAS Build)

1. Instala EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Configura EAS:
```bash
eas build:configure
```

3. Build para producción:
```bash
eas build --platform all
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests de integración
npm run test:integration
```

## 📝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentación**: [Wiki](https://github.com/your-repo/wiki)
- **Email**: support@cheeserate.com

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) por el backend
- [Expo](https://expo.dev) por el framework
- [React Navigation](https://reactnavigation.org) por la navegación
- Comunidad de quesos por las fotos y datos

---

**¡Disfruta explorando el mundo de los quesos! 🧀**
