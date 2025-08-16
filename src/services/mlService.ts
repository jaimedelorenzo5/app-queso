import { Cheese } from '../types';
import { searchCheeses } from './firebase';

// Servicio de ML para reconocimiento de etiquetas de queso
export class MLService {
  // Simulación de OCR para MVP
  // En producción, usar Google ML Kit o un servicio similar
  static async extractTextFromImage(imageUri: string): Promise<string[]> {
    try {
      // Simulación de OCR - en producción esto sería una llamada real a ML Kit
      const mockTexts = [
        'Manchego Curado',
        'Quesería de La Mancha',
        'Castilla-La Mancha',
        'Spain',
        'Sheep Milk',
        'Aged 12 months'
      ];
      
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return mockTexts;
    } catch (error) {
      console.error('Error extracting text from image:', error);
      return [];
    }
  }

  // Buscar quesos basado en texto extraído
  static async findMatchingCheeses(extractedTexts: string[]): Promise<Cheese[]> {
    try {
      const allCheeses = await searchCheeses('');
      const matches: Cheese[] = [];

      for (const cheese of allCheeses) {
        let score = 0;
        
        for (const text of extractedTexts) {
          const lowerText = text.toLowerCase();
          
          // Buscar coincidencias en nombre, productor, país, etc.
          if (cheese.name.toLowerCase().includes(lowerText)) score += 3;
          if (cheese.producer.toLowerCase().includes(lowerText)) score += 2;
          if (cheese.country.toLowerCase().includes(lowerText)) score += 1;
          if (cheese.region.toLowerCase().includes(lowerText)) score += 1;
          if (cheese.milkType.toLowerCase().includes(lowerText)) score += 1;
        }
        
        if (score > 0) {
          matches.push({ ...cheese, score });
        }
      }

      // Ordenar por score y devolver top 5
      return matches
        .sort((a, b) => (b as any).score - (a as any).score)
        .slice(0, 5)
        .map(({ score, ...cheese }) => cheese);
    } catch (error) {
      console.error('Error finding matching cheeses:', error);
      return [];
    }
  }

  // Procesar imagen completa (OCR + matching)
  static async processCheeseImage(imageUri: string): Promise<Cheese[]> {
    try {
      const extractedTexts = await this.extractTextFromImage(imageUri);
      const matches = await this.findMatchingCheeses(extractedTexts);
      return matches;
    } catch (error) {
      console.error('Error processing cheese image:', error);
      return [];
    }
  }
}
