import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
  try {
    // Initialize database at runtime
    const sql = neon(process.env.DATABASE_URL!)

    // Fetch all jobs from database
    const jobs = await sql(
      `SELECT id, title, description, category, location, budget, experience_level, company_id, posted_date
       FROM jobs
       WHERE deleted_at IS NULL
       ORDER BY posted_date DESC`,
    )

    return Response.json({ jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
