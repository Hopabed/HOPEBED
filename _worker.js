export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ============================================
    // 1. CONTACT FORM SUBMISSION
    // ============================================
    if (url.pathname === "/api/submit" && request.method === "POST") {
      try {
        if (!env.GOOGLE_SCRIPT_URL) {
          console.error("Missing GOOGLE_SCRIPT_URL environment binding.");
          return jsonResponse(
            {
              success: false,
              error: "Configuration error. Unable to process request."
            },
            500
          );
        }

        const contentType =
          request.headers.get("content-type") || "";

        let data;

        // Accept JSON
        if (contentType.includes("application/json")) {
          data = await request.json();
        }

        // Accept normal HTML form submissions
        else if (
          contentType.includes(
            "application/x-www-form-urlencoded"
          )
        ) {
          const formData = await request.formData();

          data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message")
          };
        }

        // Accept multipart form data
        else if (contentType.includes("multipart/form-data")) {
          const formData = await request.formData();

          data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message")
          };
        }

        else {
          return jsonResponse(
            {
              success: false,
              error: "Unsupported request format."
            },
            400
          );
        }

        // Clean input
        const name = String(data.name || "").trim();
        const email = String(data.email || "").trim();
        const message = String(data.message || "").trim();

        // Validation
        if (!name || !email || !message) {
          return jsonResponse(
            {
              success: false,
              error: "Name, email and message are required."
            },
            400
          );
        }

        // Basic email validation
        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
          return jsonResponse(
            {
              success: false,
              error: "Please enter a valid email address."
            },
            400
          );
        }

        // ============================================
        // SEND DATA TO GOOGLE APPS SCRIPT
        // ============================================
        const googleResponse = await fetch(
          env.GOOGLE_SCRIPT_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name,
              email,
              message
            })
          }
        );

        if (!googleResponse.ok) {
          throw new Error(
            `Google Apps Script returned ${googleResponse.status}`
          );
        }

        const googleResult =
          await googleResponse.json();

        if (!googleResult.success) {
          throw new Error(
            googleResult.error ||
            "Google Sheet submission failed."
          );
        }

        // ============================================
        // SUCCESS
        // ============================================
        return jsonResponse({
          success: true,
          message: "Message sent successfully."
        });

      } catch (error) {
        console.error(
          "Contact form error:",
          error
        );

        return jsonResponse(
          {
            success: false,
            error:
              "Unable to send your message right now. Please try again."
          },
          500
        );
      }
    }

    // ============================================
    // 2. SERVE YOUR WEBSITE
    // ============================================
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);

      // Cloudflare Worker responses from fetch() are immutable, so we must construct a new Response to modify headers
      const newResponse = new Response(response.body, response);

      // Add security headers
      newResponse.headers.set("X-Content-Type-Options", "nosniff");
      newResponse.headers.set("X-Frame-Options", "DENY");
      newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      newResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

      return newResponse;
    }

    return new Response(
      "Hopabed Worker is running, but the ASSETS binding is not configured.",
      {
        status: 500,
        headers: {
          "content-type": "text/plain;charset=UTF-8"
        }
      }
    );
  }
};


// ============================================
// JSON RESPONSE HELPER
// ============================================
function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
      }
    }
  );
}
