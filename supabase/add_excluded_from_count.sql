-- Run this in Supabase SQL Editor.
-- Adds a flag to exclude a player from the official team count (7-player cap),
-- without removing them from the roster.

ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS excluded_from_count boolean NOT NULL DEFAULT false;
