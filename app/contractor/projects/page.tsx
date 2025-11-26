"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Search, Filter, X } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export default function AvailableProjectsPage() {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showBidModal, setShowBidModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [bidData, setBidData] = useState({
    amount: "",
    companyName: "",
    completionTime: "",
    technicalProposal: "",
    documents: null,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [availableProjects, setAvailableProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/contractor/projects")
        const data = await response.json()
        const mappedProjects = Array.isArray(data)
          ? data.map((project: any) => ({
              ...project,
              title: project.name || project.title,
              company_name: project.company || project.company_name,
              bid_count: project.bidsReceived || project.bid_count || 0,
            }))
          : []
        setAvailableProjects(mappedProjects)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
        setAvailableProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleSubmitBid = (project) => {
    setSelectedProject(project)
    setBidData({
      amount: "",
      companyName: user?.companyName || "",
      completionTime: "",
      technicalProposal: "",
      documents: null,
    })
    setShowBidModal(true)
  }

  const confirmBid = async () => {
    if (!bidData.amount || !bidData.companyName || !bidData.completionTime || !bidData.technicalProposal) {
      setToastMessage("Please fill in all required fields")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    try {
      const response = await fetch("/api/contractor/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          contractorId: user?.contractorId,
          amount: bidData.amount,
          companyName: bidData.companyName,
          completionTime: bidData.completionTime,
          technicalProposal: bidData.technicalProposal,
        }),
      })

      if (response.ok) {
        setToastMessage("Bid submitted successfully!")
        setShowToast(true)
        setShowBidModal(false)
        setBidData({
          amount: "",
          companyName: "",
          completionTime: "",
          technicalProposal: "",
          documents: null,
        })
      } else {
        setToastMessage("Failed to submit bid")
        setShowToast(true)
      }
    } catch (error) {
      console.error("Failed to submit bid:", error)
      setToastMessage("Failed to submit bid")
      setShowToast(true)
    }

    setTimeout(() => setShowToast(false), 3000)
  }

  const filteredProjects = availableProjects.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar userType="contractor" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userType="contractor" />

      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Available Projects</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Browse and bid on construction projects</p>
          </div>

          {/* Filters Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-base sm:text-lg font-semibold">All Projects</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
              />
            </div>

            {/* Projects List */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-muted-foreground text-sm sm:text-base">No projects available at the moment.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-border rounded-lg p-4 sm:p-6 hover:bg-muted/50 transition"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">
                          {project.title || project.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                          {project.company_name || project.company}
                        </p>
                        {project.description && (
                          <p className="text-xs sm:text-sm text-foreground mb-2 line-clamp-2">{project.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-border">
                      <div className="flex gap-2 text-xs sm:text-sm flex-wrap">
                        {project.status && (
                          <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-full">
                            {project.status}
                          </span>
                        )}
                        {project.timeline_end && (
                          <span className="text-muted-foreground">
                            Deadline: {new Date(project.timeline_end).toLocaleDateString()}
                          </span>
                        )}
                        {typeof project.bid_count === "number" && (
                          <span className="text-muted-foreground">{project.bid_count} bids</span>
                        )}
                      </div>
                      <Button size="sm" onClick={() => handleSubmitBid(project)} className="w-full sm:w-auto">
                        Submit Bid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Bid Submission Modal */}
      {showBidModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Submit Bid</h2>
              <button onClick={() => setShowBidModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project</label>
                <p className="font-semibold text-foreground">{selectedProject.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <input
                  type="text"
                  value={bidData.companyName}
                  onChange={(e) => setBidData({ ...bidData, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your company name (e.g., Abebe Construction PLC)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Proposed Amount (ETB) *</label>
                <input
                  type="text"
                  value={bidData.amount}
                  onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your total price to complete the project (e.g., 450,000)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Completion Time *</label>
                <input
                  type="text"
                  value={bidData.completionTime}
                  onChange={(e) => setBidData({ ...bidData, completionTime: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="How long the project will take (e.g., 6 months)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Technical Proposal *</label>
                <textarea
                  value={bidData.technicalProposal}
                  onChange={(e) => setBidData({ ...bidData, technicalProposal: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Briefly describe your approach — materials, timeline, labor, and quality assurance."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Attach Supporting Documents (optional)</label>
                <input
                  type="file"
                  onChange={(e) => setBidData({ ...bidData, documents: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload proposal documents, designs, or certifications
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowBidModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={confirmBid}>
                  Submit Bid
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
