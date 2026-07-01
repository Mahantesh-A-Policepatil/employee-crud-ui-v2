# Employee CRUD UI v2

Refactored React frontend for the Laravel employee management API. This project keeps the same features as the original app, with improved structure and conventions.

## Improvements over v1

- **AuthContext** — shared auth state instead of reading `localStorage` in every component
- **ProtectedRoute** — clear route guard (replaces misnamed `App.js`)
- **AppLayout** — shared shell for sidebar, header, footer, and loading overlay
- **Centralized routes** — `src/config/routes.js` drives router, sidebar, and permission fallbacks
- **Environment-based API URL** — `REACT_APP_API_URL` in `.env.development`
- **Consistent API client** — all requests go through `apiClient`, including register
- **React Router links** — sidebar uses `NavLink` (no full page reloads)
- **PascalCase components** — e.g. `ListEmployee.js` instead of `list-employee.js`
- **Extracted CRUD utilities** — validation helpers in `crudUtils.js` with tests
- **No legacy dead code** — old per-action employee modals removed

## Prerequisites

- Node.js 18+
- Laravel API running (default: `http://127.0.0.1:8000/api`)

## Setup

```bash
cd C:\xampp\htdocs\employee-crud-ui-v2
cp .env.example .env.development   # or edit .env.development directly
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Laravel API base URL | `http://127.0.0.1:8000/api` |

## Project structure

```
src/
├── api/                 # Axios client
├── config/routes.js     # Route + sidebar + permission config
├── contexts/            # AuthContext
├── crud/                # Entity CRUD configs
├── services/auth.js     # localStorage auth helpers
└── components/
    ├── auth/
    ├── common/
    ├── crud/
    ├── department/
    ├── employee/
    ├── layout/          # AppLayout, Header, Sidebar, Footer
    ├── role/
    ├── routing/         # ProtectedRoute
    ├── user/
    └── userRole/
```

## Adding a new CRUD page

See `CRUD_REFERENCE.txt` for the step-by-step checklist.

## Scripts

- `npm start` — development server
- `npm test` — run tests
- `npm run build` — production build
- `npm test -- --watch=false --runInBand --runTestsByPath src/components/routing/ProtectedRoute.test.js`
