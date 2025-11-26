import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const jobs = await sql`
      SELECT 
        j.*,
        c.company_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      ORDER BY j.posted_date DESC
    `

    return Response.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
