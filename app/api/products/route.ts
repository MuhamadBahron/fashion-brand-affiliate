// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        modelImageUrl: body.modelImageUrl || null,
        shopeeLink: body.shopeeLink,
        categoryId: body.categoryId,
        isTrending: body.isTrending || false,
        isViral: body.isViral || false,
        views: 0,
        clicks: 0,
      }
    })
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}