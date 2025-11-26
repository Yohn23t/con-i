"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Save, Star, Award, Briefcase } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export default function ProfilePage() {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialty: "",
    location: "",
    bio: "",
    certifications: "",
  })
  const [profileStats, setProfileStats] = useState({
    rating: 0,
    completedProjects: 0,
    totalEarnings: 0,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?.contractorId) {
          setIsLoading(false)
          return
        }

        const response = await fetch(`/api/contractor/profile?contractorId=${user.contractorId}`)
        const data = await response.json()

        if (data) {
          setFormData({
            fullName: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            specialty: data.specialty || "",
            location: data.location || "",
            bio: data.bio || "",
            certifications: data.certifications || "",
          })

          setProfileStats({
            rating: data.rating || 0,
            completedProjects: data.completed_projects || 0,
            totalEarnings: data.total_earnings || 0,
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [user?.contractorId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/contractor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractorId: user?.contractorId,
          ...formData,
        }),
      })

      if (response.ok) {
        setToastMessage("Profile updated successfully!")
        setShowToast(true)
      } else {
        setToastMessage("Failed to update profile")
        setShowToast(true)
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
      setToastMessage("Failed to update profile")
      setShowToast(true)
    }

    setTimeout(() => setShowToast(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar userType="contractor" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar userType="contractor" />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your contractor profile and credentials</p>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Rating</span>
              </div>
              <p className="text-3xl font-bold">{profileStats.rating}</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(profileStats.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Completed Projects</span>
              </div>
              <p className="text-3xl font-bold">{profileStats.completedProjects}</p>
              <p className="text-xs text-muted-foreground mt-2">+8 this year</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total Earnings</span>
              </div>
              <p className="text-3xl font-bold">${(profileStats.totalEarnings / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground mt-2">+$15K this month</p>
            </Card>
          </div>

          {/* Profile Information */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Certifications</label>
                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <Button className="w-full" onClick={handleSaveChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
