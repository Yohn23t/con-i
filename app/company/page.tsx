"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Toast, ToastProvider } from "@/components/ui/toast"
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import { useForm } from "react-hook-form"
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]

export default function CompanyPage() {
  const { user } = useUser()
  const [projects, setProjects] = useState([])
  const [bids, setBids] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const form = useForm()

  const handlePostProject = async (formData: any) => {
    if (!formData.name || !formData.budget || !formData.deadline) {
      setToastMessage("Please fill in all required fields")
      setShowToast(true)
      return
    }

    try {
      const response = await fetch("/api/company/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          budget: parseFloat(formData.budget),
          description: formData.description,
          deadline: formData.deadline,
          companyId: user?.companyId,
        }),
      })

      if (response.ok) {
        setToastMessage("Project posted successfully!")
        setShowToast(true)
        setShowNewProjectModal(false)
        form.reset()

        // Refresh projects
        const res = await fetch(`/api/company/projects?companyId=${user?.companyId}`)
        const data = await res.json()
        setProjects(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to post project:", error)
      setToastMessage("Failed to post project")
      setShowToast(true)
    }

    setTimeout(() => setShowToast(false), 3000)
  }

  const handleBidAction = async (bidId: string, action: "accept" | "reject") => {
    try {
      const response = await fetch("/api/company/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId, action }),
      })

      if (response.ok) {
        setToastMessage(`Bid ${action}ed successfully!`)
        setShowToast(true)

        // Refresh bids
        const res = await fetch(`/api/company/bids?companyId=${user?.companyId}`)
        const data = await res.json()
        setBids(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to update bid:", error)
      setToastMessage("Failed to update bid")
      setShowToast(true)
    }

    setTimeout(() => setShowToast(false), 3000)
  }

  useEffect(() => {
    if (!user?.companyId) return

    const fetchData = async () => {
      try {
        const [projectsRes, bidsRes] = await Promise.all([
          fetch(`/api/company/projects?companyId=${user.companyId}`),
          fetch(`/api/company/bids?companyId=${user.companyId}`),
        ])

        const projectsData = await projectsRes.json()
        const bidsData = await bidsRes.json()

        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setBids(Array.isArray(bidsData) ? bidsData : [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setProjects([])
        setBids([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.companyId])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar userType="company" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userType="company" />

      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Company Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage your projects and track bids</p>
            </div>
            <Button onClick={() => setShowNewProjectModal(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* AI recommendations card */}
          <Card className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-2 sm:p-3 bg-primary/20 rounded-lg flex-shrink-0">
                <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg mb-1">AI-Powered Recommendations</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  Our AI analyzed your projects and found 3 contractors with perfect matches for your current bids.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <a href="/company/recommendations">View Recommendations</a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="mb-8 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-max sm:min-w-full">
              {[
                {
                  label: "Active Projects",
                  value: projects.filter((p: any) => p.status === "Active").length,
                  change: "+2",
                  icon: TrendingUp,
                },
                {
                  label: "Pending Bids",
                  value: projects.reduce((sum: number, p: any) => sum + (p.bids || 0), 0),
                  change: "+5",
                  icon: Clock,
                },
                {
                  label: "Completed",
                  value: projects.filter((p: any) => p.status === "Completed").length,
                  change: "+8",
                  icon: CheckCircle,
                },
                {
                  label: "Total Budget",
                  value: `ETB ${(projects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0) / 1000).toFixed(0)}K`,
                  change: "+15%",
                  icon: AlertCircle,
                },
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <Card key={idx} className="p-4 sm:p-6 flex-shrink-0 sm:flex-shrink-1 w-full sm:w-auto">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl sm:text-3xl font-bold truncate">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-2">{stat.change} this month</p>
                      </div>
                      <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-primary opacity-50 flex-shrink-0 ml-2" />
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Bar Chart */}
            <Card className="lg:col-span-2 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Project Activity</h2>
              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      projects.length > 0
                        ? projects.map((p: any, i: number) => ({
                            month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6],
                            projects: 1,
                            bids: p.bids || 0,
                            completed: p.status === "Completed" ? 1 : 0,
                          }))
                        : []
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                    />
                    <Legend />
                    <Bar dataKey="projects" fill="var(--color-primary)" />
                    <Bar dataKey="bids" fill="var(--color-accent)" />
                    <Bar dataKey="completed" fill="var(--color-chart-3)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Pie Chart */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Project Status</h2>
              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Active", value: projects.filter((p: any) => p.status === "Active").length },
                        { name: "Completed", value: projects.filter((p: any) => p.status === "Completed").length },
                        { name: "On Hold", value: projects.filter((p: any) => p.status === "On Hold").length },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Project List */}
          <div className="mb-8">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Your Projects</h2>
            {projects.map((project: any) => (
              <div key={project.id} className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{project.name}</p>
                  <p className="text-sm font-semibold">{project.status}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => handleBidAction(project.bidId, "accept")}>
                    Accept Bid
                  </Button>
                  <Button variant="outline" onClick={() => handleBidAction(project.bidId, "reject")}>
                    Reject Bid
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Bids Section */}
          <div className="mb-8">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Recent Bids</h2>
            {bids.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {bids.map((bid: any) => (
                  <Card key={bid.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-2 truncate">{bid.project_name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                          {bid.contractor_name} ({bid.contractor_email})
                        </p>
                        <p className="text-xs sm:text-sm text-foreground">
                          Bid Amount: <span className="font-semibold">ETB {bid.amount?.toLocaleString()}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted: {new Date(bid.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            bid.status === "accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : bid.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {bid.status?.charAt(0).toUpperCase() + bid.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                    {bid.status === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleBidAction(bid.id, "accept")}
                          className="flex-1"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBidAction(bid.id, "reject")}
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm sm:text-base">No bids received yet</p>
              </Card>
            )}
          </div>

          {/* New Project Modal */}
          {showNewProjectModal && (
            <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
              <DialogContent className="max-w-full sm:max-w-lg mx-4">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">Fill in the details below</p>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handlePostProject)} className="space-y-4 sm:space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Name" {...field} className="text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Budget (ETB)</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Budget" {...field} className="text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Project Description" {...field} className="text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                      <Button type="button" variant="outline" onClick={() => setShowNewProjectModal(false)} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                      <Button type="submit" className="w-full sm:w-auto">Create Project</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}

          {/* Toast Notification */}
          {showToast && (
            <ToastProvider>
              <Toast title="Notification" description={toastMessage} />
            </ToastProvider>
          )}
        </div>
      </main>
    </div>
  )
}
