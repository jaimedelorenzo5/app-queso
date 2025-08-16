-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE activity_type AS ENUM ('review', 'photo', 'follow');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cheeses table
CREATE TABLE cheeses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  producer TEXT,
  country TEXT NOT NULL,
  region TEXT,
  milk_type TEXT NOT NULL,
  maturation TEXT NOT NULL,
  flavor_profile JSONB NOT NULL DEFAULT '[]',
  pairings JSONB NOT NULL DEFAULT '[]',
  designation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cheese_id TEXT NOT NULL REFERENCES cheeses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  note TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cheese_id, user_id)
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cheese_id TEXT NOT NULL REFERENCES cheeses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  url_public TEXT,
  width INTEGER,
  height INTEGER,
  approved BOOLEAN DEFAULT FALSE,
  license TEXT,
  author TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follows table
CREATE TABLE follows (
  follower UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower, following),
  CHECK (follower != following)
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type activity_type NOT NULL,
  actor UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cheese_id TEXT REFERENCES cheeses(id) ON DELETE CASCADE,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_reviews_cheese_id ON reviews(cheese_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_photos_cheese_id ON photos(cheese_id);
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_approved ON photos(approved);
CREATE INDEX idx_activities_actor ON activities(actor);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_follows_follower ON follows(follower);
CREATE INDEX idx_follows_following ON follows(following);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheeses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cheeses policies (read-only for all)
CREATE POLICY "Cheeses are viewable by everyone" ON cheeses
  FOR SELECT USING (true);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Photos policies
CREATE POLICY "Approved photos are viewable by everyone" ON photos
  FOR SELECT USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own photos" ON photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos" ON photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" ON photos
  FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON follows
  FOR ALL USING (auth.uid() = follower);

-- Activities policies
CREATE POLICY "Activities are viewable by everyone" ON activities
  FOR SELECT USING (true);

CREATE POLICY "System can insert activities" ON activities
  FOR INSERT WITH CHECK (true);

-- Functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to create activity when review is created
CREATE OR REPLACE FUNCTION create_review_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activities (type, actor, cheese_id, meta)
  VALUES (
    'review',
    NEW.user_id,
    NEW.cheese_id,
    jsonb_build_object(
      'review_id', NEW.id,
      'stars', NEW.stars,
      'has_note', CASE WHEN NEW.note IS NOT NULL THEN true ELSE false END,
      'has_photo', CASE WHEN NEW.photo_url IS NOT NULL THEN true ELSE false END
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION create_review_activity();

-- Function to create activity when photo is created
CREATE OR REPLACE FUNCTION create_photo_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activities (type, actor, cheese_id, meta)
  VALUES (
    'photo',
    NEW.user_id,
    NEW.cheese_id,
    jsonb_build_object(
      'photo_id', NEW.id,
      'width', NEW.width,
      'height', NEW.height
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_photo_created
  AFTER INSERT ON photos
  FOR EACH ROW EXECUTE FUNCTION create_photo_activity();

-- Function to create activity when follow is created
CREATE OR REPLACE FUNCTION create_follow_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activities (type, actor, meta)
  VALUES (
    'follow',
    NEW.follower,
    jsonb_build_object(
      'following_id', NEW.following
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_created
  AFTER INSERT ON follows
  FOR EACH ROW EXECUTE FUNCTION create_follow_activity();

-- Function to update review updated_at
CREATE OR REPLACE FUNCTION update_review_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_review_updated_at();

-- Function to update profile updated_at
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profile_updated_at();

-- Views for common queries
CREATE VIEW cheese_stats AS
SELECT 
  c.id,
  c.name,
  COUNT(r.id) as review_count,
  AVG(r.stars) as avg_rating,
  COUNT(p.id) as photo_count
FROM cheeses c
LEFT JOIN reviews r ON c.id = r.cheese_id
LEFT JOIN photos p ON c.id = p.cheese_id AND p.approved = true
GROUP BY c.id, c.name;

CREATE VIEW user_stats AS
SELECT 
  p.id,
  p.username,
  COUNT(DISTINCT r.id) as reviews_count,
  COUNT(DISTINCT ph.id) as photos_count,
  COUNT(DISTINCT f1.following) as following_count,
  COUNT(DISTINCT f2.follower) as followers_count
FROM profiles p
LEFT JOIN reviews r ON p.id = r.user_id
LEFT JOIN photos ph ON p.id = ph.user_id
LEFT JOIN follows f1 ON p.id = f1.follower
LEFT JOIN follows f2 ON p.id = f2.following
GROUP BY p.id, p.username;
