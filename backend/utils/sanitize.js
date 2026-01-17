/**
 * Utility functions for input sanitization to prevent security vulnerabilities
 */

/**
 * Escape special regex characters to prevent ReDoS attacks
 * @param {string} str - The string to escape
 * @returns {string} - Escaped string safe for use in RegExp
 */
export const escapeRegex = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Create a safe regex pattern from user input
 * @param {string} pattern - User input to use in regex
 * @param {string} flags - Regex flags (default: 'i' for case insensitive)
 * @returns {RegExp} - Safe RegExp object
 */
export const safeRegex = (pattern, flags = 'i') => {
  const escaped = escapeRegex(pattern);
  return new RegExp(escaped, flags);
};

/**
 * Sanitize MongoDB query object to prevent NoSQL injection
 * Removes or escapes dangerous operators
 * @param {Object} query - Query object to sanitize
 * @returns {Object} - Sanitized query object
 */
export const sanitizeQuery = (query) => {
  if (!query || typeof query !== 'object') return {};
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(query)) {
    // Skip MongoDB operators that start with $
    if (key.startsWith('$')) continue;
    
    if (typeof value === 'string') {
      // Trim and limit length
      sanitized[key] = value.trim().substring(0, 1000);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeQuery(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Sanitize general text input to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 * @param {string} input - Input text to sanitize
 * @returns {string} - Sanitized text
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  sanitized = sanitized.substring(0, 1000);
  
  return sanitized;
};

/**
 * Validate and sanitize email address
 * @param {string} email - Email to validate
 * @returns {string|null} - Sanitized email or null if invalid
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed) ? trimmed : null;
};

/**
 * Sanitize phone number (Indian format)
 * @param {string} phone - Phone number to sanitize
 * @returns {string|null} - Sanitized phone or null if invalid
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return null;
  const cleaned = phone.replace(/\D/g, '');
  // Indian phone numbers are 10 digits
  return /^[6-9]\d{9}$/.test(cleaned) ? cleaned : null;
};

export default {
  escapeRegex,
  safeRegex,
  sanitizeQuery,
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone
};
