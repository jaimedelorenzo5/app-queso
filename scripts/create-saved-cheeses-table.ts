import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSavedCheesesTable() {
  console.log('🔧 Creando tabla saved_cheeses...');

  try {
    // Verificar si la tabla ya existe
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');

    if (tablesError) {
      console.error('❌ Error verificando tablas:', tablesError.message);
      console.log('⚠️ Intentando crear la tabla de todos modos...');
    } else {
      const tableExists = tables?.some(table => table === 'saved_cheeses');
      if (tableExists) {
        console.log('⚠️ La tabla saved_cheeses ya existe');
        return;
      }
    }

    // Crear la tabla usando SQL
    const { error } = await supabase.rpc('create_saved_cheeses_table');

    if (error) {
      console.error('❌ Error creando tabla:', error.message);
      
      // Intentar un enfoque alternativo
      console.log('🔄 Intentando enfoque alternativo...');
      
      // Crear un registro de prueba para ver si funciona
      const testSave = {
        cheese_id: 'test_cheese_id',
        user_id: 'anonymous',
        saved_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('saved_cheeses')
        .insert(testSave);
      
      if (insertError) {
        if (insertError.code === '42P01') {
          console.error('❌ La tabla no existe y no se pudo crear');
        } else {
          console.error('❌ Error insertando dato de prueba:', insertError.message);
        }
      } else {
        console.log('✅ Tabla creada o ya existente (se insertó un dato de prueba)');
      }
    } else {
      console.log('✅ Tabla saved_cheeses creada correctamente');
    }
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createSavedCheesesTable()
  .then(() => {
    console.log('\n✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en el proceso:', error);
    process.exit(1);
  });
