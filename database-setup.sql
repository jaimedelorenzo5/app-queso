-- Script para configurar la base de datos de CheeseRate
-- Ejecuta esto en tu proyecto de Supabase en SQL Editor

-- 1. Habilitar Row Level Security (RLS)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- 2. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de reseñas
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  cheese_id TEXT NOT NULL, -- Puede ser ID de Supabase o código de Open Food Facts
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de valoraciones (ratings)
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  cheese_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cheese_id) -- Un usuario solo puede valorar un queso una vez
);

-- 5. Crear tabla de seguidores
CREATE TABLE IF NOT EXISTS public.followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id) -- No puedes seguir a alguien dos veces
);

-- 6. Crear tabla de likes en reseñas
CREATE TABLE IF NOT EXISTS public.review_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  is_like BOOLEAN NOT NULL, -- true = like, false = dislike
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, review_id) -- Un usuario solo puede like/dislike una reseña una vez
);

-- 7. Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_reviews_cheese_id ON public.reviews(cheese_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_cheese_id ON public.ratings(cheese_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON public.followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers(following_id);

-- 8. Configurar RLS para las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- 9. Políticas RLS para usuarios
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 10. Políticas RLS para reseñas
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- 11. Políticas RLS para valoraciones
CREATE POLICY "Anyone can view ratings" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create ratings" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings" ON public.ratings
  FOR DELETE USING (auth.uid() = user_id);

-- 12. Políticas RLS para seguidores
CREATE POLICY "Anyone can view followers" ON public.followers
  FOR SELECT USING (true);

CREATE POLICY "Users can follow/unfollow" ON public.followers
  FOR ALL USING (auth.uid() = follower_id);

-- 13. Políticas RLS para likes de reseñas
CREATE POLICY "Anyone can view review likes" ON public.review_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like/dislike reviews" ON public.review_likes
  FOR ALL USING (auth.uid() = user_id);

-- 14. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 15. Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 16. Función para obtener estadísticas de usuario
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE(
  total_cheeses INTEGER,
  total_reviews INTEGER,
  total_photos INTEGER,
  avg_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT r.cheese_id)::INTEGER as total_cheeses,
    COUNT(r.id)::INTEGER as total_reviews,
    COALESCE(SUM(array_length(r.photos, 1)), 0)::INTEGER as total_photos,
    COALESCE(AVG(r.rating), 0)::NUMERIC as avg_rating
  FROM public.reviews r
  WHERE r.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- 17. Función para obtener reseñas de un queso con información del usuario
CREATE OR REPLACE FUNCTION get_cheese_reviews(cheese_id_param TEXT)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  cheese_id TEXT,
  rating INTEGER,
  comment TEXT,
  photos TEXT[],
  helpful_count INTEGER,
  comment_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  user_name TEXT,
  user_avatar TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.user_id,
    r.cheese_id,
    r.rating,
    r.comment,
    r.photos,
    r.helpful_count,
    r.comment_count,
    r.created_at,
    u.name as user_name,
    u.avatar_url as user_avatar
  FROM public.reviews r
  JOIN public.users u ON r.user_id = u.id
  WHERE r.cheese_id = cheese_id_param
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de confirmación
SELECT 'Base de datos CheeseRate configurada correctamente!' as status;
