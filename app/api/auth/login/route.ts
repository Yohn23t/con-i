import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const { email, password } = await request.json()

    const result = await sql`
      SELECT id, email, name, role, password_hash FROM users 
      WHERE email = ${email}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = result[0]

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    let companyId = null
    let contractorId = null

    if (user.role === "company") {
      const companyResult = await sql`SELECT id FROM companies WHERE user_id = ${user.id}`
      if (companyResult.length > 0) {
        companyId = companyResult[0].id
      }
    } else if (user.role === "contractor") {
      const contractorResult = await sql`SELECT id FROM contractors WHERE user_id = ${user.id}`
      if (contractorResult.length > 0) {
        contractorId = contractorResult[0].id
      }
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId,
      contractorId,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
