## 2026-08-24 - [CRITICAL] Remove Hardcoded External Service Secret

**Vulnerability:** A Google Apps Script URL was hardcoded directly as a global variable (`GOOGLE_SCRIPT_URL`) in the `_worker.js` file, which handles backend logic for form submission.

**Learning:** Hardcoding sensitive URLs and secrets directly in code exposes them to anyone with access to the source code or anyone who intercepts the worker configuration. The worker script environment provides access to secrets securely via `env` bindings, which should always be used.

**Prevention:** Ensure that any external service URLs, API keys, or secrets used in Cloudflare Workers are configured as environment variables (via `wrangler.toml`/`wrangler.jsonc` bindings or the Cloudflare dashboard) and accessed dynamically from the `env` object at runtime (e.g., `env.GOOGLE_SCRIPT_URL`), failing securely if missing.
