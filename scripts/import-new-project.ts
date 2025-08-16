import { createClient } from '@supabase/supabase-js';

// Configuración del nuevo proyecto
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

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
  },
  {
    id: 'c6',
    name: 'Roquefort',
    producer: 'Société des Caves',
    country: 'Francia',
    region: 'Occitanie',
    milk_type: 'Oveja',
    maturation: 'Azul',
    flavor_profile: ['Salty', 'Tangy', 'Sharp'],
    pairings: ['Vino dulce', 'Nueces', 'Miel']
  },
  {
    id: 'c7',
    name: 'Cheddar Aged',
    producer: 'English Dairy Farm',
    country: 'Reino Unido',
    region: 'Somerset',
    milk_type: 'Vaca',
    maturation: 'Añejo',
    flavor_profile: ['Sharp', 'Nutty', 'Crystalline'],
    pairings: ['Cerveza', 'Manzanas', 'Pan integral']
  },
  {
    id: 'c8',
    name: 'Mozzarella di Bufala',
    producer: 'Caseificio Campano',
    country: 'Italia',
    region: 'Campania',
    milk_type: 'Búfala',
    maturation: 'Fresco',
    flavor_profile: ['Creamy', 'Mild', 'Fresh'],
    pairings: ['Tomates', 'Albahaca', 'Vino blanco']
  }
];

async function importToNewProject() {
  console.log('🧀 Iniciando importación al nuevo proyecto...');
  
  try {
    // 1. Verificar conexión
    console.log('📡 Verificando conexión...');
    const { data: testData, error: testError } = await supabase
      .from('cheeses')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError);
      return;
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
      },
      {
        cheese_id: 'c3',
        url: 'https://images.unsplash.com/photo-1589881133595-a3b0852de3c5?w=800&fit=crop&crop=center',
        author: 'Unsplash',
        license: 'CC0'
      },
      {
        cheese_id: 'c4',
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&fit=crop&crop=center',
        author: 'Unsplash',
        license: 'CC0'
      },
      {
        cheese_id: 'c5',
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
    
    // 5. Crear algunas reseñas de ejemplo
    console.log('\n⭐ Creando reseñas de ejemplo...');
    const reviews = [
      {
        cheese_id: 'c1',
        user_id: 'demo-user-id',
        stars: 5,
        note: 'Excelente queso manchego, perfecto para acompañar con vino tinto.'
      },
      {
        cheese_id: 'c2',
        user_id: 'demo-user-id',
        stars: 4,
        note: 'Brie muy cremoso y sabroso, ideal para untar en pan.'
      },
      {
        cheese_id: 'c3',
        user_id: 'demo-user-id',
        stars: 5,
        note: 'Parmigiano excepcional, perfecto para rallar sobre pasta.'
      }
    ];
    
    let reviewSuccess = 0;
    let reviewErrors = 0;
    
    for (const review of reviews) {
      try {
        const { error } = await supabase
          .from('reviews')
          .upsert(review, { onConflict: 'cheese_id,user_id' });
        
        if (error) {
          console.error(`❌ Error guardando reseña para ${review.cheese_id}:`, error);
          reviewErrors++;
        } else {
          console.log(`✅ Reseña creada para queso ${review.cheese_id}`);
          reviewSuccess++;
        }
      } catch (error) {
        console.error(`❌ Error procesando reseña ${review.cheese_id}:`, error);
        reviewErrors++;
      }
    }
    
    console.log('\n📊 Resumen de importación:');
    console.log(`✅ Quesos: ${cheeseSuccess}`);
    console.log(`✅ Fotos: ${photoSuccess}`);
    console.log(`✅ Reseñas: ${reviewSuccess}`);
    console.log(`❌ Errores de quesos: ${cheeseErrors}`);
    console.log(`❌ Errores de fotos: ${photoErrors}`);
    console.log(`❌ Errores de reseñas: ${reviewErrors}`);
    
    // 6. Verificar datos importados
    if (cheeseSuccess > 0) {
      console.log('\n🔍 Verificando datos importados...');
      
      const { data: verifyCheeses, error: verifyCheeseError } = await supabase
        .from('cheeses')
        .select('id, name, country')
        .limit(5);
      
      if (verifyCheeseError) {
        console.error('❌ Error verificando quesos:', verifyCheeseError);
      } else {
        console.log('✅ Quesos en DB:', verifyCheeses?.map(c => `${c.name} (${c.country})`).join(', '));
      }
      
      const { data: verifyPhotos, error: verifyPhotoError } = await supabase
        .from('photos')
        .select('cheese_id, url')
        .limit(3);
      
      if (verifyPhotoError) {
        console.error('❌ Error verificando fotos:', verifyPhotoError);
      } else {
        console.log(`✅ Fotos en DB: ${verifyPhotos?.length || 0}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar importación
if (require.main === module) {
  importToNewProject()
    .then(() => {
      console.log('\n🎉 Importación completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en importación:', error);
      process.exit(1);
    });
}

export { importToNewProject };
