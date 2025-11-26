"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase, TrendingUp, CheckCircle } from "lucide-react"

export default function ContractorDashboard() {
  const [recommendations] = useState([
    { id: 1, title: "Office Renovation", budget: "$50K", location: "Downtown", match: "95%" },
    { id: 2, title: "Warehouse Extension", budget: "$150K", location: "Industrial Zone", match: "88%" },
    { id: 3, title: "Parking Lot Repair", budget: "$25K", location: "Midtown", match: "92%" },
  ])

  const [bids] = useState([
    { id: 1, project: "Office Renovation", amount: "$45K", status: "Pending" },
    { id: 2, project: "Parking Lot Repair", amount: "$24K", status: "Accepted" },
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Contractor Dashboard</h1>
            <Button asChild>
              <a href="/contractor-dashboard/submit-bid">
                <Plus className="w-4 h-4 mr-2" />
                Submit Bid
              </a>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Bids</p>
                  <p className="text-3xl font-bold mt-2">5</p>
                </div>
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Accepted Bids</p>
                  <p className="text-3xl font-bold mt-2">3</p>
                </div>
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Win Rate</p>
                  <p className="text-3xl font-bold mt-2">60%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </div>

          {/* AI Recommended Projects */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">AI Recommended Projects</h2>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div>
                    <h3 className="font-semibold">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">{rec.location}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-primary font-medium">{rec.match} match</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Your Bids */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Your Bids</h2>
            <div className="space-y-4">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div>
                    <h3 className="font-semibold">{bid.project}</h3>
                    <p className="text-sm text-muted-foreground">{bid.amount}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bid.status === "Accepted" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {bid.status}
                    </span>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
