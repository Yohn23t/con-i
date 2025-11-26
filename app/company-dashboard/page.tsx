"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, DollarSign, Users } from "lucide-react"

export default function CompanyDashboard() {
  const [projects] = useState([
    { id: 1, title: "Office Renovation", budget: "$50K", bids: 12, status: "Active" },
    { id: 2, title: "Warehouse Extension", budget: "$150K", bids: 8, status: "Active" },
    { id: 3, title: "Parking Lot Repair", budget: "$25K", bids: 5, status: "Completed" },
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Company Dashboard</h1>
            <Button asChild>
              <a href="/company-dashboard/post-project">
                <Plus className="w-4 h-4 mr-2" />
                Post Project
              </a>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Projects</p>
                  <p className="text-3xl font-bold mt-2">2</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Bids</p>
                  <p className="text-3xl font-bold mt-2">25</p>
                </div>
                <Users className="w-8 h-8 text-accent" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Spent</p>
                  <p className="text-3xl font-bold mt-2">$225K</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </Card>
          </div>

          {/* Projects List */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.bids} bids received</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold">{project.budget}</p>
                      <p className="text-sm text-muted-foreground">{project.status}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Bid Evaluation */}
          <Card className="p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">AI Bid Evaluation</h2>
            <p className="text-muted-foreground mb-6">Get AI-powered recommendations for the best bids.</p>
            <Button>Run AI Evaluation</Button>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
