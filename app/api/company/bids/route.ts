import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return Response.json({ error: "Company ID required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const bids = await sql`
      SELECT 
        b.id,
        b.amount,
        b.status,
        b.created_at,
        p.title as project_name,
        p.id as project_id,
        CONCAT(ct.first_name, ' ', ct.last_name) as contractor_name,
        u.email as contractor_email
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      JOIN contractors ct ON b.contractor_id = ct.id
      JOIN users u ON ct.user_id = u.id
      WHERE p.company_id = ${companyId}
      ORDER BY b.created_at DESC
    `
    return Response.json(bids)
  } catch (error) {
    console.error("Failed to fetch bids:", error)
    return Response.json({ error: "Failed to fetch bids" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { bidId, action } = await request.json()
    const sql = neon(process.env.DATABASE_URL!)

    if (action === "accept") {
      await sql`
        UPDATE bids
        SET status = 'accepted'
        WHERE id = ${bidId}
      `
    } else if (action === "reject") {
      await sql`
        UPDATE bids
        SET status = 'rejected'
        WHERE id = ${bidId}
      `
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to update bid:", error)
    return Response.json({ error: "Failed to update bid" }, { status: 500 })
  }
}
