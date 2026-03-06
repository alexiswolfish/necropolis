-- Run this once on existing projects.
-- Allows duplicate real names when birth_date differs.

alter table public.characters
  drop constraint if exists characters_real_name_normalized_key;

drop index if exists public.characters_real_name_normalized_key;

create unique index if not exists characters_real_name_birth_date_unique_idx
  on public.characters (real_name_normalized, birth_date);
