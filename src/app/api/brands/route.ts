import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Brand from '@/models/Brand'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    const query = companyId ? { companyId } : {}
    const brands = await Brand.find(query)
      .populate('companyId', 'name')
      .sort({ createdAt: -1 })
    
    return NextResponse.json({ success: true, data: brands })
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
    
    const brand = await Brand.create(body)
    await brand.populate('companyId', 'name')
    
    return NextResponse.json({ success: true, data: brand }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 400 }
    )
  }
}