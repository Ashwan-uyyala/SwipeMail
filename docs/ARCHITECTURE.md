# Architecture

The frontend is organized around route-level pages, reusable components, hooks, service modules, shared types, and configuration providers. Supabase Auth handles Google sign-in and supplies a Gmail read-only provider token to the inbox hook, which uses the Gmail service to load real messages into the deck. Future Gmail mutations, synchronization, and AI operations should use backend service boundaries.
