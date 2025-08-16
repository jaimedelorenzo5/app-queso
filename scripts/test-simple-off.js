// Test simple para verificar Open Food Facts
const testSimpleOFF = async () => {
  try {
    console.log('🧀 Test simple de Open Food Facts...');
    
    // Simular la función searchOFFCheeses
    const searchUrl = 'https://world.openfoodfacts.org/api/v2/search?categories_tags_en=Cheeses&page_size=3&fields=code,product_name,brands,countries_tags,image_front_url';
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    console.log('✅ API funciona, encontrados:', data.count, 'quesos');
    
    if (data.products.length > 0) {
      const firstCheese = data.products[0];
      console.log('📸 Primer queso:');
      console.log('  - ID:', firstCheese.code);
      console.log('  - Nombre:', firstCheese.product_name);
      console.log('  - País:', firstCheese.countries_tags?.[0]);
      console.log('  - Imagen:', firstCheese.image_front_url);
      
      // Verificar que la imagen existe
      if (firstCheese.image_front_url) {
        const imgResponse = await fetch(firstCheese.image_front_url);
        console.log('  - Imagen cargable:', imgResponse.ok);
        console.log('  - Tipo:', imgResponse.headers.get('content-type'));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testSimpleOFF();
