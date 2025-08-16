import { createClient } from '@supabase/supabase-js';

// Configuración del proyecto actual
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Quesos adicionales para expandir la base de datos
const additionalCheeses = [
  {
    id: 'c9',
    name: 'Camembert de Normandie',
    producer: 'Fromagerie de Normandie',
    country: 'Francia',
    region: 'Normandía',
    milk_type: 'Vaca',
    maturation: 'Madurado',
    flavor_profile: ['Creamy', 'Earthy', 'Mushroom'],
    pairings: ['Champagne', 'Manzanas', 'Pan de centeno'],
    designation: 'AOP'
  },
  {
    id: 'c10',
    name: 'Pecorino Romano',
    producer: 'Caseificio Romano',
    country: 'Italia',
    region: 'Lacio',
    milk_type: 'Oveja',
    maturation: 'Añejo',
    flavor_profile: ['Salty', 'Sharp', 'Nutty'],
    pairings: ['Vino tinto', 'Pasta', 'Miel'],
    designation: 'DOP'
  },
  {
    id: 'c11',
    name: 'Stilton Blue',
    producer: 'English Blue Cheese Co.',
    country: 'Reino Unido',
    region: 'Derbyshire',
    milk_type: 'Vaca',
    maturation: 'Azul',
    flavor_profile: ['Creamy', 'Tangy', 'Sharp'],
    pairings: ['Vino de Oporto', 'Nueces', 'Membrillo'],
    designation: 'PDO'
  },
  {
    id: 'c12',
    name: 'Gruyère',
    producer: 'Fromagerie Suisse',
    country: 'Suiza',
    region: 'Friburgo',
    milk_type: 'Vaca',
    maturation: 'Añejo',
    flavor_profile: ['Nutty', 'Sweet', 'Crystalline'],
    pairings: ['Vino blanco', 'Pan crujiente', 'Uvas'],
    designation: 'AOP'
  },
  {
    id: 'c13',
    name: 'Feta',
    producer: 'Greek Dairy Farm',
    country: 'Grecia',
    region: 'Tesalia',
    milk_type: 'Oveja',
    maturation: 'Semi',
    flavor_profile: ['Tangy', 'Salty', 'Fresh'],
    pairings: ['Aceitunas', 'Tomates', 'Vino blanco'],
    designation: 'PDO'
  },
  {
    id: 'c14',
    name: 'Provolone',
    producer: 'Caseificio del Sur',
    country: 'Italia',
    region: 'Campania',
    milk_type: 'Vaca',
    maturation: 'Semi',
    flavor_profile: ['Mild', 'Creamy', 'Smooth'],
    pairings: ['Vino blanco', 'Pan italiano', 'Albahaca'],
    designation: 'DOP'
  },
  {
    id: 'c15',
    name: 'Havarti',
    producer: 'Danish Dairy Co.',
    country: 'Dinamarca',
    region: 'Jutlandia',
    milk_type: 'Vaca',
    maturation: 'Semi',
    flavor_profile: ['Buttery', 'Mild', 'Creamy'],
    pairings: ['Cerveza', 'Pan integral', 'Manzanas'],
    designation: null
  }
];

async function expandCheeseDatabase() {
  console.log('🧀 Expandindo base de datos de quesos...');
  
  try {
    // 1. Insertar quesos adicionales
    for (const cheese of additionalCheeses) {
      console.log(`\n📝 Insertando ${cheese.name}...`);
      
      const { error: insertError } = await supabase
        .from('cheeses')
        .insert(cheese);
      
      if (insertError) {
        console.error(`❌ Error insertando ${cheese.name}:`, insertError);
      } else {
        console.log(`✅ ${cheese.name} insertado correctamente`);
      }
    }
    
    // 2. Verificar el total de quesos
    const { data: allCheeses, error: countError } = await supabase
      .from('cheeses')
      .select('id, name');
    
    if (countError) {
      console.error('❌ Error contando quesos:', countError);
    } else {
      console.log(`\n🎉 Base de datos expandida!`);
      console.log(`📊 Total de quesos: ${allCheeses.length}`);
      console.log(`📋 Quesos disponibles:`);
      allCheeses.forEach((cheese, index) => {
        console.log(`   ${index + 1}. ${cheese.name}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar script
if (require.main === module) {
  expandCheeseDatabase()
    .then(() => {
      console.log('\n✅ Base de datos expandida!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error:', error);
      process.exit(1);
    });
}

export { expandCheeseDatabase };
