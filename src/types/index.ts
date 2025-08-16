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
  userId: string;
  cheeseId: string;
  rating: number;
  comment: string;
  photos: string[];
  helpfulCount: number;
  commentCount: number;
  createdAt: string;
  userName: string;
  userAvatar?: string;
}

export interface CheeseRating {
  id: string;
  userId: string;
  cheeseId: string;
  rating: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RootStackParamList {
  Main: undefined;
  CheeseDetail: {
    cheeseId?: string;
    cheese?: UnifiedCheese;
  };
  Login: undefined;
  Profile: undefined;
  [key: string]: undefined | object; // Índice de firma para satisfacer ParamListBase
}

export interface TabParamList {
  HomeRecommended: undefined;
  Explore: undefined;
  Camera: undefined;
  MyCheeses: undefined;
  Profile: undefined;
  [key: string]: undefined | object; // Índice de firma para satisfacer ParamListBase
}

export interface SavedCheese {
  id: string;
  user_id: string;
  cheese_id: string;
  saved_at: string;
}

export interface ScanResult {
  cheese: Cheese;
  confidence: number;
}
