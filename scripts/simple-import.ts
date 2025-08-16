import { createClient } from '@supabase/supabase-js';

// Configuración directa
const supabaseUrl = 'https://uqvozcfioupqmiapxhlw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdm96Y2Zpb3VwcW1pYXB4aGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzAwMDMsImV4cCI6MjA3MDc0NjAwM30.U22a2wfbBR7h0DbPbe1Kf2JDLFSGB3pSnjHlrq5hbzU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  }
];

async function simpleImport() {
  console.log('🧀 Iniciando importación simple...');
  
  try {
    // 1. Verificar conexión
    console.log('📡 Verificando conexión...');
    const { data: testData, error: testError } = await supabase
      .from('cheeses')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError);
      console.log('💡 Intentando con configuración diferente...');
      
      // Intentar con configuración diferente
      const supabase2 = createClient(supabaseUrl, supabaseAnonKey, {
        db: {
          schema: 'public'
        }
      });
      
      const { data: testData2, error: testError2 } = await supabase2
        .from('cheeses')
        .select('id')
        .limit(1);
      
      if (testError2) {
        console.error('❌ Error persistente:', testError2);
        return;
      } else {
        console.log('✅ Conexión exitosa con configuración alternativa');
      }
    } else {
      console.log('✅ Conexión exitosa');
    }
    
    // 2. Importar quesos
    console.log('\n📊 Importando quesos...');
    let cheeseSuccess = 0;
    let cheeseErrors = 0;
    
    for (const cheese of SAMPLE_CHEESES) {
      try {
        const { data, error } = await supabase
          .from('cheeses')
          .upsert(cheese, { onConflict: 'id' })
          .select();
        
        if (error) {
          console.error(`❌ Error guardando ${cheese.name}:`, error);
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
    
    // 3. Crear perfil demo
    console.log('\n👤 Creando perfil demo...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: 'demo-user-id',
        username: 'DemoUser',
        avatar_url: null,
      }, { onConflict: 'id' });
    
    if (profileError) {
      console.error('❌ Error creando perfil:', profileError);
    } else {
      console.log('✅ Perfil demo creado');
    }
    
    // 4. Importar fotos
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
      }
    ];
    
    let photoSuccess = 0;
    let photoErrors = 0;
    
    for (const photo of photos) {
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
          });
        
        if (error) {
          console.error(`❌ Error guardando foto para ${photo.cheese_id}:`, error);
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
  simpleImport()
    .then(() => {
      console.log('\n🎉 Importación completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en importación:', error);
      process.exit(1);
    });
}

export { simpleImport };
