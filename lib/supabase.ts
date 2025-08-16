import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://avggkectqppeqvxcehgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2drZWN0cXBwZXF2eGNlaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU1MjEsImV4cCI6MjA3MDg2MTUyMX0.D8d0bS2xazqTbSB_FXXj6ELXVqXqv7zBzI46Makka5M';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helpers para autenticación
export const signInWithEmail = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Helpers para perfiles
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const upsertProfile = async (profile: {
  id: string;
  username: string;
  avatar_url?: string | null;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();
  return { data, error };
};

// Helpers para quesos
export const getCheeses = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('cheeses')
    .select('*')
    .order('name')
    .range(offset, offset + limit - 1);
  return { data, error };
};

export const getCheese = async (id: string) => {
  const { data, error } = await supabase
    .from('cheeses')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const searchCheeses = async (query: string, limit = 20) => {
  const { data, error } = await supabase
    .from('cheeses')
    .select('*')
    .or(`name.ilike.%${query}%,producer.ilike.%${query}%,country.ilike.%${query}%`)
    .limit(limit);
  return { data, error };
};

// Helpers para fotos
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

// Helpers para reseñas
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

// Helpers para actividades
export const getFeedActivities = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      profiles:actor (username, avatar_url),
      cheeses:cheese_id (id, name, country)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return { data, error };
};

export const createActivity = async (activity: {
  type: 'review' | 'photo' | 'follow';
  actor: string;
  cheese_id?: string;
  meta?: Record<string, any>;
}) => {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();
  return { data, error };
};

// Helpers para follows
export const followUser = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from('follows')
    .insert({
      follower: followerId,
      following: followingId,
    })
    .select()
    .single();
  return { data, error };
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
      following,
      profiles:following (username, avatar_url)
    `)
    .eq('follower', userId);
  return { data, error };
};

export const getFollowers = async (userId: string) => {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      follower,
      profiles:follower (username, avatar_url)
    `)
    .eq('following', userId);
  return { data, error };
};
