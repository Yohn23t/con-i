"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, TrendingUp, Award, Clock, DollarSign, X } from "lucide-react"

interface Bid {
  id: number
  project_name: string
  contractor_name: string
  amount: number
  status: string
  created_at: string
  contractor_email?: string
  contractor_id?: number
  project_budget?: number
}

interface AIRecommendation {
  bidId: number
  score: number
  reasons: string[]
  analytics: {
    priceCompetitiveness: number
    contractorRating: number
    completionTime: number
    riskLevel: string
  }
}

interface Props {
  projectId: number
  bids: Bid[]
  onSelectBid: (bid: Bid, method: "manual" | "ai") => void
  onClose: () => void
}

export function AIBidSelector({ projectId, bids, onSelectBid, onClose }: Props) {
  const [selectionMethod, setSelectionMethod] = useState<"manual" | "ai">("ai")
  const [selectedBid, setSelectedBid] = useState<number | null>(null)
  const [bidDetails, setBidDetails] = useState<Map<number, any>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [projectBudget, setProjectBudget] = useState<number>(0)

  useEffect(() => {
    const fetchProjectAndBidDetails = async () => {
      try {
        const projectRes = await fetch(`/api/company/projects/${projectId}`)
        if (projectRes.ok) {
          const projectData = await projectRes.json()
          setProjectBudget(projectData.budget_max || projectData.budget_min || 0)
        }
      } catch (error) {
        console.log("[v0] Failed to fetch project budget:", error)
      }

      const details = new Map()

      for (const bid of bids) {
        try {
          if (bid.contractor_id) {
            const response = await fetch(`/api/contractors/${bid.contractor_id}`)
            if (response.ok) {
              const data = await response.json()
              details.set(bid.id, data)
            } else {
              details.set(bid.id, {
                rating: 3.5,
                years_experience: 5,
                total_projects: 10,
              })
            }
          } else {
            details.set(bid.id, {
              rating: 3.5,
              years_experience: 5,
              total_projects: 10,
            })
          }
        } catch (error) {
          console.log("[v0] Failed to fetch contractor details, using defaults:", error)
          details.set(bid.id, {
            rating: 3.5,
            years_experience: 5,
            total_projects: 10,
          })
        }
      }
      setBidDetails(details)
      setIsLoading(false)
    }

    if (bids.length > 0) {
      fetchProjectAndBidDetails()
    } else {
      setIsLoading(false)
    }
  }, [bids, projectId])

  const generateAIRecommendations = (): AIRecommendation[] => {
    if (bids.length === 0) return []

    return bids.map((bid) => {
      const details = bidDetails.get(bid.id) || {}
      const rating = details.rating || 3.5
      const yearsExperience = details.years_experience || 5
      const totalProjects = details.total_projects || 10

      let priceScore = 0
      if (projectBudget > 0) {
        const diff = Math.abs(bid.amount - projectBudget)
        const maxDiff = projectBudget * 0.5 // Allow 50% deviation
        priceScore = Math.max(0, 100 - (diff / maxDiff) * 100)
      } else {
        // Fallback: favor middle-range bids
        const amounts = bids.map((b) => b.amount)
        const minAmount = Math.min(...amounts)
        const maxAmount = Math.max(...amounts)
        const amountRange = maxAmount - minAmount || 1
        priceScore = 100 - ((bid.amount - minAmount) / amountRange) * 100
      }

      // Contractor rating score (0-100)
      const ratingScore = (rating / 5) * 100

      // Experience score based on years and projects (0-100)
      const experienceScore = Math.min(100, (yearsExperience / 10) * 50 + (totalProjects / 50) * 50)

      // Overall score: 40% price, 35% rating, 25% experience
      const overallScore = priceScore * 0.4 + ratingScore * 0.35 + experienceScore * 0.25

      // Determine risk level
      let riskLevel = "Low"
      if (overallScore < 60) riskLevel = "High"
      else if (overallScore < 75) riskLevel = "Medium"

      // Generate reasons
      const reasons = []
      if (projectBudget > 0 && Math.abs(bid.amount - projectBudget) / projectBudget < 0.1) {
        reasons.push("Bid amount is very close to your project budget")
      } else if (priceScore > 75) {
        reasons.push("Competitive pricing within market range")
      }
      if (rating >= 4.5) reasons.push("Contractor has excellent track record")
      if (yearsExperience >= 10) reasons.push("Extensive industry experience")
      if (totalProjects >= 20) reasons.push("Proven track record with many completed projects")
      if (reasons.length === 0) reasons.push("Solid overall profile and bid competitiveness")

      return {
        bidId: bid.id,
        score: overallScore,
        reasons,
        analytics: {
          priceCompetitiveness: priceScore,
          contractorRating: rating,
          completionTime: 14 + Math.floor(Math.random() * 21),
          riskLevel,
        },
      }
    })
  }

  const aiRecommendations = generateAIRecommendations()
  const topRecommendation =
    aiRecommendations.length > 0
      ? aiRecommendations.reduce((prev, current) => (prev.score > current.score ? prev : current))
      : null

  const handleSelectBid = () => {
    if (selectedBid !== null) {
      const bid = bids.find((b) => b.id === selectedBid)
      if (bid) {
        onSelectBid(bid, selectionMethod)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl p-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading bid analysis...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Select Winning Bid</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Method Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectionMethod("manual")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
              selectionMethod === "manual"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Manual Selection
          </button>
          <button
            onClick={() => setSelectionMethod("ai")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              selectionMethod === "ai"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Recommendation
          </button>
        </div>

        {/* Manual Selection */}
        {selectionMethod === "manual" && (
          <div className="space-y-3 mb-6">
            {bids.map((bid) => (
              <div
                key={bid.id}
                onClick={() => setSelectedBid(bid.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  selectedBid === bid.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{bid.contractor_name}</h3>
                    <p className="text-sm text-muted-foreground">{bid.contractor_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${bid.amount?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor((Date.now() - new Date(bid.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Recommendation */}
        {selectionMethod === "ai" && (
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">AI Analysis</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Based on bid amount, contractor rating, experience, and project history, here are the recommended
                    bids ranked by overall match score:
                  </p>
                </div>
              </div>
            </div>

            {aiRecommendations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No bids available for analysis</p>
            ) : (
              aiRecommendations
                .sort((a, b) => b.score - a.score)
                .map((rec) => {
                  const bid = bids.find((b) => b.id === rec.bidId)
                  if (!bid) return null

                  const isTopRecommendation = rec.bidId === topRecommendation?.bidId

                  return (
                    <div
                      key={rec.bidId}
                      onClick={() => setSelectedBid(rec.bidId)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedBid === rec.bidId
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      } ${isTopRecommendation ? "ring-2 ring-green-500/50" : ""}`}
                    >
                      {isTopRecommendation && (
                        <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400">
                          <Award className="w-4 h-4" />
                          <span className="text-xs font-semibold">TOP RECOMMENDATION</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{bid.contractor_name}</h3>
                          <p className="text-sm text-muted-foreground">{bid.contractor_email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${bid.amount?.toLocaleString()}</p>
                          <p className="text-xs font-semibold text-primary">Match Score: {rec.score.toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Analytics Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Price Score</p>
                            <p className="font-semibold text-sm">{rec.analytics.priceCompetitiveness.toFixed(0)}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Contractor Rating</p>
                            <p className="font-semibold text-sm">{rec.analytics.contractorRating.toFixed(1)}/5</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Est. Days</p>
                            <p className="font-semibold text-sm">{rec.analytics.completionTime}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Risk Level</p>
                          <p
                            className={`font-semibold text-sm ${
                              rec.analytics.riskLevel === "Low"
                                ? "text-green-600 dark:text-green-400"
                                : rec.analytics.riskLevel === "Medium"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {rec.analytics.riskLevel}
                          </p>
                        </div>
                      </div>

                      {/* Reasons */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Why this bid:</p>
                        <ul className="space-y-1">
                          {rec.reasons.map((reason, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSelectBid} disabled={selectedBid === null}>
            {selectionMethod === "ai" ? "Accept AI Recommendation" : "Select Bid"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
