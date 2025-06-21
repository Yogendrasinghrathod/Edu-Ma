// Simple HTML sanitizer to prevent XSS attacks
export const sanitizeHTML = (html) => {
  if (!html) return '';
  
  // Remove potentially dangerous tags and attributes
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'div'
  ];
  
  const allowedAttributes = [
    'class', 'id', 'style'
  ];
  
  // This is a basic sanitizer - in production, you might want to use a library like DOMPurify
  let sanitized = html;
  
  // Remove script tags and event handlers
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  return sanitized;
};

// Function to render HTML content safely
export const renderHTML = (html, className = '') => {
  const sanitized = sanitizeHTML(html);
  return {
    __html: sanitized
  };
}; 