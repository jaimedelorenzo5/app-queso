import { createClient } from '@supabase/supabase-js';

// Configuración del nuevo proyecto
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixUserAndImportData() {
  console.log('🔧 Arreglando usuario demo e importando datos restantes...');
  
  try {
    // 1. Crear perfil demo con UUID válido
    console.log('\n👤 Creando perfil demo con UUID válido...');
    const demoUserId = '550e8400-e29b-41d4-a716-446655440000'; // UUID válido
    
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: demoUserId,
        username: 'DemoUser',
        avatar_url: null,
      }, { onConflict: 'id' });
    
    if (profileError) {
      console.error('❌ Error creando perfil:', profileError);
      return;
    } else {
      console.log('✅ Perfil demo creado con ID:', demoUserId);
    }
    
    // 2. Importar fotos
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
            user_id: demoUserId,
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
    
    // 3. Crear reseñas de ejemplo
    console.log('\n⭐ Creando reseñas de ejemplo...');
    const reviews = [
      {
        cheese_id: 'c1',
        user_id: demoUserId,
        stars: 5,
        note: 'Excelente queso manchego, perfecto para acompañar con vino tinto.'
      },
      {
        cheese_id: 'c2',
        user_id: demoUserId,
        stars: 4,
        note: 'Brie muy cremoso y sabroso, ideal para untar en pan.'
      },
      {
        cheese_id: 'c3',
        user_id: demoUserId,
        stars: 5,
        note: 'Parmigiano excepcional, perfecto para rallar sobre pasta.'
      },
      {
        cheese_id: 'c4',
        user_id: demoUserId,
        stars: 4,
        note: 'Gouda añejo con sabor intenso, perfecto para tablas de quesos.'
      },
      {
        cheese_id: 'c5',
        user_id: demoUserId,
        stars: 5,
        note: 'Chèvre fresco y cremoso, ideal para ensaladas.'
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
    
    // 4. Crear algunas actividades de ejemplo
    console.log('\n📱 Creando actividades de ejemplo...');
    const activities = [
      {
        type: 'review',
        actor: demoUserId,
        cheese_id: 'c1',
        meta: { stars: 5, action: 'reviewed' }
      },
      {
        type: 'photo',
        actor: demoUserId,
        cheese_id: 'c2',
        meta: { action: 'uploaded_photo' }
      },
      {
        type: 'review',
        actor: demoUserId,
        cheese_id: 'c3',
        meta: { stars: 5, action: 'reviewed' }
      }
    ];
    
    let activitySuccess = 0;
    let activityErrors = 0;
    
    for (const activity of activities) {
      try {
        const { error } = await supabase
          .from('activities')
          .insert(activity);
        
        if (error) {
          console.error(`❌ Error guardando actividad:`, error);
          activityErrors++;
        } else {
          console.log(`✅ Actividad creada: ${activity.type} para ${activity.cheese_id}`);
          activitySuccess++;
        }
      } catch (error) {
        console.error(`❌ Error procesando actividad:`, error);
        activityErrors++;
      }
    }
    
    console.log('\n📊 Resumen de importación:');
    console.log(`✅ Fotos: ${photoSuccess}`);
    console.log(`✅ Reseñas: ${reviewSuccess}`);
    console.log(`✅ Actividades: ${activitySuccess}`);
    console.log(`❌ Errores de fotos: ${photoErrors}`);
    console.log(`❌ Errores de reseñas: ${reviewErrors}`);
    console.log(`❌ Errores de actividades: ${activityErrors}`);
    
    // 5. Verificar datos finales
    console.log('\n🔍 Verificando datos finales...');
    
    const { data: finalCheeses, error: cheeseError } = await supabase
      .from('cheeses')
      .select('id, name, country')
      .limit(8);
    
    const { data: finalPhotos, error: photoError } = await supabase
      .from('photos')
      .select('cheese_id, url')
      .limit(5);
    
    const { data: finalReviews, error: reviewError } = await supabase
      .from('reviews')
      .select('cheese_id, stars')
      .limit(5);
    
    if (cheeseError) {
      console.error('❌ Error verificando quesos:', cheeseError);
    } else {
      console.log(`✅ Total quesos en DB: ${finalCheeses?.length || 0}`);
    }
    
    if (photoError) {
      console.error('❌ Error verificando fotos:', photoError);
    } else {
      console.log(`✅ Total fotos en DB: ${finalPhotos?.length || 0}`);
    }
    
    if (reviewError) {
      console.error('❌ Error verificando reseñas:', reviewError);
    } else {
      console.log(`✅ Total reseñas en DB: ${finalReviews?.length || 0}`);
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar importación
if (require.main === module) {
  fixUserAndImportData()
    .then(() => {
      console.log('\n🎉 Proceso completado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en proceso:', error);
      process.exit(1);
    });
}

export { fixUserAndImportData };
