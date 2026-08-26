## 2026-08-24 - [CRITICAL] Remove Hardcoded External Service Secret

**Vulnerability:** A Google Apps Script URL was hardcoded directly as a global variable (`GOOGLE_SCRIPT_URL`) in the `_worker.js` file, which handles backend logic for form submission.

**Learning:** Hardcoding sensitive URLs and secrets directly in code exposes them to anyone with access to the source code or anyone who intercepts the worker configuration. The worker script environment provides access to secrets securely via `env` bindings, which should always be used.

**Prevention:** Ensure that any external service URLs, API keys, or secrets used in Cloudflare Workers are configured as environment variables (via `wrangler.toml`/`wrangler.jsonc` bindings or the Cloudflare dashboard) and accessed dynamically from the `env` object at runtime (e.g., `env.GOOGLE_SCRIPT_URL`), failing securely if missing.

## 2026-08-25 - [MEDIUM] Add Security Headers to Responses

**Vulnerability:** The application was missing fundamental security headers, specifically `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Strict-Transport-Security`. This increases the risk of MIME-sniffing attacks, clickjacking, and data leakage.

**Learning:** In Cloudflare Workers, the response returned by `env.ASSETS.fetch()` is immutable. Any attempt to set headers directly on it throws a runtime error. This pattern requires explicitly cloning the response (by instantiating a new `Response(response.body, response)`) to append missing security headers securely.

**Prevention:** Ensure that all HTTP responses—whether dynamically generated or served from static assets via Workers—include standard security headers. When wrapping an immutable response from `fetch()`, always reconstruct the Response object so headers can be added without causing runtime crashes.
