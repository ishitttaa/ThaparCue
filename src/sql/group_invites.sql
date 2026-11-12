-- ===== Group invites: admin sends request, student accepts/declines =====

create table if not exists public.group_invites (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.groups(id) on delete cascade,
  invited_user uuid not null references public.profiles(id) on delete cascade,
  invited_by   uuid not null references public.profiles(id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at   timestamptz default now(),
  responded_at timestamptz,
  constraint no_self_invite check (invited_user <> invited_by)
);

-- ek group mein ek user ka sirf ek pending invite
create unique index if not exists one_pending_group_invite
  on public.group_invites (group_id, invited_user) where status = 'pending';

alter table public.group_invites enable row level security;
revoke all on public.group_invites from anon, authenticated;
grant select, insert on public.group_invites to authenticated;

drop policy if exists "gi_select" on public.group_invites;
create policy "gi_select" on public.group_invites for select to authenticated using (
  invited_user = auth.uid()
  or invited_by = auth.uid()
  or public.is_group_admin(group_id, auth.uid())
);

-- sirf group admin invite bhej sakta hai, aur jo pehle se member hai usay nahi
drop policy if exists "gi_insert" on public.group_invites;
create policy "gi_insert" on public.group_invites for insert to authenticated with check (
  invited_by = auth.uid()
  and public.is_group_admin(group_id, auth.uid())
  and not exists (
    select 1 from public.group_members gm
    where gm.group_id = public.group_invites.group_id
      and gm.user_id = public.group_invites.invited_user
  )
);

-- Accept/Decline sirf is function se
create or replace function public.respond_group_invite(p_invite_id uuid, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_inv public.group_invites%rowtype;
  v_max int;
  v_count int;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select * into v_inv from public.group_invites where id = p_invite_id for update;
  if not found or v_inv.invited_user <> v_uid then
    raise exception 'Invite not found' using errcode = '42501';
  end if;
  if v_inv.status <> 'pending' then
    raise exception 'Invite already answered' using errcode = '55000';
  end if;

  if p_accept then
    select max_members into v_max from public.groups where id = v_inv.group_id;
    select count(*) into v_count from public.group_members where group_id = v_inv.group_id;
    if v_count >= v_max then
      raise exception 'Group is full' using errcode = 'P0001';
    end if;
    insert into public.group_members (group_id, user_id, role)
    values (v_inv.group_id, v_uid, 'member')
    on conflict (group_id, user_id) do nothing;
  end if;

  update public.group_invites
  set status = case when p_accept then 'accepted' else 'declined' end,
      responded_at = now()
  where id = p_invite_id;
end $$;

revoke execute on function public.respond_group_invite(uuid, boolean) from public, anon;
grant execute on function public.respond_group_invite(uuid, boolean) to authenticated;

-- Direct add band: ab admin kisi aur ko group_members mein insert nahi kar sakta.
-- Student sirf apni hi row add kar sakta hai (Join).
drop policy if exists "gm_insert" on public.group_members;
create policy "gm_insert" on public.group_members for insert to authenticated with check (
  auth.uid() = user_id
);