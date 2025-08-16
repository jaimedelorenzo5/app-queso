export interface Cheese {
  id: string;
  name: string;
  producer: string;
  country: string;
  region: string;
  milkType: 'Cow' | 'Goat' | 'Sheep' | 'Mix';
  maturation: 'Fresh' | 'Semi' | 'Cured' | 'Soft';
  flavorProfile: string[];
  photoUrl: string;
  pairings: string[];
  avgRating: number;
  reviewCount?: number;
  designation?: string; // DOP, AOP, etc.
}

// Tipo para datos de Supabase
export interface SupabaseCheese {
  id: string;
  name: string;
  producer?: string;
  country: string;
  region?: string;
  milk_type: string;
  maturation: string;
  flavor_profile: string[];
  pairings: string[];
  designation?: string;
  image_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  source?: 'supabase';
}

// Tipo unificado para quesos de cualquier fuente
export interface UnifiedCheese {
  id: string;
  name: string;
  producer?: string;
  country: string;
  region?: string;
  milk_type?: string;
  maturation?: string;
  flavor_profile?: string[];
  pairings?: string[];
  designation?: string;
  image_url?: string;
  imageUrl?: string;
  description?: string;
  source: 'supabase' | 'openfoodfacts' | 'user';
  license?: string;
  brand?: string;
  quantity?: string;
  categories?: string[];
  labels?: string[];
  ingredients?: string;
  nutriscore?: string;
  novaGroup?: number;
}

// Tipo para fotos de Supabase
export interface SupabasePhoto {
  id: string;
  cheese_id: string;
  user_id: string;
  url: string;
  url_public: string | null;
  width: number | null;
  height: number | null;
  approved: boolean;
  license: string | null;
  author: string | null;
  source_url: string | null;
  created_at: string;
}

// Tipo para reseñas de Supabase
export interface SupabaseReview {
  id: string;
  cheese_id: string;
  user_id: string;
  stars: number;
  note: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  cheeseId: string;
  userId: string;
  rating: number;
  note?: string;
  photoUrl?: string;
  createdAt: string;
  userName?: string;
}

// Tipos adicionales para el sistema de reseñas completo
export interface CheeseReview {
  id: string;
  cheeseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 estrellas
  comment: string;
  photos: string[]; // URLs de las fotos subidas
  createdAt: Date;
  helpfulCount: number;
  commentCount: number;
}

export interface CheeseRating {
  averageRating: number;
  totalRatings: number;
  userRating?: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  favorites: string[];
  reviewHistory: string[];
}

export interface ScanResult {
  cheese: Cheese;
  confidence: number;
}

export interface RootStackParamList {
  Home: undefined;
  Explore: undefined;
  Following: undefined;
  MyCheeses: undefined;
  CheeseDetail: { cheeseId?: string; cheese?: UnifiedCheese };
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  [key: string]: undefined | object | { cheeseId?: string; cheese?: UnifiedCheese }; // Añadir índice de firma para satisfacer ParamListBase
}

export interface TabParamList {
  HomeRecommended: undefined;
  Explore: undefined;
  Camera: undefined;
  Following: undefined;
  MyCheeses: undefined;
}

export interface SavedCheese {
  id: string;
  user_id: string;
  cheese_id: string;
  saved_at: string;
}
