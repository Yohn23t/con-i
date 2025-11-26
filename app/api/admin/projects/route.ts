import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const projects = await sql`
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.budget_min, 
        p.budget_max, 
        p.status, 
        p.timeline_start, 
        p.timeline_end,
        p.company_id,
        p.created_at,
        c.company_name,
        COUNT(b.id) as bid_count
      FROM projects p
      LEFT JOIN companies c ON p.company_id = c.id
      LEFT JOIN bids b ON p.id = b.project_id
      GROUP BY p.id, c.id
      ORDER BY p.created_at DESC
    `
    return Response.json(projects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
