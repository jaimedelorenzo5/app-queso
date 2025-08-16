import { createClient } from '@supabase/supabase-js';
import { searchCheesePhotos, downloadAndProcessPhoto } from '../src/lib/photoSources';

// Configuración
const supabaseUrl = process.env.SUPABASE_URL || 'https://uqvozcfioupqmiapxhlw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Quesos populares para importar fotos
const POPULAR_CHEESES = [
  { id: 'c1', name: 'Manchego Curado' },
  { id: 'c2', name: 'Brie de Meaux' },
  { id: 'c3', name: 'Parmigiano Reggiano' },
  { id: 'c4', name: 'Gouda Aged' },
  { id: 'c5', name: 'Chèvre Frais' },
  { id: 'c6', name: 'Roquefort' },
  { id: 'c7', name: 'Mozzarella di Bufala' },
  { id: 'c8', name: 'Cheddar Aged' },
  { id: 'c9', name: 'Camembert de Normandie' },
  { id: 'c10', name: 'Pecorino Romano' },
];

async function importCheesePhotos() {
  console.log('🧀 Iniciando importación de fotos de quesos...');
  
  let successCount = 0;
  let errorCount = 0;

  for (const cheese of POPULAR_CHEESES) {
    console.log(`\n📸 Buscando fotos para: ${cheese.name}`);
    
    try {
      // Buscar fotos disponibles
      const photoSources = await searchCheesePhotos(cheese.id, cheese.name);
      
      if (photoSources.length === 0) {
        console.log(`❌ No se encontraron fotos para ${cheese.name}`);
        errorCount++;
        continue;
      }

      console.log(`✅ Encontradas ${photoSources.length} fotos para ${cheese.name}`);

      // Seleccionar la mejor foto (primera disponible)
      const bestPhoto = photoSources[0];
      console.log(`📥 Descargando: ${bestPhoto.name}`);

      // Descargar y procesar la foto
      const cheesePhoto = await downloadAndProcessPhoto(bestPhoto, cheese.id);

      // Subir a Supabase Storage
      const fileName = `${cheese.id}_${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cheese-photos')
        .upload(fileName, cheesePhoto.original_url, {
          contentType: 'image/jpeg',
          cacheControl: '31536000',
        });

      if (uploadError) {
        console.error(`❌ Error subiendo foto para ${cheese.name}:`, uploadError);
        errorCount++;
        continue;
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('cheese-photos')
        .getPublicUrl(fileName);

      // Guardar en la base de datos
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          cheese_id: cheese.id,
          user_id: 'demo-user-id', // Usuario demo
          url: publicUrlData.publicUrl,
          url_public: publicUrlData.publicUrl,
          width: cheesePhoto.width,
          height: cheesePhoto.height,
          approved: true, // Auto-aprobar fotos de fuentes confiables
          license: bestPhoto.license,
          author: bestPhoto.author,
          source_url: bestPhoto.source_url,
        });

      if (dbError) {
        console.error(`❌ Error guardando en DB para ${cheese.name}:`, dbError);
        errorCount++;
        continue;
      }

      console.log(`✅ Foto importada exitosamente para ${cheese.name}`);
      successCount++;

      // Pequeña pausa para no sobrecargar las APIs
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Error procesando ${cheese.name}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Resumen de importación:');
  console.log(`✅ Fotos importadas exitosamente: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📸 Total procesado: ${POPULAR_CHEESES.length} quesos`);

  // Verificar importación
  const { data: verifyData, error: verifyError } = await supabase
    .from('photos')
    .select('cheese_id, url, approved')
    .eq('approved', true)
    .limit(5);

  if (verifyError) {
    console.error('❌ Error verificando importación:', verifyError);
  } else {
    console.log('\n🔍 Fotos importadas:');
    verifyData?.forEach(photo => {
      console.log(`  - Queso ${photo.cheese_id}: ${photo.url ? '✅' : '❌'}`);
    });
  }
}

// Función para limpiar fotos existentes (opcional)
async function clearExistingPhotos() {
  console.log('🧹 Limpiando fotos existentes...');
  
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('user_id', 'demo-user-id');

  if (error) {
    console.error('Error limpiando fotos:', error);
  } else {
    console.log('✅ Fotos existentes eliminadas');
  }
}

// Ejecutar importación
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--clear')) {
    clearExistingPhotos()
      .then(() => importCheesePhotos())
      .then(() => {
        console.log('\n🎉 Importación completada!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n💥 Error en importación:', error);
        process.exit(1);
      });
  } else {
    importCheesePhotos()
      .then(() => {
        console.log('\n🎉 Importación completada!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n💥 Error en importación:', error);
        process.exit(1);
      });
  }
}

export { importCheesePhotos, clearExistingPhotos };
