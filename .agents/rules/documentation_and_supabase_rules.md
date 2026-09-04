# Documentation & Supabase Best Practices Rule

## 1. Continuous Documentation Updates
- **Always Keep Docs in Sync**: Whenever code, database schema, authentication flow, UI routes, or integrations change, immediately update relevant documentation files (e.g., `CLIENT_MANAGEMENT_DOCS.md`, `README.md`).
- **Log Architecture Decisions**: Detail any new API patterns, RLS security policies, storage bucket configurations, and mock/offline fallback mechanics in the documentation.

## 2. Supabase Best Practices & Security Standards
Before writing or modifying any Supabase queries, TypeScript clients, or SQL schemas, strictly enforce these guidelines:

### Row Level Security (RLS) & Performance
- **Subquery Wrapping**: Always wrap `auth.uid()` as `(SELECT auth.uid())` and `auth.jwt()` as `(SELECT auth.jwt() ->> 'email')` in RLS policies. This prevents PostgreSQL from re-evaluating the authentication function for each scanned row, significantly improving query performance.
- **Explicit Role Targeting**: Always specify the exact role target (`TO authenticated`, `TO anon`) for every policy.
- **Security Definer Functions**: When performing elevated checks (e.g. `public.is_admin()`), use `SECURITY DEFINER` functions with search paths set and verify both user emails and profile roles.
- **B-Tree Indexing**: Create explicit indexes on all foreign keys (`client_id`, `project_id`), lookup columns (`client_email`), and sorted timestamp columns (`created_at DESC`).

### Client-Side Integration & Resilience
- **Modern Key Handling**: Support modern opaque Supabase keys (`sb_publishable_...`) by adapting fetch headers to strip invalid `Authorization: Bearer` headers while transmitting the `apikey` header.
- **Session Lifecycle**: Configure `autoRefreshToken: true`, `persistSession: true`, and `detectSessionInUrl: true` with active `onAuthStateChange` listeners.
- **Resilient Fallback Mode**: Web client portals and package selectors must never crash or throw unhandled exceptions if the database is unconfigured or offline—provide graceful typed defaults / mock demonstration states.
- **Static vs. Dynamic Decoupling**: Keep public marketing & static portfolio content decoupled from dynamic client management / CRM tables.
