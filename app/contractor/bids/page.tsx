"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Search, Filter, MoreVertical, CheckCircle, Clock, XCircle, X } from "lucide-react"

export default function MyBidsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedBid, setSelectedBid] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [myBids, setMyBids] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("con-i-user") || "{}")
        if (!user.contractorId) {
          setMyBids([])
          return
        }

        const response = await fetch(`/api/contractor/bids?contractorId=${user.contractorId}`)
        if (response.ok) {
          const bidsData = await response.json()
          setMyBids(Array.isArray(bidsData) ? bidsData : [])
        } else {
          setMyBids([])
        }
      } catch (error) {
        console.error("Failed to fetch bids:", error)
        setMyBids([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBids()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "won":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
      case "pending":
        return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
      case "lost":
        return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "won":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "lost":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleBidAction = (bid) => {
    setSelectedBid(bid)
    setShowActionModal(true)
  }

  const confirmAction = () => {
    setToastMessage("Bid action completed successfully!")
    setShowToast(true)
    setShowActionModal(false)
    setTimeout(() => setShowToast(false), 3000)
  }

  const filteredBids = myBids.filter((b) => {
    const matchesSearch =
      b.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      b.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    const matchesStatus = filterStatus === "all" || b.status?.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar userType="contractor" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading bids...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userType="contractor" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Bids</h1>
            <p className="text-muted-foreground">Track and manage all your submitted bids</p>
          </div>

          <Card className="p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">All Bids</h2>
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
                  placeholder="Search bids..."
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
                <option value="won">Won</option>
                <option value="pending">Pending</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Project</th>
                    <th className="text-left py-3 px-4 font-semibold">Company</th>
                    <th className="text-left py-3 px-4 font-semibold">Bid Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Submitted</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBids.length > 0 ? (
                    filteredBids.map((bid) => (
                      <tr key={bid.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 font-medium">{bid.project_name}</td>
                        <td className="py-3 px-4">{bid.company_name}</td>
                        <td className="py-3 px-4 font-semibold">${bid.amount}</td>
                        <td className="py-3 px-4">
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(bid.status)}`}
                          >
                            {getStatusIcon(bid.status)}
                            {bid.status?.charAt(0).toUpperCase() + bid.status?.slice(1).toLowerCase()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(bid.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            className="p-2 hover:bg-muted rounded-lg transition"
                            onClick={() => handleBidAction(bid)}
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No bids found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* Action Modal */}
      {showActionModal && selectedBid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Bid Actions</h2>
              <button onClick={() => setShowActionModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Project: {selectedBid.project_name}</p>
              <p className="text-sm text-muted-foreground">Bid Amount: ${selectedBid.amount}</p>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowActionModal(false)}>
                  Close
                </Button>
                <Button className="flex-1" onClick={confirmAction}>
                  Confirm
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
