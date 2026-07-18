# Learning log — Day 1-2

A clean, sequential review of every concept introduced today, separate from the
blow-by-blow debugging. Read this top to bottom as the "what did I actually learn" version.

---

## 1. React — the component model

**What it is:** a JavaScript library for building UIs out of small, reusable pieces
called *components*, each with its own local *state* (data that can change).

**Core idea:** when a component's state changes, React automatically re-renders
just that piece of the page — you never manually find and update HTML elements yourself.

**Where we used it:** every `.tsx` file in `frontend/app/` is a component.
`layout.tsx` is the shared shell (nav); `page.tsx` is the home page content.

---

## 2. Next.js — the framework built on React

**What it is:** React alone gives you components; Next.js adds routing (which URL
shows which page), a dev server, and the production build process.

**Key commands:**
```
npx create-next-app@14 frontend   # scaffold a new project (pinned to v14, see §7)
npm run dev                        # start local dev server at localhost:3000
```

**Version note:** Next.js 15+ requires Node 20.9+; we're on Next.js 14, which only
needs Node 18.17+ — this pin was a direct consequence of the Node/macOS constraint in §7.

---

## 3. Tailwind CSS

**What it is:** a styling approach where you apply CSS via class names directly in
your markup (`className="text-2xl font-medium"`) instead of writing separate stylesheet files.

**Why it's common in industry:** faster iteration, no inventing class names, styles
stay colocated with the component that uses them.

---

## 4. FastAPI — the backend framework

**What it is:** a Python framework for defining HTTP endpoints — URLs the frontend
can call to get or send data (`/health`, later `/api/chat`, `/api/score`).

**Why the backend has to exist separately from the frontend:** secrets (API keys),
heavy computation, and database access need to live somewhere the browser can't see
or tamper with. That "somewhere" is the backend server.

**Key commands:**
```
pip install -r requirements.txt
uvicorn app.main:app --reload      # run locally at localhost:8000
```

---

## 5. Client-server request flow (why we deploy *two* separate services)

Two distinct round trips, at two different times:

1. **Page load (once):** browser → frontend service → gets back HTML + JS bundle.
   This is what the frontend deployment is *for* — without it, there's no page for
   anyone to visit, and no JS ever gets downloaded to run.
2. **Interaction (whenever the user does something):** the JS that arrived in step 1
   is now running *inside the browser*, and it's that browser code that calls the
   backend URL directly and gets back JSON.

