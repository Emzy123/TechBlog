import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import dbConnect from './mongodb'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export interface JWTPayload {
  userId: string
  username: string
  role: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d',
    issuer: 'techblog',
    audience: 'techblog-users'
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'techblog',
      audience: 'techblog-users'
    }) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function getAuthUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    await dbConnect()
    const user = await User.findById(decoded.userId).select('-password')
    
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getAuthUser(request)
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }
  
  return user
}
