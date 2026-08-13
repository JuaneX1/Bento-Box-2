# Vercel Hosting Adaptation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make this repo deployable on Vercel: the React frontend serves as a static build, and `server.js`'s Express app becomes importable as a Vercel serverless function without breaking local `npm start`.

**Architecture:** `server.js` currently both defines the Express app and calls `app.listen()` unconditionally — that only works as a long-lived process, which Vercel doesn't run. `server.js` is changed to export the `app` object and only call `app.listen()` when run directly (`node server.js`), preserving today's local dev/`npm start` behavior unchanged. A new `api/index.js` re-exports that app — Vercel's zero-config convention treats any file under `api/` as a serverless function automatically, so this is the only file Vercel needs to detect the backend, no legacy `builds`/`routes` config required. A root `vercel.json` tells Vercel to build the frontend with `npm run build --prefix frontend`, serve `frontend/build` as static output, and rewrite unmatched (non-`/api`) paths to `index.html` so React Router's client-side routes work on direct navigation/refresh — this replaces the catch-all `app.get('*', ...)` that `server.js` used for the same purpose when Express served static files directly (Heroku-era single-process pattern).

**Tech Stack:** Express 4 (already a dependency), Vercel's zero-config Node runtime (provided by the platform, not an npm package), CRA (`react-scripts build`, already the frontend's build command).

## Global Constraints

- No new npm dependencies — Vercel's Node runtime for `api/` functions and its static builder are platform-provided, not packages to install.
- `npm start` (`node server.js`) must keep working exactly as it does today, for local development — this plan must not require Vercel to run or test locally.
- Vercel serves `frontend/build` as static assets directly; the Express app is not used to serve static files or the SPA fallback in the Vercel deployment (the design doc's stated architecture) — `server.js`'s existing `NODE_ENV === 'production'` static-serving block stays as-is for local production testing but is not what Vercel will use.
- This plan only covers the code/config side. Connecting the Vercel account, importing the repo, and promoting a deployment to production are manual dashboard/CLI steps for the human, out of scope for any task here.

---

### Task 1: Make `server.js` importable without starting a listener

**Files:**
- Modify: `server.js`

**Interfaces:**
- Produces: `server.js`'s `module.exports` is the Express `app` instance (has `.handle`, `.use`, `.listen`, etc. — the standard Express app interface). Importing the module no longer has the side effect of binding a port; only running it directly (`node server.js`) does.

- [ ] **Step 1: Guard `app.listen()` and export the app**

In `server.js`, replace the final block:
```javascript
app.listen(PORT, () =>
{
    console.log('Server listening on port ' + PORT);
});
```
with:
```javascript
if (require.main === module) {
    app.listen(PORT, () =>
    {
        console.log('Server listening on port ' + PORT);
    });
}

module.exports = app;
```
(`require.main === module` is true only when this file is the one Node was launched with — e.g. `node server.js` — and false when another file `require()`s it, which is how Task 2's `api/index.js` will use it.)

- [ ] **Step 2: Verify importing the module does not start a server**

Run: `node -e "const app = require('./server.js'); console.log('exported type:', typeof app, 'has listen:', typeof app.listen);"`
Expected output: `exported type: function has listen: function` (an Express app is a function with methods attached), and the process exits immediately on its own — if it hangs, `app.listen()` fired when it shouldn't have.

- [ ] **Step 3: Verify running it directly still starts the server (no regression)**

Run: `node server.js &` then `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/` (default `PORT`, no `.env` override)
Expected: prints a status code (any response, even a 404 from the catch-all's absence outside production mode, confirms the server is listening and reachable) — the point is the port is bound, not the specific response.
Then stop it: find and kill the process you started (e.g. `kill %1` if run with `&` in the same shell, or `pkill -f "node server.js"` if that's unambiguous in this environment).

- [ ] **Step 4: Commit**

```bash
git add server.js
git commit -m "feat: export Express app from server.js, guard app.listen for direct execution only"
```

---

### Task 2: Add the Vercel entrypoint and config, update README

**Files:**
- Create: `api/index.js`
- Create: `vercel.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: `server.js`'s exported `app` (Task 1).

- [ ] **Step 1: Create the Vercel serverless entrypoint**

Create `api/index.js`:
```javascript
module.exports = require('../server.js');
```
(Vercel's zero-config convention auto-detects any file under `api/` as a serverless function. This file has no logic of its own — it exists only so Vercel finds the already-exported Express app at a path Vercel recognizes, without moving `server.js` itself or duplicating its contents.)

- [ ] **Step 2: Create the Vercel project config**

Create `vercel.json` at the repo root:
```json
{
    "buildCommand": "npm run build --prefix frontend",
    "outputDirectory": "frontend/build",
    "rewrites": [
        { "source": "/((?!api/).*)", "destination": "/index.html" }
    ]
}
```
(`buildCommand`/`outputDirectory` tell Vercel how to produce the static site — matching what `heroku-postbuild` in the root `package.json` already does. The `rewrites` entry sends any request that isn't under `/api/` and isn't a matched static file to `index.html`, so React Router's client-side routes — e.g. loading `/anime/123` directly — resolve correctly; Vercel serves real static files like `/static/js/main.js` before falling through to this rewrite, so it does not intercept asset requests.)

- [ ] **Step 3: Validate the JSON is well-formed**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json', 'utf8')); console.log('valid JSON');"`
Expected: `valid JSON`

- [ ] **Step 4: Update README's Deploying section**

In `README.md`, replace:
```markdown
## Deploying

The app is a single Node process: `npm run heroku-postbuild` builds the React frontend, and `npm start` serves it via Express alongside the (now DB-free) backend. It no longer needs a database, so any Node-friendly host with a free tier (e.g. Render) works — just point the frontend's `REACT_APP_BACKEND_URL` / `frontend/src/components/Path.js` at wherever the backend ends up deployed.
```
with:
```markdown
## Deploying

The app deploys to Vercel. `vercel.json` at the repo root tells Vercel to build the frontend (`npm run build --prefix frontend`) and serve `frontend/build` as a static site; `api/index.js` exposes the Express app in `server.js` as a Vercel serverless function for any backend logic added later (there are no API routes today — anime data is fetched client-side from the AniList GraphQL API).

To deploy: import this repo into a Vercel project (Vercel auto-detects `vercel.json`), then push to the connected branch to trigger a build. No environment variables or database are required.
```
(Also fixes two things that were already stale before this change: the README said anime data comes from "the public Jikan API" — the app was switched to AniList's GraphQL API in an earlier change on this branch — and it referenced `frontend/src/components/Path.js` / `REACT_APP_BACKEND_URL`, neither of which exist anywhere in the codebase anymore.)

- [ ] **Step 5: Commit**

```bash
git add api/index.js vercel.json README.md
git commit -m "feat: add Vercel deployment config and serverless entrypoint"
```
