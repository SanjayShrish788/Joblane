# Joblane

### Big ambitions. Better opportunities.

A full-stack job portal built with **React, Spring Boot, and PostgreSQL**. Browse opportunities, narrow down your next move, and create an account to post and manage jobs.

## Features

- Responsive interface with job cards and detailed role previews.
- Search by title, description, or skill; filter by experience and technology.
- Sort opportunities by latest added or experience.
- Bookmark jobs for later using browser local storage.
- Register, log in, and log out with clear validation messages.
- Create, edit, and delete jobs after signing in.
- Persistent jobs and user accounts in PostgreSQL.
- BCrypt password hashing and stateless HTTP Basic authentication.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, React Router 6, Axios, CSS, Create React App |
| Backend | Java 21, Spring Boot 4.1.1, Spring Security, Spring Data JPA |
| Database | PostgreSQL |
| Testing | Jest, React Testing Library, JUnit |
| Build tools | npm and Maven Wrapper |

## Project structure

```text
Joblane/
├── Frontend_JobPortal/          # React application
│   ├── public/                 # Page metadata and static assets
│   └── src/                    # Interface, routing, styles, and tests
├── Backend_JobPortal/           # Spring Boot API
│   └── src/main/
│       ├── java/com/sanjay/spring_boot_rest/
│       │   ├── config/          # Security configuration
│       │   ├── model/           # JPA entities and user principal
│       │   ├── repo/            # Database repositories
│       │   ├── service/         # Job and user services
│       │   └── *Controller.java # Job and registration endpoints
│       └── resources/           # Application configuration
└── docs/sample-jobs.sql         # Optional sample opportunities
```

## Run locally

### Prerequisites

- JDK **21**, with `JAVA_HOME` pointing to it.
- Node.js and npm. The frontend has been run with Node.js 24.
- A running PostgreSQL server and access to a database user.
- Git. Maven is downloaded by the included wrapper on first use.

### 1. Clone the repository

```bash
git clone https://github.com/SanjayShrish788/Joblane.git
cd Joblane
```

### 2. Create the database

Connect to PostgreSQL with `psql` or pgAdmin and run:

```sql
CREATE DATABASE sanjay;
```

The API creates or updates its tables on startup using Hibernate. Database records persist between application restarts.

### 3. Start the backend

In **PowerShell**:

```powershell
cd Backend_JobPortal
$env:DB_URL = 'jdbc:postgresql://localhost:5432/sanjay'
$env:DB_USERNAME = 'postgres'
$env:DB_PASSWORD = 'your-database-password'
.\mvnw.cmd spring-boot:run
```

In **macOS/Linux**:

```bash
cd Backend_JobPortal
export DB_URL='jdbc:postgresql://localhost:5432/sanjay'
export DB_USERNAME='postgres'
export DB_PASSWORD='your-database-password'
chmod +x mvnw
./mvnw spring-boot:run
```

The API runs at **http://localhost:8080**. Keep this terminal running.

You can alternatively put personal settings in `Backend_JobPortal/src/main/resources/application-local.properties`. That file is automatically imported and ignored by Git. Local overrides take precedence over the defaults above; do not commit passwords.

### 4. Start the frontend

In a second terminal, from the repository root:

```bash
cd Frontend_JobPortal
npm ci
npm start
```

Open **http://localhost:3000**. The frontend calls the backend on port 8080; both services must be running. CORS allows the frontend origin `http://localhost:3000`.

### 5. Add sample jobs (optional)

After the backend has started once, run from the repository root:

```bash
psql -h localhost -U postgres -d sanjay -f docs/sample-jobs.sql
```

This adds five sample opportunities and preserves existing records with the same IDs. The repository includes no database dump or preconfigured user accounts.

## Accounts and authentication

1. Click **Sign up** to create an account.
2. Choose a username with 3–40 letters, numbers, dots, underscores, or dashes.
3. Use a password of at least 8 characters and no more than 72 UTF-8 bytes.
4. Registration saves a BCrypt hash in PostgreSQL and signs you in automatically.
5. Returning users can use **Log in**. Signed-in users can post, edit, and delete jobs.

Login credentials are held in memory and are cleared on logout or page refresh. Accounts remain in PostgreSQL, so users can sign in again. Saved job IDs are stored locally in the same browser; they are not synchronized between accounts or devices.

## API reference

Base URL: `http://localhost:8080`

| Method | Route | Purpose | Authentication |
| --- | --- | --- | --- |
| POST | `/register` | Register an account | Public |
| GET | `/jobPosts` | List all jobs | Public |
| GET | `/jobPost/{postId}` | Get one job | Public |
| GET | `/jobPosts/keyword/{keyword}` | Search job titles and descriptions | Public |
| POST | `/jobPost` | Create a job | HTTP Basic |
| PUT | `/jobPost` | Update a job | HTTP Basic |
| DELETE | `/jobPost/{postId}` | Delete a job | HTTP Basic |
| GET | `/load` | Load the backend's built-in sample jobs | HTTP Basic |

Registration expects JSON containing `username` and `password`. It returns `201` on success, `400` for invalid input, and `409` for a duplicate username. Password hashes are never included in its response. Login uses HTTP Basic credentials on a request to `/jobPosts`; invalid credentials return `401`.

A job has this shape:

```json
{
  "postId": 6,
  "postProfile": "Full Stack Developer",
  "postDesc": "Build thoughtful web experiences and reliable services.",
  "reqExperience": 2,
  "postTechStack": ["React", "Java", "PostgreSQL"]
}
```

The frontend searches titles, descriptions, and skills locally. The API keyword endpoint searches titles and descriptions. `/load` saves fixed IDs and can overwrite jobs using those IDs; the SQL script above is the safer option for adding examples without overwriting existing records.

## Tests and builds

From `Frontend_JobPortal`:

```bash
npm test -- --watchAll=false
npm run build
```

The frontend tests cover skill-based search, registration with automatic login, and network-error handling.

From `Backend_JobPortal`:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
```

Use `./mvnw` on macOS/Linux. The backend context test needs PostgreSQL running and database credentials configured, just like the application.

## Current scope

This is a learning and portfolio project. All registered users currently have the same permissions and can manage all jobs. IDs are assigned manually; the current assignment approach is intended for a single application instance. HTTP Basic should be served over HTTPS outside local development. A production deployment would also need deployment-specific origins and API URLs, job ownership/roles, stronger database constraints, and schema migrations.

## Troubleshooting

- **Database connection fails:** check that PostgreSQL is running, `sanjay` exists, and the `DB_*` values are correct. Also check for an ignored local override file.
- **Wrong Java version:** set `JAVA_HOME` to your JDK 21 installation before running Maven.
- **Jobs do not load:** confirm the backend is listening on port 8080 and use `localhost:3000` for the frontend.
- **A port is occupied:** stop the previous process before launching another copy.
- **No jobs after cloning:** run the sample SQL or register and publish a job. PostgreSQL data is not stored in Git.
