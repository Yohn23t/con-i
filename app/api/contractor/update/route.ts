import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: Request) {
  try {
    const { userId, firstName, lastName, bio, skills, hourlyRate, portfolio } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get contractor ID from user
    const userResult = await sql("SELECT contractor_id FROM users WHERE id = $1", [userId])
    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const contractorId = userResult[0].contractor_id

    // Update contractor information
    const result = await sql(
      `UPDATE contractors 
       SET first_name = $1, last_name = $2, bio = $3, skills = $4, hourly_rate = $5, portfolio = $6
       WHERE id = $7
       RETURNING *`,
      [firstName, lastName, bio, skills, hourlyRate, portfolio, contractorId]
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Contractor not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      contractor: result[0],
    })
  } catch (error) {
    console.error("Contractor update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
