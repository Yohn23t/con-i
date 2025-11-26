import Link from "next/link"
import { Mail, Instagram, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Con-I</h3>
            <p className="text-sm opacity-75">Connecting construction companies with skilled contractors.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:opacity-100 opacity-75">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:opacity-100 opacity-75">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com/coni14211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-100 opacity-75 flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/coni_connection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-100 opacity-75 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="mailto:coni59097@gmail.com"
                  className="hover:opacity-100 opacity-75 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:opacity-100 opacity-75">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:opacity-100 opacity-75">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 opacity-75">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/20 pt-8 text-center text-sm opacity-75">
          <p>&copy; 2025 Con-I. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
