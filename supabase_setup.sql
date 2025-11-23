-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Users table (extends auth.users)
-- Note: This is usually handled by a trigger on auth.users, but for simplicity we'll assume basic profile data
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table public.users enable row level security;

create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- Create Categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Users can view their own categories" on public.categories
  for select using (auth.uid() = user_id);

create policy "Users can insert their own categories" on public.categories
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own categories" on public.categories
  for update using (auth.uid() = user_id);

create policy "Users can delete their own categories" on public.categories
  for delete using (auth.uid() = user_id);

-- Create Expenses table
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  amount numeric not null,
  category_id uuid references public.categories(id) on delete set null,
  date date not null,
  description text,
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses" on public.expenses
  for select using (auth.uid() = user_id);

create policy "Users can insert their own expenses" on public.expenses
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own expenses" on public.expenses
  for update using (auth.uid() = user_id);

create policy "Users can delete their own expenses" on public.expenses
  for delete using (auth.uid() = user_id);

-- Create Income Branches table (Fixed, Variable, Fun, Savings)
create table public.income_branches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.income_branches enable row level security;

create policy "Users can view their own income branches" on public.income_branches
  for select using (auth.uid() = user_id);

create policy "Users can insert their own income branches" on public.income_branches
  for insert with check (auth.uid() = user_id);

-- Create Incomes table
create table public.incomes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  amount numeric not null,
  branch_id uuid references public.income_branches(id) on delete set null,
  date date not null,
  description text,
  is_recurring boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.incomes enable row level security;

create policy "Users can view their own incomes" on public.incomes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own incomes" on public.incomes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own incomes" on public.incomes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own incomes" on public.incomes
  for delete using (auth.uid() = user_id);

-- Create Saving Goals table
create table public.saving_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  goal_amount numeric not null,
  current_amount numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.saving_goals enable row level security;

create policy "Users can view their own saving goals" on public.saving_goals
  for select using (auth.uid() = user_id);

create policy "Users can insert their own saving goals" on public.saving_goals
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own saving goals" on public.saving_goals
  for update using (auth.uid() = user_id);

create policy "Users can delete their own saving goals" on public.saving_goals
  for delete using (auth.uid() = user_id);

-- Create Saving Goal Transactions table
create table public.saving_goal_transactions (
  id uuid default uuid_generate_v4() primary key,
  goal_id uuid references public.saving_goals(id) on delete cascade not null,
  amount numeric not null,
  date date not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.saving_goal_transactions enable row level security;

-- Helper function to check ownership of goal transaction via goal
create or replace function public.get_goal_owner(goal_id uuid)
returns uuid as $$
  select user_id from public.saving_goals where id = goal_id;
$$ language sql security definer;

create policy "Users can view their own saving goal transactions" on public.saving_goal_transactions
  for select using (auth.uid() = public.get_goal_owner(goal_id));

create policy "Users can insert their own saving goal transactions" on public.saving_goal_transactions
  for insert with check (auth.uid() = public.get_goal_owner(goal_id));

-- Trigger to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  
  -- Create default income branches
  insert into public.income_branches (user_id, name) values
  (new.id, 'Fixed'),
  (new.id, 'Variable'),
  (new.id, 'Fun'),
  (new.id, 'Savings');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
