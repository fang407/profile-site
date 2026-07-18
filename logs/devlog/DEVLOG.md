# Devlog

A running log of decisions, mistakes, and learnings made while building this project.
Format: one entry per notable event — what happened, what was decided/fixed, why.
This is separate from `project_proposal.md` (the plan) — this is the journal of what actually happened.

---

## 2026-07-16 — Planning session

**Decision: standalone game section, unrelated to resume content**
Initial instinct was a resume-themed gesture game ("catch the skill icons"). Reconsidered: a personal profile site works better with genuinely separate sections carrying equal weight — resume, chat agent, play, gallery — rather than every feature trying to double as a resume delivery mechanism. Landed on a simple hand-tracked dodge/catch game (Flappy-Bird-style single-axis control), unrelated to career content, plus a public leaderboard.

**Decision: LLM provider — Gemini over Claude for the backend agent**
Original plan used the Claude API. Checked current pricing and confirmed Anthropic does not offer a sustained free API tier — only one-time trial credits (~$5). Since the whole project needs to run on free tiers, switched the "ask me" agent to Google's Gemini API, which has a genuinely sustained free tier (rate-limited, no card required). Groq noted as a backup option if inference speed matters more than model choice.
*Learning: always verify current pricing/tier terms before locking in a provider — assumptions from general familiarity with a product can be stale.*

**Decision: meme-of-the-day reuses existing infrastructure instead of adding new services**
Added as a stretch feature. Rather than standing up new infra, it reuses: Upstash Redis (already provisioned for the leaderboard) for daily caching, and Gemini (already provisioned for the agent) for generating the short explanation text. Sourced from a meme-aggregator API rather than hosting/curating images directly, to sidestep licensing overhead.

**Decision: no separate admin app**
Considered building a full admin panel for managing gallery photos, resume content, and game config. Scoped this down: static content (photos, resume text, game tuning) is treated as content-as-code — edited locally, deployed via the existing CI/CD pipeline, no UI needed. Only the leaderboard (real runtime user data in Redis) genuinely needs a live management surface, handled by one password-gated `/admin` route with two actions (delete entry, clear leaderboard) — not a full auth/roles system.
*Learning: before building an admin UI, ask whether the underlying data is actually mutable-at-runtime-by-necessity, or just content that happens to live in a database — the latter often doesn't need a UI at all.*

---

## 2026-07-18 — Day 1-2: scaffold, deploy, and a lot of environment archaeology

**What happened:**
Scaffolded the Next.js frontend and FastAPI backend, then deployed both to Google
Cloud Run with a fully automated GitHub Actions pipeline. Took most of a session,
and the bulk of the time went to environment compatibility issues rather than
application code — see `learning_log_day1-2.md` for the clean concept writeup;
this entry is specifically about what went wrong and why.

**What I decided / how I fixed it:**

*macOS Big Sur (11.7.10) vs. modern tooling, three separate times:*
- Homebrew's `node` install got stuck compiling `cmake`/`llvm` from source
  ("Tier 2" — no precompiled binary exists for this OS version). Switched to
  `nvm`, pinned to Node 18 (the last major version supporting macOS 10.15+).
- The Node 18/Next.js `@latest` combo then failed too, since current Next.js
  requires Node 20.9+. Pinned `create-next-app@14` instead — Next 14 only needs
  Node 18.17+.
- Docker Desktop's current release requires macOS 13+. Parked Docker entirely —
  turned out to be unnecessary anyway, since Google Cloud Build can containerize
  source code in the cloud without any local Docker install.
- GitHub CLI (`gh`) failed three different ways in a row (Homebrew source build,
  `.pkg` installer, even the raw precompiled binary — all compiled against newer
  macOS security APIs). Stopped trying variations on the same tool and switched
  to a Personal Access Token instead.

*A genuinely misleading compiler error:*
- `layout.tsx` failed with "Unexpected token `html`" pointing at line 22, across
  a cache clear *and* a full from-scratch rewrite of the file. Root cause turned
  out to be an unrelated missing `<a` tag six lines later (line 27) — a malformed
  tag earlier in the JSX tree confused the parser badly enough that it reported
  the error at the wrong location entirely.

*Google Cloud IAM, three sequential permission walls on a brand-new project:*
- `storage.objects.get` denied → granted `roles/storage.objectViewer`
- `artifactregistry.repositories.uploadArtifacts` denied → granted
  `roles/artifactregistry.writer`
- Cloud Run deploy then failed for an unrelated reason: our Dockerfile hardcoded
  `--port 8000`, but Cloud Run injects its own `PORT` and expects the container
  to listen on that. Fixed with `${PORT:-8080}` in the CMD (shell form required
  for env var substitution to work at all).

*CI/CD credentials:*
- Attempted a static service-account key for GitHub Actions; blocked by an org
  policy (`disableServiceAccountKeyCreation`) that a personal account can't
  override. Pivoted to Workload Identity Federation instead — more setup, but
  no standing credential ever exists, and it's the currently recommended
  pattern anyway, not just a workaround.
- First WIF provider creation failed too — Google now requires an explicit
  `--attribute-condition` restricting which repo is trusted, rather than
  trusting anything with a valid GitHub token.
- First `git push` of the workflow file itself was rejected — PATs need a
  separate `workflow` scope beyond `repo` to push files inside
  `.github/workflows/`.

**Result:** both services live on Cloud Run; `git push` now auto-lints and
auto-deploys both frontend and backend via GitHub Actions, authenticated with
zero stored secrets.

**Why / what I'd do differently:**
Nearly every wall today traced back to one root cause (an old macOS version)
hitting several unrelated tools independently — worth recognizing that pattern
faster next time a "weird" install error shows up on this machine: check the
tool's minimum OS version before assuming the error is something else. Also
worth remembering, next time a compiler error doesn't budge after a fix at the
reported location: check the surrounding structure, not just that exact line —
the reported location isn't always the actual fault.

Known gaps, deliberately deferred rather than solved: the CI service account
uses a broad `roles/editor` grant rather than the specific handful of roles it
actually needs (least-privilege scoping planned as a later pass, not urgent);
and the pipeline currently has a frontend lint step but no backend tests at all,
since there's no agent logic yet to test.

---

<!-- New entries go above this line. Suggested template:

## YYYY-MM-DD — <short title>

**What happened:**

**What I decided / how I fixed it:**

**Why / what I'd do differently:**

-->