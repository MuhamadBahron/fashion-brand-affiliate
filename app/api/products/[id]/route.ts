import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    })
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: parseInt(body.price),
        imageUrl: body.imageUrl,
        modelImageUrl: body.modelImageUrl,
        shopeeLink: body.shopeeLink,
        categoryId: body.categoryId,
        isTrending: body.isTrending || false,
        isViral: body.isViral || false,
      }
    })
    
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 })
  }
}