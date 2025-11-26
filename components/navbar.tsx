"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import { Logo } from "@/components/logo"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return null
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-foreground hover:text-primary transition-colors duration-200">
              How It Works
            </Link>
            <Link href="#features" className="text-foreground hover:text-primary transition-colors duration-200">
              Features
            </Link>
            <Link href="#testimonials" className="text-foreground hover:text-primary transition-colors duration-200">
              Testimonials
            </Link>
            <Link href="#about" className="text-foreground hover:text-primary transition-colors duration-200">
              About Us
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="hidden md:flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/welcome">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Optimized for performance */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="#how-it-works"
              className="block px-4 py-2 hover:bg-muted rounded transition-colors duration-200"
              onClick={handleLinkClick}
            >
              How It Works
            </Link>
            <Link
              href="#features"
              className="block px-4 py-2 hover:bg-muted rounded transition-colors duration-200"
              onClick={handleLinkClick}
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="block px-4 py-2 hover:bg-muted rounded transition-colors duration-200"
              onClick={handleLinkClick}
            >
              Testimonials
            </Link>
            <Link
              href="#about"
              className="block px-4 py-2 hover:bg-muted rounded transition-colors duration-200"
              onClick={handleLinkClick}
            >
              About Us
            </Link>
            <div className="flex gap-2 px-4 pt-2">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/login" onClick={handleLinkClick}>
                  Login
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/welcome" onClick={handleLinkClick}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
