import { neon } from "@neondatabase/serverless"

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    await sql`DELETE FROM users WHERE id = ${userId}`

    return Response.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    return Response.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
