import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ success: true, banners })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch banners' }, { status: 500 })
  }
}

// POST new banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        buttonText: body.buttonText || 'Shop Now',
        buttonLink: body.buttonLink,
        isActive: body.isActive !== undefined ? body.isActive : true,
        order: body.order || 0,
      }
    })
    return NextResponse.json({ success: true, banner })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json({ success: false, error: 'Failed to create banner' }, { status: 500 })
  }
}