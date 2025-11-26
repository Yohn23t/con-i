"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { Users, TrendingUp, CheckCircle, Search, Filter, MoreVertical, Briefcase } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

const COLORS = ["#58a6ff", "#f0883e"]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dashboardStats, setDashboardStats] = useState([
    { label: "Total Users", value: "0", change: "+0%", icon: Users },
    { label: "Total Jobs", value: "0", change: "+0%", icon: Briefcase },
    { label: "Active Projects", value: "0", change: "+0%", icon: TrendingUp },
    { label: "Completed Projects", value: "0", change: "+0%", icon: CheckCircle },
  ])
  const [chartData, setChartData] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, projectsRes, jobsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/projects"),
          fetch("/api/admin/jobs"),
        ])

        const users = await usersRes.json()
        const projectsData = await projectsRes.json()
        const jobsData = await jobsRes.json()

        const totalUsers = Array.isArray(users) ? users.length : 0
        const totalJobs = Array.isArray(jobsData) ? jobsData.length : 0
        const activeProjects = Array.isArray(projectsData)
          ? projectsData.filter((p: any) => p.status === "open" || p.status === "in_progress").length
          : 0
        const completedProjects = Array.isArray(projectsData)
          ? projectsData.filter((p: any) => p.status === "completed").length
          : 0

        setDashboardStats([
          { label: "Total Users", value: totalUsers.toString(), change: "+12%", icon: Users },
          { label: "Total Jobs", value: totalJobs.toString(), change: "+15%", icon: Briefcase },
          { label: "Active Projects", value: activeProjects.toString(), change: "+8%", icon: TrendingUp },
          { label: "Completed Projects", value: completedProjects.toString(), change: "+23%", icon: CheckCircle },
        ])

        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setRecentUsers(
          Array.isArray(users)
            ? users.map((user: any) => ({
                id: user.id,
                name: user.name || "Unknown",
                email: user.email,
                type: user.role,
                status: "Active",
                joinDate: user.created_at,
              }))
            : [],
        )
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const filteredUsers = recentUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || user.type === filterType
    return matchesSearch && matchesType
  })

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, projects, and platform activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, idx) => {
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Line Chart */}
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-lg font-semibold mb-4">Platform Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="companies" stroke="var(--color-primary)" strokeWidth={2} />
                  <Line type="monotone" dataKey="contractors" stroke="var(--color-accent)" strokeWidth={2} />
                  <Line type="monotone" dataKey="total" stroke="var(--color-chart-3)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Pie Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Companies", value: recentUsers.filter((u) => u.type === "company").length },
                      { name: "Contractors", value: recentUsers.filter((u) => u.type === "contractor").length },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1].map((index) => (
                      <Cell key={`cell-${index}`} fill={["#58a6ff", "#f0883e"][index % 2]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Recent Users Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Users</h2>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Types</option>
                  <option value="company">Companies</option>
                  <option value="contractor">Contractors</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
                          {user.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">{user.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button className="p-2 hover:bg-muted rounded-lg transition">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Projects Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">All Projects</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Project Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Company</th>
                    <th className="text-left py-3 px-4 font-semibold">Budget</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Bids</th>
                    <th className="text-left py-3 px-4 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length > 0 ? (
                    projects.map((project: any) => (
                      <tr key={project.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 font-medium">{project.name || project.title}</td>
                        <td className="py-3 px-4">{project.company_name || "Unknown"}</td>
                        <td className="py-3 px-4">ETB {project.budget ? project.budget.toLocaleString() : "N/A"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              project.status === "open"
                                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                : project.status === "completed"
                                  ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                                  : "bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {project.status || "Unknown"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{project.bid_count || 0}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {project.created_at ? new Date(project.created_at).toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 px-4 text-center text-muted-foreground">
                        No projects found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
