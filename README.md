# Playwright Testing Example

Example full-stack notes app that demonstrates four testing layers using Playwright only:

- Backend unit tests (pure functions)
- Integration tests (HTTP against the API + real MySQL)
- End-to-end browser tests (Next.js + API + DB)
- React component tests (Playwright Component Testing)

Stack: Next.js 14 (App Router), Express, Sequelize, MySQL 8. All tests can run locally or entirely via Docker Compose.

## Project layout
- `server/` - Express API, Sequelize models, JWT auth, MySQL connection.
- `frontend/` - Next.js app with basic login/register and notes UI.
- `tests/unit/` - Playwright-run unit tests for server utilities.
- `tests/integration/` - Playwright API tests hitting the running server.
- `tests/e2e/` - Playwright browser flows.
- `frontend/tests/` - Playwright component tests (Vite-powered).
- `docker-compose.yml` - Dev stack (DB + API + frontend).
- `docker-compose.test.yml` - Self-contained test runner (adds a Playwright container).

## Prerequisites
- Docker + Docker Compose
- (Optional for local runs) Node.js 20+

## Run the app with Docker
```sh
docker compose up --build
```
- Frontend: http://localhost:3000 (override with `FRONTEND_PORT`)
- API: http://localhost:3001 (override with `SERVER_PORT`)
- MySQL: localhost:3307 (override with `MYSQL_PORT`, root password `MYSQL_ROOT_PASSWORD`)

## Run the full test suite in Docker (recommended)
```sh
docker compose -f docker-compose.test.yml up --build --exit-code-from playwright
```
This builds the images, installs all dependencies inside the Playwright container (including browsers), and runs:
- Unit + integration + E2E tests (`tests/*`)
- Component tests (`frontend/tests/*`)

## Run tests locally (requires services running)
Install dependencies and browsers:
```sh
npm install
npm run install:all
npm run install:browsers
```
Start the API (`npm start` inside `server/`) and the frontend (`npm run dev` inside `frontend/`), then run:
```sh
npm test                # all Playwright projects
npm run test:unit       # unit only
npm run test:integration# integration only
npm run test:e2e        # browser E2E only
npm run test:component  # React component tests
```

## Environment
1) Copy `.env.example` to `.env` (dev stack) and fill real values.  
2) Copy `.env.test.example` to `.env.test` (test stack) and fill real values.  
The server loads the root `.env`; docker-compose uses the same files via `env_file`. Nothing sensitive should be committed—examples carry placeholders only.  
The API drops and recreates tables on each start in non-production (`sequelize.sync({ force: true })`) to keep tests isolated.

## Playwright: strengths, weaknesses, and fit
- Strengths
  - One tool for multiple layers: browser E2E, API/integration (via `request`), and component testing (CT) with real browsers.
  - Fast, reliable browser automation with auto-waiting and good tracing/debug tooling.
  - First-class TypeScript support and rich selectors (getByRole, text, test-id).
  - Official Docker images include browsers, making CI and containerized runs straightforward.
- Weaknesses / less ideal
  - Not optimized for pure backend unit tests: it can run them, but lighter runners (Vitest/Jest) start faster.
  - Component testing ecosystem is newer than Jest/Vitest + RTL; fewer community utilities/patterns.
  - For snapshot-heavy UI testing or React-specific hooks/state testing, RTL + Jest/Vitest may feel simpler.
- Best used for
  - Full-stack E2E browser flows.
  - Integration/API tests where you want consistent runner + reporters.
  - Component tests that need a real browser environment (animations, canvas, layout).
- Not best for
  - Ultra-fast, isolated logic/unit tests where a minimal runner (Vitest/Jest) is faster and lighter.
  - Deep React-hook/state unit tests that don’t need a DOM; RTL/Vitest often simpler there.

## Notes on credentials
- Default JWT secret: change `JWT_ACCESS_SECRET` for anything beyond demos.
- Docker MySQL root password: `rootpassword` (dev) / `testpassword` (tests). User accounts are also set in the compose files.

## CI-style exit codes
`--exit-code-from playwright` makes `docker compose` exit with the test result, suitable for CI pipelines.
