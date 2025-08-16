import { createClient } from '@supabase/supabase-js';

// Configuración del nuevo proyecto
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugApp() {
  console.log('🔍 Debuggeando la aplicación CheeseRate...');
  
  try {
    // 1. Verificar conexión básica
    console.log('\n📡 Verificando conexión...');
    const { data: testData, error: testError } = await supabase
      .from('cheeses')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError);
      return;
    } else {
      console.log('✅ Conexión exitosa');
    }
    
    // 2. Obtener todos los quesos
    console.log('\n🧀 Obteniendo quesos...');
    const { data: cheeses, error: cheesesError } = await supabase
      .from('cheeses')
      .select('*')
      .order('name');
    
    if (cheesesError) {
      console.error('❌ Error obteniendo quesos:', cheesesError);
      return;
    }
    
    console.log(`✅ Quesos obtenidos: ${cheeses?.length || 0}`);
    
    if (cheeses) {
      cheeses.forEach((cheese, index) => {
        console.log(`   ${index + 1}. ${cheese.name} (${cheese.country}) - ID: ${cheese.id}`);
      });
    }
    
    // 3. Obtener fotos para cada queso
    console.log('\n📸 Obteniendo fotos...');
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('*')
      .eq('approved', true)
      .order('cheese_id');
    
    if (photosError) {
      console.error('❌ Error obteniendo fotos:', photosError);
    } else {
      console.log(`✅ Fotos obtenidas: ${photos?.length || 0}`);
      
      if (photos) {
        photos.forEach((photo, index) => {
          console.log(`   ${index + 1}. Queso ${photo.cheese_id}: ${photo.url}`);
        });
      }
    }
    
    // 4. Simular el proceso de la aplicación
    console.log('\n🔄 Simulando proceso de la aplicación...');
    
    if (cheeses && photos) {
      const cheesesWithPhotos = cheeses.map(cheese => {
        const cheesePhotos = photos.filter(photo => photo.cheese_id === cheese.id);
        const photoUrl = cheesePhotos.length > 0 ? cheesePhotos[0].url : null;
        
        return {
          id: cheese.id,
          name: cheese.name,
          country: cheese.country,
          photoUrl,
          hasPhoto: !!photoUrl
        };
      });
      
      console.log('\n📊 Resumen de quesos con fotos:');
      cheesesWithPhotos.forEach(cheese => {
        const status = cheese.hasPhoto ? '✅' : '❌';
        console.log(`   ${status} ${cheese.name}: ${cheese.photoUrl || 'Sin foto'}`);
      });
      
      const withPhotos = cheesesWithPhotos.filter(c => c.hasPhoto).length;
      const withoutPhotos = cheesesWithPhotos.filter(c => !c.hasPhoto).length;
      
      console.log(`\n📈 Estadísticas:`);
      console.log(`   ✅ Con fotos: ${withPhotos}`);
      console.log(`   ❌ Sin fotos: ${withoutPhotos}`);
      console.log(`   📊 Total: ${cheesesWithPhotos.length}`);
    }
    
    // 5. Verificar URLs de imágenes
    console.log('\n🔗 Verificando URLs de imágenes...');
    if (photos) {
      const uniqueUrls = [...new Set(photos.map(p => p.url))];
      console.log(`📋 URLs únicas encontradas: ${uniqueUrls.length}`);
      
      uniqueUrls.forEach((url, index) => {
        console.log(`   ${index + 1}. ${url}`);
      });
    }
    
    console.log('\n🎉 Debug completado!');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar debug
if (require.main === module) {
  debugApp()
    .then(() => {
      console.log('\n✅ Debug completado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en debug:', error);
      process.exit(1);
    });
}

export { debugApp };
