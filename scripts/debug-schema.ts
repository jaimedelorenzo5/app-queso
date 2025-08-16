import { createClient } from '@supabase/supabase-js';

// Configuración directa
const supabaseUrl = 'https://uqvozcfioupqmiapxhlw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdm96Y2Zpb3VwcW1pYXB4aGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzAwMDMsImV4cCI6MjA3MDc0NjAwM30.U22a2wfbBR7h0DbPbe1Kf2JDLFSGB3pSnjHlrq5hbzU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugSchema() {
  console.log('🔍 Debuggeando esquema de Supabase...');
  
  try {
    // 1. Probar conexión básica
    console.log('\n📡 Probando conexión básica...');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');
    
    // 2. Intentar listar tablas usando información del esquema
    console.log('\n📊 Intentando acceder a tablas...');
    
    // Probar diferentes enfoques
    const approaches = [
      { name: 'Enfoque 1: Select básico', query: () => supabase.from('cheeses').select('*').limit(1) },
      { name: 'Enfoque 2: Select con count', query: () => supabase.from('cheeses').select('count') },
      { name: 'Enfoque 3: Select con schema explícito', query: () => supabase.from('public.cheeses').select('*').limit(1) },
      { name: 'Enfoque 4: RPC para listar tablas', query: () => supabase.rpc('get_schema_info') },
    ];
    
    for (const approach of approaches) {
      try {
        console.log(`\n🧪 ${approach.name}...`);
        const { data, error } = await approach.query();
        
        if (error) {
          console.log(`❌ Error: ${error.code} - ${error.message}`);
          if (error.details) console.log(`   Detalles: ${error.details}`);
          if (error.hint) console.log(`   Hint: ${error.hint}`);
        } else {
          console.log(`✅ Éxito:`, data);
          break; // Si uno funciona, no necesitamos probar más
        }
      } catch (err) {
        console.log(`💥 Excepción: ${err}`);
      }
    }
    
    // 3. Verificar configuración del cliente
    console.log('\n⚙️ Verificando configuración del cliente...');
    console.log('Cliente configurado:', !!supabase);
    console.log('URL del cliente:', supabaseUrl);
    console.log('Key del cliente:', supabaseAnonKey ? 'Configurada' : 'No configurada');
    
    // 4. Intentar con configuración diferente
    console.log('\n🔄 Probando configuración alternativa...');
    
    const supabaseAlt = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'X-Client-Info': 'cheeserate-app'
        }
      }
    });
    
    const { data: altData, error: altError } = await supabaseAlt
      .from('cheeses')
      .select('id')
      .limit(1);
    
    if (altError) {
      console.log(`❌ Configuración alternativa falló: ${altError.message}`);
    } else {
      console.log(`✅ Configuración alternativa funcionó:`, altData);
    }
    
    // 5. Verificar si es un problema de permisos
    console.log('\n🔐 Verificando permisos...');
    
    // Intentar crear una tabla de prueba temporal
    try {
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: 'CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT);'
      });
      
      if (createError) {
        console.log(`❌ No se pueden crear tablas: ${createError.message}`);
      } else {
        console.log('✅ Se pueden crear tablas');
        // Limpiar tabla de prueba
        await supabase.rpc('exec_sql', { sql: 'DROP TABLE test_table;' });
      }
    } catch (err) {
      console.log('❌ No se puede ejecutar SQL directo');
    }
    
  } catch (error) {
    console.error('💥 Error general en debug:', error);
  }
}

// Ejecutar debug
if (require.main === module) {
  debugSchema()
    .then(() => {
      console.log('\n🎉 Debug completado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en debug:', error);
      process.exit(1);
    });
}

export { debugSchema };
