import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const { name, email, password, role } = await request.json()

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const userResult = await sql`
      INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
      VALUES (${name}, ${email}, ${passwordHash}, ${role}, 'active', NOW(), NOW())
      RETURNING id, email, name, role
    `

    const user = userResult[0]
    let companyId = null
    let contractorId = null

    if (role === "company") {
      const companyResult = await sql`
        INSERT INTO companies (user_id, company_name, created_at, updated_at)
        VALUES (${user.id}, ${name}, NOW(), NOW())
        RETURNING id
      `
      companyId = companyResult[0].id
    } else if (role === "contractor") {
      const contractorResult = await sql`
        INSERT INTO contractors (user_id, first_name, created_at, updated_at)
        VALUES (${user.id}, ${name}, NOW(), NOW())
        RETURNING id
      `
      contractorId = contractorResult[0].id
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
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
