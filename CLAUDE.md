# Team Selector — Claude Reference

## What This Is

A mobile-friendly React app for fairly assigning teams in table football (and other games). Players are managed persistently, a spin wheel provides visual flair, and the algorithm tracks sit-out history to give priority to players who sat out recently.

## Tech Stack

- **React 19** with Vite 7
- **Plain CSS** (no CSS framework)
- **localStorage** for persistence (no backend)
- Deployed to **GitHub Pages** at `https://matviyiv.github.io/game/`

## Dev Commands

```bash
npm run dev      # local dev server (http://localhost:5173/game/)
npm run build    # production build → dist/
npm run preview  # serve the dist/ build locally (http://localhost:4173/game/)
npm run lint     # ESLint
```

## Project Structure

```
src/
  components/
    PlayerManager.jsx   # add / remove / toggle players
    SpinWheel.jsx       # canvas spin animation (visual only)
    TeamsDisplay.jsx    # shows resulting teams + sit-outs
    History.jsx         # past game log
  utils/
    teamBuilder.js      # weighted shuffle + team assignment logic
    storage.js          # localStorage helpers
  App.jsx               # tab layout, state, orchestration
```

## Key Architecture Notes

### Team Assignment (`teamBuilder.js`)

`assignTeams(activePlayers, history)` is the core function:

1. `buildWeightedPool` walks history **backwards** to count each player's consecutive sit-out streak. A `frozen` Set prevents older history entries from overwriting counts already accumulated from more recent runs.
2. `weightedShuffle` picks players in a weighted random order (higher sit-out streak = higher weight = more likely to play).
3. Players at the end of the shuffled list sit out.

The spin wheel does **not** influence who gets assigned to which team — it is purely visual. `onSpinComplete` triggers `assignTeams` regardless of where the wheel stops.

### GitHub Pages Base Path

`vite.config.js` sets `base: '/game/'` (the repo name). This is required because the site is served from a subdirectory, not the root. Without it, asset URLs resolve to the wrong path and the app loads as a blank white page.

## CI / Deployment

| Workflow | Trigger | Steps |
|---|---|---|
| `ci.yml` | Push to any non-main branch, PRs to main | lint → build |
| `deploy.yml` | Push to `main` / `master`, manual dispatch | lint → build → deploy to GitHub Pages |

### GitHub Pages Setup (one-time)

In the repo → **Settings → Pages → Source**, select **"GitHub Actions"** (not a branch). The `deploy.yml` workflow handles everything else.

### Deployment Checklist

- [ ] `base: '/game/'` in `vite.config.js` matches the repo name
- [ ] GitHub Pages source set to **GitHub Actions**
- [ ] Push to `main` — the deploy workflow runs automatically
