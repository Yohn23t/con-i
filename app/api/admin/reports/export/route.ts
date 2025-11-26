import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Fetch all report data
    const totalRevenue = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM bids
      WHERE status = 'accepted'
    `

    const projectStats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM projects
      GROUP BY status
    `

    const jobStats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM jobs
      GROUP BY status
    `

    const bidStats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM bids
      GROUP BY status
    `

    const userStats = await sql`
      SELECT 
        role,
        COUNT(*) as count
      FROM users
      GROUP BY role
    `

    // Generate CSV content
    let csvContent = "Construction Bidding Platform - Report Export\n"
    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`

    csvContent += "REVENUE SUMMARY\n"
    csvContent += `Total Revenue (Accepted Bids),${totalRevenue[0]?.total || 0}\n\n`

    csvContent += "PROJECT STATISTICS\n"
    csvContent += "Status,Count\n"
    projectStats.forEach((stat: any) => {
      csvContent += `${stat.status},${stat.count}\n`
    })
    csvContent += "\n"

    csvContent += "JOB STATISTICS\n"
    csvContent += "Status,Count\n"
    jobStats.forEach((stat: any) => {
      csvContent += `${stat.status},${stat.count}\n`
    })
    csvContent += "\n"

    csvContent += "BID STATISTICS\n"
    csvContent += "Status,Count\n"
    bidStats.forEach((stat: any) => {
      csvContent += `${stat.status},${stat.count}\n`
    })
    csvContent += "\n"

    csvContent += "USER STATISTICS\n"
    csvContent += "Role,Count\n"
    userStats.forEach((stat: any) => {
      csvContent += `${stat.role},${stat.count}\n`
    })

    // Return CSV file
    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Failed to export report:", error)
    return Response.json({ error: "Failed to export report" }, { status: 500 })
  }
}
