import { createClient } from '@supabase/supabase-js';

// Configuración directa de Supabase (sin AsyncStorage)
const supabaseUrl = 'https://your-project.supabase.co'; // Reemplaza con tu URL
const supabaseKey = 'your-anon-key'; // Reemplaza con tu clave anónima

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseSimple() {
  console.log('🔍 Verificando base de datos de quesos (versión simple)...\n');

  try {
    // 1. Verificar tabla de quesos
    console.log('1️⃣ Verificando tabla de quesos...');
    const { data: cheeses, error: cheesesError, count } = await supabase
      .from('cheeses')
      .select('*', { count: 'exact', head: true });

    if (cheesesError) {
      console.log('❌ Error accediendo a la tabla cheeses:', cheesesError.message);
      console.log('🔧 Posibles soluciones:');
      console.log('   - Verificar que la tabla "cheeses" existe');
      console.log('   - Verificar permisos de la tabla');
      console.log('   - Verificar que las credenciales son correctas');
      return;
    }

    console.log(`✅ Tabla cheeses accesible`);
    console.log(`📊 Total de quesos en la base de datos: ${count || 0}`);

    if (count && count > 0) {
      // 2. Mostrar algunos quesos de ejemplo
      console.log('\n2️⃣ Mostrando algunos quesos de ejemplo...');
      const { data: sampleCheeses, error: sampleError } = await supabase
        .from('cheeses')
        .select('id, name, country, milk_type')
        .limit(5);

      if (sampleError) {
        console.log('❌ Error obteniendo muestra:', sampleError.message);
      } else if (sampleCheeses) {
        sampleCheeses.forEach((cheese, index) => {
          console.log(`   ${index + 1}. ${cheese.name} (${cheese.country}, ${cheese.milk_type}) - ID: ${cheese.id}`);
        });
      }

      // 3. Verificar estructura de la tabla
      console.log('\n3️⃣ Verificando estructura de la tabla...');
      const { data: structure, error: structureError } = await supabase
        .from('cheeses')
        .select('*')
        .limit(1);

      if (structureError) {
        console.log('❌ Error verificando estructura:', structureError.message);
      } else if (structure && structure.length > 0) {
        const cheese = structure[0];
        console.log('✅ Estructura de la tabla verificada');
        console.log('📋 Campos disponibles:', Object.keys(cheese).join(', '));
        
        // Verificar campos críticos
        const requiredFields = ['id', 'name', 'country', 'milk_type', 'maturation'];
        const missingFields = requiredFields.filter(field => !(field in cheese));
        
        if (missingFields.length > 0) {
          console.log('⚠️  Campos faltantes:', missingFields.join(', '));
        } else {
          console.log('✅ Todos los campos requeridos están presentes');
        }
      }
    } else {
      console.log('⚠️  La tabla cheeses está vacía');
      console.log('🔧 Necesitas insertar datos de quesos');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la verificación
checkDatabaseSimple()
  .then(() => {
    console.log('\n✅ Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en la verificación:', error);
    process.exit(1);
  });
