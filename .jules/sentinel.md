## 2024-05-18 - [Fix Hardcoded Secret]
**Vulnerability:** A hardcoded Google Apps Script URL (`GOOGLE_SCRIPT_URL`) was found globally in `_worker.js`.
**Learning:** Hardcoded endpoints/secrets shouldn't be baked into the codebase, as they could be extracted or misused, especially when deploying Cloudflare Workers.
**Prevention:** Always use Cloudflare Worker environment bindings (e.g., `env.GOOGLE_SCRIPT_URL`) to securely inject configurations and secrets, failing securely with standard error messages if they are not provided.
