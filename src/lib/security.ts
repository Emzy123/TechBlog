import crypto from 'crypto'
import validator from 'validator'
import DOMPurify from 'isomorphic-dompurify'

// Generate secure random tokens
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

// Validate and sanitize email
export function validateEmail(email: string): boolean {
  return validator.isEmail(email) && validator.isLength(email, { max: 254 })
}

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel']
  })
}

// Validate string length and content
export function validateString(str: string, minLength: number = 1, maxLength: number = 1000): boolean {
  return validator.isLength(str.trim(), { min: minLength, max: maxLength })
}

// Rate limiting helper
export function createRateLimitKey(ip: string, endpoint: string): string {
  return `rate_limit:${endpoint}:${ip}`
}

// Password strength validation
export function validatePasswordStrength(password: string): boolean {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
}

// Escape special characters for database queries
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
