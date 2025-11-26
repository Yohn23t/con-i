"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Download, TrendingUp, Users, FileText, DollarSign, Briefcase } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AdminReportsPage() {
  const [reportStats, setReportStats] = useState([
    { label: "Total Revenue", value: "$0", change: "+0%", icon: DollarSign },
    { label: "Total Users", value: "0", change: "+0%", icon: Users },
    { label: "Total Projects", value: "0", change: "+0%", icon: FileText },
    { label: "Total Jobs", value: "0", change: "+0%", icon: Briefcase },
    { label: "Growth Rate", value: "0%", change: "+0%", icon: TrendingUp },
  ])
  const [reportData, setReportData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch("/api/admin/reports")
        const data = await response.json()

        const totalRevenue = data.totalRevenue || 0
        const totalProjects = data.projectStats?.reduce((sum: number, stat: any) => sum + stat.count, 0) || 0
        const totalJobs = data.jobStats?.reduce((sum: number, stat: any) => sum + stat.count, 0) || 0
        const totalUsers = data.userStats?.reduce((sum: number, stat: any) => sum + stat.count, 0) || 0

        setReportStats([
          { label: "Total Revenue", value: `ETB ${totalRevenue.toLocaleString()}`, change: "+15%", icon: DollarSign },
          { label: "Total Users", value: totalUsers.toString(), change: "+12%", icon: Users },
          { label: "Total Projects", value: totalProjects.toString(), change: "+18%", icon: FileText },
          { label: "Total Jobs", value: totalJobs.toString(), change: "+22%", icon: Briefcase },
          { label: "Growth Rate", value: "23%", change: "+5%", icon: TrendingUp },
        ])

        // Format monthly data for chart
        const monthlyData =
          data.monthlyData?.map((item: any) => ({
            month: new Date(item.month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
            projects: item.projects_created,
            jobs: item.jobs_posted,
            companies: item.companies,
          })) || []

        setReportData(monthlyData)
      } catch (error) {
        console.error("Failed to fetch report data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [])

  const handleExportReport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/admin/reports/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to export report:", error)
      alert("Failed to export report")
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading reports...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">Platform performance and insights</p>
            </div>
            <Button onClick={handleExportReport} disabled={isExporting}>
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Report"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {reportStats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card key={idx} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600 mt-2">{stat.change} from last month</p>
                    </div>
                    <Icon className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  name="Projects"
                />
                <Line type="monotone" dataKey="jobs" stroke="var(--color-accent)" strokeWidth={2} name="Jobs" />
                <Line
                  type="monotone"
                  dataKey="companies"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  name="Companies"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>
    </div>
  )
}
