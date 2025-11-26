import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const contractors = await sql`
      SELECT 
        c.id,
        c.first_name,
        c.last_name,
        CONCAT(c.first_name, ' ', c.last_name) as name,
        c.specializations,
        c.city,
        c.state,
        c.phone,
        c.rating,
        c.years_experience,
        c.total_projects,
        c.profile_image_url,
        c.verified,
        u.email as user_email
      FROM contractors c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.rating DESC, c.total_projects DESC
    `

    return NextResponse.json(contractors)
  } catch (error) {
    console.error("Contractors error:", error)
    return NextResponse.json([])
  }
}
