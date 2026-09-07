# Iron Ledger — six-day workout tracker

A single-file workout tracker for a six-day push/pull/legs cut phase.

- **`workout-tracker.html`** — the whole app: the program, the logger, the charts.
  Published as a Claude Artifact; it uses the `db` runtime capability to persist
  sessions to the signed-in account, and falls back to `localStorage` when that
  capability is unavailable.

## What it does

- **Train** — pick a day from the rail, fill in weight × reps per set, tick sets
  off, add or remove sets and lifts on the fly, log the session.
- **Progress** — estimated 1RM curve per lift (Epley), weekly tonnage, bodyweight
  trend, and a full session history you can expand or delete.
- **Program** — rename days, edit sets/reps/cues, add or delete lifts, add or
  delete whole training days, or restore the default split.

## The default split

| Day | Session | Focus |
|-----|---------|-------|
| 1 | Push — Heavy | 5-8 reps, 3 min rests |
| 2 | Pull — Heavy | 5-8 reps |
| 3 | Legs — Heavy | 5-8 reps |
| 4 | Push — Volume | 10-15 reps, 90 sec rests |
| 5 | Pull — Volume | 10-15 reps |
| 6 | Legs & Core — Volume | 10-15 reps + intervals |
| 7 | Rest | walk, stretch, weigh in |

Cut targets baked into the Program tab are calculated for a 23-year-old male,
5'10", 190 lb: ~2,890 kcal maintenance, 2,350 kcal intake, 190 g protein,
~1 lb/week loss. General fitness information, not medical advice.

## Storage

| Path | Contents |
|------|----------|
| `state/program` | the current plan (days, lifts, sets, rep ranges, cues) |
| `sessions/<id>` | one document per logged session |
| `state/bodyweight` | `{ entries: [{ d, lbs }] }` |
