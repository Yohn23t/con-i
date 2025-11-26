"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Check, ArrowRight } from "lucide-react"

export default function WelcomePage() {
  const trialStartDate = new Date(2025, 0, 26) // Jan 26, 2025
  const trialEndDate = new Date(2025, 3, 26) // Apr 26, 2025 (3 months later)
  const formattedStartDate = trialStartDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedEndDate = trialEndDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const plans = [
    {
      name: "Starter",
      price: "ETB 0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Up to 5 projects per month",
        "Basic project posting",
        "View contractor profiles",
        "Email notifications",
        "Basic support",
      ],
    },
    {
      name: "Professional",
      price: "ETB 2,000",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Unlimited projects",
        "Advanced bid management",
        "AI-powered contractor matching",
        "Priority email support",
        "Real-time analytics dashboard",
        "Project timeline tracking",
        "Custom workflow automation",
        "Advanced search filters",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom API integrations",
        "White-label branding options",
        "SLA guarantee (99.9% uptime)",
        "Advanced security features",
        "Multi-user team management",
        "Custom reporting tools",
        "Priority phone support",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section with Construction Image */}
      <section className="relative py-20 px-4 overflow-hidden min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/welcome-header-construction.jpg"
            alt="Ethiopian construction professionals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
          <div className="mb-6 inline-block">
            <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Welcome to Con-I
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white text-balance leading-tight">
            Transform Your Construction Business
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto text-balance">
            Connect with top contractors, manage projects efficiently, and grow your business with our all-in-one
            platform.
          </p>
        </div>
      </section>

      {/* Free Trial Offer */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-r from-primary/15 to-primary/5 border-primary/30 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-block mb-4 text-4xl">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Launch Offer</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Get 3 months completely free from {formattedStartDate} to {formattedEndDate}
              </p>
              <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow-md">
                Trial runs: {formattedStartDate} - {formattedEndDate}
              </div>
            </div>
            <p className="text-center text-muted-foreground text-sm">
              No credit card required. Full access to all Professional features during your trial period.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Choose the perfect plan for your construction business. All prices in Ethiopian Birr (ETB).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                className={`p-8 flex flex-col transition-all duration-300 hover:shadow-lg ${
                  plan.highlighted
                    ? "border-primary border-2 shadow-xl md:scale-105 relative"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2 mt-4">{plan.name}</h3>
                <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2 text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link href="/signup" className="flex items-center justify-center gap-2">
                    {plan.name !== "Enterprise" && (
                      <>
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                    {plan.name === "Enterprise" && (
                      <>
                        Contact Sales
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Con-I?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Smart Matching",
                description: "AI-powered algorithm connects you with the best contractors for your projects",
              },
              {
                title: "Real-time Tracking",
                description: "Monitor project progress and bids in real-time with our intuitive dashboard",
              },
              {
                title: "Secure Payments",
                description: "Safe and secure payment processing with multiple payment options",
              },
              {
                title: "24/7 Support",
                description: "Our dedicated support team is always ready to help you succeed",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 border-border hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of construction professionals using Con-I. Start your free 3-month trial today.
          </p>
          <Button size="lg" asChild className="shadow-lg">
            <Link href="/signup" className="flex items-center gap-2">
              Sign Up Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
