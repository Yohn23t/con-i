import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const totalUsers = await sql`SELECT COUNT(*) as count FROM users`
    const activeProjects = await sql`SELECT COUNT(*) as count FROM projects WHERE status = 'in_progress'`
    const pendingBids = await sql`SELECT COUNT(*) as count FROM bids WHERE status = 'pending'`
    const completedProjects = await sql`SELECT COUNT(*) as count FROM projects WHERE status = 'completed'`

    const recentUsers = await sql`
      SELECT u.id, u.name, u.email, u.role as type, u.status, u.created_at as "joinDate"
       FROM users u ORDER BY u.created_at DESC LIMIT 5
    `

    const growthData = await sql`
      SELECT 
        DATE_TRUNC('month', created_at)::date as month,
        COUNT(CASE WHEN role = 'company' THEN 1 END) as companies,
        COUNT(CASE WHEN role = 'contractor' THEN 1 END) as contractors,
        COUNT(*) as total
       FROM users 
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC LIMIT 6
    `

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers[0]?.count || 0,
        activeProjects: activeProjects[0]?.count || 0,
        pendingBids: pendingBids[0]?.count || 0,
        completedProjects: completedProjects[0]?.count || 0,
      },
      recentUsers,
      growthData: growthData.reverse(),
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json({
      stats: { totalUsers: 0, activeProjects: 0, pendingBids: 0, completedProjects: 0 },
      recentUsers: [],
      growthData: [],
    })
  }
}
