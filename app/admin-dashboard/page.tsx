"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, TrendingUp, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, color: "text-primary" },
    { label: "Active Projects", value: "456", icon: FileText, color: "text-accent" },
    { label: "Total Bids", value: "2,891", icon: TrendingUp, color: "text-primary" },
    { label: "Revenue", value: "$125K", icon: BarChart3, color: "text-accent" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card key={idx} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* AI Insights Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">AI Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Platform Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Bid Success Rate</span>
                    <span className="font-bold text-primary">87%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "87%" }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">User Growth</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monthly Growth</span>
                    <span className="font-bold text-accent">+23%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Management Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8">
              <h2 className="text-xl font-bold mb-4">Manage Users</h2>
              <p className="text-muted-foreground mb-6">View, verify, and manage all platform users.</p>
              <Button className="w-full">View Users</Button>
            </Card>
            <Card className="p-8">
              <h2 className="text-xl font-bold mb-4">Manage Projects</h2>
              <p className="text-muted-foreground mb-6">Monitor and manage all active projects.</p>
              <Button className="w-full">View Projects</Button>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
