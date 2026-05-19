import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, device } = body
    
    // Get session ID from cookie or generate new one
    let sessionId = request.cookies.get('session_id')?.value
    
    if (!sessionId) {
      sessionId = crypto.randomUUID()
    }
    
    // Get traffic source from referrer
    const referrer = request.headers.get('referer') || ''
    let trafficSource = 'direct'
    
    if (referrer.includes('tiktok')) trafficSource = 'tiktok'
    else if (referrer.includes('instagram')) trafficSource = 'instagram'
    else if (referrer.includes('facebook')) trafficSource = 'facebook'
    else if (referrer.includes('google')) trafficSource = 'google'
    
    // Store visitor data (in production, save to database)
    console.log('Visitor tracked:', {
      sessionId,
      path,
      device,
      trafficSource,
      timestamp: new Date().toISOString()
    })
    
    const response = NextResponse.json({ success: true })
    
    // Set session cookie if new
    if (!request.cookies.get('session_id')) {
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
    }
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 })
  }
}