// Tipos para gestión de fotos
export interface PhotoSource {
  id: string;
  name: string;
  url: string;
  license: 'CC-BY' | 'CC-BY-SA' | 'CC0' | 'Commercial' | 'Fair Use';
  author?: string;
  attribution?: string;
  source_url?: string;
  permission_ref?: string; // Referencia a permiso por email
}

export interface CheesePhoto {
  cheese_id: string;
  source: PhotoSource;
  original_url: string;
  local_path?: string;
  width: number;
  height: number;
  approved: boolean;
  created_at: string;
}

// Fuentes de fotos legales y éticas
export const PHOTO_SOURCES = {
  // Wikimedia Commons (licencias abiertas)
  WIKIMEDIA: {
    id: 'wikimedia',
    name: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org',
    license: 'CC-BY' as const,
    search_url: 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=',
  },

  // Open Food Facts (base de datos abierta)
  OPENFOODFACTS: {
    id: 'openfoodfacts',
    name: 'Open Food Facts',
    url: 'https://world.openfoodfacts.org',
    license: 'CC-BY-SA' as const,
    search_url: 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=',
  },

  // Unsplash (licencia libre)
  UNSPLASH: {
    id: 'unsplash',
    name: 'Unsplash',
    url: 'https://unsplash.com',
    license: 'CC0' as const,
    search_url: 'https://api.unsplash.com/search/photos?query=',
  },

  // Productores oficiales (con permiso)
  PRODUCER: {
    id: 'producer',
    name: 'Productor Oficial',
    url: '',
    license: 'Commercial' as const,
    requires_permission: true,
  },

  // Usuario de la app
  USER: {
    id: 'user',
    name: 'Usuario de CheeseRate',
    url: '',
    license: 'Commercial' as const,
    requires_attribution: true,
  },
};

// Quesos populares con búsquedas optimizadas
export const CHEESE_SEARCH_TERMS = {
  'c1': ['manchego', 'queso manchego', 'manchego cheese'],
  'c2': ['brie', 'brie cheese', 'brie de meaux'],
  'c3': ['parmigiano', 'parmesan', 'parmigiano reggiano'],
  'c4': ['gouda', 'gouda cheese', 'aged gouda'],
  'c5': ['chevre', 'goat cheese', 'chèvre frais'],
  'c6': ['roquefort', 'blue cheese', 'roquefort cheese'],
  'c7': ['mozzarella', 'buffalo mozzarella', 'mozzarella di bufala'],
  'c8': ['cheddar', 'cheddar cheese', 'aged cheddar'],
  'c9': ['camembert', 'camembert cheese', 'camembert de normandie'],
  'c10': ['pecorino', 'pecorino romano', 'sheep cheese'],
};

// Función para buscar fotos en múltiples fuentes
export const searchCheesePhotos = async (cheeseId: string, cheeseName: string) => {
  const searchTerms = CHEESE_SEARCH_TERMS[cheeseId as keyof typeof CHEESE_SEARCH_TERMS] || [cheeseName];
  
  const results: PhotoSource[] = [];

  // Buscar en Wikimedia Commons
  try {
    const wikimediaResults = await searchWikimedia(searchTerms[0]);
    results.push(...wikimediaResults);
  } catch (error) {
    console.error('Error searching Wikimedia:', error);
  }

  // Buscar en Open Food Facts
  try {
    const openFoodResults = await searchOpenFoodFacts(searchTerms[0]);
    results.push(...openFoodResults);
  } catch (error) {
    console.error('Error searching Open Food Facts:', error);
  }

  // Buscar en Unsplash (solo para fotos generales de quesos)
  try {
    const unsplashResults = await searchUnsplash(searchTerms[0]);
    results.push(...unsplashResults);
  } catch (error) {
    console.error('Error searching Unsplash:', error);
  }

  return results;
};

// Búsqueda en Wikimedia Commons
const searchWikimedia = async (query: string): Promise<PhotoSource[]> => {
  const searchUrl = `${PHOTO_SOURCES.WIKIMEDIA.search_url}${encodeURIComponent(query + ' cheese')}&format=json&srlimit=10`;
  
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    return data.query?.search?.map((item: any) => ({
      id: `wikimedia_${item.pageid}`,
      name: item.title,
      url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(item.title)}`,
      license: 'CC-BY' as const,
      author: 'Wikimedia Commons',
      attribution: `Photo: ${item.title} - License: CC-BY`,
      source_url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(item.title)}`,
    })) || [];
  } catch (error) {
    console.error('Wikimedia search error:', error);
    return [];
  }
};

// Búsqueda en Open Food Facts
const searchOpenFoodFacts = async (query: string): Promise<PhotoSource[]> => {
  const searchUrl = `${PHOTO_SOURCES.OPENFOODFACTS.search_url}${encodeURIComponent(query)}&json=1`;
  
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    return data.products?.slice(0, 5).map((product: any) => ({
      id: `openfood_${product.code}`,
      name: product.product_name || query,
      url: `https://world.openfoodfacts.org/product/${product.code}`,
      license: 'CC-BY-SA' as const,
      author: 'Open Food Facts',
      attribution: `Photo: ${product.product_name || query} - License: CC-BY-SA`,
      source_url: `https://world.openfoodfacts.org/product/${product.code}`,
    })) || [];
  } catch (error) {
    console.error('Open Food Facts search error:', error);
    return [];
  }
};

// Búsqueda en Unsplash (requiere API key)
const searchUnsplash = async (query: string): Promise<PhotoSource[]> => {
  // Nota: Necesitarías una API key de Unsplash para esto
  // Por ahora retornamos un array vacío
  return [];
};

// Función para descargar y procesar una foto
export const downloadAndProcessPhoto = async (
  photoSource: PhotoSource,
  cheeseId: string
): Promise<CheesePhoto> => {
  try {
    // Descargar la imagen
    const response = await fetch(photoSource.url);
    const blob = await response.blob();
    
    // Crear un archivo
    const file = new File([blob], `${cheeseId}_${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });
    
    // Obtener dimensiones
    const dimensions = await getImageDimensions(file);
    
    return {
      cheese_id: cheeseId,
      source: photoSource,
      original_url: photoSource.url,
      width: dimensions.width,
      height: dimensions.height,
      approved: false,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error downloading photo:', error);
    throw error;
  }
};

// Función para obtener dimensiones de imagen
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
};

// Función para generar atribución HTML
export const generateAttribution = (photoSource: PhotoSource): string => {
  const parts = [];
  
  if (photoSource.author) {
    parts.push(`Foto: ${photoSource.author}`);
  }
  
  if (photoSource.source_url) {
    parts.push(`<a href="${photoSource.source_url}" target="_blank" rel="noopener">Fuente</a>`);
  }
  
  parts.push(`Licencia: ${photoSource.license}`);
  
  return parts.join(' - ');
};

// Función para validar licencia
export const validateLicense = (photoSource: PhotoSource): boolean => {
  const validLicenses = ['CC-BY', 'CC-BY-SA', 'CC0', 'Commercial'];
  return validLicenses.includes(photoSource.license);
};
