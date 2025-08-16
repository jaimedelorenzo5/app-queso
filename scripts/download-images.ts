import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Configuración del nuevo proyecto
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para descargar una imagen
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file async
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadCheeseImages() {
  console.log('📸 Descargando imágenes de quesos...');
  
  try {
    // 1. Obtener fotos de quesos
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('cheese_id, url, author')
      .limit(10);
    
    if (photosError) {
      console.error('❌ Error obteniendo fotos:', photosError);
      return;
    }
    
    if (!photos || photos.length === 0) {
      console.log('⚠️ No hay fotos para descargar');
      return;
    }
    
    console.log(`📋 Encontradas ${photos.length} fotos para descargar`);
    
    // 2. Crear directorio de imágenes si no existe
    const imagesDir = path.join(__dirname, '../assets/images/cheeses');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log('📁 Directorio de imágenes creado');
    }
    
    // 3. Descargar cada imagen
    let successCount = 0;
    let errorCount = 0;
    
    for (const photo of photos) {
      try {
        const filename = `cheese-${photo.cheese_id}.jpg`;
        const filepath = path.join(imagesDir, filename);
        
        console.log(`⬇️ Descargando ${filename}...`);
        await downloadImage(photo.url, filepath);
        
        console.log(`✅ ${filename} descargado exitosamente`);
        successCount++;
        
        // Actualizar la URL en la base de datos para usar la imagen local
        const localUrl = `/assets/images/cheeses/${filename}`;
        const { error: updateError } = await supabase
          .from('photos')
          .update({ url: localUrl })
          .eq('id', photo.id);
        
        if (updateError) {
          console.error(`⚠️ Error actualizando URL para ${filename}:`, updateError);
        } else {
          console.log(`🔄 URL actualizada para ${filename}`);
        }
        
      } catch (error) {
        console.error(`❌ Error descargando ${photo.cheese_id}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Resumen de descarga:');
    console.log(`✅ Imágenes descargadas: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    if (successCount > 0) {
      console.log('\n💡 Las imágenes ahora están disponibles localmente en:');
      console.log(`   ${imagesDir}`);
      console.log('\n🔄 Las URLs en la base de datos han sido actualizadas');
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar descarga
if (require.main === module) {
  downloadCheeseImages()
    .then(() => {
      console.log('\n🎉 Descarga completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en descarga:', error);
      process.exit(1);
    });
}

export { downloadCheeseImages };
