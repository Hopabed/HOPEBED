## 2024-05-18 - [CRITICAL] Prevent Hardcoded Secrets in Cloudflare Workers
**Vulnerability:** Hardcoded API endpoints or secrets (`GOOGLE_SCRIPT_URL`) in Cloudflare worker scripts (`_worker.js`).
**Learning:** Hardcoding secrets exposes sensitive configuration to anyone who can view the repository source code. Cloudflare workers support environment variables via the `env` object passed to the `fetch` handler.
**Prevention:** Always use Cloudflare worker environment variables (`env.SECRET_NAME`) instead of hardcoding secrets in the source code. Configure these bindings in Cloudflare settings or `wrangler.toml`/`wrangler.jsonc` (for local dev/non-secrets). Ensure that the code fails securely if the environment variable is not configured.
