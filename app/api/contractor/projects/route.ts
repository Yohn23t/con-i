import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const availableProjects = await sql`
      SELECT p.id, p.title as name, c.company_name as company, 
              COALESCE(p.budget_max, p.budget_min) as budget, 
              p.timeline_end as deadline,
              p.category, p.description, p.status, COUNT(b.id) as "bidsReceived"
       FROM projects p
       JOIN companies c ON p.company_id = c.id
       LEFT JOIN bids b ON p.id = b.project_id
       WHERE p.status = 'open'
       GROUP BY p.id, c.company_name, p.budget_max, p.budget_min, p.timeline_end, p.category, p.description, p.status
       ORDER BY p.created_at DESC
    `

    return NextResponse.json(availableProjects)
  } catch (error) {
    console.error("Projects error:", error)
    return NextResponse.json([], { status: 200 })
  }
}
