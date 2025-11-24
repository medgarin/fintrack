-- Advanced Financial Features Migration

-- 1. Monthly Summaries Table
-- Stores a snapshot of financial data for each month
create table if not exists public.monthly_summaries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  month int not null check (month between 1 and 12),
  year int not null,
  total_income numeric default 0,
  total_expenses numeric default 0,
  total_savings numeric default 0,
  balance numeric default 0,
  snapshot_data jsonb default '{}'::jsonb, -- Stores detailed breakdown if needed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, month, year)
);

alter table public.monthly_summaries enable row level security;

create policy "Users can view their own monthly summaries" on public.monthly_summaries
  for select using (auth.uid() = user_id);

create policy "Users can insert their own monthly summaries" on public.monthly_summaries
  for insert with check (auth.uid() = user_id);

-- 2. Recurring Transactions Table
-- Stores templates for transactions that happen automatically
create table if not exists public.recurring_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  frequency text default 'monthly',
  day_of_month int check (day_of_month between 1 and 31),
  active boolean default true,
  last_processed date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.recurring_transactions enable row level security;

create policy "Users can view their own recurring transactions" on public.recurring_transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own recurring transactions" on public.recurring_transactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own recurring transactions" on public.recurring_transactions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own recurring transactions" on public.recurring_transactions
  for delete using (auth.uid() = user_id);

-- 3. Budgets Table
-- Stores budget limits per category per month
create table if not exists public.budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  amount numeric not null,
  month int not null check (month between 1 and 12),
  year int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, category_id, month, year)
);

alter table public.budgets enable row level security;

create policy "Users can view their own budgets" on public.budgets
  for select using (auth.uid() = user_id);

create policy "Users can insert their own budgets" on public.budgets
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own budgets" on public.budgets
  for update using (auth.uid() = user_id);

create policy "Users can delete their own budgets" on public.budgets
  for delete using (auth.uid() = user_id);
