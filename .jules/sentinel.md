## 2026-08-20 - Unhandled Timeout Memory Leak
**Vulnerability:** Implementing fetch timeouts with setTimeout and AbortController without a finally block leaves lingering timers in memory if the fetch throws an error (e.g. network failure) before the timeout duration is reached.
**Learning:** Always place clearTimeout inside a finally block when wrapping fetch calls with an AbortController timeout to ensure memory is properly cleaned up regardless of success or failure.
**Prevention:** Use a try/finally block for clearTimeout when using setTimeout to abort a fetch request.
