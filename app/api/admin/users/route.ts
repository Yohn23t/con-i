import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const users = await sql`
      SELECT id, email, name, role, created_at, status
      FROM users
      ORDER BY created_at DESC
    `
    return Response.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return Response.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
