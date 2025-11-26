import { neon } from "@neondatabase/serverless"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const projectId = params.id

    const projects = await sql`
      SELECT p.*, c.company_name
      FROM projects p
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE p.id = ${projectId}
    `

    if (projects.length === 0) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    return Response.json(projects[0])
  } catch (error) {
    console.error("Failed to fetch project:", error)
    return Response.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
