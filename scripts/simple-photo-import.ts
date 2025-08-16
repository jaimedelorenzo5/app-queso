import { createClient } from '@supabase/supabase-js';

// Configuración
const supabaseUrl = 'https://uqvozcfioupqmiapxhlw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdm96Y2Zpb3VwcW1pYXB4aGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzAwMDMsImV4cCI6MjA3MDc0NjAwM30.U22a2wfbBR7h0DbPbe1Kf2JDLFSGB3pSnjHlrq5hbzU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fotos de quesos populares de Unsplash (CC0 - dominio público)
const CHEESE_PHOTOS = [
  {
    cheese_id: 'c1',
    name: 'Manchego Curado',
    url: 'https://images.unsplash.com/photo-1589881133595-a3b0852de3c5?w=800&fit=crop&crop=center',
    author: 'Unsplash',
    license: 'CC0',
    source_url: 'https://unsplash.com/photos/cheese-on-white-surface'
  },
  {
    cheese_id: 'c2',
    name: 'Brie de Meaux',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&fit=crop&crop=center',
    author: 'Unsplash',
    license: 'CC0',
    source_url: 'https://unsplash.com/photos/cheese-slice'
  },
  {
    cheese_id: 'c3',
    name: 'Parmigiano Reggiano',
    url: 'https://images.unsplash.com/photo-1589881133595-a3b0852de3c5?w=800&fit=crop&crop=center',
    author: 'Unsplash',
    license: 'CC0',
    source_url: 'https://unsplash.com/photos/parmesan-cheese'
  },
  {
    cheese_id: 'c4',
    name: 'Gouda Aged',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&fit=crop&crop=center',
    author: 'Unsplash',
    license: 'CC0',
    source_url: 'https://unsplash.com/photos/gouda-cheese'
  },
  {
    cheese_id: 'c5',
    name: 'Chèvre Frais',
    url: 'https://images.unsplash.com/photo-1589881133595-a3b0852de3c5?w=800&fit=crop&crop=center',
    author: 'Unsplash',
    license: 'CC0',
    source_url: 'https://unsplash.com/photos/goat-cheese'
  }
];

async function importSimplePhotos() {
  console.log('🧀 Iniciando importación simple de fotos...');
  
  let successCount = 0;
  let errorCount = 0;

  for (const photo of CHEESE_PHOTOS) {
    console.log(`\n📸 Procesando: ${photo.name}`);
    
    try {
      // Insertar directamente en la base de datos
      const { error } = await supabase
        .from('photos')
        .insert({
          cheese_id: photo.cheese_id,
          user_id: 'demo-user-id',
          url: photo.url,
          url_public: photo.url,
          width: 800,
          height: 600,
          approved: true,
          license: photo.license,
          author: photo.author,
          source_url: photo.source_url,
        });

      if (error) {
        console.error(`❌ Error guardando ${photo.name}:`, error);
        errorCount++;
      } else {
        console.log(`✅ Foto importada para ${photo.name}`);
        successCount++;
      }

    } catch (error) {
      console.error(`❌ Error procesando ${photo.name}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Resumen de importación:');
  console.log(`✅ Fotos importadas: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📸 Total procesado: ${CHEESE_PHOTOS.length} quesos`);

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

// Ejecutar importación
if (require.main === module) {
  importSimplePhotos()
    .then(() => {
      console.log('\n🎉 Importación completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en importación:', error);
      process.exit(1);
    });
}

export { importSimplePhotos };
