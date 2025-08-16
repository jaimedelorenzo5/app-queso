import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Usar valores directos para evitar problemas con variables de entorno
const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Cheese {
  id: string;
  name: string;
  producer: string;
  country: string;
  region: string;
  milk_type: string;
  maturation: string;
  flavor_profile: string[];
  pairings: string[];
  designation?: string;
  created_at: string;
}

export interface Review {
  id: string;
  cheese_id: string;
  user_id: string;
  stars: number;
  note?: string;
  photo_url?: string;
  created_at: string;
  user?: Profile;
}

export interface Photo {
  id: string;
  cheese_id: string;
  user_id: string;
  url: string;
  url_public?: string;
  width: number;
  height: number;
  approved: boolean;
  license?: string;
  author?: string;
  source_url?: string;
  created_at: string;
  user?: Profile;
}

export interface Activity {
  id: string;
  type: 'review' | 'photo' | 'follow';
  actor: string;
  cheese_id?: string;
  meta: any;
  created_at: string;
  actor_profile?: Profile;
  cheese?: Cheese;
}

// Auth Helpers
export const auth = {
  signInWithEmail: async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'cheeserate://auth/callback',
      },
    });
    return { error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Profile Helpers
export const profiles = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  createProfile: async (userId: string, username: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username,
      })
      .select()
      .single();
    return { data, error };
  },
};

