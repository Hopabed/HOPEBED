## 2026-08-24 - [CRITICAL] Remove Hardcoded External Service Secret

**Vulnerability:** A Google Apps Script URL was hardcoded directly as a global variable (`GOOGLE_SCRIPT_URL`) in the `_worker.js` file, which handles backend logic for form submission.

**Learning:** Hardcoding sensitive URLs and secrets directly in code exposes them to anyone with access to the source code or anyone who intercepts the worker configuration. The worker script environment provides access to secrets securely via `env` bindings, which should always be used.

**Prevention:** Ensure that any external service URLs, API keys, or secrets used in Cloudflare Workers are configured as environment variables (via `wrangler.toml`/`wrangler.jsonc` bindings or the Cloudflare dashboard) and accessed dynamically from the `env` object at runtime (e.g., `env.GOOGLE_SCRIPT_URL`), failing securely if missing.

## 2026-08-25 - [HIGH] Missing Security Headers in Cloudflare Worker

**Vulnerability:** The application was serving static assets and API responses without basic security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).

**Learning:** When using Cloudflare Workers to serve static assets via `env.ASSETS.fetch(request)` or returning custom API responses, standard security headers are not applied automatically. This leaves the application susceptible to MIME-sniffing, clickjacking, and XSS attacks.

**Prevention:** Intercept responses from `env.ASSETS.fetch` by creating a new `Response` object and explicitly appending security headers before returning. Ensure utility functions like `jsonResponse` also explicitly include these headers.
