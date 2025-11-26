"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Search, Filter, Star, MapPin, Phone, Mail, MoreVertical, X } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export default function ContractorsPage() {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("all")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedContractor, setSelectedContractor] = useState(null)
  const [selectedProject, setSelectedProject] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [contractors, setContractors] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractorsRes, projectsRes] = await Promise.all([
          fetch("/api/company/contractors"),
          user?.companyId
            ? fetch(`/api/company/projects?companyId=${user.companyId}`)
            : Promise.resolve(new Response("[]")),
        ])

        const contractorsData = await contractorsRes.json()
        const projectsData = projectsRes.status === 200 ? await projectsRes.json() : []

        setContractors(Array.isArray(contractorsData) ? contractorsData : [])
        setProjects(Array.isArray(projectsData) ? projectsData : [])
      } catch (error) {
        console.error("Failed to fetch contractors:", error)
        setContractors([])
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.companyId])

  const handleInvite = (contractor) => {
    setSelectedContractor(contractor)
    setShowInviteModal(true)
  }

  const confirmInvite = async () => {
    if (!selectedProject) {
      setToastMessage("Please select a project")
      setShowToast(true)
      return
    }

    try {
      const response = await fetch("/api/company/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractorId: selectedContractor.id,
          projectId: selectedProject,
        }),
      })

      if (response.ok) {
        setToastMessage(`Invitation sent to ${selectedContractor.name}!`)
        setShowToast(true)
        setShowInviteModal(false)
        setSelectedProject("")
      }
    } catch (error) {
      console.error("Failed to send invite:", error)
      setToastMessage("Failed to send invitation")
      setShowToast(true)
    }

    setTimeout(() => setShowToast(false), 3000)
  }

  const filteredContractors = contractors.filter((c) => {
    const matchesSearch =
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.specializations || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = filterSpecialty === "all" || (c.specializations || "").includes(filterSpecialty)
    return matchesSearch && matchesSpecialty
  })

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar userType="company" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading contractors...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userType="company" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Contractors</h1>
            <p className="text-muted-foreground">Browse and manage contractors for your projects</p>
          </div>

          <Card className="p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Available Contractors</h2>
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
                  placeholder="Search contractors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Specialties</option>
                <option value="Renovation">Renovation</option>
                <option value="Commercial">Commercial</option>
                <option value="Structural">Structural</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredContractors.length > 0 ? (
                filteredContractors.map((contractor) => (
                  <Card key={contractor.id} className="p-6 border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{contractor.name}</h3>
                        <p className="text-sm text-muted-foreground">{contractor.specializations}</p>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg transition">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(contractor.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{contractor.rating || 0}</span>
                      <span className="text-sm text-muted-foreground">({contractor.total_projects || 0} projects)</span>
                    </div>

                    <div className="space-y-2 mb-4 pb-4 border-b border-border">
                      {(contractor.city || contractor.state) && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {contractor.city}
                            {contractor.city && contractor.state && ", "}
                            {contractor.state}
                          </span>
                        </div>
                      )}
                      {contractor.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{contractor.phone}</span>
                        </div>
                      )}
                      {contractor.user_email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{contractor.user_email}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                        <p className="font-semibold">{contractor.years_experience || 0} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Projects</p>
                        <p className="font-semibold">{contractor.total_projects || 0}</p>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => handleInvite(contractor)}>
                      Invite to Project
                    </Button>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground col-span-2 text-center py-8">No contractors available</p>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Invite Modal */}
      {showInviteModal && selectedContractor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Invite to Project</h2>
              <button onClick={() => setShowInviteModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Contractor</p>
                <p className="font-semibold">{selectedContractor.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select Project</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Choose a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title || project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={confirmInvite}>
                  Send Invite
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
