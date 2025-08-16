import { getRatings, getFavorites, getHistory } from './storage';
import cheeseData from '../assets/data/cheese_dataset_seed.json';

// Obtener recomendaciones basadas en lo que le gustó al usuario
export const getRecommendations = async (limit = 6) => {
  try {
    const [ratings, favorites, history] = await Promise.all([
      getRatings(),
      getFavorites(),
      getHistory(),
    ]);

    // Analizar preferencias del usuario
    const userPreferences = analyzeUserPreferences(ratings, favorites, history);
    
    // Generar recomendaciones
    const recommendations = generateRecommendations(userPreferences, limit);
    
    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return getTrendingCheeses(limit);
  }
};

// Analizar preferencias del usuario
const analyzeUserPreferences = (ratings: any, favorites: string[], history: any[]) => {
  const preferences = {
    milkTypes: {} as Record<string, number>,
    countries: {} as Record<string, number>,
    maturation: {} as Record<string, number>,
    flavorProfiles: {} as Record<string, number>,
    avgRating: 0,
  };

  // Analizar valoraciones
  Object.values(ratings).forEach((rating: any) => {
    const cheese = cheeseData.find((c: any) => c.id === rating.cheeseId);
    if (cheese) {
      // Tipo de leche
      preferences.milkTypes[cheese.milkType] = (preferences.milkTypes[cheese.milkType] || 0) + rating.rating;
      
      // País
      preferences.countries[cheese.country] = (preferences.countries[cheese.country] || 0) + rating.rating;
      
      // Maduración
      preferences.maturation[cheese.maturation] = (preferences.maturation[cheese.maturation] || 0) + rating.rating;
      
      // Perfil de sabor
      cheese.flavorProfile.forEach((flavor: string) => {
        preferences.flavorProfiles[flavor] = (preferences.flavorProfiles[flavor] || 0) + rating.rating;
      });
      
      preferences.avgRating += rating.rating;
    }
  });

  // Normalizar preferencias
  const totalRatings = Object.keys(ratings).length;
  if (totalRatings > 0) {
    preferences.avgRating /= totalRatings;
    
    Object.keys(preferences.milkTypes).forEach(key => {
      preferences.milkTypes[key] /= totalRatings;
    });
    
    Object.keys(preferences.countries).forEach(key => {
      preferences.countries[key] /= totalRatings;
    });
    
    Object.keys(preferences.maturation).forEach(key => {
      preferences.maturation[key] /= totalRatings;
    });
    
    Object.keys(preferences.flavorProfiles).forEach(key => {
      preferences.flavorProfiles[key] /= totalRatings;
    });
  }

  return preferences;
};

// Generar recomendaciones basadas en preferencias
const generateRecommendations = (preferences: any, limit: number) => {
  const scoredCheeses = cheeseData.map((cheese: any) => {
    let score = 0;
    
    // Score por tipo de leche
    if (preferences.milkTypes[cheese.milkType]) {
      score += preferences.milkTypes[cheese.milkType] * 2;
    }
    
    // Score por país
    if (preferences.countries[cheese.country]) {
      score += preferences.countries[cheese.country] * 1.5;
    }
    
    // Score por maduración
    if (preferences.maturation[cheese.maturation]) {
      score += preferences.maturation[cheese.maturation] * 1.5;
    }
    
    // Score por perfil de sabor
    cheese.flavorProfile.forEach((flavor: string) => {
      if (preferences.flavorProfiles[flavor]) {
        score += preferences.flavorProfiles[flavor] * 1;
      }
    });
    
    // Bonus por rating alto
    if (cheese.avgRating >= preferences.avgRating) {
      score += 0.5;
    }
    
    return { ...cheese, score };
  });

  // Ordenar por score y devolver los mejores
  return scoredCheeses
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, limit);
};

// Obtener quesos trending (más valorados)
export const getTrendingCheeses = (limit = 6) => {
  return cheeseData
    .sort((a: any, b: any) => b.avgRating - a.avgRating)
    .slice(0, limit);
};

