# DealDost

DealDost is a community-first local discovery app for:
- online deals (e-commerce + quick commerce)
- food spot recommendations by dish
- neighbourhood board updates (events, lost & found, services)

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Firebase Auth + Storage
- MongoDB Atlas (Mongoose)
- Neon PostgreSQL (Drizzle/PostGIS-ready)

## Run Locally
1. Install dependencies
```bash
npm install
```
2. Configure `.env.local` (see required keys below)
3. Start dev server
```bash
npm run dev
```

## Verify
```bash
npm run lint
npm run build
```

## Core Routes
### Pages
- `/` home
- `/deals`
- `/deals/platform/[platform]`
- `/food`
- `/food/dish/[dish]`
- `/food/map`
- `/neighbourhood`
- `/neighbourhood/events`
- `/neighbourhood/lost-found`
- `/neighbourhood/services`
- `/trending`
- `/search`
- `/profile/[username]`

### API
- `/api/auth/register`
- `/api/auth/sync`
- `/api/auth/me`
- `/api/posts`
- `/api/posts/:id`
- `/api/posts/:id/upvote`
- `/api/posts/:id/save`
- `/api/posts/:id/verify`
- `/api/posts/:id/comments`
- `/api/comments/:id`
- `/api/search`
- `/api/search/nearby`
- `/api/food`
- `/api/food/dish/:dishName`
- `/api/food/nearby`
- `/api/food/:id/review`
- `/api/deals/trending`
- `/api/deals/expiring`
- `/api/deals/platform/:name`
- `/api/leaderboard`
- `/api/upload`

## Environment Variables
- `MONGODB_URI`
- `DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_GEOAPIFY_API_KEY` (current map component)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (if switching map provider)
- `SEED_SECRET`

## Database Notes
- MongoDB models include `Deal`, `FoodSpot`, `Event`, `User`, `Post`, `Comment`, `Notification`.
- Neon SQL starter schema: `docs/sql/neon_schema.sql`.
