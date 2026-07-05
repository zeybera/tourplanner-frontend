# Tour Planner - Frontend

This is the frontend for the Tour Planner project. It is built with Angular 20, using standalone components and Signals instead of NgModules or a separate state management library.

The frontend talks to a Spring Boot backend over a REST API. It needs the backend to be running to work correctly, since it has no local mock data anymore.

---

## What this app can do

- Register and log in with a username and password (JWT-based authentication)
- Create, edit, delete, and search tours
- Get live address suggestions while typing a location (geocoding)
- See the real route drawn on a map, with distance and estimated time calculated automatically
- Add, edit, and delete tour logs, including an optional photo
- Export tours as JSON or XML, and import them again

---

## How to run the project

### Step 1 - Install dependencies

```bash
npm install
```

### Step 2 - Start the backend first

This frontend needs the backend to be running at `http://localhost:8080`. See the backend's own README for setup steps.

### Step 3 - Start the frontend

```bash
npm start
```

The app runs at `http://localhost:4200`.

### Demo login

If the backend was started with its demo data, you can log in directly with:

| Username    | Password |
|-------------|---|
| `testuser1` | `password123` |
| `testuser2` | `password123` |

---

## Configuration

The backend URL is set in the environment files, not hardcoded everywhere:

- `src/environments/environment.ts` (production)
- `src/environments/environment.development.ts` (local development)

Both currently point to `http://localhost:8080`.

---

## Project structure

```
src/app/
  features/
    auth/login       -> login and register page
    tour/            -> create, edit, list, and view tours
    tour-log/        -> create, edit, and list tour logs
    map/tour-map     -> shows the route on a Leaflet map
    route/           -> address search and route calculation
  shared/
    api.ts                -> backend base URL
    auth.service.ts       -> stores the login token
    auth.guard.ts         -> blocks pages if the user is not logged in
    auth.interceptor.ts   -> adds the login token to every request
    navbar, card, confirm-dialog -> reusable UI parts
```

---

## Running tests

```bash
npm test
```
