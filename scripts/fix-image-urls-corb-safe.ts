import { createClient } from '@supabase/supabase-js';

// Configuración del proyecto actual
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// URLs de placeholder que no tienen problemas de CORB
const CORB_SAFE_IMAGES = [
  'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Queso+Manchego',
  'https://via.placeholder.com/400x300/28A745/FFFFFF?text=Queso+Brie',
  'https://via.placeholder.com/400x300/20C997/FFFFFF?text=Queso+Cheddar',
  'https://via.placeholder.com/400x300/FFC107/FFFFFF?text=Queso+Gouda',
  'https://via.placeholder.com/400x300/007BFF/FFFFFF?text=Queso+Parmigiano',
  'https://via.placeholder.com/400x300/FD7E14/FFFFFF?text=Queso+Mozzarella',
  'https://via.placeholder.com/400x300/6F42C1/FFFFFF?text=Queso+Roquefort',
  'https://via.placeholder.com/400x300/DC3545/FFFFFF?text=Queso+Chevre',
];

async function fixImageUrlsCorbSafe() {
  console.log('🖼️ Actualizando URLs de imágenes con placeholders seguros para CORB...');
  
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
    
    console.log(`✅ Quesos obtenidos: ${cheeses.length}`);
    
    // 2. Para cada queso, actualizar su foto
    for (let i = 0; i < cheeses.length; i++) {
      const cheese = cheeses[i];
      const placeholderUrl = CORB_SAFE_IMAGES[i % CORB_SAFE_IMAGES.length];
      
      console.log(`\n🧀 Procesando ${cheese.name}...`);
      
      // Verificar si ya tiene foto
      const { data: existingPhotos, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('cheese_id', cheese.id)
        .eq('approved', true);
      
      if (photosError) {
        console.error(`❌ Error obteniendo fotos para ${cheese.name}:`, photosError);
        continue;
      }
      
      if (existingPhotos && existingPhotos.length > 0) {
        // Actualizar foto existente
        const photo = existingPhotos[0];
        console.log(`   📸 Foto existente encontrada, actualizando URL...`);
        
        const { error: updateError } = await supabase
          .from('photos')
          .update({
            url: placeholderUrl,
            url_public: placeholderUrl,
          })
          .eq('id', photo.id);
        
        if (updateError) {
          console.error(`❌ Error actualizando foto para ${cheese.name}:`, updateError);
        } else {
          console.log(`   ✅ Foto actualizada: ${placeholderUrl}`);
        }
      } else {
        // Crear nueva foto
        console.log(`   📸 Creando nueva foto...`);
        
        const { error: insertError } = await supabase
          .from('photos')
          .insert({
            cheese_id: cheese.id,
            user_id: '550e8400-e29b-41d4-a716-446655440000', // Demo user
            url: placeholderUrl,
            url_public: placeholderUrl,
            width: 400,
            height: 300,
            approved: true,
            license: 'placeholder',
            author: 'system',
          });
        
        if (insertError) {
          console.error(`❌ Error creando foto para ${cheese.name}:`, insertError);
        } else {
          console.log(`   ✅ Nueva foto creada: ${placeholderUrl}`);
        }
      }
    }
    
    console.log('\n🎉 Proceso completado!');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar script
if (require.main === module) {
  fixImageUrlsCorbSafe()
    .then(() => {
      console.log('\n✅ URLs de imágenes actualizadas!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error:', error);
      process.exit(1);
    });
}

export { fixImageUrlsCorbSafe };
