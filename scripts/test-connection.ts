import { createClient } from '@supabase/supabase-js';

// Probar la conexión actual
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Probando conexión al proyecto actual...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');
  
  try {
    // 1. Probar conexión básica
    const { data: testData, error: testError } = await supabase
      .from('cheeses')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError);
      return;
    }
    
    console.log('✅ Conexión exitosa');
    console.log('📊 Datos de prueba:', testData);
    
    // 2. Contar quesos
    const { count, error: countError } = await supabase
      .from('cheeses')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error contando quesos:', countError);
    } else {
      console.log(`🧀 Total de quesos en la base de datos: ${count}`);
    }
    
    // 3. Verificar estructura de la tabla
    const { data: sampleCheese, error: sampleError } = await supabase
      .from('cheeses')
      .select('*')
      .limit(1)
      .single();
    
    if (sampleError) {
      console.error('❌ Error obteniendo muestra:', sampleError);
    } else {
      console.log('📋 Estructura del primer queso:');
      console.log(JSON.stringify(sampleCheese, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar prueba
if (require.main === module) {
  testConnection()
    .then(() => {
      console.log('\n✅ Prueba completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en prueba:', error);
      process.exit(1);
    });
}

export { testConnection };
