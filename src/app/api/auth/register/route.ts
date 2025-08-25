import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { email, password, name, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const existingAdmin = await Admin.findOne({ email })
    
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin with this email already exists' },
        { status: 409 }
      )
    }

    const admin = await Admin.create({
      email,
      password,
      name,
      role: role || 'admin'
    })

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
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 400 }
    )
  }
}