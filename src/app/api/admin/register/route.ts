import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = 'admin' } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    })

    await user.save()

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      data: {
        token,
        admin: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (error) {
    console.error('Admin registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}