// Obtener recomendaciones por tipo de leche
export const getRecommendationsByMilkType = (milkType: string, limit = 4) => {
  return cheeseData
    .filter((cheese: any) => cheese.milkType === milkType)
    .sort((a: any, b: any) => b.avgRating - a.avgRating)
    .slice(0, limit);
};

// Obtener recomendaciones por país
export const getRecommendationsByCountry = (country: string, limit = 4) => {
  return cheeseData
    .filter((cheese: any) => cheese.country === country)
    .sort((a: any, b: any) => b.avgRating - a.avgRating)
    .slice(0, limit);
};

// Obtener recomendaciones por maduración
export const getRecommendationsByMaturation = (maturation: string, limit = 4) => {
  return cheeseData
    .filter((cheese: any) => cheese.maturation === maturation)
    .sort((a: any, b: any) => b.avgRating - a.avgRating)
    .slice(0, limit);
};

// Obtener recomendaciones por perfil de sabor
export const getRecommendationsByFlavor = (flavor: string, limit = 4) => {
  return cheeseData
    .filter((cheese: any) => cheese.flavorProfile.includes(flavor))
    .sort((a: any, b: any) => b.avgRating - a.avgRating)
    .slice(0, limit);
};

// Obtener quesos similares a uno específico
export const getSimilarCheeses = (cheeseId: string, limit = 4) => {
  const targetCheese = cheeseData.find((c: any) => c.id === cheeseId);
  if (!targetCheese) return [];

  const scoredCheeses = cheeseData
    .filter((cheese: any) => cheese.id !== cheeseId)
    .map((cheese: any) => {
      let score = 0;
      
      // Mismo tipo de leche
      if (cheese.milkType === targetCheese.milkType) score += 3;
      
      // Mismo país
      if (cheese.country === targetCheese.country) score += 2;
      
      // Misma maduración
      if (cheese.maturation === targetCheese.maturation) score += 2;
      
      // Perfiles de sabor similares
      const commonFlavors = cheese.flavorProfile.filter((flavor: string) => 
        targetCheese.flavorProfile.includes(flavor)
      );
      score += commonFlavors.length * 1.5;
      
      return { ...cheese, score };
    });

  return scoredCheeses
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, limit);
};

// Obtener quesos recientemente vistos
export const getRecentlyViewed = async (limit = 6) => {
  try {
    const history = await getHistory();
    const recentCheeses = [];
    
    for (const item of history.slice(0, limit)) {
      const cheese = cheeseData.find((c: any) => c.id === item.cheeseId);
      if (cheese) {
        recentCheeses.push({
          ...cheese,
          viewedAt: item.timestamp,
        });
      }
    }
    
    return recentCheeses;
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

// Obtener quesos favoritos del usuario
export const getUserFavorites = async (limit = 6) => {
  try {
    const favorites = await getFavorites();
    const favoriteCheeses = [];
    
    for (const cheeseId of favorites.slice(0, limit)) {
      const cheese = cheeseData.find((c: any) => c.id === cheeseId);
      if (cheese) {
        favoriteCheeses.push(cheese);
      }
    }
    
    return favoriteCheeses;
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return [];
  }
};

// Obtener quesos valorados por el usuario
export const getUserRatedCheeses = async (limit = 6) => {
  try {
    const ratings = await getRatings();
    const ratedCheeses = [];
    
    for (const [cheeseId, rating] of Object.entries(ratings)) {
      const cheese = cheeseData.find((c: any) => c.id === cheeseId);
      if (cheese) {
        ratedCheeses.push({
          ...cheese,
          userRating: (rating as any).rating,
          userNote: (rating as any).note,
          ratedAt: (rating as any).date,
        });
      }
    }
    
    return ratedCheeses
      .sort((a: any, b: any) => new Date(b.ratedAt) - new Date(a.ratedAt))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting user rated cheeses:', error);
    return [];
  }
};
