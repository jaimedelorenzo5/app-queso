# 📸 Guía de Fotos de Quesos - CheeseRate

## 🎯 Objetivo

Esta guía establece las mejores prácticas para obtener y usar fotos de quesos de manera legal, ética y sostenible en CheeseRate.

## 📋 Fuentes Legales y Éticas

### 1. **Wikimedia Commons** ⭐ (Recomendado)
- **Licencia**: CC-BY, CC-BY-SA
- **Ventajas**: Gran cantidad de fotos, licencias claras, atribución simple
- **Uso**: Ideal para quesos tradicionales y históricos
- **Atribución**: `Foto: [Autor] - Licencia: CC-BY`

### 2. **Open Food Facts** ⭐ (Recomendado)
- **Licencia**: CC-BY-SA
- **Ventajas**: Base de datos abierta, fotos de productos reales
- **Uso**: Perfecto para quesos comerciales y empaquetados
- **Atribución**: `Foto: [Producto] - Licencia: CC-BY-SA`

### 3. **Unsplash** (Para fotos generales)
- **Licencia**: CC0 (Dominio público)
- **Ventajas**: Fotos de alta calidad, sin atribución requerida
- **Uso**: Fotos artísticas de quesos, no productos específicos
- **Atribución**: Opcional pero apreciada

### 4. **Productores Oficiales** (Con permiso)
- **Licencia**: Commercial (con permiso)
- **Ventajas**: Fotos oficiales de alta calidad
- **Uso**: Quesos de productores que colaboran
- **Proceso**: Contactar por email, guardar permiso

### 5. **Usuarios de la App** (Comunidad)
- **Licencia**: Commercial (con atribución)
- **Ventajas**: Fotos reales de usuarios
- **Uso**: Fotos subidas por la comunidad
- **Atribución**: `Foto: [Usuario] - CheeseRate`

## 🚫 Fuentes a Evitar

### ❌ **Supermercados sin permiso**
- **Problema**: Derechos de autor del retailer
- **Riesgo**: Reclamaciones legales
- **Alternativa**: Contactar para permiso oficial

### ❌ **Hotlinking de terceros**
- **Problema**: Dependencia de servidores externos
- **Riesgo**: Fotos que desaparecen
- **Alternativa**: Descargar y hospedar localmente

### ❌ **Scraping automático**
- **Problema**: Puede violar ToS
- **Riesgo**: IP bloqueada
- **Alternativa**: APIs oficiales o contacto directo

## 📝 Proceso de Obtención de Fotos

### 1. **Búsqueda Automática**
```typescript
// Buscar en múltiples fuentes
const photos = await searchCheesePhotos(cheeseId, cheeseName);
```

### 2. **Selección Manual**
- Revisar calidad de imagen
- Verificar licencia
- Comprobar atribución correcta

### 3. **Descarga y Procesamiento**
```typescript
// Descargar y procesar
const cheesePhoto = await downloadAndProcessPhoto(photoSource, cheeseId);
```

### 4. **Almacenamiento**
- Subir a Supabase Storage
- Generar thumbnails automáticamente
- Guardar metadatos en base de datos

### 5. **Atribución**
- Mostrar créditos en la app
- Enlazar a fuente original
- Respetar términos de licencia

## 🎨 Atribuciones por Tipo de Licencia

### CC-BY (Creative Commons Atribución)
```
Foto: [Nombre del Autor] - Licencia: CC-BY
Fuente: [URL de Wikimedia Commons]
```

### CC-BY-SA (Creative Commons Atribución + Compartir Igual)
```
Foto: [Nombre del Producto] - Licencia: CC-BY-SA
Fuente: [URL de Open Food Facts]
```

### CC0 (Dominio Público)
```
Foto: [Título] - Licencia: CC0 (Dominio público)
Fuente: [URL de Unsplash]
```

### Commercial (Con Permiso)
```
Foto: [Productor] - Licencia: Uso comercial con permiso
Fuente: [URL del productor]
```

## 🔧 Implementación Técnica

### Estructura de Base de Datos
```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY,
  cheese_id TEXT REFERENCES cheeses(id),
  user_id UUID REFERENCES profiles(id),
  url TEXT NOT NULL,
  url_public TEXT,
  width INTEGER,
  height INTEGER,
  approved BOOLEAN DEFAULT FALSE,
  license TEXT,
  author TEXT,
  source_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Flujo de Moderación
1. **Subida**: Usuario sube foto → `user-uploads`
2. **Revisión**: Moderador revisa foto y atribución
3. **Aprobación**: Si OK → mover a `cheese-photos`
4. **Publicación**: Foto disponible en la app

### Componentes de UI
- `PhotoSearchModal`: Buscar fotos de fuentes legales
- `PhotoAttribution`: Mostrar créditos de imagen
- `PhotoGallery`: Galería de fotos con atribuciones

## 📊 Métricas de Calidad

### Criterios de Aprobación
- ✅ **Resolución mínima**: 800x600px
- ✅ **Licencia válida**: CC-BY, CC-BY-SA, CC0, Commercial
- ✅ **Atribución correcta**: Autor y fuente verificados
- ✅ **Calidad visual**: Clara y representativa del queso
- ✅ **Sin marcas de agua**: Imagen limpia

### Rechazo Automático
- ❌ **Resolución muy baja**: < 400x300px
- ❌ **Licencia desconocida**: Sin información de derechos
- ❌ **Atribución faltante**: Sin autor o fuente
- ❌ **Calidad pobre**: Borrosa, oscura, no representativa

## 🤝 Colaboración con Productores

### Email Template para Solicitar Permiso
```
Asunto: Solicitud de uso de fotos para CheeseRate

Estimado [Nombre del Productor],

Somos CheeseRate, una aplicación para descubrir y valorar quesos. 
Nos gustaría solicitar permiso para usar fotos de sus productos 
en nuestra aplicación.

Detalles:
- Uso: Mostrar en catálogo de quesos
- Atribución: Incluir nombre del productor
- Sin fines comerciales directos
- Créditos visibles en la app

¿Podrían proporcionarnos fotos de alta calidad de sus productos?

Saludos cordiales,
Equipo CheeseRate
```

### Seguimiento de Permisos
- Guardar emails de permiso
- Documentar términos específicos
- Renovar permisos anualmente

## 🔄 Mantenimiento Continuo

### Revisión Periódica
- **Mensual**: Verificar que las URLs de atribución funcionen
- **Trimestral**: Revisar licencias y permisos
- **Anual**: Renovar permisos comerciales

### Actualización de Fotos
- Reemplazar fotos de baja calidad
- Añadir fotos de nuevos quesos
- Mantener galerías actualizadas

### Monitoreo de Uso
- Seguimiento de descargas
- Feedback de usuarios
- Métricas de engagement

## 📚 Recursos Adicionales

### APIs y Herramientas
- [Wikimedia Commons API](https://commons.wikimedia.org/w/api.php)
- [Open Food Facts API](https://world.openfoodfacts.org/data)
- [Unsplash API](https://unsplash.com/developers)

### Documentación Legal
- [Creative Commons Licenses](https://creativecommons.org/licenses/)
- [Fair Use Guidelines](https://www.copyright.gov/fair-use/)
- [EU Copyright Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0790)

### Comunidad
- [Open Food Facts Community](https://world.openfoodfacts.org/community)
- [Wikimedia Commons Community](https://commons.wikimedia.org/wiki/Commons:Community_portal)

---

**Nota**: Esta guía se actualiza regularmente. Última actualización: Agosto 2025
