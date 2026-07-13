# Supabase — Live Competition

SQL scripts for the whitelabel live competition leaderboard.

## Tables

| Table                | Purpose                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `active_competition` | Singleton config row (`id` must be `1`). Holds title, copy, theme, `order_by`, and `active_in_test` / `active_in_production` flags. |
| `competition_entry`  | Leaderboard rows (`name`, `score`, `category`) linked to the active competition.                                                    |

The app should query `active_competition` where the environment flag matches the build (`active_in_test` for dev/preview, `active_in_production` for store builds), then load entries for `competition_id = 1`.

## App configuration

The mobile app loads live competition data from:

`GET https://www.temperedstrength.com/api/live-competition?environment=test|production`

Choose which environment to request in `src/hooks/useLiveCompetition.ts`:

```typescript
const COMPETITION_FETCH_ENVIRONMENT = 'test'; // or 'production'
```

The app keeps a shared in-memory cache for 60 seconds so the home banner does not flash on every visit. Manual refresh on the competition page always bypasses the cache.

## Setup

1. Open your Supabase project → **SQL Editor**.
2. Run `migrations/20260710120000_create_live_competition_tables.sql`.
3. Run `seed/live_competition_seed.sql`.

Seed enables the competition in **test** only (`active_in_test = true`). When ready for the live app, run:

```sql
update public.active_competition
set
  active_in_production = true,
  active_in_test = false
where id = 1;
```

## Useful queries

**Check current config:**

```sql
select * from public.active_competition;
```

**Leaderboard for a category:**

```sql
select name, score, category
from public.competition_entry
where competition_id = 1
  and category = 'Male'
order by score desc;
```

**Add an entry during an event:**

```sql
insert into public.competition_entry (competition_id, name, score, category)
values (1, 'New Athlete', 115, 'Male');
```
