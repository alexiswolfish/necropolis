alter table public.characters
add column if not exists character_name text;

alter table public.characters
add column if not exists character_bio text;
