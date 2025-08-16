import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleCheeses = [
  {
    name: 'Manchego',
    producer: 'Queserías de La Mancha',
    country: 'España',
    region: 'La Mancha',
    milk_type: 'Oveja',
    maturation: 'Cured',
    flavor_profile: ['Salado', 'Nutty', 'Cremoso'],
    pairings: ['Vino tinto', 'Membrillo', 'Nueces'],
    designation: 'DOP',
    description: 'Queso español tradicional elaborado con leche de oveja manchega, con un sabor rico y complejo.',
  },
  {
    name: 'Brie de Meaux',
    producer: 'Fromagerie de Meaux',
    country: 'Francia',
    region: 'Île-de-France',
    milk_type: 'Vaca',
    maturation: 'Soft',
    flavor_profile: ['Cremoso', 'Suave', 'Terroso'],
    pairings: ['Champagne', 'Pan baguette', 'Uvas'],
    designation: 'AOP',
    description: 'Queso francés clásico con corteza blanca y interior cremoso y delicado.',
  },
  {
    name: 'Parmigiano-Reggiano',
    producer: 'Consorzio del Formaggio Parmigiano-Reggiano',
    country: 'Italia',
    region: 'Emilia-Romagna',
    milk_type: 'Vaca',
    maturation: 'Cured',
    flavor_profile: ['Salado', 'Nutty', 'Umami'],
    pairings: ['Vino tinto', 'Pasta', 'Miel'],
    designation: 'DOP',
    description: 'El "rey de los quesos" italiano, añejado por al menos 12 meses.',
  },
  {
    name: 'Stilton',
    producer: 'Queserías de Stilton',
    country: 'Reino Unido',
    region: 'Derbyshire',
    milk_type: 'Vaca',
    maturation: 'Blue',
    flavor_profile: ['Picante', 'Cremoso', 'Salado'],
    pairings: ['Porto', 'Peras', 'Nueces'],
    designation: 'PDO',
    description: 'Queso azul inglés cremoso con vetas azules características.',
  },
  {
    name: 'Gouda',
    producer: 'Queserías Holandesas',
    country: 'Países Bajos',
    region: 'Holanda Meridional',
    milk_type: 'Vaca',
    maturation: 'Semi',
    flavor_profile: ['Suave', 'Cremoso', 'Ligeramente dulce'],
    pairings: ['Cerveza', 'Pan integral', 'Manzanas'],
    designation: 'PGI',
    description: 'Queso holandés tradicional con un sabor suave y textura cremosa.',
  },
  {
    name: 'Feta',
    producer: 'Queserías Griegas',
    country: 'Grecia',
    region: 'Macedonia',
    milk_type: 'Oveja',
    maturation: 'Fresh',
    flavor_profile: ['Salado', 'Ácido', 'Cremoso'],
    pairings: ['Aceitunas', 'Tomates', 'Aceite de oliva'],
    designation: 'PDO',
    description: 'Queso griego tradicional elaborado con leche de oveja y cabra.',
  },
  {
    name: 'Mozzarella di Bufala',
    producer: 'Consorzio di Tutela della Mozzarella di Bufala Campana',
    country: 'Italia',
    region: 'Campania',
    milk_type: 'Búfala',
    maturation: 'Fresh',
    flavor_profile: ['Suave', 'Cremoso', 'Ligeramente dulce'],
    pairings: ['Tomates', 'Albahaca', 'Aceite de oliva'],
    designation: 'DOP',
    description: 'Mozzarella tradicional italiana elaborada con leche de búfala.',
  },
  {
    name: 'Cheddar',
    producer: 'Queserías de Somerset',
    country: 'Reino Unido',
    region: 'Somerset',
    milk_type: 'Vaca',
    maturation: 'Cured',
    flavor_profile: ['Salado', 'Nutty', 'Ligeramente picante'],
    pairings: ['Cerveza', 'Pan integral', 'Manzanas'],
    designation: 'PDO',
    description: 'Queso inglés clásico con un sabor rico y complejo.',
  }
];

async function insertSampleData() {
  console.log('🧀 Insertando datos de ejemplo en la base de datos...\n');

  try {
    // 1. Verificar si ya hay datos
    const { data: existingCheeses, error: checkError, count } = await supabase
      .from('cheeses')
      .select('*', { count: 'exact', head: true });

    if (checkError) {
      console.log('❌ Error verificando datos existentes:', checkError.message);
      return;
    }

    if (count && count > 0) {
      console.log(`⚠️  Ya hay ${count} quesos en la base de datos`);
      console.log('🔧 Si quieres reemplazar, primero elimina los datos existentes');
      return;
    }

    // 2. Insertar datos de ejemplo
    console.log('📝 Insertando quesos de ejemplo...');
    
    for (const cheese of sampleCheeses) {
      const { data, error } = await supabase
        .from('cheeses')
        .insert(cheese)
        .select()
        .single();

      if (error) {
        console.log(`❌ Error insertando ${cheese.name}:`, error.message);
      } else {
        console.log(`✅ ${cheese.name} insertado correctamente (ID: ${data.id})`);
      }
    }

    // 3. Verificar inserción
    const { data: finalCheeses, error: finalError, count: finalCount } = await supabase
      .from('cheeses')
      .select('*', { count: 'exact', head: true });

    if (finalError) {
      console.log('❌ Error verificando inserción final:', finalError.message);
    } else {
      console.log(`\n🎉 ¡Inserción completada! Ahora hay ${finalCount} quesos en la base de datos`);
      
      // Mostrar resumen
      if (finalCheeses) {
        console.log('\n📋 Quesos insertados:');
        finalCheeses.forEach((cheese, index) => {
          console.log(`   ${index + 1}. ${cheese.name} (${cheese.country})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la inserción
insertSampleData()
  .then(() => {
    console.log('\n✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en el proceso:', error);
    process.exit(1);
  });
