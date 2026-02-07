// Simple HTML sanitizer to prevent XSS attacks
export const sanitizeHTML = (html) => {
  if (!html) return "";

  // This is a basic sanitizer - in production, you might want to use a library like DOMPurify
  let sanitized = html;

  // Remove script tags and event handlers
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove iframe tags
  sanitized = sanitized.replace(
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    "",
  );

  return sanitized;
};

// Function to render HTML content safely
export const renderHTML = (html) => {
  const sanitized = sanitizeHTML(html);
  return {
    __html: sanitized,
  };
};
