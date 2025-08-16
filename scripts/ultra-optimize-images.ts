import { createClient } from '@supabase/supabase-js';

// Configuración del proyecto actual
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// URLs ultra-optimizadas para carga instantánea
const ULTRA_OPTIMIZED_IMAGES = [
  'https://images.unsplash.com/photo-1661002410569-c4394ad2b92b?w=200&h=150&fit=crop&crop=center&q=60&auto=format',
  'https://images.unsplash.com/photo-1683314573422-649a3c6ad784?w=200&h=150&fit=crop&crop=center&q=60&auto=format',
  'https://images.unsplash.com/photo-1691472898747-363d6d7409de?w=200&h=150&fit=crop&crop=center&q=60&auto=format',
  'https://images.unsplash.com/photo-1519411792752-25c2468cccb3?w=200&h=150&fit=crop&crop=center&q=60&auto=format',
  'https://images.unsplash.com/photo-1739874729849-2039afb19389?w=200&h=150&fit=crop&crop=center&q=60&auto=format',
  'https://images.unsplash.com/photo-1633253037246-12bb11ff545a?w=200&h=150&fit=crop&crop=center&q=60&auto=format',
  'https://images.unsplash.com/photo-1677826158893-e5120a1c7875?w=200&h=150&fit=crop&crop=center&q=60&auto=format',
  'https://images.unsplash.com/photo-1723473620176-8d26dc6314cf?w=200&h=150&fit=crop&crop=center&q=60&auto=format',
];

async function ultraOptimizeImages() {
  console.log('⚡ Ultra-optimizando imágenes para carga instantánea...');
  
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
    
    // 2. Para cada queso, actualizar su foto con URL ultra-optimizada
    for (let i = 0; i < cheeses.length; i++) {
      const cheese = cheeses[i];
      const ultraOptimizedUrl = ULTRA_OPTIMIZED_IMAGES[i % ULTRA_OPTIMIZED_IMAGES.length];
      
      console.log(`\n🧀 Ultra-optimizando ${cheese.name}...`);
      
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
        console.log(`   📸 Foto existente encontrada, ultra-optimizando...`);
        
        const { error: updateError } = await supabase
          .from('photos')
          .update({
            url: ultraOptimizedUrl,
            url_public: ultraOptimizedUrl,
          })
          .eq('id', photo.id);
        
        if (updateError) {
          console.error(`❌ Error ultra-optimizando foto para ${cheese.name}:`, updateError);
        } else {
          console.log(`   ✅ Foto ultra-optimizada: ${ultraOptimizedUrl}`);
        }
      } else {
        // Crear nueva foto
        console.log(`   📸 Creando nueva foto ultra-optimizada...`);
        
        const { error: insertError } = await supabase
          .from('photos')
          .insert({
            cheese_id: cheese.id,
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            url: ultraOptimizedUrl,
            url_public: ultraOptimizedUrl,
            width: 200,
            height: 150,
            approved: true,
            license: 'Unsplash License',
            author: 'Unsplash',
          });
        
        if (insertError) {
          console.error(`❌ Error creando foto ultra-optimizada:`, insertError);
        } else {
          console.log(`   ✅ Nueva foto ultra-optimizada creada: ${ultraOptimizedUrl}`);
        }
      }
    }
    
    console.log('\n🎉 Proceso de ultra-optimización completado!');
    console.log('💡 Las imágenes ahora deberían cargar INSTANTÁNEAMENTE');
    console.log('📱 Tamaño: 200x150, Calidad: 60%, Formato: auto');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar script
if (require.main === module) {
  ultraOptimizeImages()
    .then(() => {
      console.log('\n✅ Imágenes ultra-optimizadas!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error:', error);
      process.exit(1);
    });
}

export { ultraOptimizeImages };
