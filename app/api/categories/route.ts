import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          take: 1
        }
      }
    })
    return NextResponse.json({ success: true, categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        icon: body.icon || '📁',
        imageUrl: body.imageUrl || null,
      }
    })
    
    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}
