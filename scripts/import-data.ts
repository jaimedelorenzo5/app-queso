import { createClient } from '@supabase/supabase-js';
import cheeseData from '../assets/data/cheese_dataset_seed.json';

// Configuración directa
const supabaseUrl = 'https://uqvozcfioupqmiapxhlw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdm96Y2Zpb3VwcW1pYXB4aGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzAwMDMsImV4cCI6MjA3MDc0NjAwM30.U22a2wfbBR7h0DbPbe1Kf2JDLFSGB3pSnjHlrq5hbzU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fotos de quesos populares
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

async function importAllData() {
  console.log('🧀 Iniciando importación completa de datos...');
  
  // 1. Importar quesos
  console.log('\n📊 Importando quesos...');
  const cheesesToImport = cheeseData.map((cheese: any) => ({
    id: cheese.id,
    name: cheese.name,
    producer: cheese.producer,
    country: cheese.country,
    region: cheese.region,
    milk_type: cheese.milkType,
    maturation: cheese.maturation,
    flavor_profile: cheese.flavorProfile,
    pairings: cheese.pairings,
    designation: cheese.designation || null,
  }));

  const { data: importedCheeses, error: cheeseError } = await supabase
    .from('cheeses')
    .upsert(cheesesToImport, { onConflict: 'id' })
    .select();

  if (cheeseError) {
    console.error('❌ Error importando quesos:', cheeseError);
  } else {
    console.log(`✅ ${importedCheeses?.length || 0} quesos importados`);
  }

  // 2. Crear perfil demo si no existe
  console.log('\n👤 Creando perfil demo...');
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: 'demo-user-id',
      username: 'DemoUser',
      avatar_url: null,
    }, { onConflict: 'id' });

  if (profileError) {
    console.error('❌ Error creando perfil demo:', profileError);
  } else {
    console.log('✅ Perfil demo creado');
  }

  // 3. Importar fotos
  console.log('\n📸 Importando fotos...');
  let photoSuccess = 0;
  let photoErrors = 0;

  for (const photo of CHEESE_PHOTOS) {
    try {
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
        console.error(`❌ Error guardando foto ${photo.name}:`, error);
        photoErrors++;
      } else {
        console.log(`✅ Foto importada: ${photo.name}`);
        photoSuccess++;
      }
    } catch (error) {
      console.error(`❌ Error procesando ${photo.name}:`, error);
      photoErrors++;
    }
  }

  console.log('\n📊 Resumen de importación:');
  console.log(`✅ Quesos: ${importedCheeses?.length || 0}`);
  console.log(`✅ Fotos: ${photoSuccess}`);
  console.log(`❌ Errores de fotos: ${photoErrors}`);

  // 4. Verificar datos
  console.log('\n🔍 Verificando datos...');
  
  const { data: verifyCheeses, error: verifyCheeseError } = await supabase
    .from('cheeses')
    .select('id, name')
    .limit(3);

  const { data: verifyPhotos, error: verifyPhotoError } = await supabase
    .from('photos')
    .select('cheese_id, url')
    .limit(3);

  if (verifyCheeseError) {
    console.error('❌ Error verificando quesos:', verifyCheeseError);
  } else {
    console.log('✅ Quesos en DB:', verifyCheeses?.map(c => c.name).join(', '));
  }

  if (verifyPhotoError) {
    console.error('❌ Error verificando fotos:', verifyPhotoError);
  } else {
    console.log('✅ Fotos en DB:', verifyPhotos?.length || 0);
  }
}

// Ejecutar importación
if (require.main === module) {
  importAllData()
    .then(() => {
      console.log('\n🎉 Importación completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en importación:', error);
      process.exit(1);
    });
}

export { importAllData };
