import { supabase } from './supabase';
import { SupabaseCheese } from '../types';

export interface CheeseRecommendation {
  cheese: SupabaseCheese;
  score: number;
  reasons: string[];
}

export const getCheeseRecommendations = async (
  currentCheeseId: string,
  limit: number = 4
): Promise<CheeseRecommendation[]> => {
  try {
    // 1. Obtener el queso actual
    const { data: currentCheese, error: currentError } = await supabase
      .from('cheeses')
      .select('*')
      .eq('id', currentCheeseId)
      .single();

    if (currentError || !currentCheese) {
      console.error('Error obteniendo queso actual:', currentError);
      return [];
    }

    // 2. Obtener todos los quesos (excepto el actual)
    const { data: allCheeses, error: allError } = await supabase
      .from('cheeses')
      .select('*')
      .neq('id', currentCheeseId);

    if (allError || !allCheeses) {
      console.error('Error obteniendo todos los quesos:', allError);
      return [];
    }

    // 3. Calcular puntuación de similitud para cada queso
    const recommendations: CheeseRecommendation[] = allCheeses.map(cheese => {
      let score = 0;
      const reasons: string[] = [];

      // Mismo país: +3 puntos
      if (cheese.country === currentCheese.country) {
        score += 3;
        reasons.push(`Mismo país (${cheese.country})`);
      }

      // Mismo tipo de leche: +2 puntos
      if (cheese.milk_type === currentCheese.milk_type) {
        score += 2;
        reasons.push(`Mismo tipo de leche (${cheese.milk_type})`);
      }

      // Misma maduración: +2 puntos
      if (cheese.maturation === currentCheese.maturation) {
        score += 2;
        reasons.push(`Misma maduración (${cheese.maturation})`);
      }

      // Maridajes similares: +1 punto por cada maridaje común
      const commonPairings = cheese.pairings.filter(pairing => 
        currentCheese.pairings.includes(pairing)
      );
      if (commonPairings.length > 0) {
        score += commonPairings.length;
        reasons.push(`Maridajes similares: ${commonPairings.join(', ')}`);
      }

      // Perfil de sabor similar: +1 punto por cada sabor común
      const commonFlavors = cheese.flavor_profile.filter(flavor => 
        currentCheese.flavor_profile.includes(flavor)
      );
      if (commonFlavors.length > 0) {
        score += commonFlavors.length;
        reasons.push(`Sabores similares: ${commonFlavors.join(', ')}`);
      }

      // Misma designación (AOP, DOP, etc.): +1 punto
      if (cheese.designation && cheese.designation === currentCheese.designation) {
        score += 1;
        reasons.push(`Misma designación (${cheese.designation})`);
      }

      return {
        cheese,
        score,
        reasons: reasons.length > 0 ? reasons : ['Características generales similares']
      };
    });

    // 4. Ordenar por puntuación (mayor a menor) y limitar resultados
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

  } catch (error) {
    console.error('Error en getCheeseRecommendations:', error);
    return [];
  }
};

export const getRandomRecommendations = async (
  limit: number = 4
): Promise<SupabaseCheese[]> => {
  try {
    const { data: cheeses, error } = await supabase
      .from('cheeses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error obteniendo recomendaciones aleatorias:', error);
      return [];
    }

    // Mezclar aleatoriamente
    return cheeses.sort(() => Math.random() - 0.5);

  } catch (error) {
    console.error('Error en getRandomRecommendations:', error);
    return [];
  }
};

export const getRecommendationsByCountry = async (
  country: string,
  limit: number = 4
): Promise<SupabaseCheese[]> => {
  try {
    const { data: cheeses, error } = await supabase
      .from('cheeses')
      .select('*')
      .eq('country', country)
      .limit(limit);

    if (error) {
      console.error('Error obteniendo recomendaciones por país:', error);
      return [];
    }

    return cheeses;

  } catch (error) {
    console.error('Error en getRecommendationsByCountry:', error);
    return [];
  }
};

export const getRecommendationsByMilkType = async (
  milkType: string,
  limit: number = 4
): Promise<SupabaseCheese[]> => {
  try {
    const { data: cheeses, error } = await supabase
      .from('cheeses')
      .select('*')
      .eq('milk_type', milkType)
      .limit(limit);

    if (error) {
      console.error('Error obteniendo recomendaciones por tipo de leche:', error);
      return [];
    }

    return cheeses;

  } catch (error) {
    console.error('Error en getRecommendationsByMilkType:', error);
    return [];
  }
};
