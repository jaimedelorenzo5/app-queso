import cheeseData from '../assets/data/cheese_dataset_seed.json';

// Simular OCR para extraer texto de una imagen
export const simulateOCR = async (imageUri: string) => {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular diferentes resultados basados en el hash de la URI
  const hash = simpleHash(imageUri);
  const scenarios = [
    // Escenario 1: Manchego detectado
    {
      text: 'Manchego Curado DOP',
      confidence: 0.95,
      matches: ['c1']
    },
    // Escenario 2: Brie detectado
    {
      text: 'Brie de Meaux AOP',
      confidence: 0.88,
      matches: ['c2']
    },
    // Escenario 3: Gouda detectado
    {
      text: 'Gouda Aged',
      confidence: 0.92,
      matches: ['c3']
    },
    // Escenario 4: Cheddar detectado
    {
      text: 'Cheddar Sharp',
      confidence: 0.85,
      matches: ['c4']
    },
    // Escenario 5: Parmigiano detectado
    {
      text: 'Parmigiano Reggiano DOP',
      confidence: 0.97,
      matches: ['c5']
    },
    // Escenario 6: Roquefort detectado
    {
      text: 'Roquefort AOP',
      confidence: 0.90,
      matches: ['c6']
    },
    // Escenario 7: Mozzarella detectado
    {
      text: 'Mozzarella di Bufala',
      confidence: 0.87,
      matches: ['c7']
    },
    // Escenario 8: Gruyère detectado
    {
      text: 'Gruyère AOP',
      confidence: 0.93,
      matches: ['c8']
    },
    // Escenario 9: Comté detectado
    {
      text: 'Comté AOP',
      confidence: 0.89,
      matches: ['c9']
    },
    // Escenario 10: Feta detectado
    {
      text: 'Feta DOP',
      confidence: 0.86,
      matches: ['c10']
    },
    // Escenario 11: Texto no reconocido
    {
      text: 'Texto no reconocido',
      confidence: 0.15,
      matches: []
    },
    // Escenario 12: Múltiples coincidencias
    {
      text: 'Queso Español',
      confidence: 0.75,
      matches: ['c1', 'c6']
    }
  ];
  
  const scenarioIndex = hash % scenarios.length;
  return scenarios[scenarioIndex];
};

// Buscar quesos basado en texto extraído
export const searchCheesesByText = (text: string) => {
  const searchTerm = text.toLowerCase();
  const matches: any[] = [];
  
  cheeseData.forEach((cheese: any) => {
    let score = 0;
    
    // Buscar en nombre
    if (cheese.name.toLowerCase().includes(searchTerm)) {
      score += 10;
    }
    
    // Buscar en productor
    if (cheese.producer.toLowerCase().includes(searchTerm)) {
      score += 5;
    }
    
    // Buscar en país
    if (cheese.country.toLowerCase().includes(searchTerm)) {
      score += 3;
    }
    
    // Buscar en tipo de leche
    if (cheese.milkType.toLowerCase().includes(searchTerm)) {
      score += 2;
    }
    
    // Buscar en maduración
    if (cheese.maturation.toLowerCase().includes(searchTerm)) {
      score += 2;
    }
    
    // Buscar en designación
    if (cheese.designation && cheese.designation.toLowerCase().includes(searchTerm)) {
      score += 4;
    }
    
    // Buscar en perfil de sabor
    cheese.flavorProfile.forEach((flavor: string) => {
      if (flavor.toLowerCase().includes(searchTerm)) {
        score += 1;
      }
    });
    
    if (score > 0) {
      matches.push({ ...cheese, searchScore: score });
    }
  });
  
  // Ordenar por score de búsqueda
  return matches.sort((a: any, b: any) => b.searchScore - a.searchScore);
};

// Función hash simple para simular resultados consistentes
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a entero de 32 bits
  }
  return Math.abs(hash);
};

// Procesar imagen y buscar quesos
export const processImageAndSearch = async (imageUri: string) => {
  try {
    // Simular OCR
    const ocrResult = await simulateOCR(imageUri);
    
    if (ocrResult.confidence < 0.5) {
      return {
        success: false,
        message: 'No se pudo reconocer texto en la imagen. Intenta con una foto más clara.',
        matches: []
      };
    }
    
    // Buscar quesos basado en el texto extraído
    const matches = searchCheesesByText(ocrResult.text);
    
    // Si hay matches específicos del OCR, usarlos
    if (ocrResult.matches.length > 0) {
      const specificMatches = cheeseData.filter((cheese: any) => 
        ocrResult.matches.includes(cheese.id)
      );
      
      return {
        success: true,
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        matches: specificMatches,
        searchResults: matches
      };
    }
    
    return {
      success: true,
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      matches: matches.slice(0, 5), // Top 5 resultados
      searchResults: matches
    };
    
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      success: false,
      message: 'Error al procesar la imagen. Intenta de nuevo.',
      matches: []
    };
  }
};

// Obtener sugerencias de búsqueda
export const getSearchSuggestions = (query: string) => {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  const searchTerm = query.toLowerCase();
  
  cheeseData.forEach((cheese: any) => {
    // Sugerencias basadas en nombres
    if (cheese.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(cheese.name);
    }
    
    // Sugerencias basadas en países
    if (cheese.country.toLowerCase().includes(searchTerm)) {
      suggestions.add(cheese.country);
    }
    
    // Sugerencias basadas en tipos de leche
    if (cheese.milkType.toLowerCase().includes(searchTerm)) {
      suggestions.add(cheese.milkType);
    }
    
    // Sugerencias basadas en maduración
    if (cheese.maturation.toLowerCase().includes(searchTerm)) {
      suggestions.add(cheese.maturation);
    }
  });
  
  return Array.from(suggestions).slice(0, 8);
};

// Simular reconocimiento de etiquetas específicas
export const recognizeCheeseLabel = async (imageUri: string) => {
  const hash = simpleHash(imageUri);
  const labels = [
    'Manchego Curado DOP - Quesería de La Mancha',
    'Brie de Meaux AOP - Fromagerie X',
    'Gouda Aged - Dutch Dairy Co.',
    'Cheddar Sharp - English Farm',
    'Parmigiano Reggiano DOP - Consorzio',
    'Roquefort AOP - Société des Caves',
    'Mozzarella di Bufala - Campania Dairy',
    'Gruyère AOP - Fromagerie Gruyère',
    'Comté AOP - Fruitière Comtoise',
    'Feta DOP - Greek Dairy Association'
  ];
  
  const labelIndex = hash % labels.length;
  return {
    label: labels[labelIndex],
    confidence: 0.85 + (hash % 15) / 100, // Entre 0.85 y 0.99
    timestamp: new Date().toISOString()
  };
};
