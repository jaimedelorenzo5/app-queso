// Script para probar la integración de Open Food Facts
const testOFFIntegration = async () => {
  try {
    console.log('🧀 Probando integración de Open Food Facts...');
    
    // Probar búsqueda de quesos
    const searchUrl = 'https://world.openfoodfacts.org/api/v2/search?categories_tags_en=Cheeses&page_size=5&fields=code,product_name,brands,countries_tags,quantity,image_front_url,image_url,image_small_url,categories_tags,labels_tags,ingredients_text,nutriscore_grade,nova_group,nutriments';
    
    console.log('🔍 URL de búsqueda:', searchUrl);
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error('❌ Error en la API:', response.status);
      return;
    }
    
    const data = await response.json();
    
    console.log('✅ Respuesta de la API:');
    console.log('  - Total de productos:', data.count);
    console.log('  - Productos en esta página:', data.products.length);
    
    if (data.products.length > 0) {
      console.log('\n📸 Primer queso encontrado:');
      const firstCheese = data.products[0];
      console.log('  - Nombre:', firstCheese.product_name);
      console.log('  - País:', firstCheese.countries_tags?.[0]);
      console.log('  - Imagen frontal:', firstCheese.image_front_url);
      console.log('  - Imagen pequeña:', firstCheese.image_small_url);
      console.log('  - Categorías:', firstCheese.categories_tags?.slice(0, 3));
      
      // Verificar si la imagen se puede cargar
      if (firstCheese.image_front_url) {
        console.log('\n🖼️ Probando carga de imagen...');
        const imageResponse = await fetch(firstCheese.image_front_url);
        console.log('  - Status de imagen:', imageResponse.status);
        console.log('  - Content-Type:', imageResponse.headers.get('content-type'));
      }
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
};

testOFFIntegration();
