# Iron Ledger — six-day workout tracker

A single-file workout tracker for a six-day push/pull/legs cut phase.

- **`workout-tracker.html`** — the whole app: the program, the logger, the charts.
  Published as a Claude Artifact; it uses the `db` runtime capability to persist
  sessions to the signed-in account, and falls back to `localStorage` when that
  capability is unavailable.

## What it does

- **Train** — pick a day from the rail, fill in weight × reps per set, tick sets
  off, add or remove sets and lifts on the fly, log the session. The pencil on
  each lift renames it and attaches a note ("wide grip", "seat 4"); saving to the
  plan keeps past logs linked to the old name via an `aka` list.
- **Progress** — estimated 1RM curve per lift (Epley), weekly tonnage, and a full
  session history you can expand or delete.
- **Body** — goal tracker with a pace line on the bodyweight chart, plus a body
  scan log (weight, body fat, fat/lean mass, skeletal muscle, visceral, waist,
  BMR, TEE) that turns into a trend from the second scan on.
- **Program** — rename days, edit sets/reps/cues, add or delete lifts, add or
  delete whole training days, or restore the default split.

## The default split

| Day | Session | Focus |
|-----|---------|-------|
| 1 | Push — Heavy | 5-8 reps, 3 min rests |
| 2 | Pull — Heavy | 5-8 reps + trap-bar deadlift |
| 3 | Legs — Heavy | 5-8 reps |
| 4 | Push — Volume | 10-15 reps, 90 sec rests |
| 5 | Pull — Volume | 10-15 reps + hamstrings |
| 6 | Legs & Core — Volume | 10-15 reps + intervals |
| 7 | Rest | walk, stretch, weigh in |

Cut targets on the Program tab come from a 09-07-2026 Evolt 360 scan: measured
TEE 2,735 kcal, 2,000 kcal intake, 185 g protein, ~1.7 lb/week toward a 165 lb
target on 12-25-2026. The scan also flagged upper/lower imbalance (arms and torso
above range, legs mid-range), which is why days 2 and 5 carry extra lower-body
work. General fitness information, not medical advice.

## Storage

| Path | Contents |
|------|----------|
| `state/program` | the current plan (days, lifts, sets, rep ranges, cues) |
| `sessions/<id>` | one document per logged session |
| `state/bodyweight` | `{ entries: [{ d, lbs }] }` |
| `state/scans` | `{ entries: [{ d, weight, bf, fat, lean, smm, visc, waist, bmr, tee }] }` |
| `state/goal` | `{ startD, startLb, targetLb, targetD }` |
