"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface BidModalProps {
  project: any
  bidAmount: string
  setBidAmount: (amount: string) => void
  confirmBid: () => void
  setShowBidModal: (show: boolean) => void
}

export function BidModal({ project, bidAmount, setBidAmount, confirmBid, setShowBidModal }: BidModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Submit Bid</h2>
          <button onClick={() => setShowBidModal(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Project</p>
            <p className="font-semibold">{project?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="font-semibold">{project?.budget}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your Bid Amount</label>
            <input
              type="text"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
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
  )
}
