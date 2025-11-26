"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Search, Filter, Plus, MoreVertical, Calendar, DollarSign, Users, X } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export default function ProjectsPage() {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [newProject, setNewProject] = useState({
    name: "",
    category: "",
    location: "",
    budget: "",
    deadline: "",
    description: "",
    documents: null,
  })
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.companyId) return

    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/company/projects?companyId=${user.companyId}`)
        const data = await response.json()
        setProjects(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch projects:", error)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [user?.companyId])

  const handlePostProject = async () => {
    if (
      !newProject.name ||
      !newProject.category ||
      !newProject.location ||
      !newProject.budget ||
      !newProject.deadline
    ) {
      setToastMessage("Please fill in all required fields")
      setShowToast(true)
      return
    }

    try {
      const response = await fetch("/api/company/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProject,
          companyId: user?.companyId,
        }),
      })

      if (response.ok) {
        setToastMessage("Project posted successfully!")
        setShowToast(true)
        setShowNewProjectModal(false)
        setNewProject({
          name: "",
          category: "",
          location: "",
          budget: "",
          description: "",
          deadline: "",
          documents: null,
        })

        const res = await fetch(`/api/company/projects?companyId=${user?.companyId}`)
        const data = await res.json()
        setProjects(Array.isArray(data) ? data : [])
      } else {
        const errorData = await response.json()
        setToastMessage(errorData.error || "Failed to post project")
        setShowToast(true)
      }
    } catch (error) {
      console.error("Failed to post project:", error)
      setToastMessage("Failed to post project")
      setShowToast(true)
    }

    setTimeout(() => setShowToast(false), 3000)
  }

  const handleViewDetails = (project) => {
    setSelectedProject(project)
    setShowDetailsModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
      case "Active":
        return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
      case "completed":
      case "Completed":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
      case "in_progress":
      case "On Hold":
        return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
      default:
        return "bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300"
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === "all") return true
    return p.status === filterStatus || p.status === filterStatus.toLowerCase()
  })

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
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Projects</h1>
              <p className="text-muted-foreground">Manage all your construction projects</p>
            </div>
            <Button onClick={() => setShowNewProjectModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">All Projects</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found. Create your first project!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg transition">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-3 border-y border-border">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="font-semibold">₿{project.budget?.toLocaleString() || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Bids</p>
                          <p className="font-semibold">{project.bids || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="font-semibold text-sm">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <Button size="sm" onClick={() => handleViewDetails(project)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Post New Project</h2>
              <button onClick={() => setShowNewProjectModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter the project name (e.g., Residential Building Construction in Hawassa)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select a category</option>
                  <option value="Road Construction">Road Construction</option>
                  <option value="Building Construction">Building Construction</option>
                  <option value="Bridge Construction">Bridge Construction</option>
                  <option value="Renovation / Maintenance">Renovation / Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  value={newProject.location}
                  onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Where the project will take place (e.g., Addis Ababa)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Budget (ETB) *</label>
                <input
                  type="text"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g., 500,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deadline for Bids *</label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Description *</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Describe the project details clearly, including materials, size, and any special requirements."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Attach Documents (optional)</label>
                <input
                  type="file"
                  onChange={(e) => setNewProject({ ...newProject, documents: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <p className="text-xs text-muted-foreground mt-1">Upload project plan, design, or related files</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowNewProjectModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handlePostProject}>
                  Post Project
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showDetailsModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Project Details</h2>
              <button onClick={() => setShowDetailsModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Project Name</p>
                <p className="font-semibold">{selectedProject.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-semibold">₿{selectedProject.budget}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">{selectedProject.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-semibold">{selectedProject.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{selectedProject.description}</p>
              </div>
              <Button className="w-full" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
