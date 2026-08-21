## 2024-05-15 - [CRITICAL] Fix hardcoded Google Script URL in Cloudflare Worker
**Vulnerability:** A hardcoded Google Apps Script URL (`GOOGLE_SCRIPT_URL`) was found in `_worker.js`, which exposes a backend webhook endpoint directly in the source code.
**Learning:** Hardcoded secrets/endpoints in worker code can leak sensitive integration points if the repository is exposed or shared. The Cloudflare Worker needs these values provided via environment variables (`env`).
**Prevention:** Always use Cloudflare Worker environment bindings (e.g., `env.GOOGLE_SCRIPT_URL`) to access secrets or configuration. Ensure a fallback/error response is triggered securely without leaking details when the environment variable is missing.
