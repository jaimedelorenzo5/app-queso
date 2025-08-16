// Script para verificar fotos en la base de datos
const checkPhotos = async () => {
  try {
    console.log('📸 Verificando fotos en la base de datos...');
    
    // Verificar tabla de fotos
    const photosResponse = await fetch('https://avggkectqppeqvxcehgy.supabase.co/rest/v1/photos?select=count', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M'
      }
    });
    
    if (photosResponse.ok) {
      const photosData = await photosResponse.json();
      console.log('📸 Total de fotos:', photosData[0]?.count || 0);
    }
    
    // Verificar algunos quesos con sus fotos
    const cheesesResponse = await fetch('https://avggkectqppeqvxcehgy.supabase.co/rest/v1/cheeses?select=id,name,image_url&limit=3', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M'
      }
    });
    
    if (cheesesResponse.ok) {
      const cheesesData = await cheesesResponse.json();
      console.log('🧀 Quesos con sus URLs de imagen:');
      cheesesData.forEach(cheese => {
        console.log(`  - ${cheese.name}: ${cheese.image_url || 'Sin imagen'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error verificando fotos:', error.message);
  }
};

checkPhotos();
