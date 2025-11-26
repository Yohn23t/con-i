import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contractorId = searchParams.get("contractorId")

    if (!contractorId) {
      return Response.json({ error: "Contractor ID required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const bids = await sql`
      SELECT 
        b.id,
        b.amount,
        b.status,
        b.created_at,
        p.title as project_name,
        p.description,
        c.company_name,
        u.email as company_email
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      JOIN companies c ON p.company_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE b.contractor_id = ${contractorId}
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
    const { projectId, contractorId, amount } = await request.json()

    if (!projectId || !contractorId || !amount) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Parse amount to remove $ and commas
    const bidAmount = Number.parseFloat(amount.replace(/[$,]/g, ""))

    const result = await sql`
      INSERT INTO bids (project_id, contractor_id, amount, status)
      VALUES (${projectId}, ${contractorId}, ${bidAmount}, 'pending')
      RETURNING id, project_id, contractor_id, amount, status, created_at
    `

    return Response.json({ success: true, bid: result[0] })
  } catch (error) {
    console.error("Failed to submit bid:", error)
    return Response.json({ error: "Failed to submit bid" }, { status: 500 })
  }
}
