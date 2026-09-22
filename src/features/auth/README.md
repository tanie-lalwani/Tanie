# Feature: Authentication & User Accounts (`src/features/auth`)

## Overview
A plug-and-play Supabase authentication module supporting email/password sign-up, sign-in, password reset, session persistence, and server-side request verification.

## Capabilities
- Client-side reactive authentication state (`useAuth`)
- Token decoding and server-side API auth helper (`requireAuth`)
- Graceful offline fallback / demo reviewer mock login
- Transparent Supabase fetch proxy with opaque key handling

## Boilerplate Usage in Future Projects
To copy this feature into another project:
1. Copy the entire `src/features/auth/` folder.
2. Install `@supabase/supabase-js`.
3. Set your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Import into your components:
   ```tsx
   import { useAuth } from "@/features/auth";

   export function LoginCard() {
     const { signInWithPassword, user, isAuthenticated } = useAuth();
     // ...
   }
   ```
