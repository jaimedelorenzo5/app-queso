import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves de storage
const STORAGE_KEYS = {
  FAVORITES: 'cheeserate_favorites',
  RATINGS: 'cheeserate_ratings',
  HISTORY: 'cheeserate_history',
  ACTIVITY: 'cheeserate_activity',
  FILTERS: 'cheeserate_filters',
  USER_PREFERENCES: 'cheeserate_preferences',
};

// Favoritos
export const getFavorites = async (): Promise<string[]> => {
  try {
    const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addToFavorites = async (cheeseId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(cheeseId)) {
      favorites.push(cheeseId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

export const removeFromFavorites = async (cheeseId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(id => id !== cheeseId);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const isFavorite = async (cheeseId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(cheeseId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// Valoraciones
export const getRatings = async (): Promise<Record<string, any>> => {
  try {
    const ratings = await AsyncStorage.getItem(STORAGE_KEYS.RATINGS);
    return ratings ? JSON.parse(ratings) : {};
  } catch (error) {
    console.error('Error getting ratings:', error);
    return {};
  }
};

export const saveRating = async (cheeseId: string, rating: number, note: string = ''): Promise<boolean> => {
  try {
    const ratings = await getRatings();
    ratings[cheeseId] = {
      rating,
      note,
      date: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
    return true;
  } catch (error) {
    console.error('Error saving rating:', error);
    return false;
  }
};

export const getRating = async (cheeseId: string): Promise<any> => {
  try {
    const ratings = await getRatings();
    return ratings[cheeseId] || null;
  } catch (error) {
    console.error('Error getting rating:', error);
    return null;
  }
};

// Historial de vistas
export const getHistory = async (): Promise<any[]> => {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const addToHistory = async (cheeseId: string): Promise<boolean> => {
  try {
    const history = await getHistory();
    const existingIndex = history.findIndex(item => item.cheeseId === cheeseId);
    
    if (existingIndex !== -1) {
      // Actualizar timestamp si ya existe
      history[existingIndex].timestamp = new Date().toISOString();
    } else {
      // Agregar nuevo item
      history.unshift({
        cheeseId,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Mantener solo los últimos 50 items
    const limitedHistory = history.slice(0, 50);
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
    return true;
  } catch (error) {
    console.error('Error adding to history:', error);
    return false;
  }
};

// Actividad social (mock)
export const getActivity = async (): Promise<any[]> => {
  try {
    const activity = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return activity ? JSON.parse(activity) : [];
  } catch (error) {
    console.error('Error getting activity:', error);
    return [];
  }
};

export const addActivity = async (activityItem: any): Promise<boolean> => {
  try {
    const activity = await getActivity();
    activity.unshift({
      ...activityItem,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });
    
    // Mantener solo los últimos 100 items
    const limitedActivity = activity.slice(0, 100);
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(limitedActivity));
    return true;
  } catch (error) {
    console.error('Error adding activity:', error);
    return false;
  }
};

// Filtros guardados
export const getFilters = async (): Promise<any> => {
  try {
    const filters = await AsyncStorage.getItem(STORAGE_KEYS.FILTERS);
    return filters ? JSON.parse(filters) : {
      country: '',
      milkType: '',
      maturation: '',
      designation: '',
    };
  } catch (error) {
    console.error('Error getting filters:', error);
    return {
      country: '',
      milkType: '',
      maturation: '',
      designation: '',
    };
  }
};

export const saveFilters = async (filters: any): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
    return true;
  } catch (error) {
    console.error('Error saving filters:', error);
    return false;
  }
};

// Preferencias del usuario
export const getUserPreferences = async (): Promise<any> => {
  try {
    const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return preferences ? JSON.parse(preferences) : {
      theme: 'light',
      notifications: true,
      language: 'es',
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {
      theme: 'light',
      notifications: true,
      language: 'es',
    };
  }
};

export const saveUserPreferences = async (preferences: any): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

// Exportar datos
export const exportData = async (): Promise<any> => {
  try {
    const data = {
      favorites: await getFavorites(),
      ratings: await getRatings(),
      history: await getHistory(),
      activity: await getActivity(),
      filters: await getFilters(),
      preferences: await getUserPreferences(),
      exportDate: new Date().toISOString(),
    };
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

// Borrar todos los datos
export const clearAllData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Obtener estadísticas
export const getStats = async (): Promise<any> => {
  try {
    const [favorites, ratings, history] = await Promise.all([
      getFavorites(),
      getRatings(),
      getHistory(),
    ]);

    const totalRatings = Object.keys(ratings).length;
    const avgRating = totalRatings > 0 
      ? Object.values(ratings).reduce((sum: number, r: any) => sum + r.rating, 0) / totalRatings 
      : 0;

    return {
      totalFavorites: favorites.length,
      totalRatings,
      averageRating: avgRating.toFixed(1),
      totalViewed: history.length,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalFavorites: 0,
      totalRatings: 0,
      averageRating: '0.0',
      totalViewed: 0,
    };
  }
};
