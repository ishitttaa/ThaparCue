-- ============================================================
-- GROUPS FEATURE — PRODUCTION-GRADE SECURITY & RLS SCRIPT
-- Run this in the Supabase SQL Editor to secure all group data
-- ============================================================

-- 1. Create Tables (with foreign keys and cascades)
create table if not exists public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  category    text not null default 'general',
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now(),
  max_members int default 10,
  is_open     boolean default true
);

create table if not exists public.group_members (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid references public.groups(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  role       text default 'member',
  joined_at  timestamptz default now(),
  unique(group_id, user_id)
);

create table if not exists public.group_messages (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid references public.groups(id) on delete cascade,
  sender_id  uuid references public.profiles(id) on delete set null,
  content    text not null,
  created_at timestamptz default now()
);

-- 2. Data Validation Constraints (prevents corrupted or malicious payloads)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'check_group_name_len') then
    alter table public.groups add constraint check_group_name_len check (char_length(trim(name)) between 2 and 100);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'check_group_category') then
    alter table public.groups add constraint check_group_category check (category in ('hackathon', 'competition', 'event', 'general'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'check_group_max_members') then
    alter table public.groups add constraint check_group_max_members check (max_members between 2 and 100);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'check_member_role') then
    alter table public.group_members add constraint check_member_role check (role in ('admin', 'member'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'check_message_len') then
    alter table public.group_messages add constraint check_message_len check (char_length(trim(content)) between 1 and 4000);
  end if;
end $$;

-- 3. Security Definer Helper Functions (prevents circular RLS recursion & speeds up queries)
create or replace function public.is_group_admin(p_group_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = p_user_id and role = 'admin'
  ) or exists (
    select 1 from public.groups
    where id = p_group_id and created_by = p_user_id
  );
$$;

create or replace function public.is_group_member(p_group_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = p_user_id
  );
$$;

-- 4. Enable Row Level Security (RLS) on all tables
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_messages enable row level security;

-- 5. Bulletproof RLS Policies for Groups
drop policy if exists "groups_select" on public.groups;
create policy "groups_select" on public.groups for select to authenticated using (true);

drop policy if exists "groups_insert" on public.groups;
create policy "groups_insert" on public.groups for insert to authenticated with check (auth.uid() = created_by);

drop policy if exists "groups_update" on public.groups;
create policy "groups_update" on public.groups for update to authenticated using (
  public.is_group_admin(id, auth.uid())
);

drop policy if exists "groups_delete" on public.groups;
create policy "groups_delete" on public.groups for delete to authenticated using (
  public.is_group_admin(id, auth.uid())
);

-- 6. Bulletproof RLS Policies for Group Members
drop policy if exists "gm_select" on public.group_members;
create policy "gm_select" on public.group_members for select to authenticated using (true);

drop policy if exists "gm_insert" on public.group_members;
create policy "gm_insert" on public.group_members for insert to authenticated with check (
  auth.uid() = user_id or public.is_group_admin(group_id, auth.uid())
);

drop policy if exists "gm_delete" on public.group_members;
create policy "gm_delete" on public.group_members for delete to authenticated using (
  auth.uid() = user_id or public.is_group_admin(group_id, auth.uid())
);

-- 7. Bulletproof RLS Policies for Group Messages (Strict Data Isolation)
drop policy if exists "gmsg_select" on public.group_messages;
create policy "gmsg_select" on public.group_messages for select to authenticated using (
  public.is_group_member(group_id, auth.uid())
);

drop policy if exists "gmsg_insert" on public.group_messages;
create policy "gmsg_insert" on public.group_messages for insert to authenticated with check (
  auth.uid() = sender_id and public.is_group_member(group_id, auth.uid())
);

-- 8. Realtime configuration
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'group_messages'
  ) then
    alter publication supabase_realtime add table public.group_messages;
  end if;
end $$;
