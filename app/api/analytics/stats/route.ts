import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get daily visitors and clicks for the last 7 days
    const dailyData = await prisma.$queryRaw`
      SELECT 
        DATE(v."visitedAt") as date,
        COUNT(DISTINCT v."sessionId") as visitors,
        COUNT(ac."id") as clicks
      FROM "Visitor" v
      LEFT JOIN "AffiliateClick" ac ON DATE(ac."clickedAt") = DATE(v."visitedAt")
      WHERE v."visitedAt" >= ${sevenDaysAgo}
      GROUP BY DATE(v."visitedAt")
      ORDER BY date ASC
    ` as Array<{ date: Date; visitors: number; clicks: number }>

    // Get total stats
    const totalVisitors = await prisma.visitor.count()
    const totalClicks = await prisma.affiliateClick.count()
    
    // Get traffic sources
    const trafficSources = await prisma.$queryRaw`
      SELECT 
        COALESCE("trafficSource", 'direct') as source,
        COUNT(*) as count
      FROM "Visitor"
      GROUP BY "trafficSource"
    ` as Array<{ source: string; count: number }>

    // Get top products
    const topProducts = await prisma.product.findMany({
      take: 5,
      orderBy: {
        clicks: 'desc'
      },
      select: {
        name: true,
        views: true,
        clicks: true,
        price: true
      }
    })

    // Calculate estimated commission (assuming 10% affiliate commission)
    const commissionResult = await prisma.$queryRaw`
      SELECT COALESCE(SUM(p."price" * 0.1), 0) as total
      FROM "AffiliateClick" ac
      JOIN "Product" p ON ac."productId" = p."id"
    ` as Array<{ total: number }>

    const estimatedCommission = commissionResult[0]?.total || 0

    // Calculate conversion rate
    const conversionRate = totalVisitors > 0 ? ((totalClicks / totalVisitors) * 100).toFixed(1) : 0

    return NextResponse.json({
      success: true,
      data: {
        totalVisitors,
        totalClicks,
        estimatedCommission,
        conversionRate: Number(conversionRate),
        dailyData: dailyData.map(d => ({
          date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
          visitors: d.visitors,
          clicks: d.clicks
        })),
        trafficSources: trafficSources.map(t => ({
          name: t.source,
          value: t.count
        })),
        topProducts
      }
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}