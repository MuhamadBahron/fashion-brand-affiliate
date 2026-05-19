import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const inspirations = await prisma.inspiration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6
    })
    return NextResponse.json({ success: true, inspirations })
  } catch (error) {
    console.error('GET /api/inspirations error:', error)
    return NextResponse.json({ success: true, inspirations: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const inspiration = await prisma.inspiration.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        imageUrl: body.imageUrl,
        tags: body.tags || [],
      }
    })
    return NextResponse.json({ success: true, inspiration })
  } catch (error) {
    console.error('POST /api/inspirations error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create inspiration' }, { status: 500 })
  }
}
