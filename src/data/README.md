Supabase data layer notes

- `supabaseRest.js` is a tiny PostgREST client using `fetch`.
- `charactersApi.js` maps DB rows to app objects.
- Configure with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- SQL schema/policies live in `supabase/schema.sql`.
