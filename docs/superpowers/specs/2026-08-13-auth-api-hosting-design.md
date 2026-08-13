# Auth, Anime API, and Hosting Decisions

## Context

The `a7c6859` commit removed Mongo-backed login/register and all related routes, leaving the app fetching anime data client-side from the Jikan API and running `server.js` purely to serve the built React frontend. This spec records three follow-on decisions: what to do with the old Mongo DB, what to replace Jikan with, and where to host given a free-tier, low-traffic goal.

## 1. Auth / Mongo DB

The old MongoDB instance is most likely inactive and inaccessible; no code in the repo references it anymore (confirmed by search). Decision: treat it as already decommissioned — no migration work needed, just confirm no stray env vars point at it when configuring the new host.

Auth is still planned, but deferred and scope (which features require login) is not yet decided. When it's built, use a hosted auth service rather than rolling custom password/JWT handling. Recommended: **Supabase Auth** — free tier, and if favorites/profile features return, its bundled Postgres avoids running a second free-tier service just for data storage. (Not committing to Supabase for data storage now — just noting it as the reason it beats an auth-only service like Clerk for this app's likely future needs.)

## 2. Anime Data API

Replace Jikan (unofficial MAL scraper, prone to downtime) with **AniList's GraphQL API** — first-party, free, no API key, ~90 req/min rate limit (ample for low traffic).

Work required: rewrite `frontend/src/utils/fetchJikan.js` to issue GraphQL queries against AniList instead of REST calls to Jikan, and update any component consuming its response shape. Note for later: AniList's anime IDs differ from MAL's, so if favorites/watch-list data is stored down the line, it should key off AniList IDs consistently.

## 3. Hosting

Deploy to **Vercel** (free hobby tier, no card required, no inactivity sleep).

Since `server.js` currently has no real backend logic (just static serving + unused CORS headers), adapt it to Vercel's serverless model:
- Export the Express `app` instead of calling `app.listen()`.
- Let Vercel serve `frontend/build` as static assets directly rather than routing static files through the Express handler.
- Keep the Express handler in place (rather than dropping the server entirely) so future backend logic — e.g. auth callbacks — has somewhere to live.

## Out of scope

- Actually building the Supabase Auth integration and deciding which features it gates (favorites/profile) — future work, not part of this change.
- Data storage for favorites/watch-lists — no decision made yet; will follow once auth scope is decided.
