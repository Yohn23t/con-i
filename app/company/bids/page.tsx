"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Search, Filter, MoreVertical, TrendingUp, CheckCircle, Clock, XCircle, X } from 'lucide-react'
import { AIBidSelector } from "@/components/ai-bid-selector"
import { useUser } from "@/contexts/user-context"

export default function BidsPage() {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedBid, setSelectedBid] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showBidSelector, setShowBidSelector] = useState(false)
  const [bids, setBids] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.companyId) return

    const fetchBids = async () => {
      try {
        const response = await fetch(`/api/company/bids?companyId=${user.companyId}`)
        const data = await response.json()
        setBids(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch bids:", error)
        setBids([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBids()
  }, [user?.companyId])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
      case "pending":
        return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
      case "rejected":
        return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const handleBidAction = (bid, action) => {
    if (action === "accept") {
      setShowBidSelector(true)
      setSelectedBid(bid)
    } else {
      setSelectedBid({ ...bid, action })
      setShowActionModal(true)
    }
  }

  const handleBidSelection = (bid: any, method: "manual" | "ai") => {
    const confirmSelection = async () => {
      try {
        const response = await fetch("/api/company/bids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bidId: bid.id,
            action: "accept",
            selectionMethod: method,
          }),
        })

        if (response.ok) {
          setToastMessage(
            `Bid ${method === "ai" ? "selected via AI recommendation" : "manually selected"} from ${bid.contractor_name}!`,
          )
          setShowToast(true)
          setShowBidSelector(false)

          // Refresh bids
          const res = await fetch(`/api/company/bids?companyId=${user?.companyId}`)
          const data = await res.json()
          setBids(Array.isArray(data) ? data : [])
        } else {
          setToastMessage("Failed to accept bid")
          setShowToast(true)
        }
      } catch (error) {
        console.error("Failed to accept bid:", error)
        setToastMessage("Failed to accept bid")
        setShowToast(true)
      }

      setTimeout(() => setShowToast(false), 3000)
    }

    confirmSelection()
  }

  const confirmAction = async () => {
    try {
      const response = await fetch("/api/company/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidId: selectedBid.id,
          action: selectedBid.action,
        }),
      })

      if (response.ok) {
        setToastMessage(`Bid ${selectedBid.action}ed successfully!`)
        setShowToast(true)
        setShowActionModal(false)

        // Refresh bids
        const res = await fetch(`/api/company/bids?companyId=${user?.companyId}`)
        const data = await res.json()
        setBids(Array.isArray(data) ? data : [])
      } else {
        setToastMessage(`Failed to ${selectedBid.action} bid`)
        setShowToast(true)
      }
    } catch (error) {
      console.error(`Failed to ${selectedBid.action} bid:`, error)
      setToastMessage(`Failed to ${selectedBid.action} bid`)
      setShowToast(true)
    }

    setTimeout(() => setShowToast(false), 3000)
  }

  const getDaysAgo = (createdAt: string) => {
    const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const filteredBids = bids.filter((b) => {
    const matchesSearch =
      b.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contractor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || b.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar userType="company" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading bids...</p>
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
            <h1 className="text-4xl font-bold mb-2">Bids</h1>
            <p className="text-muted-foreground">Review and manage bids from contractors</p>
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
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {filteredBids.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bids found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Project</th>
                      <th className="text-left py-3 px-4 font-semibold">Contractor</th>
                      <th className="text-left py-3 px-4 font-semibold">Bid Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Submitted</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBids.map((bid) => (
                      <tr key={bid.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 font-medium">{bid.project_name}</td>
                        <td className="py-3 px-4">{bid.contractor_name}</td>
                        <td className="py-3 px-4 font-semibold">ETB {bid.amount?.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(bid.status)}`}
                          >
                            {getStatusIcon(bid.status)}
                            {bid.status}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{getDaysAgo(bid.created_at)} days ago</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {bid.status.toLowerCase() === "pending" && (
                              <>
                                <Button size="sm" onClick={() => handleBidAction(bid, "accept")}>
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleBidAction(bid, "reject")}>
                                  Reject
                                </Button>
                              </>
                            )}
                            {bid.status.toLowerCase() !== "pending" && (
                              <button className="p-2 hover:bg-muted rounded-lg transition">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Action Confirmation Modal */}
      {showActionModal && selectedBid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Confirm Action</h2>
              <button onClick={() => setShowActionModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to {selectedBid.action} this bid from {selectedBid.contractor_name}?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={confirmAction}>
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* AI Bid Selector Modal */}
      {showBidSelector && selectedBid && (
        <AIBidSelector
          projectId={selectedBid.project_id}
          bids={bids.filter((b) => b.project_id === selectedBid.project_id && b.status.toLowerCase() === "pending")}
          onSelectBid={handleBidSelection}
          onClose={() => {
            setShowBidSelector(false)
            setSelectedBid(null)
          }}
        />
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
