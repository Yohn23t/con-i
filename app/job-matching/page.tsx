"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MapPin, DollarSign, Briefcase, X } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export default function JobMatchingPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("find")
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [showPostJobModal, setShowPostJobModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  // Find Job states
  const [searchLocation, setSearchLocation] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [jobs, setJobs] = useState([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)

  const availableSkills = [
    "Carpentry",
    "Masonry",
    "Plumbing",
    "Electrical",
    "Painting",
    "Framing",
    "Concrete",
    "Roofing",
    "Tiling",
    "Flooring",
    "Welding",
    "HVAC",
  ]

  useEffect(() => {
    fetchJobs()
  }, [searchLocation, experienceLevel, selectedCategories, selectedSkills, minBudget, maxBudget])

  const fetchJobs = async () => {
    try {
      setIsLoadingJobs(true)
      const params = new URLSearchParams()
      if (searchLocation) params.append("location", searchLocation)
      if (experienceLevel !== "all") params.append("experienceLevel", experienceLevel)
      if (selectedCategories.length > 0) params.append("categories", selectedCategories.join(","))
      if (selectedSkills.length > 0) params.append("skills", selectedSkills.join(","))
      if (minBudget) params.append("minBudget", minBudget)
      if (maxBudget) params.append("maxBudget", maxBudget)

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json()
      setJobs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      setJobs([])
    } finally {
      setIsLoadingJobs(false)
    }
  }

  const newJob = {
    title: "",
    description: "",
    location: "",
    budget: "",
    experienceLevel: "intermediate",
    deadline: "",
    skills: [] as string[],
    phone: "",
    website: "",
  }

  const [newJobState, setNewJob] = useState(newJob)

  const handlePostJob = async () => {
    if (!user?.companyId) {
      setToastMessage("You must be logged in as a company to post jobs")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setIsPosting(true)
    try {
      const response = await fetch("/api/jobs/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newJobState,
          budget: Number.parseFloat(newJobState.budget),
          companyId: user.companyId,
        }),
      })

      if (response.ok) {
        setToastMessage("Job posted successfully!")
        setShowToast(true)
        setShowPostJobModal(false)
        setNewJob(newJob)
        fetchJobs()
      } else {
        const error = await response.json()
        setToastMessage(error.error || "Failed to post job")
        setShowToast(true)
      }
    } catch (error) {
      console.error("Failed to post job:", error)
      setToastMessage("Failed to post job")
      setShowToast(true)
    } finally {
      setIsPosting(false)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const toggleSkill = (skill: string, isNewJob = false) => {
    if (isNewJob) {
      setNewJob((prev) => ({
        ...prev,
        skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      }))
    } else {
      setSelectedSkills((prev) => ({
        ...prev,
        skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      }))
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesLocation = job.location?.toLowerCase().includes(searchLocation.toLowerCase())
    const matchesExperienceLevel =
      experienceLevel === "all" || job.experience_level?.toLowerCase() === experienceLevel.toLowerCase()
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((skill) => job.skills?.includes(skill))
    const matchesMinBudget = !minBudget || job.budget >= Number.parseFloat(minBudget)
    const matchesMaxBudget = !maxBudget || job.budget <= Number.parseFloat(maxBudget)
    return matchesLocation && matchesExperienceLevel && matchesSkills && matchesMinBudget && matchesMaxBudget
  })

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar userType={user?.role || "contractor"} />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Job Matching</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Find available construction jobs or post projects for contractors
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="find">Find a Job</TabsTrigger>
              <TabsTrigger value="post">Post a Job</TabsTrigger>
            </TabsList>

            <TabsContent value="find" className="space-y-6">
              {/* Filters */}
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Filter Jobs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Enter city or region"
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="all">All Levels</option>
                      <option value="entry">Entry Level</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Min Budget (ETB)</label>
                    <input
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      placeholder="e.g., 50000"
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Budget (ETB)</label>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      placeholder="e.g., 500000"
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </Card>

              {/* Job Listings */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {isLoadingJobs ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">Loading jobs...</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No jobs found matching your criteria</p>
                  </div>
                ) : (
                  jobs.map((job: any) => (
                    <Card key={job.id} className="p-4 sm:p-6 hover:shadow-lg transition cursor-pointer">
                      <div className="mb-3">
                        <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">{job.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{job.company_name}</p>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">ETB {job.budget?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate capitalize">{job.experience_level}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full text-sm"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job)
                          setShowJobDetails(true)
                        }}
                      >
                        View Details
                      </Button>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="post">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Post a New Job</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Title</label>
                    <input
                      type="text"
                      value={newJobState.title}
                      onChange={(e) => setNewJob({ ...newJobState, title: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g., Senior Construction Manager"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newJobState.description}
                      onChange={(e) => setNewJob({ ...newJobState, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="Describe the job requirements and responsibilities..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={newJobState.location}
                        onChange={(e) => setNewJob({ ...newJobState, location: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g., Addis Ababa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Budget (ETB)</label>
                      <input
                        type="number"
                        value={newJobState.budget}
                        onChange={(e) => setNewJob({ ...newJobState, budget: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g., 150000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Experience Level</label>
                      <select
                        value={newJobState.experienceLevel}
                        onChange={(e) => setNewJob({ ...newJobState, experienceLevel: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="entry">Entry Level</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Application Deadline</label>
                      <input
                        type="date"
                        value={newJobState.deadline}
                        onChange={(e) => setNewJob({ ...newJobState, deadline: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        value={newJobState.phone}
                        onChange={(e) => setNewJob({ ...newJobState, phone: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="+251 91 234 5678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <input
                        type="url"
                        value={newJobState.website}
                        onChange={(e) => setNewJob({ ...newJobState, website: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handlePostJob} disabled={isPosting}>
                    {isPosting ? "Posting..." : "Post Job"}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold mb-1 break-words">{selectedJob.title}</h2>
                <p className="text-sm text-muted-foreground truncate">{selectedJob.company_name}</p>
              </div>
              <button onClick={() => setShowJobDetails(false)} className="flex-shrink-0 ml-4">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Job Description</h3>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Budget</h3>
                  <p className="text-sm">ETB {selectedJob.budget?.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Location</h3>
                  <p className="text-sm">{selectedJob.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Experience Level</h3>
                  <p className="text-sm capitalize">{selectedJob.experience_level}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Deadline</h3>
                  <p className="text-sm">
                    {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : "Open"}
                  </p>
                </div>
                {selectedJob.phone && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">Contact Phone</h3>
                    <a href={`tel:${selectedJob.phone}`} className="text-sm text-primary hover:underline">
                      {selectedJob.phone}
                    </a>
                  </div>
                )}
                {selectedJob.website && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">Website</h3>
                    <a
                      href={
                        selectedJob.website.startsWith("http") ? selectedJob.website : `https://${selectedJob.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {selectedJob.website}
                    </a>
                  </div>
                )}
              </div>

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowJobDetails(false)}>
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (selectedJob.phone || selectedJob.website) {
                      setShowToast(true)
                      setTimeout(() => setShowToast(false), 3000)
                    }
                  }}
                >
                  Apply Now
                </Button>
              </div>

              {(selectedJob.phone || selectedJob.website) && (
                <div className="text-xs sm:text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <p className="font-semibold mb-1">How to Apply:</p>
                  {selectedJob.phone && <p>Call: {selectedJob.phone}</p>}
                  {selectedJob.website && <p>Visit: {selectedJob.website}</p>}
                </div>
              )}
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
