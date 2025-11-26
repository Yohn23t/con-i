"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, CheckCircle, X } from "lucide-react"

interface BidRecommendation {
  id: string
  contractorName: string
  rating: number
  matchScore: number
  estimatedPrice: string
  completionTime: string
  reviews: number
}

interface BidRecommendationCardProps {
  recommendation: BidRecommendation
  onViewProfile?: (recommendation: BidRecommendation) => void
}

export function BidRecommendationCard({ recommendation, onViewProfile }: BidRecommendationCardProps) {
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(recommendation)
    } else {
      setShowProfileModal(true)
    }
  }

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{recommendation.contractorName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(recommendation.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({recommendation.reviews} reviews)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950 rounded-full">
            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              {recommendation.matchScore}% Match
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estimated Price</span>
            <span className="font-semibold">{recommendation.estimatedPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Completion Time</span>
            <span className="font-semibold">{recommendation.completionTime}</span>
          </div>
        </div>

        <Button className="w-full" onClick={handleViewProfile}>
          View Profile
        </Button>
      </Card>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Contractor Profile</h2>
              <button onClick={() => setShowProfileModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Contractor Name</p>
                <p className="font-semibold">{recommendation.contractorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-semibold">
                  {recommendation.rating} stars ({recommendation.reviews} reviews)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Match Score</p>
                <p className="font-semibold">{recommendation.matchScore}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Price</p>
                <p className="font-semibold">{recommendation.estimatedPrice}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Time</p>
                <p className="font-semibold">{recommendation.completionTime}</p>
              </div>
              <Button className="w-full" onClick={() => setShowProfileModal(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
