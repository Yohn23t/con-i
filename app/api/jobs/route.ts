import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get("location")
    const experienceLevel = searchParams.get("experienceLevel")
    const category = searchParams.get("category")
    const minBudget = searchParams.get("minBudget")
    const maxBudget = searchParams.get("maxBudget")

    const baseQuery = sql`
      SELECT 
        j.id, 
        j.title, 
        j.description, 
        j.location, 
        j.budget, 
        j.experience_level as "experienceLevel",
        j.skills,
        j.deadline,
        j.posted_date as "posted",
        j.phone,
        j.website,
        c.company_name as company_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'open'
    `

    const allJobs = await baseQuery

    // Apply filters in JavaScript
    let filteredJobs = allJobs

    if (location) {
      filteredJobs = filteredJobs.filter((job: any) => job.location?.toLowerCase().includes(location.toLowerCase()))
    }

    if (experienceLevel && experienceLevel !== "all") {
      filteredJobs = filteredJobs.filter((job: any) => job.experienceLevel === experienceLevel)
    }

    if (category && category !== "all") {
      filteredJobs = filteredJobs.filter((job: any) => Array.isArray(job.skills) && job.skills.includes(category))
    }

    if (minBudget) {
      const min = Number.parseFloat(minBudget)
      filteredJobs = filteredJobs.filter((job: any) => job.budget && Number(job.budget) >= min)
    }

    if (maxBudget) {
      const max = Number.parseFloat(maxBudget)
      filteredJobs = filteredJobs.filter((job: any) => job.budget && Number(job.budget) <= max)
    }

    const transformedJobs = filteredJobs.slice(0, 50).map((job: any) => ({
      id: job.id,
      title: job.title,
      company_name: job.company_name || "Company Name",
      description: job.description,
      budget: job.budget,
      location: job.location,
      deadline: job.deadline,
      skills: Array.isArray(job.skills) ? job.skills : [],
      experience_level: job.experienceLevel,
      phone: job.phone,
      website: job.website,
      posted: job.posted
        ? `${Math.floor((Date.now() - new Date(job.posted).getTime()) / (1000 * 60 * 60 * 24))} days ago`
        : "Recently",
    }))

    return NextResponse.json(transformedJobs)
  } catch (error) {
    console.error("Jobs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
