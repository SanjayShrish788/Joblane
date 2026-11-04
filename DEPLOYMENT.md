# Joblane deployment

Production runs the `deployment/production` branch. The frontend remains Create React App, with the original UI and browser routes. Jobs can now be edited/deleted only by their creator; new IDs are assigned by PostgreSQL.

## Backend

Build root: `Backend_JobPortal`. Run Java 21 and `./mvnw -B -ntp verify` against a disposable PostgreSQL database, supplying `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. Tests create accounts and jobs; do not point tests at production.

Render uses the backend Dockerfile/context, Singapore, **Free**, with automatic deployment disabled so checks precede each release. The image uses Java 21, a non-root user, and bounded heap/metaspace/code cache. Set HTTP health path `/actuator/health`; it includes database connectivity and hides details. The MCP service creation API may initially configure only TCP health checks; verify the HTTP setting in Render.

Set `DB_URL` to the credential-free Neon JDBC URL, `DB_USERNAME`, `DB_PASSWORD`, `FRONTEND_ORIGIN` to the exact HTTPS Vercel origin without trailing slash, and `SPRING_PROFILES_ACTIVE=prod`. Render supplies `PORT`. TLS verifies the server hostname and certificate using the Java trust store. Secrets belong only in Render environment variables.

Flyway creates the initial schema only in an empty database. Hibernate validates rather than changing schema. Flyway clean and automatic baselining are disabled. Existing databases require a separately reviewed, additive migration; never enable baseline/clean or reset data just to make startup pass. The old sample SQL is not compatible with the new ownership schema; create examples through an authenticated account instead.

## Frontend

Vercel root: `Frontend_JobPortal`; Node 24; framework Create React App; install `npm ci`; build `npm run build`; output `build`. Set public build variable `REACT_APP_API_BASE_URL` to the actual HTTPS Render backend origin. `vercel.json` supplies SPA fallback.

Local development may use localhost; production builds require a non-local HTTPS URL. After any API URL change, rebuild the frontend. Only the public URL belongs in frontend environment variables.

## Security and verification

Passwords use BCrypt; Basic credentials stay in browser memory and require HTTPS. Write requests require `X-Requested-With: XMLHttpRequest` and the exact CORS origin; this header is not a secret. The API validates jobs, ignores forged IDs/owners on create, restricts updates/deletes to their owner, and denies the removed `/load` route. Registration IDs and username uniqueness are enforced in PostgreSQL.

Before a release run Maven verify, frontend tests, production build, diff/secret checks. Verify live `/actuator/health`, `/jobPosts`, registration, authenticated job creation/read/update/delete, unauthorized requests, allowed/denied CORS, frontend network requests and direct route loads. Use dedicated test records only.

Remaining scope: registration/login have no dedicated abuse rate limiter, account recovery, email verification or MFA. CRA has unpatched build/dev-tool advisories; its dev server is never deployed. The remaining Router 6 advisories concern untrusted navigation destinations and SSR error hydration; this app uses fixed/internal routes and no SSR. Migrating the toolchain/router is separate work and must be tested. This remains a portfolio application on sleeping free services, without a production availability guarantee.

Render Free running hours are shared across the workspace, including existing services. No paid upgrade or paid storage is configured. The database and frontend remain separate per application.
