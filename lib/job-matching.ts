export interface Job {
  id: string
  title: string
  description: string
  category: string
  location: string
  budget: number
  experienceLevel: string
  distance: number
  matchScore: number
  postedDate: string
  company: string
}

export interface JobFilters {
  jobTitle: string
  location: string
  categories: string[]
  experienceLevel: string
  minBudget: number
  maxBudget: number
  distance: number
}

const EXPERIENCE_LEVEL_RANK = {
  "Entry Level": 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
}

export function calculateMatchScore(job: Omit<Job, "matchScore">, filters: JobFilters): number {
  let score = 0
  let maxScore = 0

  // Job title match (30 points)
  maxScore += 30
  if (filters.jobTitle) {
    const titleMatch =
      job.title.toLowerCase().includes(filters.jobTitle.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.jobTitle.toLowerCase())
    if (titleMatch) score += 30
    else score += 10
  } else {
    score += 15
  }

  // Category match (25 points)
  maxScore += 25
  if (filters.categories.length > 0) {
    if (filters.categories.includes(job.category)) {
      score += 25
    } else {
      score += 5
    }
  } else {
    score += 12
  }

  // Budget match (20 points)
  maxScore += 20
  if (job.budget >= filters.minBudget && job.budget <= filters.maxBudget) {
    score += 20
  } else if (job.budget >= filters.minBudget * 0.8 && job.budget <= filters.maxBudget * 1.2) {
    score += 10
  } else {
    score += 2
  }

  // Distance match (15 points)
  maxScore += 15
  if (job.distance <= filters.distance) {
    score += 15
  } else if (job.distance <= filters.distance * 1.5) {
    score += 8
  } else {
    score += 2
  }

  // Experience level match (10 points)
  maxScore += 10
  if (filters.experienceLevel) {
    const filterLevel = EXPERIENCE_LEVEL_RANK[filters.experienceLevel as keyof typeof EXPERIENCE_LEVEL_RANK] || 0
    const jobLevel = EXPERIENCE_LEVEL_RANK[job.experienceLevel as keyof typeof EXPERIENCE_LEVEL_RANK] || 0

    if (jobLevel === filterLevel) {
      score += 10
    } else if (jobLevel > filterLevel) {
      score += 8
    } else {
      score += 4
    }
  } else {
    score += 5
  }

  return Math.round((score / maxScore) * 100)
}

export async function matchJobs(filters: JobFilters): Promise<Job[]> {
  try {
    // Fetch jobs from database
    const response = await fetch("/api/jobs/fetch")
    const data = await response.json()
    const databaseJobs = data.jobs || []

    // Transform database jobs to match Job interface
    const jobsWithScores = databaseJobs.map((job: any) => ({
      ...job,
      distance: 0, // Distance would need to be calculated based on actual coordinates
      company: "Posted Company",
      matchScore: 0, // Will be calculated below
    }))

    // Calculate match scores
    const scoredJobs = jobsWithScores.map((job: any) => ({
      ...job,
      matchScore: calculateMatchScore(job, filters),
    }))

    const hasFilters = filters.jobTitle || filters.categories.length > 0 || filters.experienceLevel

    if (!hasFilters) {
      return scoredJobs.sort((a, b) => b.matchScore - a.matchScore)
    }

    // Filter based on criteria
    const filtered = scoredJobs.filter((job: any) => {
      if (job.distance > filters.distance * 1.5) return false
      if (job.budget < filters.minBudget * 0.8 || job.budget > filters.maxBudget * 1.2) return false
      if (filters.categories.length > 0 && !filters.categories.includes(job.category)) return false
      return true
    })

    return filtered.sort((a, b) => b.matchScore - a.matchScore)
  } catch (error) {
    console.error("Error matching jobs:", error)
    return []
  }
}

export function getJobsByCategory(category: string): Job[] {
  // This will need to be updated to fetch from database
  return []
}
