import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    const result = await sql`SELECT 
      id, 
      company_name, 
      phone, 
      address, 
      website, 
      description,
      industry,
      city,
      state,
      zip_code,
      logo_url
    FROM companies WHERE id = ${companyId}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Fetch company profile error:", error)
    return NextResponse.json({ error: "Failed to fetch company profile" }, { status: 500 })
  }
}
