// Script para verificar la estructura de los quesos
const checkCheeseStructure = async () => {
  try {
    console.log('🧀 Verificando estructura de quesos...');
    
    // Obtener un queso completo
    const cheeseResponse = await fetch('https://avggkectqppeqvxcehgy.supabase.co/rest/v1/cheeses?select=*&limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M'
      }
    });
    
    if (cheeseResponse.ok) {
      const cheeseData = await cheeseResponse.json();
      if (cheeseData.length > 0) {
        const cheese = cheeseData[0];
        console.log('📊 Estructura del primer queso:');
        console.log(JSON.stringify(cheese, null, 2));
        
        // Verificar campos específicos
        console.log('\n🔍 Campos importantes:');
        console.log(`  - image_url: ${cheese.image_url || 'NO EXISTE'}`);
        console.log(`  - photoUrl: ${cheese.photoUrl || 'NO EXISTE'}`);
        console.log(`  - photo_url: ${cheese.photo_url || 'NO EXISTE'}`);
        console.log(`  - pairings: ${Array.isArray(cheese.pairings) ? cheese.pairings.length : 'NO ES ARRAY'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error verificando estructura:', error.message);
  }
};

checkCheeseStructure();
