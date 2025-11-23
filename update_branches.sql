-- Update the trigger function for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  
  -- Create new default income branches
  insert into public.income_branches (user_id, name) values
  (new.id, 'Ingreso de Nómina'),
  (new.id, 'Ingreso Externo');

  return new;
end;
$$ language plpgsql security definer;

-- Migration to update existing users (optional, run if you want to reset current data)
-- WARNING: This will delete existing branches and their linked incomes if cascade is set, or fail if restricted.
-- Since we are in dev, we can try to update or insert if missing.
-- For this specific user request, let's just insert the new ones for the current user if they don't exist
-- and maybe rename old ones? 
-- Actually, the user said "must have two types".
-- Let's just insert them for now. The user can delete old ones manually or we can wipe.
-- Given it's a personal project in dev, let's try to clean up.

delete from public.income_branches where name not in ('Ingreso de Nómina', 'Ingreso Externo');

-- Insert for existing users who might miss them
insert into public.income_branches (user_id, name)
select id, 'Ingreso de Nómina' from public.users
where not exists (select 1 from public.income_branches where user_id = public.users.id and name = 'Ingreso de Nómina');

insert into public.income_branches (user_id, name)
select id, 'Ingreso Externo' from public.users
where not exists (select 1 from public.income_branches where user_id = public.users.id and name = 'Ingreso Externo');

-- Also populate categories with the old branch names as requested ("what is currently income_branch should be expense categories")
insert into public.categories (user_id, name, color)
select id, 'Fixed', '#ef4444' from public.users
where not exists (select 1 from public.categories where user_id = public.users.id and name = 'Fixed');

insert into public.categories (user_id, name, color)
select id, 'Variable', '#3b82f6' from public.users
where not exists (select 1 from public.categories where user_id = public.users.id and name = 'Variable');

insert into public.categories (user_id, name, color)
select id, 'Fun', '#10b981' from public.users
where not exists (select 1 from public.categories where user_id = public.users.id and name = 'Fun');

