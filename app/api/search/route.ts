import { NextRequest, NextResponse } from 'next/server'

// Mock product data - in production, fetch from database
const products = [
  { id: '1', name: 'Oversized Graphic Tee', price: 189000, category: 'Streetwear' },
  { id: '2', name: 'Cargo Pants Black', price: 349000, category: 'Streetwear' },
  { id: '3', name: 'Wool Blazer Beige', price: 559000, category: 'Old Money' },
  { id: '4', name: 'Knitted Cardigan', price: 279000, category: 'Korean Style' },
  { id: '5', name: 'Pleated Skirt Mini', price: 229000, category: 'Korean Style' },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q') || ''
  
  if (!q) {
    return NextResponse.json({ products: [] })
  }
  
  const results = products.filter(product =>
    product.name.toLowerCase().includes(q.toLowerCase()) ||
    product.category.toLowerCase().includes(q.toLowerCase())
  )
  
  return NextResponse.json({ products: results, query: q })
}