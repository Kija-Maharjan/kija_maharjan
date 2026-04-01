# Kija Maharjan Portfolio

Next.js + Supabase portfolio with admin dashboard.

## Setup

1. Install dependencies:
```
npm install
```

2. Run Supabase SQL schema:
- Go to your Supabase project → SQL Editor
- Paste and run the contents of `supabase-schema.sql`

3. Set your admin password hash in `.env.local`:
- Generate hash: `node -e "const b=require('bcryptjs');b.hash('YOUR_PASSWORD',10).then(console.log)"`
- Replace `ADMIN_PASSWORD_HASH` in `.env.local`

4. Run locally:
```
npm run dev
```

5. Deploy to Vercel:
- Push to GitHub (make sure `.env.local` is in `.gitignore`)
- Connect repo to Vercel
- Add all environment variables from `.env.local` in Vercel dashboard

## Admin Access
- URL: `/admin/login`
- Username: `kija`
- Password: (whatever you set)

## Pages
- `/` — Home
- `/about` — About
- `/services` — Services  
- `/projects` — Projects (from database)
- `/certificates` — Certificates (from database)
- `/contact` — Contact form

## Admin Pages
- `/admin/login` — Login
- `/admin/dashboard` — Overview
- `/admin/projects` — Manage projects
- `/admin/github` — Pull & sync GitHub repos
- `/admin/certificates` — Manage certificates
- `/admin/messages` — View contact messages
