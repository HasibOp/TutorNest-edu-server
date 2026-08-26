# TutorNest-edu Server

The TutorNest-edu Backend API is the server-side foundation of a modern 1-on-1 learning platform that helps students find and connect with expert tutors. It handles everything behind the scenes, from user authentication and tutor profiles to tutor discovery, availability, bookings, and reviews. The API also manages secure role-based access, ensuring that students, tutors, and admins can only perform actions relevant to their roles. Overall, it provides a reliable and organized backend that keeps the TutorNest-edu platform running smoothly.

### Live site: 
https://tutor-nest-edu-server.vercel.app

## Tech stack

- Node.js + Express 5
- MongoDB (native driver)
- Firebase Authentication (verified client-side) + JWT for API authorization
- Google Gemini (`@google/genai`) for the AI assistant chat endpoint

## Features

- **Auth & roles** — Email/password and Google sign-in on the client; this server issues short-lived JWTs and enforces `student` / `tutor` / `admin` roles per route. New Google sign-ins pick their role once via a self-service endpoint.
- **Users** — Profile self-service (name/photo), admin user listing, ban/unban, and platform stats.
- **Categories** — Subjects tutors can teach; public read, admin-managed CRUD.
- **Tutor profiles** — Bio, hourly rate, subjects, and weekly availability; public listing (filterable by category) enriched with the tutor's name/photo and live rating.
- **Bookings** — Students book an open slot on a tutor's weekly availability against a specific calendar date; conflict-checked so a slot can't be double-booked. Tutors mark sessions complete; either side can cancel. Admins can view all bookings.
- **Reviews** — Students rate (supports half-star increments) and review a session once it's marked complete; ratings aggregate into each tutor's public average.
- **Banned-user enforcement** — A banned account is rejected at the auth middleware, blocking every protected route in one place.
- **AI assistant chat** — A lightweight Gemini-backed endpoint for answering questions about the platform.

## Getting started

```bash
npm install
```

Create a `.env` file:

```
DB_USER=<mongodb atlas username>
DB_PASS=<mongodb atlas password>
ACCESS_TOKEN_SECRET=<a long random string, used to sign JWTs>
GEMINI_API_KEY=<google gemini api key>
```

Run it:

```bash
npm run dev     # nodemon, restarts on file change
```

The server starts on `PORT` (defaults to `5000`) and logs once it has connected to MongoDB.

## Project structure

```
src/
  index.js            entrypoint — loads env, connects to Mongo, starts the server
  app.js              express app, middleware, and route mounting
  routes/             one file per resource, thin — just method + path + middleware
  controllers/        request/response handling, input validation
  services/           MongoDB queries and business logic
  middlewares/
    verifyToken.js    checks the JWT, rejects banned accounts
    verifyAdmin.js     requires role: 'admin'
    verifyTutor.js     requires role: 'tutor'
config/
  db.js               MongoDB client, connection, and ObjectId helpers
```

## API overview

All protected routes expect `Authorization: Bearer <jwt>`, obtained from `POST /jwt` after a client-side Firebase sign-in.

| Area | Routes |
|---|---|
| Auth | `POST /jwt` |
| Users | `GET /users` (admin) · `POST /users` · `PATCH /users/me` · `PATCH /users/role` · `PATCH /users/:id/status` (admin) · `GET /users/admin/:email` · `GET /users/stats` (admin) |
| Categories | `GET /categories` · `POST /categories` (admin) · `PATCH /categories/:id` (admin) · `DELETE /categories/:id` (admin) |
| Tutor profiles | `GET /tutor-profiles` · `GET /tutor-profiles/:id` · `GET /tutor-profiles/me` (tutor) · `PUT /tutor-profiles/me` (tutor) |
| Bookings | `POST /bookings` · `GET /bookings` (mine) · `GET /bookings/admin` (admin) · `PATCH /bookings/:id/status` |
| Reviews | `POST /reviews` · `GET /reviews/tutor/:email` |
| Chat | `POST /chat` |

## Notes

- CORS is currently open (`cors()` with no allowlist) — the deployed client works from any origin without extra config.
- MongoDB access uses the native driver directly (no ODM); each `services/*Services.js` file owns one collection.
