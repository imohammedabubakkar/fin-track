# FinTrack backend setup

The React app remains in `frontend/`. The standalone Express API and Mongoose models are in `backend/`.

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` (or `MONGODB_URI`) to your Atlas connection string or local MongoDB URI. Keep `.env` private; it is ignored by Git. The server accepts `PORT`/`API_PORT` and `CORS_ORIGIN`/`CLIENT_ORIGIN` as well.
2. Install backend dependencies with `npm --prefix backend install`.
3. Start the API with `pnpm dev:backend` and the frontend with `pnpm dev` in separate terminals. The API uses `PORT` (default 3001) and Vite uses port 8443.
4. Check `http://localhost:3001/api/health` or the database status in the dashboard header.

The API exposes health, transaction CRUD, transaction search/filter/pagination, transaction summaries, and basic user listing/creation routes. `GET /api/transactions` accepts `page`, `limit` (maximum 100), `status`, `risk`, `type`, `search`, `from`, and `to` query parameters and returns `{ data, pagination }`. `GET /api/transactions/summary` returns count and amount totals grouped by status and risk. The current dashboard's account, transaction, and settings data still comes from browser `localStorage`; the health indicator is the only frontend request wired to the API so far. The app's demo login is not server authentication, so do not expose these data routes publicly or use them for real customer data until authentication and authorization are added. Set `VITE_API_URL` if the API is hosted at another origin.
