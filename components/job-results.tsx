"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type JobFilters, matchJobs } from "@/lib/job-matching"
import { JobCard } from "./job-card"
import { ArrowLeft, Search, Filter } from "lucide-react"

interface JobResultsProps {
  filters: JobFilters
  onBack: () => void
}

export function JobResults({ filters, onBack }: JobResultsProps) {
  const [sortBy, setSortBy] = useState<"match" | "budget" | "date">("match")
  const [searchTerm, setSearchTerm] = useState("")

  const matchedJobs = useMemo(() => {
    const jobs = matchJobs(filters)

    // Apply additional search filter
    if (searchTerm) {
      return jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return jobs
  }, [filters, searchTerm])

  const sortedJobs = useMemo(() => {
    const jobs = [...matchedJobs]

    switch (sortBy) {
      case "budget":
        return jobs.sort((a, b) => b.budget - a.budget)
      case "date":
        return jobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
      case "match":
      default:
        return jobs.sort((a, b) => b.matchScore - a.matchScore)
    }
  }, [matchedJobs, sortBy])

  return (
    <div className="py-12 px-4 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Filters
          </Button>
          <h1 className="text-4xl font-bold mb-2">Job Matches</h1>
          <p className="text-lg text-muted-foreground">
            Found <span className="font-semibold text-foreground">{sortedJobs.length}</span> jobs matching your criteria
          </p>
        </div>

        {/* Search and Sort Controls */}
        <Card className="p-4 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
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
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to find more opportunities.</p>
            <Button onClick={onBack}>Adjust Filters</Button>
          </Card>
        )}
      </div>
    </div>
  )
}
