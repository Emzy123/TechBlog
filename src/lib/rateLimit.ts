import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  message?: string
}

export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const key = `${ip}:${request.nextUrl.pathname}`
    const now = Date.now()
    
    // Clean up expired entries
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    })
    
    // Get or create rate limit entry
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + config.windowMs
      }
    }
    
    const entry = store[key]
    
    // Reset if window expired
    if (entry.resetTime < now) {
      entry.count = 0
      entry.resetTime = now + config.windowMs
    }
    
    // Increment counter
    entry.count++
    
    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      return NextResponse.json(
        { 
          error: config.message || 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString()
          }
        }
      )
    }
    
    return null // Allow request to proceed
  }
}

// Predefined rate limit configurations
export const rateLimits = {
  contact: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3, // 3 contact submissions per 15 minutes
    message: 'Too many contact form submissions. Please wait before sending another message.'
  },
  newsletter: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 newsletter signups per hour
    message: 'Too many newsletter subscription attempts. Please try again later.'
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
    message: 'Too many login attempts. Please wait before trying again.'
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'API rate limit exceeded. Please slow down your requests.'
  }
}
