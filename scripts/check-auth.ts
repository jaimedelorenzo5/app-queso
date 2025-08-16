import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuth() {
  console.log('🔍 Verificando autenticación...');

  try {
    // Verificar si hay un usuario autenticado
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('❌ Error obteniendo usuario:', error.message);
      return;
    }

    if (user) {
      console.log('✅ Usuario autenticado:');
      console.log('  ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Creado:', new Date(user.created_at).toLocaleString());
      
      // Verificar permisos
      console.log('\n🔍 Verificando permisos...');
      
      // 1. Intentar leer la tabla saved_cheeses
      const { data: savedCheeses, error: savedError } = await supabase
        .from('saved_cheeses')
        .select('*')
        .eq('user_id', user.id)
        .limit(5);
      
      if (savedError) {
        console.error('❌ Error accediendo a saved_cheeses:', savedError.message);
      } else {
        console.log('✅ Acceso a saved_cheeses correcto');
        console.log('  Quesos guardados:', savedCheeses?.length || 0);
      }
      
      // 2. Intentar insertar un queso de prueba
      console.log('\n🔍 Probando inserción en saved_cheeses...');
      
      // Primero obtener un queso para guardar
      const { data: sampleCheese, error: cheeseError } = await supabase
        .from('cheeses')
        .select('id')
        .limit(1)
        .single();
      
      if (cheeseError) {
        console.error('❌ Error obteniendo queso de prueba:', cheeseError.message);
        return;
      }
      
      if (sampleCheese) {
        const testId = 'test_' + Date.now();
        const { data: insertData, error: insertError } = await supabase
          .from('saved_cheeses')
          .insert({
            id: testId,
            user_id: user.id,
            cheese_id: sampleCheese.id,
            saved_at: new Date().toISOString(),
          })
          .select();
        
        if (insertError) {
          console.error('❌ Error insertando queso de prueba:', insertError.message);
        } else {
          console.log('✅ Inserción correcta:', insertData);
          
          // Eliminar el queso de prueba
          const { error: deleteError } = await supabase
            .from('saved_cheeses')
            .delete()
            .eq('id', testId);
          
          if (deleteError) {
            console.error('❌ Error eliminando queso de prueba:', deleteError.message);
          } else {
            console.log('✅ Eliminación correcta del queso de prueba');
          }
        }
      }
    } else {
      console.log('⚠️ No hay usuario autenticado');
    }
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkAuth()
  .then(() => {
    console.log('\n✅ Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en la verificación:', error);
    process.exit(1);
  });
