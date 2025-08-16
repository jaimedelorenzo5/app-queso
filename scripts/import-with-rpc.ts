import { createClient } from '@supabase/supabase-js';

// Configuración directa
const supabaseUrl = 'https://uqvozcfioupqmiapxhlw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdm96Y2Zpb3VwcW1pYXB4aGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzAwMDMsImV4cCI6MjA3MDc0NjAwM30.U22a2wfbBR7h0DbPbe1Kf2JDLFSGB3pSnjHlrq5hbzU';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Datos de quesos de ejemplo
const SAMPLE_CHEESES = [
  {
    id: 'c1',
    name: 'Manchego Curado',
    producer: 'Quesería La Mancha',
    country: 'España',
    region: 'Castilla-La Mancha',
    milk_type: 'Oveja',
    maturation: 'Curado',
    flavor_profile: ['Nutty', 'Salty', 'Complex'],
    pairings: ['Vino tinto', 'Membrillo', 'Nueces']
  },
  {
    id: 'c2',
    name: 'Brie de Meaux',
    producer: 'Fromagerie de Meaux',
    country: 'Francia',
    region: 'Île-de-France',
    milk_type: 'Vaca',
    maturation: 'Madurado',
    flavor_profile: ['Creamy', 'Mushroom', 'Buttery'],
    pairings: ['Champagne', 'Uvas', 'Pan crujiente']
  },
  {
    id: 'c3',
    name: 'Parmigiano Reggiano',
    producer: 'Consorzio del Formaggio Parmigiano-Reggiano',
    country: 'Italia',
    region: 'Emilia-Romagna',
    milk_type: 'Vaca',
    maturation: 'Añejo',
    flavor_profile: ['Nutty', 'Salty', 'Crystalline'],
    pairings: ['Vino tinto', 'Miel', 'Pasta']
  },
  {
    id: 'c4',
    name: 'Gouda Aged',
    producer: 'Dutch Dairy Co.',
    country: 'Países Bajos',
    region: 'Holanda Meridional',
    milk_type: 'Vaca',
    maturation: 'Añejo',
    flavor_profile: ['Caramel', 'Nutty', 'Sharp'],
    pairings: ['Cerveza', 'Manzanas', 'Pan integral']
  },
  {
    id: 'c5',
    name: 'Chèvre Frais',
    producer: 'Ferme du Chèvre',
    country: 'Francia',
    region: 'Poitou-Charentes',
    milk_type: 'Cabra',
    maturation: 'Fresco',
    flavor_profile: ['Tangy', 'Creamy', 'Fresh'],
    pairings: ['Vino blanco', 'Miel', 'Frutas frescas']
  }
];

async function importWithDirectSQL() {
  console.log('🧀 Iniciando importación con SQL directo...');
  
  try {
    // 1. Crear perfil demo usando SQL directo
    console.log('\n👤 Creando perfil demo...');
    const { error: profileError } = await supabase.rpc('exec_sql', {
      sql_query: `
        INSERT INTO profiles (id, username, avatar_url)
        VALUES ('demo-user-id', 'DemoUser', null)
        ON CONFLICT (id) DO NOTHING;
      `
    });
    
    if (profileError) {
      console.log('⚠️ Error creando perfil (puede que ya exista):', profileError.message);
    } else {
      console.log('✅ Perfil demo creado');
    }
    
    // 2. Importar quesos uno por uno
    console.log('\n📊 Importando quesos...');
    let cheeseSuccess = 0;
    let cheeseErrors = 0;
    
    for (const cheese of SAMPLE_CHEESES) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: `
            INSERT INTO cheeses (id, name, producer, country, region, milk_type, maturation, flavor_profile, pairings)
            VALUES (
              '${cheese.id}',
              '${cheese.name.replace(/'/g, "''")}',
              '${cheese.producer.replace(/'/g, "''")}',
              '${cheese.country}',
              '${cheese.region}',
              '${cheese.milk_type}',
              '${cheese.maturation}',
              '${JSON.stringify(cheese.flavor_profile)}',
              '${JSON.stringify(cheese.pairings)}'
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              producer = EXCLUDED.producer,
              country = EXCLUDED.country,
              region = EXCLUDED.region,
              milk_type = EXCLUDED.milk_type,
              maturation = EXCLUDED.maturation,
              flavor_profile = EXCLUDED.flavor_profile,
              pairings = EXCLUDED.pairings;
          `
        });
        
        if (error) {
          console.error(`❌ Error guardando ${cheese.name}:`, error.message);
          cheeseErrors++;
        } else {
          console.log(`✅ Queso importado: ${cheese.name}`);
          cheeseSuccess++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${cheese.name}:`, error);
        cheeseErrors++;
      }
    }
    
    // 3. Importar fotos
    console.log('\n📸 Importando fotos...');
    const photos = [
      {
        cheese_id: 'c1',
        url: 'https://images.unsplash.com/photo-1589881133595-a3b0852de3c5?w=800&fit=crop&crop=center',
        author: 'Unsplash',
        license: 'CC0'
      },
      {
        cheese_id: 'c2',
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&fit=crop&crop=center',
        author: 'Unsplash',
        license: 'CC0'
      },
      {
        cheese_id: 'c3',
        url: 'https://images.unsplash.com/photo-1589881133595-a3b0852de3c5?w=800&fit=crop&crop=center',
        author: 'Unsplash',
        license: 'CC0'
      }
    ];
    
    let photoSuccess = 0;
    let photoErrors = 0;
    
    for (const photo of photos) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: `
            INSERT INTO photos (cheese_id, user_id, url, url_public, width, height, approved, license, author)
            VALUES (
              '${photo.cheese_id}',
              'demo-user-id',
              '${photo.url}',
              '${photo.url}',
              800,
              600,
              true,
              '${photo.license}',
              '${photo.author}'
            );
          `
        });
        
        if (error) {
          console.error(`❌ Error guardando foto para ${photo.cheese_id}:`, error.message);
          photoErrors++;
        } else {
          console.log(`✅ Foto importada para queso ${photo.cheese_id}`);
          photoSuccess++;
        }
      } catch (error) {
        console.error(`❌ Error procesando foto ${photo.cheese_id}:`, error);
        photoErrors++;
      }
    }
    
    console.log('\n📊 Resumen de importación:');
    console.log(`✅ Quesos: ${cheeseSuccess}`);
    console.log(`✅ Fotos: ${photoSuccess}`);
    console.log(`❌ Errores de quesos: ${cheeseErrors}`);
    console.log(`❌ Errores de fotos: ${photoErrors}`);
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar importación
if (require.main === module) {
  importWithDirectSQL()
    .then(() => {
      console.log('\n🎉 Importación completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en importación:', error);
      process.exit(1);
    });
}

export { importWithDirectSQL };
