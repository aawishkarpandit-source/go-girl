-- Go Girl Fashion Store - Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  category text not null,
  sizes text[] default '{}',
  colors text[] default '{}',
  in_stock boolean default true,
  featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Index for filtering by category
create index if not exists idx_products_category on products (category);
create index if not exists idx_products_featured on products (featured);
create index if not exists idx_products_in_stock on products (in_stock);

-- Insert sample products (uncomment and modify as needed)
insert into products (name, description, price, image_url, category, sizes, colors, in_stock, featured)
values
  ('Floral Summer Dress', 'A beautiful floral print dress perfect for sunny days.', 49.99, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600', 'Dresses', '{"XS","S","M","L"}', '{"Pink","Blue"}', true, true),
  ('Classic Denim Jacket', 'Timeless denim jacket that goes with everything.', 65.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', 'Tops', '{"S","M","L","XL"}', '{"Blue","Black"}', true, true),
  ('High-Waist Palazzo Pants', 'Flowy palazzo pants for effortless style.', 42.00, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600', 'Bottoms', '{"XS","S","M","L"}', '{"White","Black","Beige"}', true, true),
  ('Pearl Drop Earrings', 'Elegant pearl earrings for any occasion.', 28.00, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', 'Accessories', '{"One Size"}', '{"Gold","Silver"}', true, true),
  ('Boho Crop Top', 'Relaxed crop top with bohemian vibes.', 32.00, 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=600', 'Tops', '{"XS","S","M"}', '{"White","Coral"}', true, false),
  ('A-Line Midi Skirt', 'Classic A-line midi skirt in soft fabric.', 38.00, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600', 'Bottoms', '{"XS","S","M","L"}', '{"Black","Navy"}', true, false);

-- Row Level Security (optional - enable if using Supabase Auth)
-- alter table products enable row level security;
-- create policy "Allow public read access" on products for select using (true);
-- create policy "Allow authenticated insert" on products for insert with check (auth.role() = 'authenticated');
