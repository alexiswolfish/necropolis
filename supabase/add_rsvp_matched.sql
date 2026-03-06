alter table public.characters
add column if not exists rsvp_matched boolean not null default true;
