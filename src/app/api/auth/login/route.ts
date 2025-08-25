import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const admin = await Admin.findOne({ email }).select('+password')
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isPasswordValid = await admin.comparePassword(password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    })

    return NextResponse.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}