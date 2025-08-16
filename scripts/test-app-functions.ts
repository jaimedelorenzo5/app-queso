import { createClient } from '@supabase/supabase-js';

// Simular las funciones de la aplicación
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simular getCheeses
async function getCheeses(limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('cheeses')
    .select('*')
    .order('name')
    .range(offset, offset + limit - 1);
  return { data, error };
}

// Simular getCheesePhotos
async function getCheesePhotos(cheeseId: string) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('cheese_id', cheeseId)
    .eq('approved', true)
    .order('created_at', { ascending: false });
  return { data, error };
}

async function testAppFunctions() {
  console.log('🧪 Probando funciones de la aplicación...');
  
  try {
    // 1. Probar getCheeses
    console.log('\n📊 Probando getCheeses...');
    const { data: cheesesData, error: cheesesError } = await getCheeses(8, 0);
    
    if (cheesesError) {
      console.error('❌ Error en getCheeses:', cheesesError);
      return;
    }
    
    console.log(`✅ getCheeses exitoso: ${cheesesData?.length || 0} quesos`);
    
    if (cheesesData) {
      // 2. Probar getCheesePhotos para cada queso
      console.log('\n📸 Probando getCheesePhotos...');
      
      for (const cheese of cheesesData) {
        const { data: photosData, error: photosError } = await getCheesePhotos(cheese.id);
        
        if (photosError) {
          console.error(`❌ Error obteniendo fotos para ${cheese.name}:`, photosError);
        } else {
          const photoUrl = photosData && photosData.length > 0 ? photosData[0].url : 'Sin foto';
          console.log(`   🧀 ${cheese.name}: ${photoUrl}`);
          console.log(`      🍷 Pairings: ${cheese.pairings?.join(', ') || 'Ninguno'}`);
        }
      }
      
      // 3. Simular el proceso completo de la aplicación
      console.log('\n🔄 Simulando proceso completo de la aplicación...');
      
      const cheesesWithPhotos = await Promise.all(
        cheesesData.map(async (cheese: any) => {
          const { data: photosData } = await getCheesePhotos(cheese.id);
          const photoUrl = photosData && photosData.length > 0 ? photosData[0].url : undefined;
          
          return {
            id: cheese.id,
            name: cheese.name,
            producer: cheese.producer || 'Desconocido',
            country: cheese.country,
            region: cheese.region || 'Desconocida',
            milkType: cheese.milk_type,
            maturation: cheese.maturation,
            flavorProfile: cheese.flavor_profile,
            pairings: cheese.pairings,
            avgRating: 4.2,
            photoUrl,
            designation: cheese.designation,
          };
        })
      );
      
      console.log(`\n✅ Proceso simulado exitoso: ${cheesesWithPhotos.length} quesos procesados`);
      
      // Mostrar ejemplo de queso procesado
      if (cheesesWithPhotos.length > 0) {
        const example = cheesesWithPhotos[0];
        console.log('\n📋 Ejemplo de queso procesado:');
        console.log(`   Nombre: ${example.name}`);
        console.log(`   País: ${example.country}`);
        console.log(`   Tipo de leche: ${example.milkType}`);
        console.log(`   Pairings: ${example.pairings?.join(', ') || 'Ninguno'}`);
        console.log(`   Foto: ${example.photoUrl || 'Sin foto'}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar prueba
if (require.main === module) {
  testAppFunctions()
    .then(() => {
      console.log('\n✅ Prueba completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en prueba:', error);
      process.exit(1);
    });
}

export { testAppFunctions };
