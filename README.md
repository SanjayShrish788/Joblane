# Joblane

**[Open the live application](https://joblane-six.vercel.app)** | [Backend health](https://joblane-api.onrender.com/actuator/health)

A full-stack application built with React 18, Java 21, Spring Boot 4.1.1 and PostgreSQL.

## Features

Browse and filter five repository sample jobs, bookmark opportunities, register and sign in, and publish jobs. Only a job owner can edit or delete it. PostgreSQL assigns IDs and enforces unique usernames.

## Deployment

| Layer | Service | Configuration |
| --- | --- | --- |
| Frontend | Vercel Hobby | Create React App, Node.js 24, SPA routing |
| Spring Boot API | Render Free | Singapore, Java 21 Docker |
| PostgreSQL | Neon Free | Separate database, AWS Singapore (`aws-ap-southeast-1`) |

Production source is on `deployment/production`. Deployment is manual: pushing a commit does not automatically release it. Free backends sleep after inactivity, so initial requests may take a few minutes. See [deployment instructions](DEPLOYMENT.md).

## Project layout

- `Backend_JobPortal/`: Spring Boot API, Dockerfile, Flyway migration and tests.
- `Frontend_JobPortal/`: React frontend and Vercel routing configuration.
- `render.yaml`: reproducible Render reference configuration; the live service is managed directly.

## Local setup

1. Install Java 21, Node.js 24 and PostgreSQL. Create an empty disposable development database.
2. Supply backend environment variables `DB_URL` (JDBC URL), `DB_USERNAME`, and `DB_PASSWORD`. The application reads these directly; keep secrets out of Git. `PORT` defaults to 8080.
3. Set `FRONTEND_ORIGIN` to the exact frontend origin. Local backend configuration accepts `http://localhost:3000`; use that origin/port for local frontend development, or deliberately adjust local CORS for another development port.
4. From `Backend_JobPortal`, run `./mvnw spring-boot:run` (Windows: `.\mvnw.cmd spring-boot:run`). Flyway initializes an empty schema; Hibernate validates it. Existing schemas need a reviewed migration, not a reset or automatic baseline.
5. From `Frontend_JobPortal`, run `npm ci`, then configure `REACT_APP_API_BASE_URL` for the API. Development can use HTTP localhost; production builds require HTTPS.
6. Start the frontend with `npm start` for Joblane or `npm run dev -- --port 3000` for Everyday Edit.

Use `SPRING_PROFILES_ACTIVE=prod` only with production HTTPS origins and TLS database settings. Production verifies PostgreSQL server certificates and hostnames. Passwords use BCrypt and authenticated requests use HTTP Basic over HTTPS. Credentials remain in browser memory and refresh clears sign-in.

## Checks

Run Maven `verify` against a disposable PostgreSQL database, never production. Run `npm run build` with the appropriate public API variable configured. Joblane additionally has `npm test -- --watchAll=false`; Everyday Edit has no frontend automated test suite.

Deployment checks included builds, database health, live API reads/writes, authentication, CORS and browser rendering. Flyway clean and automatic baseline are disabled. No dedicated abuse limiter, password recovery, email verification or MFA is implemented. Remaining frontend toolchain dependency advisories and operational limitations are documented in [DEPLOYMENT.md](DEPLOYMENT.md).

## Sample jobs

The live database includes the five opportunities from `docs/sample-jobs.sql`, imported through the authenticated API. The legacy SQL uses fixed IDs and predates job ownership; do not run it against the production schema. Add jobs through a registered account instead. `/load` is removed/denied.
