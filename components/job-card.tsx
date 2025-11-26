"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Job } from "@/lib/job-matching"
import { MapPin, DollarSign, Briefcase, Calendar } from "lucide-react"
import { JobDetailModal } from "./job-detail-modal"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-blue-100 text-blue-800"
    if (score >= 40) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowDetails(true)}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <Badge className={`${getMatchColor(job.matchScore)} font-semibold`}>{job.matchScore}% Match</Badge>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-primary" />
                <span>{job.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{job.distance} miles</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-primary" />
                <span>${job.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatDate(job.postedDate)}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{job.experienceLevel}</Badge>
              <Badge variant="outline">{job.location}</Badge>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex flex-col gap-2 md:w-32">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(true)
              }}
              className="w-full"
            >
              View Details
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Save Job
            </Button>
          </div>
        </div>
      </Card>

      <JobDetailModal job={job} open={showDetails} onOpenChange={setShowDetails} />
    </>
  )
}
