-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  real_name text not null,
  character_name text,
  real_name_normalized text not null,
  birth_date date not null,
  zodiac_sign text not null,
  concord_id text not null,
  class_name text not null,
  stats jsonb not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists characters_concord_id_idx on public.characters (concord_id);
create index if not exists characters_completed_at_idx on public.characters (completed_at);
create unique index if not exists characters_real_name_birth_date_unique_idx on public.characters (real_name_normalized, birth_date);

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

alter table public.characters enable row level security;

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
create policy "characters_update_anon"
on public.characters
for update
to anon
using (true)
with check (true);

drop policy if exists "characters_delete_anon" on public.characters;
create policy "characters_delete_anon"
on public.characters
for delete
to anon
using (true);
