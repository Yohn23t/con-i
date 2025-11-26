"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Job } from "@/lib/job-matching"
import { MapPin, DollarSign, Briefcase, Calendar, User, CheckCircle } from "lucide-react"

interface JobDetailModalProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobDetailModal({ job, open, onOpenChange }: JobDetailModalProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitBid = () => {
    setSubmitted(true)
    setTimeout(() => {
      onOpenChange(false)
      setSubmitted(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
          <DialogDescription>{job.company}</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Bid Submitted Successfully!</h3>
            <p className="text-muted-foreground">The company will review your bid and contact you soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Match Score */}
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Match Score</p>
                <p className="text-2xl font-bold">{job.matchScore}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">This job matches your profile</p>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Budget</span>
                </div>
                <p className="text-2xl font-bold">${job.budget.toLocaleString()}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Distance</span>
                </div>
                <p className="text-2xl font-bold">{job.distance} miles</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Category</span>
                </div>
                <p className="text-lg font-semibold">{job.category}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Experience</span>
                </div>
                <p className="text-lg font-semibold">{job.experienceLevel}</p>
              </Card>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Job Description</h4>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h4>
              <p className="text-muted-foreground">{job.location}</p>
            </div>

            {/* Posted Date */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Posted
              </h4>
              <p className="text-muted-foreground">{new Date(job.postedDate).toLocaleDateString()}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge>{job.category}</Badge>
              <Badge variant="secondary">{job.experienceLevel}</Badge>
              <Badge variant="outline">{job.location}</Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmitBid} className="flex-1" size="lg">
                Submit Bid
              </Button>
              <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1" size="lg">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
