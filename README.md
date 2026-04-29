# LooksLens

LooksLens is an AI-powered visual presence analysis app that helps you understand and improve how the world sees you.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- Supabase (auth, database, storage, edge functions)

## Local Development

```sh
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs on [http://localhost:8080](http://localhost:8080) by default.

## Project Structure

- `src/pages` — top-level routes (Landing, Auth, Capture, Insights, Improve, Progress, Profile)
- `src/components` — shared UI components
- `src/contexts` — React contexts (Auth)
- `src/hooks` — reusable hooks (scans, profile)
- `supabase/functions` — backend edge functions, including the photo analysis pipeline
- `supabase/migrations` — database schema migrations

## Deployment

Build for production:

```sh
npm run build
```

The output in `dist/` can be deployed to any static host. Backend edge functions and database live on Supabase.
