import { createClient } from '@supabase/supabase-js';

// Configuración del proyecto actual
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configuración de Unsplash (necesitarás tu API key)
const UNSPLASH_ACCESS_KEY = 'utiKY4drjcrn1GdCJu5cIloNm3oXC3NZ16hu88p_MVw';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Términos de búsqueda más específicos para cada tipo de queso
const CHEESE_SEARCH_TERMS = {
  'Manchego Curado': 'manchego cheese spain',
  'Brie de Meaux': 'brie de meaux cheese france',
  'Parmigiano Reggiano': 'parmigiano reggiano cheese italy',
  'Cheddar Aged': 'aged cheddar cheese england',
  'Gouda Aged': 'aged gouda cheese netherlands',
  'Chèvre Frais': 'fresh goat cheese france',
  'Roquefort': 'roquefort blue cheese france',
  'Mozzarella di Bufala': 'buffalo mozzarella cheese italy'
};

async function searchUnsplashPhoto(query: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      console.error(`❌ Error en Unsplash API: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      // Usar la URL regular (no la raw) para evitar problemas de CORS
      return photo.urls.regular;
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error buscando foto para "${query}":`, error);
    return null;
  }
}

async function getRealCheesePhotos() {
  console.log('🧀 Obteniendo fotos reales de quesos desde Unsplash...');
  
  console.log('🔑 API Key configurada:', UNSPLASH_ACCESS_KEY.substring(0, 10) + '...');
  
  try {
    // 1. Obtener todos los quesos
    const { data: cheeses, error: cheesesError } = await supabase
      .from('cheeses')
      .select('id, name')
      .order('name');
    
    if (cheesesError) {
      console.error('❌ Error obteniendo quesos:', cheesesError);
      return;
    }
    
    console.log(`✅ Quesos obtenidos: ${cheeses.length}`);
    
    // 2. Para cada queso, buscar foto en Unsplash
    for (const cheese of cheeses) {
      const searchTerm = CHEESE_SEARCH_TERMS[cheese.name as keyof typeof CHEESE_SEARCH_TERMS];
      
      if (!searchTerm) {
        console.log(`⚠️ No hay término de búsqueda para: ${cheese.name}`);
        continue;
      }
      
      console.log(`\n🔍 Buscando foto para: ${cheese.name} (${searchTerm})`);
      
      const photoUrl = await searchUnsplashPhoto(searchTerm);
      
      if (photoUrl) {
        console.log(`   ✅ Foto encontrada: ${photoUrl}`);
        
        // Actualizar o crear foto en la base de datos
        const { data: existingPhotos } = await supabase
          .from('photos')
          .select('*')
          .eq('cheese_id', cheese.id)
          .eq('approved', true);
        
        if (existingPhotos && existingPhotos.length > 0) {
          // Actualizar foto existente
          const { error: updateError } = await supabase
            .from('photos')
            .update({
              url: photoUrl,
              url_public: photoUrl,
              source_url: `https://unsplash.com/search?query=${encodeURIComponent(searchTerm)}`,
              author: 'Unsplash',
            })
            .eq('id', existingPhotos[0].id);
          
          if (updateError) {
            console.error(`❌ Error actualizando foto:`, updateError);
          } else {
            console.log(`   ✅ Foto actualizada en la base de datos`);
          }
        } else {
          // Crear nueva foto
          const { error: insertError } = await supabase
            .from('photos')
            .insert({
              cheese_id: cheese.id,
              user_id: '550e8400-e29b-41d4-a716-446655440000',
              url: photoUrl,
              url_public: photoUrl,
              width: 800,
              height: 600,
              approved: true,
              license: 'Unsplash License',
              author: 'Unsplash',
              source_url: `https://unsplash.com/search?query=${encodeURIComponent(searchTerm)}`,
            });
          
          if (insertError) {
            console.error(`❌ Error creando foto:`, insertError);
          } else {
            console.log(`   ✅ Nueva foto creada en la base de datos`);
          }
        }
      } else {
        console.log(`   ❌ No se encontró foto para: ${cheese.name}`);
      }
      
      // Esperar un poco para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Proceso completado!');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar script
if (require.main === module) {
  getRealCheesePhotos()
    .then(() => {
      console.log('\n✅ Fotos reales obtenidas!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error:', error);
      process.exit(1);
    });
}

export { getRealCheesePhotos };
