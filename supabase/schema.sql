-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  real_name text not null,
  character_name text,
  rsvp_matched boolean not null default true,
  real_name_normalized text not null,
  birth_date date not null,
  zodiac_sign text not null,
  concord_id text not null,
  class_name text,
  stats jsonb not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists characters_concord_id_idx on public.characters (concord_id);
create index if not exists characters_completed_at_idx on public.characters (completed_at);
create unique index if not exists characters_real_name_birth_date_unique_idx on public.characters (real_name_normalized, birth_date);

alter table public.characters
  drop constraint if exists characters_class_name_valid;

alter table public.characters
  add constraint characters_class_name_valid
  check (
    class_name is null or class_name in (
      'bard',
      'fighter',
      'ranger',
      'druid',
      'rogue',
      'wizard',
      'peasant',
      'npc'
    )
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists characters_set_updated_at on public.characters;
create trigger characters_set_updated_at
before update on public.characters
for each row execute procedure public.set_updated_at();

create table if not exists public.character_audit_log (
  id uuid primary key default gen_random_uuid(),
  character_id uuid,
  operation text not null,
  changed_at timestamptz not null default now(),
  old_row jsonb,
  new_row jsonb
);

create index if not exists character_audit_log_character_id_idx on public.character_audit_log (character_id, changed_at desc);

create or replace function public.audit_character_changes()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    insert into public.character_audit_log (character_id, operation, old_row, new_row)
    values (old.id, tg_op, to_jsonb(old), null);
    return old;
  end if;

  insert into public.character_audit_log (character_id, operation, old_row, new_row)
  values (new.id, tg_op, case when tg_op = 'UPDATE' then to_jsonb(old) else null end, to_jsonb(new));

  return new;
end;
$$;

drop trigger if exists characters_audit_log on public.characters;
create trigger characters_audit_log
after insert or update or delete on public.characters
for each row execute procedure public.audit_character_changes();

create or replace function public.update_character_profile(
  p_id uuid,
  p_character_name text default null,
  p_character_bio text default null
)
returns setof public.characters
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.characters
  set
    character_name = nullif(btrim(p_character_name), ''),
    character_bio = nullif(btrim(p_character_bio), '')
  where id = p_id
  returning *;
end;
$$;

alter table public.characters enable row level security;
alter table public.character_audit_log enable row level security;

-- Lightweight project policy: public read/write with anon key.
drop policy if exists "characters_select_anon" on public.characters;
create policy "characters_select_anon"
on public.characters
for select
to anon
using (true);

drop policy if exists "characters_insert_anon" on public.characters;
create policy "characters_insert_anon"
on public.characters
for insert
to anon
with check (true);

drop policy if exists "characters_update_anon" on public.characters;
drop policy if exists "characters_delete_anon" on public.characters;

revoke all on public.character_audit_log from anon;
grant execute on function public.update_character_profile(uuid, text, text) to anon;
