-- Run this in your Supabase SQL Editor

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  hosted_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  url TEXT,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (from contact form)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public reads on projects and certificates
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (true);

-- Allow all operations (server-side uses service role)
CREATE POLICY "All access projects" ON projects FOR ALL USING (true);
CREATE POLICY "All access certificates" ON certificates FOR ALL USING (true);
CREATE POLICY "All access messages" ON messages FOR ALL USING (true);

-- Insert your existing projects
INSERT INTO projects (name, description, category, tech_stack, github_url) VALUES
('Kijas POS', 'A full-featured point-of-sale system built for a restaurant with multiple features.', 'Restaurant Tech', ARRAY['HTML','JavaScript'], 'https://github.com/Kija-Maharjan/kijas-pos'),
('Trios Cafe Menu', 'Online menu for Trios Cafe separating day and night menus.', 'Cafe Tech', ARRAY['HTML','CSS'], 'https://github.com/Kija-Maharjan/trios-cafe-menu'),
('Trios Cafe', 'Full website for Trios Cafe.', 'Cafe Tech', ARRAY['HTML','CSS'], 'https://github.com/Kija-Maharjan/trios-cafe'),
('New Diamond Academy', 'School website for New Diamond Academy.', 'Education', ARRAY['Blade','PHP'], 'https://github.com/Kija-Maharjan/new_diamond_academy'),
('Luswaa Fits', 'Website for Luswaa Fits brand.', 'Brand & Fashion', ARRAY['HTML','CSS'], 'https://github.com/Kija-Maharjan/luswaa_fits'),
('Recipe Streak', 'A recipe learning and sharing site.', 'Food & Community', ARRAY['HTML','JavaScript'], 'https://github.com/Kija-Maharjan/recipe-streak'),
('Keyboard Sound Extension', 'Brave browser typing sound extension.', 'Browser Extension', ARRAY['JavaScript'], 'https://github.com/Kija-Maharjan/keyboard-sound-extension'),
('Key Sound Gnome', 'GNOME desktop key sound extension.', 'Browser Extension', ARRAY['JavaScript'], 'https://github.com/Kija-Maharjan/key-sound-gnome'),
('Gym Bro', 'Fitness website for gym enthusiasts.', 'Fitness', ARRAY['HTML','CSS'], 'https://github.com/Kija-Maharjan/gym-bro'),
('Kija Growth', 'Personal programming growth project.', 'Personal Growth', ARRAY['Hack'], 'https://github.com/Kija-Maharjan/kija_growth');

-- Insert placeholder certificates
INSERT INTO certificates (name, issuer, status) VALUES
('Fullstack Web Development', 'Self-taught · Online', 'Completed'),
('UI/UX Design Fundamentals', 'Online Courses', 'Completed'),
('Database Design & Management', 'Self-taught', 'Completed');
