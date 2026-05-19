import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.category.delete({
      where: { id }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category and all its products have been deleted' 
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete category' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        icon: body.icon,
        imageUrl: body.imageUrl || null,
      }
    })
    
    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 })
  }
}