import { createClient } from '@supabase/supabase-js';

// Configuración del proyecto actual
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCheeseData() {
  console.log('🔍 Verificando estructura de datos de quesos...');
  
  try {
    // 1. Obtener todos los quesos con todos los campos
    const { data: cheeses, error: cheesesError } = await supabase
      .from('cheeses')
      .select('*')
      .order('name');
    
    if (cheesesError) {
      console.error('❌ Error obteniendo quesos:', cheesesError);
      return;
    }
    
    console.log(`✅ Quesos obtenidos: ${cheeses.length}`);
    
    // 2. Verificar la estructura de cada queso
    cheeses.forEach((cheese, index) => {
      console.log(`\n🧀 Queso ${index + 1}: ${cheese.name}`);
      console.log(`   ID: ${cheese.id}`);
      console.log(`   País: ${cheese.country}`);
      console.log(`   Tipo de leche: ${cheese.milk_type}`);
      console.log(`   Maduración: ${cheese.maturation}`);
      console.log(`   Perfil de sabor: ${cheese.flavor_profile?.join(', ') || 'Ninguno'}`);
      console.log(`   Maridajes: ${cheese.pairings?.join(', ') || 'Ninguno'}`);
      console.log(`   Productor: ${cheese.producer || 'Ninguno'}`);
      console.log(`   Región: ${cheese.region || 'Ninguno'}`);
      console.log(`   Designación: ${cheese.designation || 'Ninguna'}`);
      
      // Verificar si pairings es un array
      console.log(`   Tipo de pairings: ${typeof cheese.pairings}`);
      console.log(`   ¿Es array?: ${Array.isArray(cheese.pairings)}`);
      if (Array.isArray(cheese.pairings)) {
        console.log(`   Longitud del array: ${cheese.pairings.length}`);
      }
    });
    
    // 3. Verificar la estructura de la tabla
    console.log('\n📊 Estructura de la tabla:');
    if (cheeses.length > 0) {
      const firstCheese = cheeses[0];
      console.log('Campos disponibles:', Object.keys(firstCheese));
      console.log('Tipos de datos:');
      Object.entries(firstCheese).forEach(([key, value]) => {
        console.log(`   ${key}: ${typeof value} = ${JSON.stringify(value)}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar verificación
if (require.main === module) {
  checkCheeseData()
    .then(() => {
      console.log('\n✅ Verificación completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error:', error);
      process.exit(1);
    });
}

export { checkCheeseData };
