import { createClient } from '@supabase/supabase-js';

// Usar valores directos para evitar problemas con variables de entorno
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('Key (primeros 10 caracteres):', supabaseAnonKey.substring(0, 10) + '...');

  try {
    // Probar una consulta simple
    const { data, error, count } = await supabase
      .from('cheeses')
      .select('*', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      console.log('❌ Error de conexión:', error.message);
      console.log('❌ Detalles:', error);
      return;
    }

    console.log('✅ Conexión exitosa a Supabase');
    console.log(`📊 Encontrados ${count} quesos en la base de datos`);

    if (data && data.length > 0) {
      console.log('📋 Ejemplo de queso:', {
        id: data[0].id,
        name: data[0].name,
        country: data[0].country
      });

      // Probar consulta por ID
      const cheeseId = data[0].id;
      console.log('\n🔍 Probando consulta por ID:', cheeseId);
      
      const { data: cheeseData, error: cheeseError } = await supabase
        .from('cheeses')
        .select('*')
        .eq('id', cheeseId)
        .single();

      if (cheeseError) {
        console.log('❌ Error al consultar por ID:', cheeseError.message);
      } else {
        console.log('✅ Consulta por ID exitosa:', cheeseData.name);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testConnection()
  .then(() => {
    console.log('\n✅ Prueba completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en la prueba:', error);
    process.exit(1);
  });