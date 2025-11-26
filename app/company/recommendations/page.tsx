"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BidRecommendationCard } from "@/components/bid-recommendation-card"
import { Sparkles, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

const recommendations = [
  {
    id: "1",
    contractorName: "Elite Construction Co.",
    rating: 4.9,
    matchScore: 98,
    estimatedPrice: "$47,500",
    completionTime: "45 days",
    reviews: 156,
  },
  {
    id: "2",
    contractorName: "BuildPro Solutions",
    rating: 4.8,
    matchScore: 95,
    estimatedPrice: "$48,200",
    completionTime: "48 days",
    reviews: 142,
  },
  {
    id: "3",
    contractorName: "Quality Builders Inc.",
    rating: 4.7,
    matchScore: 92,
    estimatedPrice: "$49,000",
    completionTime: "50 days",
    reviews: 128,
  },
]

export default function RecommendationsPage() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [filterRating, setFilterRating] = useState("all")

  const filteredRecommendations = recommendations.filter((rec) => {
    if (filterRating === "all") return true
    if (filterRating === "4.9+") return rec.rating >= 4.9
    if (filterRating === "4.7+") return rec.rating >= 4.7
    return true
  })

  const handleViewProfile = (recommendation) => {
    setToastMessage(`Viewing profile for ${recommendation.contractorName}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userType="company" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold">AI Recommendations</h1>
              </div>
              <p className="text-muted-foreground">
                Personalized contractor recommendations based on your project requirements
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Ratings</option>
                <option value="4.9+">4.9+ Stars</option>
                <option value="4.7+">4.7+ Stars</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Info Card */}
          <Card className="mb-8 p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2">How AI Recommendations Work</h3>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes contractor profiles, ratings, past projects, availability, and pricing to find the best
              matches for your specific project needs. Recommendations are updated in real-time as new contractors join
              the platform.
            </p>
          </Card>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((rec) => (
              <BidRecommendationCard key={rec.id} recommendation={rec} onViewProfile={handleViewProfile} />
            ))}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
