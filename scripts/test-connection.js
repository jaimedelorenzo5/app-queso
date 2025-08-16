// Script simple para verificar conexión a Supabase
const testSupabaseConnection = async () => {
  try {
    console.log('🧀 Probando conexión a Supabase...');
    
    const response = await fetch('https://avggkectqppeqvxcehgy.supabase.co/rest/v1/cheeses?select=count', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa a Supabase');
      console.log('📊 Datos recibidos:', data);
    } else {
      console.log('❌ Error en respuesta:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
};

testSupabaseConnection();
