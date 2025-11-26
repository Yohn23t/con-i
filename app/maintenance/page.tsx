import { Construction, AlertTriangle, Mail } from 'lucide-react'
import Link from 'next/link'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Construction className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Under Maintenance</h1>
        <p className="text-muted-foreground text-lg mb-2">
          We're currently performing scheduled maintenance
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Our platform will be back online shortly. We apologize for any inconvenience.
        </p>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-sm mb-1">Expected Duration</p>
              <p className="text-xs text-muted-foreground">
                Maintenance should be completed within a few hours. Please check back later.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Have questions? Contact us:
          </p>
          <a 
            href="mailto:coni59097@gmail.com"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Mail className="w-4 h-4" />
            coni59097@gmail.com
          </a>
        </div>
      </div>
    </div>
  )
}
