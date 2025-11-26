import { neon } from "@neondatabase/serverless"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const jobId = params.id

    await sql`DELETE FROM jobs WHERE id = ${jobId}`

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return Response.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
