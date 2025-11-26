import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const { userId, companyName, email, phone, address, website, description } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const companyResult = await sql`SELECT id FROM companies WHERE user_id = ${userId}`
    if (companyResult.length === 0) {
      return NextResponse.json({ error: "Company not found for this user" }, { status: 404 })
    }

    const companyId = companyResult[0].id

    const result = await sql`
      UPDATE companies 
      SET company_name = ${companyName}, phone = ${phone}, address = ${address}, website = ${website}, description = ${description}
      WHERE id = ${companyId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Company updated successfully",
      company: result[0],
    })
  } catch (error) {
    console.error("Company update error:", error)
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 })
  }
}
