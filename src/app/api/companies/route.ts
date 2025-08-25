import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Company from '@/models/Company'

export async function GET() {
  try {
    await dbConnect()
    const companies = await Company.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: companies })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const company = await Company.create(body)
    return NextResponse.json({ success: true, data: company }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 400 }
    )
  }
}