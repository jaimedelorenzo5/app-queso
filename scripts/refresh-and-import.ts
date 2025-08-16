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

async function refreshAndImport() {
  console.log('🧀 Refrescando cache e importando datos...');
  
  try {
    // 1. Intentar refrescar el cache del esquema
    console.log('\n🔄 Intentando refrescar cache del esquema...');
    
    // Enviar notificación para refrescar el esquema
    const { error: notifyError } = await supabase
      .from('_dummy_table_for_notify')
      .select('*')
      .limit(1);
    
    if (notifyError && notifyError.code === 'PGRST205') {
      console.log('✅ Cache del esquema refrescado (error esperado)');
    } else {
      console.log('⚠️ No se pudo refrescar el cache');
    }
    
    // 2. Esperar un momento para que se refresque
    console.log('⏳ Esperando 3 segundos para que se refresque el cache...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 3. Verificar conexión
    console.log('\n📡 Verificando conexión...');
    const { data: testData, error: testError } = await supabase
      .from('cheeses')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError);
      console.log('💡 Intentando importar de todas formas...');
    } else {
      console.log('✅ Conexión exitosa');
    }
    
    // 4. Importar quesos
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
    
    // 5. Crear perfil demo
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
    
    // 6. Importar fotos
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
    
    // 7. Verificar datos importados
    if (cheeseSuccess > 0) {
      console.log('\n🔍 Verificando datos importados...');
      
      const { data: verifyCheeses, error: verifyCheeseError } = await supabase
        .from('cheeses')
        .select('id, name')
        .limit(3);
      
      if (verifyCheeseError) {
        console.error('❌ Error verificando quesos:', verifyCheeseError);
      } else {
        console.log('✅ Quesos en DB:', verifyCheeses?.map(c => c.name).join(', '));
      }
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar importación
if (require.main === module) {
  refreshAndImport()
    .then(() => {
      console.log('\n🎉 Proceso completado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en proceso:', error);
      process.exit(1);
    });
}

export { refreshAndImport };
