"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, FileText, Users, LogOut, Menu, X, Moon, Sun, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

interface DashboardSidebarProps {
  userType: "company" | "contractor"
}

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return null
  }

  const companyMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/company" },
    { icon: FileText, label: "Projects", href: "/company/projects" },
    { icon: Users, label: "Contractors", href: "/company/contractors" },
    { icon: Briefcase, label: "Bids", href: "/company/bids" },
    { icon: Briefcase, label: "Jobs", href: "/job-matching" }, // Updated Jobs link to navigate to job-matching page instead of settings
  ]

  const contractorMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/contractor" },
    { icon: FileText, label: "Available Projects", href: "/contractor/projects" },
    { icon: Briefcase, label: "My Bids", href: "/contractor/bids" },
    { icon: Users, label: "Profile", href: "/contractor/profile" },
    { icon: Briefcase, label: "Jobs", href: "/job-matching" }, // Updated Jobs link to navigate to job-matching page instead of settings
  ]

  const menuItems = userType === "company" ? companyMenuItems : contractorMenuItems

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-muted rounded-lg"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href={userType === "company" ? "/company" : "/contractor"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-lg">C</span>
            </div>
            <div>
              <span className="font-bold text-lg block">Con-I</span>
              <span className="text-xs text-sidebar-foreground/60 capitalize">{userType}</span>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" asChild>
            <Link href="/">
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
