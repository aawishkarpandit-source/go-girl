-- Go Girl Fashion Store - Orders Table
-- Run this in your Supabase SQL Editor after creating the products table

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  items jsonb not null default '[]',
  total numeric(10, 2) not null,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

create index if not exists idx_orders_email on orders (user_email);
create index if not exists idx_orders_status on orders (status);

-- Row Level Security
-- alter table orders enable row level security;
-- create policy "Users can view their own orders" on orders for select using (auth.email() = user_email);
-- create policy "Users can create orders" on orders for insert with check (auth.email() = user_email);
