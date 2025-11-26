"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JobFilters } from "@/lib/job-matching"
import { JobMatchCard } from "./job-match-card"
import { ArrowLeft, Search, Filter, Loader } from "lucide-react"

interface JobMatchingResultsProps {
  filters: JobFilters
  onBack: () => void
}

export function JobMatchingResults({ filters, onBack }: JobMatchingResultsProps) {
  const [sortBy, setSortBy] = useState<"match" | "budget" | "date">("match")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs/fetch")
        const data = await response.json()
        setJobs(data.jobs || [])
      } catch (error) {
        console.error("Error fetching jobs:", error)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const matchedJobs = useMemo(() => {
    let filtered = jobs

    if (searchTerm) {
      filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [jobs, searchTerm])

  const sortedJobs = useMemo(() => {
    const jobList = [...matchedJobs]

    switch (sortBy) {
      case "budget":
        return jobList.sort((a, b) => b.budget - a.budget)
      case "date":
        return jobList.sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime())
      case "match":
      default:
        return jobList.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    }
  }, [matchedJobs, sortBy])

  if (loading) {
    return (
      <div className="py-12 px-4 flex-1">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Filters
          </Button>
          <h1 className="text-4xl font-bold mb-2">Job Matches</h1>
          <p className="text-lg text-muted-foreground">
            Found <span className="font-semibold text-foreground">{sortedJobs.length}</span> jobs matching your criteria
          </p>
        </div>

        {/* Search and Sort Controls */}
        <Card className="p-4 mb-8 flex flex-col sm:flex-row gap-4 border-primary/20">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-primary/30"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40 border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="budget">Highest Budget</SelectItem>
                <SelectItem value="date">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results */}
        {sortedJobs.length > 0 ? (
          <div className="space-y-4">
            {sortedJobs.map((job) => (
              <JobMatchCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-primary/20">
            <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to find more opportunities.</p>
            <Button onClick={onBack} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Adjust Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
