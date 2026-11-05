# Technical Requirements Document

## Architecture

- **Frontend:** React 19 and Vite; responsive single-page interface.
- **Application/API server:** Node.js 22 HTTP server serves `dist/` and handles `/api/assist/*`.
- **Copilot SDK:** Node server compares only the sample jobs included in the request, with one allowlisted local `search_jobs` tool.
- **Microsoft Agent Framework:** FastAPI service uses Foundry `FoundryChatClient` for optional posting-description drafts. In the container it listens only on `127.0.0.1:8001`; the Node server proxies the feature.
- **Persistence:** browser local storage for demo listings and applications. No production database or personal account data.
- **Hosting target:** Azure App Service for Linux using the included Dockerfile. No Azure resource or live deployment URL is provisioned by this repository.

## Runtime configuration

Copy `.env.example` to a local, untracked `.env` and set only the integrations being tested:

| Variable | Purpose |
|---|---|
| `COPILOT_GITHUB_TOKEN` | Server-side authentication for the Copilot SDK matching assistant. |
| `FOUNDRY_PROJECT_ENDPOINT` | Microsoft Foundry project endpoint. |
| `FOUNDRY_MODEL` | Model deployment name used by `FoundryChatClient`. |
| `AZURE_CLIENT_ID` | Optional user-assigned managed identity client ID. |
| `PORT` | Node HTTP listener; defaults to `3001` locally and `8080` in the container. |

On Azure, prefer managed identity and grant it the minimum Foundry project/model permissions required. Do not set or commit a local credential file or publish-profile secret. Local Foundry development uses `DefaultAzureCredential`.

## API

- `GET /api/health` returns process health.
- `GET /api/assist/status` reports whether each provider is configured; it does not prove model connectivity.
- `POST /api/assist/match` accepts a short preference and up to ten bounded sample-job records.
- `POST /api/assist/posting` accepts bounded title, category, location, and description fields.
- Unknown API paths return 404. Unsupported methods return 405.
- Request bodies are capped at 8 KiB, validated with strict schemas, and limited to eight assistance requests per in-memory peer address per window. This is not a distributed or production abuse-control system.
- Obvious email and phone-number patterns are rejected from AI inputs; this does not detect every form of personal information, so users must not submit names or other private details.
- AI provider failures return a generic user-safe error; server logs retain diagnostic context. A missing provider returns 503 while non-AI product flows remain available.

## Privacy and responsible AI

- Do not submit names or other personal information to either provider. Apparent email addresses and phone numbers are rejected before the provider call.
- Matching sends the user's short preference and the currently visible sample listing fields.
- Drafting sends only the work title, category, location, and current description.
- AI output is an unverified suggestion; users must check every condition and explicitly apply a draft.
- The prototype has no authentication, durable server-side data store, or production abuse controls. Add these before handling real applications or personal data.

## Local development and verification

```powershell
npm.cmd install
npm.cmd run dev
```

In another terminal, run the API/static server:

```powershell
npm.cmd run build
npm.cmd start
```

Vite proxies `/api` to the Node server at `127.0.0.1:3001`; the Node API server defaults to port `3001` outside the container. To run the optional Foundry service locally, install `agent_service/requirements.txt`, set Foundry variables, and run:

```powershell
python -m uvicorn agent_service.main:app --host 127.0.0.1 --port 8001
```

Build the Azure-compatible container with `docker build -t ilsonieum .`. Configure the App Service container port as `8080`, then provide provider configuration through App Service settings or managed identity.

## Known production gaps

Real sign-in, persistent listings/applications, farmer-worker contact, consent and retention policies, moderation, operational monitoring, distributed rate limiting, and end-to-end availability checks are outside the prototype scope.
