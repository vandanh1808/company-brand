import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    const product = await Product.findById(id)
      .populate({
        path: 'brandId',
        select: 'name companyId',
        populate: {
          path: 'companyId',
          select: 'name'
        }
      })
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    const body = await request.json()
    
    const product = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate({
      path: 'brandId',
      select: 'name companyId',
      populate: {
        path: 'companyId',
        select: 'name'
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    const product = await Product.findByIdAndDelete(id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}