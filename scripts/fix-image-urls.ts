import { createClient } from '@supabase/supabase-js';

// Configuración del nuevo proyecto
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// URLs de placeholder que funcionan
const PLACEHOLDER_IMAGES = [
  'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Queso+Manchego',
  'https://via.placeholder.com/400x300/28A745/FFFFFF?text=Queso+Brie',
  'https://via.placeholder.com/400x300/007BFF/FFFFFF?text=Queso+Parmigiano',
  'https://via.placeholder.com/400x300/FFC107/FFFFFF?text=Queso+Gouda',
  'https://via.placeholder.com/400x300/DC3545/FFFFFF?text=Queso+Chevre',
  'https://via.placeholder.com/400x300/6F42C1/FFFFFF?text=Queso+Roquefort',
  'https://via.placeholder.com/400x300/20C997/FFFFFF?text=Queso+Cheddar',
  'https://via.placeholder.com/400x300/FD7E14/FFFFFF?text=Queso+Mozzarella'
];

async function fixImageUrls() {
  console.log('🖼️ Arreglando URLs de imágenes...');
  
  try {
    // 1. Obtener todos los quesos
    const { data: cheeses, error: cheesesError } = await supabase
      .from('cheeses')
      .select('id, name')
      .order('name');
    
    if (cheesesError) {
      console.error('❌ Error obteniendo quesos:', cheesesError);
      return;
    }
    
    console.log(`📋 Encontrados ${cheeses.length} quesos`);
    
    // 2. Para cada queso, crear o actualizar su foto
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < cheeses.length; i++) {
      const cheese = cheeses[i];
      const placeholderUrl = PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length];
      
      try {
        // Verificar si ya existe una foto para este queso
        const { data: existingPhotos } = await supabase
          .from('photos')
          .select('id')
          .eq('cheese_id', cheese.id)
          .limit(1);
        
        if (existingPhotos && existingPhotos.length > 0) {
          // Actualizar la foto existente
          const { error: updateError } = await supabase
            .from('photos')
            .update({ 
              url: placeholderUrl,
              url_public: placeholderUrl,
              approved: true
            })
            .eq('id', existingPhotos[0].id);
          
          if (updateError) {
            console.error(`❌ Error actualizando foto para ${cheese.name}:`, updateError);
            errorCount++;
          } else {
            console.log(`✅ Foto actualizada para ${cheese.name}`);
            successCount++;
          }
        } else {
          // Crear nueva foto
          const { error: insertError } = await supabase
            .from('photos')
            .insert({
              cheese_id: cheese.id,
              user_id: '550e8400-e29b-41d4-a716-446655440000', // Usuario demo
              url: placeholderUrl,
              url_public: placeholderUrl,
              width: 400,
              height: 300,
              approved: true,
              license: 'Placeholder',
              author: 'CheeseRate',
            });
          
          if (insertError) {
            console.error(`❌ Error creando foto para ${cheese.name}:`, insertError);
            errorCount++;
          } else {
            console.log(`✅ Foto creada para ${cheese.name}`);
            successCount++;
          }
        }
        
      } catch (error) {
        console.error(`❌ Error procesando ${cheese.name}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 Resumen de actualización:');
    console.log(`✅ Fotos procesadas: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    // 3. Verificar que las fotos estén disponibles
    console.log('\n🔍 Verificando fotos...');
    const { data: allPhotos, error: photosError } = await supabase
      .from('photos')
      .select('cheese_id, url, approved')
      .eq('approved', true);
    
    if (photosError) {
      console.error('❌ Error verificando fotos:', photosError);
    } else {
      console.log(`✅ Total fotos disponibles: ${allPhotos?.length || 0}`);
      if (allPhotos) {
        allPhotos.forEach(photo => {
          console.log(`   - Queso ${photo.cheese_id}: ${photo.url}`);
        });
      }
    }
    
    console.log('\n🎉 URLs de imágenes arregladas!');
    console.log('💡 Ahora las imágenes deberían cargar correctamente en la aplicación');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar arreglo
if (require.main === module) {
  fixImageUrls()
    .then(() => {
      console.log('\n✅ Proceso completado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en proceso:', error);
      process.exit(1);
    });
}

export { fixImageUrls };
