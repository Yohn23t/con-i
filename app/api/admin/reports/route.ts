import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const totalRevenue = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM bids
      WHERE status = 'accepted'
    `

    const projectStats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM projects
      GROUP BY status
    `

    const jobStats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM jobs
      GROUP BY status
    `

    const userStats = await sql`
      SELECT 
        role,
        COUNT(*) as count
      FROM users
      GROUP BY role
    `

    const monthlyData = await sql`
      SELECT 
        DATE_TRUNC('month', p.created_at) as month,
        COUNT(DISTINCT p.id) as projects_created,
        COUNT(DISTINCT p.company_id) as companies,
        COALESCE((
          SELECT COUNT(*) 
          FROM jobs j 
          WHERE DATE_TRUNC('month', j.posted_date) = DATE_TRUNC('month', p.created_at)
        ), 0) as jobs_posted
      FROM projects p
      GROUP BY DATE_TRUNC('month', p.created_at)
      ORDER BY month DESC
      LIMIT 12
    `

    return Response.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      projectStats,
      jobStats,
      userStats,
      monthlyData,
    })
  } catch (error) {
    console.error("Failed to fetch reports:", error)
    return Response.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
