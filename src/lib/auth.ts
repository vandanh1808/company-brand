import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export function generateToken(payload: Record<string, unknown>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>
  } catch {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export function authenticateAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded || !decoded.id || !decoded.role) {
    return null
  }

  return decoded
}