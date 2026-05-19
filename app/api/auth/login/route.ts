import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (username === 'admin' && password === 'admin123') {
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      })
      
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      })
      
      return response
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid username or password' 
    }, { status: 401 })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Login failed' 
    }, { status: 500 })
  }
}