**Practical implication:** only the frontend URL is ever shared publicly (it's "the site").
The backend URL is an API — reachable, but not meant to be browsed directly.

**Coming later, not yet configured:** because frontend and backend live on two
different domains, browsers block cross-domain requests by default (CORS) unless the
backend explicitly allows the frontend's URL.

---

## 6. Docker — containerization (built, but not run locally — see §7)

**The problem it solves:** "works on my machine" happens when your exact Python
version + dependencies + OS libraries aren't reproducible elsewhere.

**What a Dockerfile is:** a recipe that builds an identical, isolated environment
every time, regardless of where it's built.

**Line-by-line, from `backend/Dockerfile`:**
| Line | Purpose |
|---|---|
| `FROM python:3.12-slim` | start from a minimal pre-built Python image |
| `WORKDIR /app` | set the working directory *inside* the container |
| `COPY requirements.txt .` + `RUN pip install ...` | install dependencies **before** copying app code, so Docker can cache this step and skip re-installing when only code changes |
| `COPY app ./app` | copy the actual application code in |
| `EXPOSE 8080` | documents which port the container listens on |
| `CMD [...]` | the command that runs when the container **starts** |

---

## 7. The macOS version wall (the day's recurring theme)

**Root cause, discovered repeatedly:** the laptop is on macOS Big Sur (11.7.10),
released 2020. Most current dev tooling (Node 20+, Docker Desktop, Homebrew's
"Tier 2" source builds, GitHub CLI's `.pkg` and even its raw binary) now requires
macOS 12 or 13+.

**Pattern learned — three ways to route around an OS-version wall, in order of preference:**
1. **Pin an older tool version** that still supports your OS (Node 18 via `nvm`,
   Next.js 14 instead of `@latest`) — the cleanest fix when available.
2. **Skip the package manager, use a precompiled binary/installer directly** —
   bypasses Homebrew's from-source builds (worked for Node, once pinned to v18).
3. **If even the binary was compiled against newer OS APIs, stop and switch
   approach entirely** rather than trying a fourth workaround for the same wall
   (this is what happened with `gh` — pivoted to a Personal Access Token instead).

**Concrete resolutions today:**
- Node → installed via `nvm`, pinned to v18 (not `--lts`, which grabs a too-new version)
- Next.js → pinned to `@14` via `create-next-app@14`
- Docker Desktop → **parked entirely**; not needed because Google Cloud Build can
  containerize source code in the cloud without a local Docker install
- GitHub CLI (`gh`) → **abandoned**; used a Personal Access Token instead

---

## 8. Google Cloud Run + Cloud Build

**What Cloud Run is:** a service that runs containers and only charges for actual
usage (scales to zero when idle) — this is why it suits a free-tier personal project.

**How we deployed without Docker installed locally:**
```
gcloud run deploy <service-name> --source . --region us-central1 --allow-unauthenticated
```
`--source .` uploads your code to Google, which builds the container *in the cloud*
via Cloud Build — either using buildpacks (auto-detects language from files like
`package.json`) or, if present, an actual `Dockerfile` in the folder (this is what
happened for `backend/`, since we had one; the buildpack path is what ran for
`frontend/`, since it has no Dockerfile).

**One real config bug hit and fixed:** Cloud Run injects a `PORT` environment
variable and expects the container to listen on it — our Dockerfile had a hardcoded
`--port 8000`. Fixed by using `${PORT:-8080}` in the `CMD`, which requires the
shell form of `CMD` (`sh -c "..."`) rather than the JSON-array form, since env var
substitution needs a shell to evaluate it.

---

## 9. IAM & service accounts (Google Cloud's permission system)

**Core idea:** every actor in Google Cloud — including automated processes like
Cloud Build — is an *identity* that needs to be explicitly granted permission
(a "role") to do specific things. Nothing is trusted by default.

**Roles granted today, and why each was needed:**
| Role | Needed for |
|---|---|
| `roles/storage.objectViewer` | reading uploaded source code during build |
| `roles/artifactregistry.writer` | pushing the built container image |
| `roles/editor` (on the CI service account specifically) | broad grant for GitHub Actions — a deliberate simplification, see devlog |

**Pattern learned:** on a brand-new project, expect to hit a *sequence* of
"permission denied" errors, each naming the exact missing role — grant it, retry,
repeat. This is normal, not a sign something is broken.

---

## 10. Git + GitHub authentication

**What changed industry-wide (not new today, but relevant):** GitHub removed
plain password authentication for git operations in 2021. Logging into the website
via Google/SSO doesn't substitute — git needs its own credential.

**Options, in order attempted today:**
1. `gh` CLI's browser-based login → blocked by the macOS version wall (§7)
2. **Personal Access Token (PAT)** → what we ended up using: a token generated on
   GitHub's website, pasted in place of a password when git prompts for one.
   Needed the **`repo`** scope for normal pushes, plus **`workflow`** scope
   specifically to push changes inside `.github/workflows/`.

---

## 11. CI/CD — GitHub Actions

**What "CI/CD" means:** Continuous Integration / Continuous Deployment — automatically
testing and deploying code on every push, instead of doing it by hand each time.

**Where the pipeline definition lives:** `.github/workflows/deploy.yml`, written in
YAML, committed *in the repo itself* — this is "config as code": the deployment
process is version-controlled and identical for anyone who clones the repo, not
hidden in a dashboard's settings.

**How a `git push` actually triggers a cloud deploy:** nothing runs on your laptop.
GitHub's own servers detect the push, spin up a temporary VM, check out your code
onto it, and run each step in the YAML file there — including the `gcloud run deploy`
commands. Your laptop's only job was pushing the code.

**Structure of the workflow file:**
- `on:` → what triggers it (a push to `main`)
- `jobs:` → the sequence of steps that run

**What "lint" means:** static analysis — scanning code for style issues and obvious
bugs *without running it*. Cheap and fast (seconds) compared to catching the same
issue after a full deploy.

---

## 12. Workload Identity Federation (WIF)

**The problem it solves:** the naive way to let GitHub Actions deploy to Google
Cloud is to create a long-lived key file and store it as a GitHub secret. That key
is a standing liability if it ever leaks. Our project's org policy actually
*blocked* key creation outright, which forced the better solution.

**How WIF works instead:** Google Cloud is configured to directly trust identity
tokens that GitHub itself issues. When the workflow runs, GitHub proves "this is
really a run of `fang407/profile-site`," and Google exchanges that proof for a
short-lived credential on the spot. No password or key file exists at any point,
stored or otherwise.

**Pieces set up:**
1. A **Workload Identity Pool** — a container for trusted external identities
2. A **Provider** inside it — configured to trust GitHub's token issuer specifically,
   restricted via `--attribute-condition` to only this one repo
3. A **service account** (`github-deployer`) that the pool is allowed to impersonate
4. Three GitHub repo secrets (`GCP_PROJECT_ID`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`)
   referencing the above — none of them are credentials themselves, just identifiers

**Industry note:** this is the currently recommended pattern for CI-to-cloud auth
generally, not a workaround specific to our situation — worth knowing that the
"harder" path here was actually the better-practice one.

---

## Sequence, end to end (how it all connects)

```
git push
   │
   ▼
GitHub detects the push → spins up a runner
   │
   ▼
Runner checks out code, installs deps, runs lint
   │
   ▼
Runner authenticates to Google Cloud via WIF (no stored key)
   │
   ▼
Runner runs `gcloud run deploy` for backend and frontend
   │
   ▼
Google Cloud Build containerizes each (Dockerfile for backend,
buildpack auto-detection for frontend) and deploys to Cloud Run
   │
   ▼
Two live public URLs — frontend is "the site," backend is the API
it calls from the visitor's own browser
```