"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Job } from "@/lib/job-matching"
import { MapPin, Banknote, Briefcase, TrendingUp, ChevronRight } from "lucide-react"
import { JobDetailModal } from "./job-detail-modal"

interface JobMatchCardProps {
  job: Job
}

export function JobMatchCard({ job }: JobMatchCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
    if (score >= 60) return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
    if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
    return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
  }

  return (
    <>
      <Card
        className="p-6 hover:shadow-lg transition-all border-primary/20 hover:border-primary/50 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="border-primary/30">
                {job.category}
              </Badge>
              <Badge variant="outline" className="border-primary/30">
                {job.experienceLevel}
              </Badge>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Banknote className="w-4 h-4 text-primary" />
                <span>ETB {job.budget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right Content - Match Score */}
          <div className="flex flex-col items-end gap-4">
            <div className={`p-4 rounded-lg ${getMatchColor(job.matchScore)} text-center`}>
              <div className="flex items-center gap-1 justify-center mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-2xl font-bold">{job.matchScore}%</span>
              </div>
              <p className="text-xs font-semibold">Match Score</p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(true)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      <JobDetailModal job={job} open={showDetails} onOpenChange={setShowDetails} />
    </>
  )
}
