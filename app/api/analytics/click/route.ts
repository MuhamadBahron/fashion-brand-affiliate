import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId } = body
    
    const sessionId = request.cookies.get('session_id')?.value || 'anonymous'
    
    // Get traffic source
    const referrer = request.headers.get('referer') || ''
    let trafficSource = 'direct'
    
    if (referrer.includes('tiktok')) trafficSource = 'tiktok'
    else if (referrer.includes('instagram')) trafficSource = 'instagram'
    else if (referrer.includes('facebook')) trafficSource = 'facebook'
    else if (referrer.includes('google')) trafficSource = 'google'
    
    // Get device info
    const userAgent = request.headers.get('user-agent') || ''
    const device = /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : 'desktop'
    
    // Store click data (in production, save to database)
    console.log('Affiliate click tracked:', {
      productId,
      sessionId,
      device,
      trafficSource,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}