"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Search, Filter, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { BidModal } from "@/components/bid-modal"
import { Toast } from "@/components/toast"
import { useUser } from "@/contexts/user-context"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export default function ContractorDashboard() {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"available" | "mybids">("available")
  const [showBidModal, setShowBidModal] = useState(false)
  const [selectedProjectForBid, setSelectedProjectForBid] = useState(null)
  const [bidAmount, setBidAmount] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [availableProjects, setAvailableProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [myBids, setMyBids] = useState([])
  const [contractorStats, setContractorStats] = useState([
    { label: "Active Bids", value: "0", change: "+0", icon: TrendingUp },
    { label: "Pending Review", value: "0", change: "+0", icon: Clock },
    { label: "Won Projects", value: "0", change: "+0", icon: CheckCircle },
    { label: "Total Earnings", value: "$0", change: "+0%", icon: AlertCircle },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.contractorId) {
          setIsLoading(false)
          return
        }

        const [projectsRes, bidsRes] = await Promise.all([
          fetch("/api/contractor/projects"),
          fetch(`/api/contractor/bids?contractorId=${user.contractorId}`),
        ])

        const projectsData = await projectsRes.json()
        const bidsData = await bidsRes.json()

        setAvailableProjects(Array.isArray(projectsData) ? projectsData : [])
        setMyBids(Array.isArray(bidsData) ? bidsData : [])

        const activeBids = bidsData.filter((b: any) => b.status === "Pending").length
        const wonProjects = bidsData.filter((b: any) => b.status === "Won").length
        const totalEarnings = bidsData
          .filter((b: any) => b.status === "Won")
          .reduce((sum: number, b: any) => sum + (b.amount || 0), 0)

        setContractorStats([
          { label: "Active Bids", value: activeBids.toString(), change: `+${activeBids}`, icon: TrendingUp },
          { label: "Pending Review", value: bidsData.length.toString(), change: `+${bidsData.length}`, icon: Clock },
          { label: "Won Projects", value: wonProjects.toString(), change: `+${wonProjects}`, icon: CheckCircle },
          {
            label: "Total Earnings",
            value: `ETB ${(totalEarnings / 1000).toFixed(0)}K`,
            change: `+${totalEarnings > 0 ? "12%" : "0%"}`,
            icon: AlertCircle,
          },
        ])
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setAvailableProjects([])
        setMyBids([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.contractorId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Won":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
      case "Pending":
        return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
      case "Lost":
        return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300"
    }
  }

  const handleSubmitBid = (project) => {
    setSelectedProjectForBid(project)
    setShowBidModal(true)
  }

  const confirmBid = async () => {
    if (!bidAmount) {
      setToastMessage("Please enter a bid amount")
      setShowToast(true)
      return
    }

    try {
      const response = await fetch("/api/contractor/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectForBid.id,
          contractorId: user?.contractorId,
          amount: Number.parseFloat(bidAmount),
        }),
      })

      if (response.ok) {
        setToastMessage("Bid submitted successfully!")
        setShowToast(true)
        setShowBidModal(false)
        setBidAmount("")

        // Refresh bids
        const res = await fetch(`/api/contractor/bids?contractorId=${user?.contractorId}`)
        const data = await res.json()
        setMyBids(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to submit bid:", error)
      setToastMessage("Failed to submit bid")
      setShowToast(true)
    }

    setTimeout(() => setShowToast(false), 3000)
  }

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
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Contractor Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Find projects and manage your bids</p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-max sm:min-w-full">
              {contractorStats.map((stat, idx) => {
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
            {/* Line Chart */}
            <Card className="lg:col-span-2 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Bidding Activity</h2>
              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      myBids.length > 0
                        ? myBids.map((b, i) => ({
                            month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6],
                            submitted: 1,
                            won: b.status === "Won" ? 1 : 0,
                            pending: b.status === "Pending" ? 1 : 0,
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
                    <Line type="monotone" dataKey="submitted" stroke="var(--color-primary)" strokeWidth={2} />
                    <Line type="monotone" dataKey="won" stroke="var(--color-chart-3)" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" stroke="var(--color-accent)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Pie Chart */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Bid Status</h2>
              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Won", value: myBids.filter((b) => b.status === "Won").length },
                        { name: "Pending", value: myBids.filter((b) => b.status === "Pending").length },
                        { name: "Lost", value: myBids.filter((b) => b.status === "Lost").length },
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

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 mb-6 border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-3 sm:px-4 py-2 font-medium transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === "available"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Available Projects
            </button>
            <button
              onClick={() => setActiveTab("mybids")}
              className={`px-3 sm:px-4 py-2 font-medium transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === "mybids"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Bids
            </button>
          </div>

          {/* Available Projects Table */}
          {activeTab === "available" && (
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-base sm:text-lg font-semibold">Available Projects</h2>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

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

              <div className="space-y-3 sm:space-y-4">
                {availableProjects.length > 0 ? (
                  availableProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-border rounded-lg p-4 sm:p-6 hover:bg-muted/50 transition"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">
                            {project.name || project.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                            {project.company_name || project.company}
                          </p>
                          {project.description && (
                            <p className="text-xs sm:text-sm text-foreground mb-2 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-border">
                        <div className="flex gap-2 text-xs sm:text-sm flex-wrap">
                          {project.category && (
                            <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-full">
                              {project.category}
                            </span>
                          )}
                          {project.deadline && (
                            <span className="text-muted-foreground">
                              Deadline: {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          )}
                          {project.bidsReceived !== undefined && (
                            <span className="text-muted-foreground">{project.bidsReceived} bids</span>
                          )}
                        </div>
                        <Button size="sm" onClick={() => handleSubmitBid(project)} className="w-full sm:w-auto">
                          Submit Bid
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">
                    No projects available at the moment
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* My Bids Table */}
          {activeTab === "mybids" && (
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-6">My Bids</h2>
              {myBids.length > 0 ? (
                <div className="overflow-x-auto -mx-4 sm:-mx-6">
                  <div className="inline-block min-w-full px-4 sm:px-6">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Project</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Company</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Bid Amount</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myBids.map((bid: any) => (
                          <tr key={bid.id} className="border-b border-border hover:bg-muted/50 transition">
                            <td className="py-3 px-2 sm:px-4 font-medium truncate">{bid.project_name}</td>
                            <td className="py-3 px-2 sm:px-4 truncate">{bid.company_name}</td>
                            <td className="py-3 px-2 sm:px-4">ETB {bid.amount}</td>
                            <td className="py-3 px-2 sm:px-4">
                              <span
                                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(bid.status)}`}
                              >
                                {bid.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-muted-foreground">
                              {new Date(bid.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">No bids submitted yet</p>
              )}
            </Card>
          )}

          {/* Bid Modal */}
          {showBidModal && (
            <BidModal
              project={selectedProjectForBid}
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              confirmBid={confirmBid}
              setShowBidModal={setShowBidModal}
            />
          )}

          {/* Toast */}
          {showToast && <Toast message={toastMessage} />}
        </div>
      </main>
    </div>
  )
}
