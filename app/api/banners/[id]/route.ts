import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.banner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete banner' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        isActive: body.isActive,
        order: body.order,
      }
    })
    return NextResponse.json({ success: true, banner })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update banner' }, { status: 500 })
  }
}