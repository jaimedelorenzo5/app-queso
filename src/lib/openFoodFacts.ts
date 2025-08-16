// Servicio para Open Food Facts API
export interface OFFProduct {
  code: string;
  product_name: string;
  brands?: string;
  countries_tags?: string[];
  quantity?: string;
  image_front_url?: string;
  image_url?: string;
  image_small_url?: string;
  categories_tags?: string[];
  labels_tags?: string[];
  ingredients_text?: string;
  nutriscore_grade?: string;
  nova_group?: number;
  nutriments?: any;
}

export interface OFFSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: OFFProduct[];
}

export interface OFFCheese {
  id: string;
  name: string;
  brand?: string;
  country?: string;
  quantity?: string;
  imageUrl?: string;
  imageSmallUrl?: string;
  categories: string[];
  labels: string[];
  ingredients?: string;
  nutriscore?: string;
  novaGroup?: number;
  source: 'openfoodfacts';
  license: 'CC-BY-SA 4.0';
}

// Configuración de la API
const OFF_BASE_URL = 'https://world.openfoodfacts.org/api/v2';
const OFF_LICENSE = 'CC-BY-SA 4.0';
const OFF_ATTRIBUTION = 'Datos e imágenes de Open Food Facts — CC-BY-SA 4.0';

// Función para buscar quesos
export const searchOFFCheeses = async (
  page: number = 1,
  pageSize: number = 50,
  searchQuery?: string
): Promise<{ data: OFFCheese[]; total: number; page: number }> => {
  try {
    let url = `${OFF_BASE_URL}/search?categories_tags_en=Cheeses&page_size=${pageSize}&page=${page}&fields=code,product_name,brands,countries_tags,quantity,image_front_url,image_url,image_small_url,categories_tags,labels_tags,ingredients_text,nutriscore_grade,nova_group,nutriments`;
    
    // Añadir búsqueda por texto si se proporciona
    if (searchQuery && searchQuery.trim()) {
      url += `&search_terms=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    console.log('🔍 Buscando quesos en Open Food Facts:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    
    const data: OFFSearchResponse = await response.json();
    
    console.log('🔍 Datos brutos de la API OFF:', {
      totalProducts: data.products?.length || 0,
      firstProduct: data.products?.[0] || null
    });
    
    // Transformar productos a formato de queso
    const cheeses: OFFCheese[] = data.products
      .filter(product => {
        const hasImage = product.image_front_url || product.image_url;
        console.log('🔍 Producto:', {
          name: product.product_name,
          image_front_url: product.image_front_url,
          image_url: product.image_url,
          hasImage: !!hasImage
        });
        return product.product_name && hasImage;
      })
      .map(product => {
        const imageUrl = product.image_front_url || product.image_url;
        console.log('🖼️ Asignando imagen para', product.product_name, ':', imageUrl);
        
        return {
          id: product.code,
          name: product.product_name,
          brand: product.brands,
          country: product.countries_tags?.[0]?.replace('en:', '') || 'Desconocido',
          quantity: product.quantity,
          imageUrl: product.image_front_url || product.image_url,
          imageSmallUrl: product.image_small_url || product.image_front_url,
          categories: product.categories_tags?.map(tag => tag.replace('en:', '')) || [],
          labels: product.labels_tags?.map(tag => tag.replace('en:', '')) || [],
          ingredients: product.ingredients_text,
          nutriscore: product.nutriscore_grade,
          novaGroup: product.nova_group,
          source: 'openfoodfacts' as const,
          license: OFF_LICENSE
        };
      });
    
    console.log(`✅ Encontrados ${cheeses.length} quesos en Open Food Facts`);
    
    return {
      data: cheeses,
      total: data.count,
      page: data.page
    };
    
  } catch (error) {
    console.error('❌ Error buscando quesos en Open Food Facts:', error);
    throw error;
  }
};

// Función para obtener un queso específico por código
export const getOFFCheese = async (code: string): Promise<OFFCheese | null> => {
  try {
    const url = `${OFF_BASE_URL}/product/${code}?fields=code,product_name,brands,countries_tags,quantity,image_front_url,image_url,image_small_url,categories_tags,labels_tags,ingredients_text,nutriscore_grade,nova_group,nutriments`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.product) {
      return null;
    }
    
    const product = data.product;
    
    return {
      id: product.code,
      name: product.product_name,
      brand: product.brands,
      country: product.countries_tags?.[0]?.replace('en:', '') || 'Desconocido',
      quantity: product.quantity,
      imageUrl: product.image_front_url || product.image_url,
      imageSmallUrl: product.image_small_url || product.image_front_url,
      categories: product.categories_tags?.map(tag => tag.replace('en:', '')) || [],
      labels: product.labels_tags?.map(tag => tag.replace('en:', '')) || [],
      ingredients: product.ingredients_text,
      nutriscore: product.nutriscore_grade,
      novaGroup: product.nova_group,
      source: 'openfoodfacts' as const,
      license: OFF_LICENSE
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo queso de Open Food Facts:', error);
    return null;
  }
};

// Función para obtener URL de imagen optimizada
export const getOptimizedImageUrl = (imageUrl: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  if (!imageUrl) return '';
  
  // Open Food Facts ya proporciona URLs optimizadas
  if (imageUrl.includes('openfoodfacts.org')) {
    return imageUrl;
  }
  
  // Para otras URLs, devolver la original
  return imageUrl;
};

// Constantes para la UI
export const OFF_CONSTANTS = {
  LICENSE: OFF_LICENSE,
  ATTRIBUTION: OFF_ATTRIBUTION,
  SOURCE_NAME: 'Open Food Facts',
  WEBSITE_URL: 'https://world.openfoodfacts.org'
};
