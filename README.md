# Go Girl Fashion Store

A full-stack React + Vercel website for a girls fashion store, powered by Supabase.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the contents of `supabase/schema.sql` and `supabase/orders-schema.sql`
4. Copy your **Project URL** and **Anon Key** from Settings > API

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL` (your Supabase project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Settings > API)
   - `VITE_SUPABASE_URL` (same as above)
   - `VITE_SUPABASE_ANON_KEY` (your anon key)

## Database Schema

### Products

| Column     | Type       | Description              |
|------------|------------|--------------------------|
| id         | uuid       | Primary key              |
| name       | text       | Product name             |
| description| text       | Product description      |
| price      | numeric    | Price                    |
| image_url  | text       | Product image URL        |
| category   | text       | Category name            |
| sizes      | text[]     | Available sizes          |
| colors     | text[]     | Available colors         |
| in_stock   | boolean    | Whether item is in stock |
| featured   | boolean    | Featured on homepage     |
| created_at | timestamp  | Creation date            |

### Orders

| Column     | Type       | Description              |
|------------|------------|--------------------------|
| id         | uuid       | Primary key              |
| user_email | text       | Customer email           |
| items      | jsonb      | Order items              |
| total      | numeric    | Order total              |
| status     | text       | Order status             |
| created_at | timestamp  | Creation date            |
