-- Run this in your Supabase SQL Editor

-- ============================================================
-- EXISTING TABLES (keep as-is)
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  hosted_url TEXT,
  project_type TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  url TEXT,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NEW TABLES
-- ============================================================

-- Visitors (community accounts for posting reviews/chat)
CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gym posts (workouts, fitness content)
CREATE TABLE IF NOT EXISTS gym_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  workout_type TEXT,
  difficulty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Art gallery posts
CREATE TABLE IF NOT EXISTS art_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  medium TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews / testimonials for community page
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  project_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT,
  message TEXT NOT NULL,
  project_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADD project_type COLUMN to existing projects
-- ============================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'website';

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES
-- ============================================================
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public read gym_posts" ON gym_posts FOR SELECT USING (true);
CREATE POLICY "Public read art_posts" ON art_posts FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

CREATE POLICY "All access projects" ON projects FOR ALL USING (true);
CREATE POLICY "All access certificates" ON certificates FOR ALL USING (true);
CREATE POLICY "All access messages" ON messages FOR ALL USING (true);
CREATE POLICY "All access settings" ON settings FOR ALL USING (true);
CREATE POLICY "All access gym_posts" ON gym_posts FOR ALL USING (true);
CREATE POLICY "All access art_posts" ON art_posts FOR ALL USING (true);
CREATE POLICY "All access reviews" ON reviews FOR ALL USING (true);
CREATE POLICY "All access chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "All access visitors" ON visitors FOR ALL USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO projects (name, description, category, tech_stack, github_url, project_type) VALUES
('Kijas POS', 'A full-featured point-of-sale system built for a restaurant with multiple features.', 'Restaurant Tech', ARRAY['HTML','JavaScript'], 'https://github.com/Kija-Maharjan/kijas-pos', 'website'),
('Trios Cafe Menu', 'Online menu for Trios Cafe separating day and night menus.', 'Cafe Tech', ARRAY['HTML','CSS'], 'https://github.com/Kija-Maharjan/trios-cafe-menu', 'website'),
('Trios Cafe', 'Full website for Trios Cafe.', 'Cafe Tech', ARRAY['HTML','CSS'], 'https://github.com/Kija-Maharjan/trios-cafe', 'website'),
('New Diamond Academy', 'School website for New Diamond Academy.', 'Education', ARRAY['Blade','PHP'], 'https://github.com/Kija-Maharjan/new_diamond_academy', 'website'),
('Luswaa Fits', 'Website for Luswaa Fits brand.', 'Brand & Fashion', ARRAY['HTML','CSS'], 'https://github.com/Kija-Maharjan/luswaa_fits', 'website'),
('Recipe Streak', 'A recipe learning and sharing site.', 'Food & Community', ARRAY['HTML','JavaScript'], 'https://github.com/Kija-Maharjan/recipe-streak', 'website'),
('Keyboard Sound Extension', 'Brave browser typing sound extension.', 'Browser Extension', ARRAY['JavaScript'], 'https://github.com/Kija-Maharjan/keyboard-sound-extension', 'extension'),
('Key Sound Gnome', 'GNOME desktop key sound extension.', 'Browser Extension', ARRAY['JavaScript'], 'https://github.com/Kija-Maharjan/key-sound-gnome', 'extension'),
('Gym Bro', 'Fitness website for gym enthusiasts.', 'Fitness', ARRAY['HTML','CSS'], 'https://github.com/Kija-Maharjan/gym-bro', 'website'),
('Kija Growth', 'Personal programming growth project.', 'Personal Growth', ARRAY['Hack'], 'https://github.com/Kija-Maharjan/kija_growth', 'website');

INSERT INTO certificates (name, issuer, status) VALUES
('Fullstack Web Development', 'Self-taught · Online', 'Completed'),
('UI/UX Design Fundamentals', 'Online Courses', 'Completed'),
('Database Design & Management', 'Self-taught', 'Completed');
