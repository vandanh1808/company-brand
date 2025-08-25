import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brandId')
    
    const query = brandId ? { brandId } : {}
    const products = await Product.find(query)
      .populate({
        path: 'brandId',
        select: 'name companyId',
        populate: {
          path: 'companyId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
    
    return NextResponse.json({ success: true, data: products })
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
    
    const product = await Product.create(body)
    await product.populate({
      path: 'brandId',
      select: 'name companyId',
      populate: {
        path: 'companyId',
        select: 'name'
      }
    })
    
    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 400 }
    )
  }
}