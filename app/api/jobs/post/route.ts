import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, skills, location, budget, deadline, experienceLevel, company_id, phone, website } = body

    // Validate required fields
    if (!title || !description || !skills || !location || !experienceLevel) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!company_id) {
      return Response.json({ error: "Company ID is required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      INSERT INTO jobs (
        title, 
        description, 
        skills, 
        location, 
        budget, 
        experience_level, 
        company_id, 
        phone,
        website,
        deadline,
        posted_date,
        status,
        created_at
      )
      VALUES (
        ${title}, 
        ${description}, 
        ${skills}, 
        ${location}, 
        ${budget}, 
        ${experienceLevel}, 
        ${company_id},
        ${phone || null},
        ${website || null},
        ${deadline || null},
        NOW(),
        'open',
        NOW()
      )
      RETURNING id, title, description, location, budget, experience_level, posted_date
    `

    return Response.json({
      success: true,
      job: result[0],
    })
  } catch (error) {
    console.error("Error posting job:", error)
    return Response.json({ error: "Failed to post job. Please try again." }, { status: 500 })
  }
}
