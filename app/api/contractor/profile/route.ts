import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contractorId = searchParams.get("contractorId")

    if (!contractorId) {
      return NextResponse.json({ error: "Missing contractorId" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const contractor = await sql`
      SELECT 
        id,
        first_name,
        last_name,
        phone,
        city,
        state,
        address,
        zip_code,
        bio,
        specializations,
        rating,
        total_projects,
        profile_image_url,
        hourly_rate,
        years_experience,
        verified,
        created_at,
        updated_at,
        user_id
      FROM contractors
      WHERE id = ${Number.parseInt(contractorId)}
    `

    if (!contractor || contractor.length === 0) {
      return NextResponse.json({ error: "Contractor not found" }, { status: 404 })
    }

    const data = contractor[0]
    const user = await sql`
      SELECT email FROM users WHERE id = ${data.user_id}
    `

    return NextResponse.json({
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      email: user[0]?.email || "",
      phone: data.phone || "",
      specialty: data.specializations || "",
      location: `${data.city}, ${data.state}` || "",
      bio: data.bio || "",
      certifications: data.years_experience ? `${data.years_experience} years experience` : "",
      rating: data.rating || 0,
      completed_projects: data.total_projects || 0,
      total_earnings: 0,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contractorId, fullName, email, phone, specialty, location, bio, certifications } = body

    if (!contractorId) {
      return NextResponse.json({ error: "Missing contractorId" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Extract first and last name
    const [firstName, ...lastNameParts] = fullName.split(" ")
    const lastName = lastNameParts.join(" ") || ""

    // Extract city and state from location
    const [city, state] = location.split(",").map((s: string) => s.trim())

    // Update contractor
    await sql`
      UPDATE contractors
      SET 
        first_name = ${firstName},
        last_name = ${lastName},
        phone = ${phone},
        city = ${city || ""},
        state = ${state || ""},
        bio = ${bio},
        specializations = ${specialty},
        updated_at = NOW()
      WHERE id = ${Number.parseInt(contractorId)}
    `

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