// Cheese Helpers
export const cheeses = {
  getAll: async (limit = 50, offset = 0) => {
    const { data, error } = await supabase
      .from('cheeses')
      .select('*')
      .order('name')
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('cheeses')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  search: async (query: string, limit = 20) => {
    const { data, error } = await supabase
      .from('cheeses')
      .select('*')
      .or(`name.ilike.%${query}%,country.ilike.%${query}%,producer.ilike.%${query}%`)
      .limit(limit);
    return { data, error };
  },

  getByFilters: async (filters: {
    country?: string;
    milk_type?: string;
    maturation?: string;
    designation?: string;
  }, limit = 50, offset = 0) => {
    let query = supabase.from('cheeses').select('*');
    
    if (filters.country) query = query.eq('country', filters.country);
    if (filters.milk_type) query = query.eq('milk_type', filters.milk_type);
    if (filters.maturation) query = query.eq('maturation', filters.maturation);
    if (filters.designation) query = query.eq('designation', filters.designation);
    
    const { data, error } = await query
      .order('name')
      .range(offset, offset + limit - 1);
    return { data, error };
  },
};

// Review Helpers
export const reviews = {
  getByCheeseId: async (cheeseId: string, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(username, avatar_url)
      `)
      .eq('cheese_id', cheeseId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  getByUserId: async (userId: string, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        cheese:cheeses(name, country, milk_type)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  create: async (review: {
    cheese_id: string;
    stars: number;
    note?: string;
    photo_url?: string;
  }) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    return { data, error };
  },

  update: async (reviewId: string, updates: Partial<Review>) => {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();
    return { data, error };
  },

  delete: async (reviewId: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    return { error };
  },
};

// Photo Helpers
export const photos = {
  getByCheeseId: async (cheeseId: string, limit = 12) => {
    const { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        user:profiles(username, avatar_url)
      `)
      .eq('cheese_id', cheeseId)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  getByUserId: async (userId: string, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        cheese:cheeses(name, country, milk_type)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  create: async (photo: {
    cheese_id: string;
    url: string;
    width: number;
    height: number;
    license?: string;
    author?: string;
    source_url?: string;
  }) => {
    const { data, error } = await supabase
      .from('photos')
      .insert(photo)
      .select()
      .single();
    return { data, error };
  },

  update: async (photoId: string, updates: Partial<Photo>) => {
    const { data, error } = await supabase
      .from('photos')
      .update(updates)
      .eq('id', photoId)
      .select()
      .single();
    return { data, error };
  },

  delete: async (photoId: string) => {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);
    return { error };
  },
};

// Activity Helpers
export const activities = {
  getFeed: async (limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        actor_profile:profiles!actor(username, avatar_url),
        cheese:cheeses(name, country, milk_type)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  getByUserId: async (userId: string, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        actor_profile:profiles!actor(username, avatar_url),
        cheese:cheeses(name, country, milk_type)
      `)
      .eq('actor', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },
};

// Follow Helpers
export const follows = {
  follow: async (followingId: string) => {
    const { error } = await supabase
      .from('follows')
      .insert({
        follower: (await supabase.auth.getUser()).data.user?.id,
        following: followingId,
      });
    return { error };
  },

  unfollow: async (followingId: string) => {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower', (await supabase.auth.getUser()).data.user?.id)
      .eq('following', followingId);
    return { error };
  },

  isFollowing: async (followingId: string) => {
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower', (await supabase.auth.getUser()).data.user?.id)
      .eq('following', followingId)
      .single();
    return { isFollowing: !!data, error };
  },

  getFollowers: async (userId: string, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower:profiles!follower(username, avatar_url)
      `)
      .eq('following', userId)
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  getFollowing: async (userId: string, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following:profiles!following(username, avatar_url)
      `)
      .eq('follower', userId)
      .range(offset, offset + limit - 1);
    return { data, error };
  },
};

// Cheese Helpers
export const getCheeses = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('cheeses')
    .select('*')
    .order('name')
    .range(offset, offset + limit - 1);
  return { data, error };
};

export const getCheese = async (id: string) => {
  console.log('📞 getCheese llamado con ID:', id);
  try {
    const { data, error } = await supabase
      .from('cheeses')
      .select('*')
      .eq('id', id)
      .single();
    
    console.log('📞 getCheese resultado:', { data, error });
    return { data, error };
  } catch (e) {
    console.error('📞 getCheese error:', e);
    return { data: null, error: e as any };
  }
};

export const searchCheeses = async (query: string, limit = 20) => {
  const { data, error } = await supabase
    .from('cheeses')
    .select('*')
    .or(`name.ilike.%${query}%,producer.ilike.%${query}%,country.ilike.%${query}%`)
    .limit(limit);
  return { data, error };
};

// Photo Helpers
export const getCheesePhotos = async (cheeseId: string) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('cheese_id', cheeseId)
    .eq('approved', true)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const uploadPhoto = async (photo: {
  cheese_id: string;
  user_id: string;
  url: string;
  url_public?: string;
  width?: number;
  height?: number;
  license?: string;
  author?: string;
  source_url?: string;
}) => {
  const { data, error } = await supabase
    .from('photos')
    .insert(photo)
    .select()
    .single();
  return { data, error };
};

// Review Helpers
export const getCheeseReviews = async (cheeseId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:user_id (username, avatar_url)
    `)
    .eq('cheese_id', cheeseId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createReview = async (review: {
  cheese_id: string;
  user_id: string;
  stars: number;
  note?: string;
  photo_url?: string;
}) => {
  const { data, error } = await supabase
    .from('reviews')
    .upsert(review, { onConflict: 'cheese_id,user_id' })
    .select()
    .single();
  return { data, error };
};

export const getUserReviews = async (userId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      cheeses:cheese_id (id, name, country)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Activity Helpers
export const getFeedActivities = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      actor_profile:profiles!actor(username, avatar_url),
      cheese:cheeses(name, country, milk_type)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return { data, error };
};

export const createActivity = async (activity: {
  type: 'review' | 'photo' | 'follow';
  actor: string;
  cheese_id?: string;
  meta: any;
}) => {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();
  return { data, error };
};

// Follow Helpers
export const followUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('follows')
    .insert({
      follower: followerId,
      following: followingId,
    });
  return { error };
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower', followerId)
    .eq('following', followingId);
  return { error };
};

export const getFollowing = async (userId: string) => {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      following:profiles!following(username, avatar_url)
    `)
    .eq('follower', userId);
  return { data, error };
};

export const getFollowers = async (userId: string) => {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      follower:profiles!follower(username, avatar_url)
    `)
    .eq('following', userId);
  return { data, error };
};
