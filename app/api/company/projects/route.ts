import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const companyId = request.nextUrl.searchParams.get("companyId")

    const projects = await sql`
      SELECT p.id, p.title as name, p.budget_max as budget, p.status, 
              COUNT(b.id) as bids, p.timeline_start as "startDate", p.timeline_end as "dueDate",
              p.description
       FROM projects p
       LEFT JOIN bids b ON p.id = b.project_id
       WHERE p.company_id = ${companyId}
       GROUP BY p.id, p.title, p.budget_max, p.status, p.timeline_start, p.timeline_end, p.description
       ORDER BY p.created_at DESC
    `

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Projects error:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const body = await request.json()
    const { name, category, location, budget, description, deadline, companyId } = body

    console.log("[v0] Creating project:", { name, category, location, budget, description, deadline, companyId })

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    const budgetAmount = typeof budget === "string" ? Number.parseFloat(budget.replace(/[₿,$,]/g, "")) : Number(budget)

    // Insert project into database
    const result = await sql`
      INSERT INTO projects (company_id, title, description, budget_max, timeline_end, status, category, location, created_at, updated_at)
      VALUES (${companyId}, ${name}, ${description}, ${budgetAmount}, ${deadline}, 'open', ${category || null}, ${location || null}, NOW(), NOW())
      RETURNING id, title, description, budget_max, timeline_end, status, category, location
    `

    console.log("[v0] Project created:", result[0])

    return NextResponse.json({ success: true, project: result[0] })
  } catch (error) {
    console.error("[v0] Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
